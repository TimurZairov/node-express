const express = require('express')
const session = require('express-session')
const MongoDbStore = require('connect-mongodb-session')(session)
const keys = require('./keys')

//middleware
const varMiddleware = require('./middleware/variables')
const userMiddleware = require('./middleware/user')

//connect-flash
const flash = require('connect-flash')
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
const ordersRoutes = require('./routes/orders')
const cartRoutes = require('./routes/cart')
const authRotes = require('./routes/auth')

const app = express()

//config handlebars | layout and ext.name "hbs"
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars) // дает доступ handlebars рабоать данные котрые прохоядт через классовые компоненты
})
app.use(flash())
// app engine to render
app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

//как использовать статические файлы например сss и js на фронте
app.use(express.static(__dirname + '/public'))
//для обработки запроса со страницы что бы правильно приходили данные в нужном формате
app.use(express.urlencoded({extended: true}))

//MONGODB STORE
//создаем store с параметрами
const store = new MongoDbStore({
    uri: keys.MONGODB_URI,
    collation: 'session'
})
// ловим ошибку если что
store.on('error', (error) => {
    console.log(error)
})

//настройка session -- SESSION
app.use(session({
    secret: 'some secret value',
    resave: false,
    saveUninitialized: false,
    store
}))
// variable.js
//нужен для проверки зашел ли пользователь или нет express-session
app.use(varMiddleware)
app.use(userMiddleware)


//render pages || routes register
app.use('/', homeRoutes)
app.use('/courses', coursesRoutes)
app.use('/add', addRoutes)
app.use('/cart', cartRoutes)
app.use('/orders', ordersRoutes)
app.use('/auth', authRotes)

const PORT = process.env.PORT || 3000

//подключить функцию старт promise
async function start() {
    try {
        await mongoose.connect(keys.MONGODB_URI, {
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



