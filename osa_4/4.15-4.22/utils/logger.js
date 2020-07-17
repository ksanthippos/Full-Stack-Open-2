const info = (...params) => {
  // testien aikana loggaus pois päältä
  if (process.env.NODE_ENV !== 'test')
    console.log(...params)
}

const error = (...params) => {
  if (process.env.NODE_ENV !== 'test')
    console.log(...params)
}

module.exports = { info, error }

