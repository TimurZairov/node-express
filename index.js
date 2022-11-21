const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')
const {engine} = require("express-handlebars");

const app = express()
//config handlebars | layout and ext.name "hbs"
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
})

//app engine to render
app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')



//render pages
app.get('/', (req, res) => {
    res.status(200)
    res.render('index')
})

app.get('/about', (req, res) => {
    res.render('about')
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server is started on ${PORT}`)
})
