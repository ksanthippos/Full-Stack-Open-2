const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
})

// GET (all)
// tieto palautetaan JSON-muodossa
test('blogs are returned as JSON', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-type', /application\/json/)
})

// blogeja palautetaan oikea määrä
test('number of blogs is correct', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
})

// palautetuissa blogeissa on id (ei käytetty toBeDefinedia)
test('blongs are returned with id keys', async () => {
    const response = await api.get('/api/blogs')
    // tallennetaan vastauksesta avaimet taulukkoon
    const keyArray = response.body.map(r => Object.keys(r))
    keyArray.map(key => expect(key).toContain('id'))
})

// tietokannasta löytyy blogi haetulla otsikolla
test('finds a matching blog', async () => {
    const response = await api.get('/api/blogs')
    const titles = response.body.map(r => r.title)
    expect(titles).toContain('Most stupid blog evr')
})


// POST
// uuden blogin luominen onnistuu
test('a new blog can be added', async () => {
    const newBlog =  {
        title: 'test blog',
        author: 'test author',
        url: 'www.test.com',
        likes: 12
    }

    await api
        .post('/apí/blogs')
        .send(newBlog)
        .expect(200)
        .expect('Content-type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).toContain('test blog')

})

test('blog without title is not added', async () => {
    const newBlog = {
        author: 'anonymous',
        url: 'www.nowhere.com',
        likes: 6
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
})


afterAll(() => {
    mongoose.connection.close()
})