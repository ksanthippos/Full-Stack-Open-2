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
    // taulukon läpikäynti
    keyArray.map(key => expect(key).toContain('id'))
})


afterAll(() => {
    mongoose.connection.close()
})