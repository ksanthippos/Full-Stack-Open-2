// mongoose
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

// yhteys
const url = process.env.MONGODB_URI
console.log('connecting to: ', url)
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
// eslint-disable-next-line no-unused-vars
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB: ', error.message)
  })

// skeema
const personSchema = new mongoose.Schema({
  // kenttien validointi
  name: {
    type: String,
    minlength: 3,
    required: true,
    unique: true
  },
  number: {
    type: String,
    minlength: 8,
    required: true
  }
})

// vain uniikit nimet sallitaan
personSchema.plugin(uniqueValidator)

// palautetaan data json-muodossa mongodb-muodon sijaan
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)