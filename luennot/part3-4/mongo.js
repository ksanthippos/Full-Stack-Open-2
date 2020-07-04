const mongoose = require('mongoose')

// yhteyden luominen
if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://fs-user:${password}@cluster0.fi7eh.mongodb.net/note-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

// skeeman luominen
const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
    content: 'JS is hard',
    date: new Date(),
    important: false,
})

/*
// tulostetaan vain tärkeät
Note.find({important: false}).then(result => {
    result.forEach(note => {
        console.log(note)
    })
    mongoose.connection.close()
})*/

// skeeman tallennus
note.save().then(response => {
    console.log('note saved!')
    mongoose.connection.close()
})
