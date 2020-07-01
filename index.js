const http = require('http')

const app = http.createServer((req, res) => {
    res.writeHead(200, {'Content-type' : 'text/plain'})
    res.end('Heippa maailma!')
})

const port = 3001
app.listen(port)
console.log(`Server running on port ${port}`)
