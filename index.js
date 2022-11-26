const express = require('express')
//подключаем mongoose
const mongoose = require('mongoose')
//плдключение handlebars
const exphbs = require('express-handlebars')

//даем доступт к handlebars
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const Handlebars = require('handlebars')


//routes
const homeRoutes = require('./routes/home')
const coursesRoutes = require('./routes/courses')
const addRoutes = require('./routes/add')
const cartRoutes = require('./routes/cart')

const app = express()
//config handlebars | layout and ext.name "hbs"
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars) // дает доступ handlebars рабоать данные котрые прохоядт через классовые компоненты
})

// app engine to render
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
app.use('/cart', cartRoutes)

const PORT = process.env.PORT || 3000

//подключить функцию старт promise


const password = 12512500
const url = `mongodb+srv://admin:${password}@cluster0.rociosw.mongodb.net/shop`

async function start() {
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
        })
        app.listen(PORT, () => {
            console.log(`Server is started on ${PORT}`)
        })

    } catch (e) {
        console.log(e)
    }
}
start()



