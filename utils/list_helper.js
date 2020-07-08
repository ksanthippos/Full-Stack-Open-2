// testejä varten
const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {

  const reducer = (sum, blog) => {
    return sum + blog.likes
  }

  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {

  const blog = blogs.reduce((prev, current) =>
      (prev.likes > current.likes)
          ? prev
          : current
  )

  const title = blog.title
  const author = blog.author
  const likes = blog.likes

  return { title: title, author: author, likes: likes }

}



const mostBlogs = (blogs) => {

  const authors = []

  // erotellaan nimet omaan taulukkoon
  blogs.map(blog => {
    authors.push(blog.author)
  })

  // katsotaan kenen nimi esiintyy useimmin
  const author = _.head(_(authors)
      .countBy()
      .entries()
      .maxBy(_.last)
  )

  // lasketaan suosituimman nimen esiintymiskerrat
  let count = 0
  authors.filter(match => {
    match === author
      ? count++
      : 0
  })

  return { author: author, blogs: count }

}

const mostLikes = (blogs) => {

  const namesToArray = []

  // erotellaan nimet omaan taulukkoon
  blogs.map(blog => {
    namesToArray.push(blog.author)
  })

  // poistetaan tupla yms kappaleet
  const authors = _.sortedUniq(namesToArray)

  const authorObjects = []

  // lisätään taulukkoon oliot, joissa kirjoittajan nimi ja total tykkäykset
  authors.map(a => {
    const authorObject = {
      author: a,
      likes: 0
    }
    blogs.find(blog => {
      if(blog.author === a)
        authorObject.likes += blog.likes
    })

    authorObjects.push(authorObject)
  })

  // selvitetään edellisestä taulukosta, kenellä suurimmat tykkäykset
  let maxLikes = authorObjects[0].likes
  let likedAuthor = authorObjects[0].author

  authorObjects.map(authorObject => {
    if (authorObject.likes > maxLikes) {
      maxLikes = authorObject.likes
      likedAuthor = authorObject.author
    }
  })

  return { author: likedAuthor, likes: maxLikes }

}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }