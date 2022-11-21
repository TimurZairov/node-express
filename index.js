const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')

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


//render pages
app.get('/', (req, res) => {
    res.status(200)
        //вторым параметром добавляем для каждой страницы нужные нам элементы title и булен свойтсва для активных страниц
    res.render('index', {
        title: "Главная страница",
        isHome: true
    })
})

app.get('/courses', (req, res) => {
    res.render('courses', {
        title: "Курсы",
        isCourses: true
    })
})

app.get('/add', (req, res) => {
    res.render('add', {
        title: "Добавить курс",
        isAdd: true
    })
})
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server is started on ${PORT}`)
})
