const mongoose = require('mongoose')

// salasanan oltava argumenttina
if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
}

// yhteyden avaaminen
const password = process.argv[2]
const url = `mongodb+srv://fs-user:${password}@cluster0.fi7eh.mongodb.net/phonebook-app?retryWrites=true&w=majority`
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

// skeeman luominen
const noteSchema = new mongoose.Schema({
    name: String,
    number: String
})

// modelin määritys
const Person = mongoose.model('Person', noteSchema)

/*
// kovakoodattu lisäämistapa
const person = new Person({
    name: 'Wanhatyyppi',
    number: '034434343'
})*/

// argumentit tyhjät --> tulostetaan vain tietokannan sisältö ja suljetaan yhteys
if (process.argv.length < 4) {

    Person.find({}).then(result => {
        console.log("Phonebook:")
        result.forEach(person => {
            console.log(person)
        })
        mongoose.connection.close()
    })
}
// lisätään uusi henkilö komentorivin argumenteilla, tallennetaan ja suljetaan yhteys
else {
    const newName = process.argv[3]
    const newNumber = process.argv[4]

    const person = new Person({
        name: newName,
        number: newNumber
    })

    person.save().then(response => {
        console.log(`Added ${newName} ${newNumber} to phonebook`)
        mongoose.connection.close()
    })
}





