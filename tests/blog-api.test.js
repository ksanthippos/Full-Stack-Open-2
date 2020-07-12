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

    // tarkistetaan että taulukosta löytyy avain id
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
        likes: 12,
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(200)
        .expect('Content-type', /application\/json/)

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
        .send(noTitle)
        .expect(400)

    await api
        .post('/api/blogs')
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
        .send(noLikes)
        .expect(200)

    const currentBlogs = await helper.blogsInDb()
    expect(currentBlogs).toHaveLength(helper.initialBlogs.length + 1)

    const previousBlog = currentBlogs.find(b => b.title === 'dont mind any likes')
    expect(previousBlog.likes).toEqual(0)
})

afterAll(() => {
    mongoose.connection.close()
})