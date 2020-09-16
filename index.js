const { ApolloServer, gql, UserInputError } = require('apollo-server')
const mongoose = require('mongoose')
const Book = require('./models/book')
const Author = require('./models/author')
const { v1: uuid } = require('uuid')
const MONGODB_URI = 'mongodb+srv://fs-user:VaTb430qKlfzjh5I@cluster0.fi7eh.mongodb.net/library-gql?authSource=admin&replicaSet=atlas-a7mvq8-shard-0&readPreference=primary&retryWrites=true&ssl=true'

mongoose.set('useFindAndModify', false)

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const typeDefs = gql`
  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }
  type Author {
    name: String!
    id: String!
    born: Int
    bookCount: Int!
  }
  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book]!
    allAuthors: [Author]!
  }
  type Mutation {
    addBook(
      title: String!,
      author: String!,
      published: Int!,
      genres: [String!]!
    ): Book
    editAuthor(
      name: String!,
      setBornTo: Int!
    ): Author
  }
`

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allAuthors: () => Author.find({}),
    allBooks: (root, args) => {
      return Book.find({})
    },
    /* 
    allBooks: (root, args) => {
      let retBooks = []

      if (args.genre) {
        retBooks = books.filter(b => b.genres.includes(args.genre))
      }

      if (args.author) {
        retBooks = books.filter(b => b.author === args.author)
      }

      if (!args.genre && !args.author) {
        return books
      }
      
      return retBooks
    }, */
    // allAuthors: () => authors
  },
  Author: {
    name: (root) => root.name,
/*     bookCount: (root) => {
      const authorsBooks = books.filter(b => b.author === root.name)
      return authorsBooks.length    
    } */
  },
  Mutation: {
    addBook: async (root, args) => {
      const author = await Author.findOne({ name: args.author })
      const book = new Book({ ...args, author: author })
      console.log(book.author.name)
   
      try {
        await book.save()
      }
      catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args
        })
      }
      
      return book
    },
    /* editAuthor: (root, args) => {
      const author = authors.find(a => a.name === args.name)      
      
      if (!author)
        return null

      const updatedAuthor = { ...args, name: args.name, born: args.setBornTo }      
      authors = authors.map(a => a.name === args.name ? updatedAuthor : a)
      return updatedAuthor    
    } */
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})