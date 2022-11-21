const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')

//routes
const homeRoutes = require('./routes/home')
const coursesRoutes = require('./routes/courses')
const addRoutes = require('./routes/add')

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


//как использовать статические файлы например сss
app.use(express.static('public'))
//для обработки запроса со страницы что бы правильно приходили данные в нужном формате
app.use(express.urlencoded({extended: true}))

//render pages || routes register
app.use('/', homeRoutes)
app.use('/courses', coursesRoutes)
app.use('/add', addRoutes)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server is started on ${PORT}`)
})
