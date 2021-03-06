const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
})

// tallennetaan token
let token = ''
beforeAll(async (done) => {

    await User.deleteMany({})
    const newUser = {
        username: 'testi',
        password: 'salainen'
    }

    await api
        .post('/api/users')
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const response = await api
        .post('/api/login')
        .send({
            username: newUser.username,
            password: newUser.password
        })

    token = response.body.token
    done()
})

// GET
test('blogs are returned as JSON', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-type', /application\/json/)
})

test('number of blogs is correct', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('blongs are returned with id keys', async () => {
    const response = await api.get('/api/blogs')

    // tallennetaan vastauksesta avaimet taulukkoon
    const keyArray = response.body.map(r => Object.keys(r))

    // tarkistetaan että taulukosta löytyy avain id
    keyArray.map(key => expect(key).toContain('id'))
})

test('finds a matching blog', async () => {
    const response = await api.get('/api/blogs')
    const titles = response.body.map(r => r.title)
    expect(titles).toContain('Most stupid blog evr')
})

// POST
test('a new blog can be added', async () => {
    const newBlog =  {
        title: 'test blog',
        author: 'test author',
        url: 'www.test.com',
        likes: 12,
    }

    await api
        .post('/api/blogs')
        .set('Authorization', `bearer ${token}`)
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).toContain('test blog')

})

test('blog without title or url will not be added', async () => {
    const noTitle = {
        author: 'anonymous',
        url: 'www.notitlehere.com',
        likes: 0
    }

    const noUrl = {
        title: 'nowhere to go',
        author: 'anonymous',
        likes: 0
    }

    await api
        .post('/api/blogs')
        .set('Authorization', `bearer ${token}`)
        .send(noTitle)
        .expect(400)

    await api
        .post('/api/blogs')
        .set('Authorization', `bearer ${token}`)
        .send(noUrl)
        .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
})

test('not defining likes results default likes 0', async () => {
    const noLikes = {
        title: 'dont mind any likes',
        author: 'mr zero',
        url: 'www.dontlikethis.com',
    }

    await api
        .post('/api/blogs')
        .set('Authorization', `bearer ${token}`)
        .send(noLikes)
        .expect(200)

    const currentBlogs = await helper.blogsInDb()
    expect(currentBlogs).toHaveLength(helper.initialBlogs.length + 1)

    const previousBlog = currentBlogs.find(b => b.title === 'dont mind any likes')
    expect(previousBlog.likes).toEqual(0)
})


// UPDATE
test('single blog can be updated', async () => {
    const currentBlogs = await helper.blogsInDb()
    const blogId = currentBlogs[0].id

    // vain liket päivitetään
    const newBlog = {
        likes: 12122
    }

    await api
        .put(`/api/blogs/${blogId}`)
        .send(newBlog)
        .expect(200)

    const updatedBlogs = await helper.blogsInDb()
    expect(updatedBlogs).toHaveLength(helper.initialBlogs.length)
    expect(updatedBlogs[0].likes).toEqual(12122)
})


// DELETE
test('single blog can be deleted', async () => {

    const newBlog =  {
        title: 'for deletion',
        author: 'test author',
        url: 'www.test.com',
        likes: 12,
    }

    const response = await api
        .post('/api/blogs')
        .set('Authorization', `bearer ${token}`)
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const oldBlogs = await helper.blogsInDb()
    expect(oldBlogs).toHaveLength(helper.initialBlogs.length + 1)

    const blogId = response.body.id
    const blogToDelete = Blog.findById(blogId)

    await api
        .delete(`/api/blogs/${blogId}`)
        .set('Authorization', `bearer ${token}`)
        .send(blogToDelete.toJSON)
        .expect(204)

    const updatedBlogs = await helper.blogsInDb()
    expect(updatedBlogs).toHaveLength(helper.initialBlogs.length)

})

afterAll(() => {
    mongoose.connection.close()
})
