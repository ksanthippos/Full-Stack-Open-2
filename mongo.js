const mongoose = require('mongoose')

// yhteyden luominen
if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://fs-user:${password}@cluster0.fi7eh.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

// skeeman luominen
const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean,
})

const Person = mongoose.model('Person', noteSchema)

const person = new Person({
    name: 'Uusi tyyppi',
    number: '032302302'
})

/*
// tulostetaan vain tärkeät
Person.find({important: false}).then(result => {
    result.forEach(person => {
        console.log(person)
    })
    mongoose.connection.close()
})*/

// skeeman tallennus
person.save().then(response => {
    console.log('person saved!')
    mongoose.connection.close()
})
