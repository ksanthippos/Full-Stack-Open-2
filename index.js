const express = require('express')
const app = express()

let notes = [
    {
        id: 1,
        content: "HTML is easy",
        date: "2020-01-10T17:30:31.098Z",
        important: true
    },
    {
        id: 2,
        content: "Browser can execute only Javascript",
        date: "2020-01-10T18:39:34.091Z",
        important: false
    },
    {
        id: 3,
        content: "GET and POST are the most important methods of HTTP protocol",
        date: "2020-01-10T19:20:14.298Z",
        important: true
    }
]

app.get('/', (req, res) => {
    res.send('<h1>Hello!</h1>')
})

app.get('/api/notes/:id', (req, res) => {
    const id = Number(req.params.id)    // json-muodossa id on merkkijono --> muunnos luvuksi
    const note = notes.find(note => note.id === id)

    if (note)
        res.json(note)
    else
        res.status(404).end()
})

app.delete(`/api/notes/:id`, (req, res) => {
    const id = Number(req.params.id)
    notes = notes.filter(note => note.id !== id)

    res.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})


