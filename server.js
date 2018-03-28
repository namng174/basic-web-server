const express = require('express')
const hbs = require('express-hbs')
const fs = require('fs')
const port = process.env.PORT || 3000
var app = express()

app.set('view engine', 'hbs')
app.engine('hbs', hbs.express4({
    partialsDir: __dirname + '/views/partials',
}))
app.set('views', __dirname + '/views')

hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear()
})
hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase() 
})

app.use((req, res, next) => {
    var now = new Date().toString()
    var log = `${now} : ${req.method} ${req.url}`
    console.log(log)
    fs.appendFile('server.log', log + '\n', (error) => {
        if (error) {
            console.log('Unable to append to server.log')
        }
    })
    next()
})

app.use((req, res, next) => {
    res.render('maintenance.hbs')
})

app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
    res.render('home.hbs', {
        pageTitle: 'About Page',
        welcomeMessage: 'Welcome to my Website'
    })
})

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'About Page',
    })
})

app.get('/bad', (req, res) => {
    res.send({
        errorMessage: 'Unable to handle the request'
    })
})

app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})
