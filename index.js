require('dotenv').config()
const { ApolloServer, gql, UserInputError } = require('apollo-server')
const mongoose = require('mongoose')
const Book = require('./models/book')
const Author = require('./models/author')
const { v1: uuid } = require('uuid')
const author = require('./models/author')
const MONGODB_URI = process.env.MONGODB_URI

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
    allBooks: async (root, args) => {
      if (args.genre) {
        const books = await Book.find({ genres: args.genre})
        return books
      }

      if (!args.genre) {
        return Book.find({})
      }

      // args.author puuttuu vielä
    },
  },
  Author: {
    name: (root) => root.name,
    bookCount: async (root) => {      
      const books = await Book.find({ author: root.id })    
      return books.length
    }
  },
  Mutation: {
    addBook: async (root, args) => {
      const author = await Author.findOne({ name: args.author })
      const book = new Book({ ...args, author: author })
   
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
    editAuthor: async (root, args) => {
      const author = await Author.findOne({ name: args.name })

      if (!author)
        return null

      const updatedAuthor = await Author.findByIdAndUpdate(
        { _id: author.id },
        { born: args.setBornTo }
      )

      /* tämä oli ainoa temppu, jolla sain playgroundin palauttamaan päivitetyn
      arvon. mutta vaikuttaa hieman kömpelöltä, luulisi että on helpompikin tapa? */
      const returnedAuthor = await Author.findOne({ name: updatedAuthor.name })
      
      return returnedAuthor
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})