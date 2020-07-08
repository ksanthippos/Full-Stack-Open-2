// testejä varten

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

  const blog = blogs.reduce(function(prev, current) {
    return (prev.likes > current.likes) ? prev : current
  })

  const title = blog.title
  const author = blog.author
  const likes = blog.likes

  return { title: title, author: author, likes: likes }

}

module.exports = { dummy, totalLikes, favoriteBlog }