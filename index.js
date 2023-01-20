const express = require('express')
//подключаем mongoose
const mongoose = require('mongoose')
//плдключение handlebars
const exphbs = require('express-handlebars')
const User = require('./models/user')

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

// app engine to render
app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use( async (req, res, next) => {
    //для тестов что бы пока был пользователь и новый котрый внизу не вызывался и не создавался новый пользователь
    try {
        const user = await User.findById('63b55765fc37a4c8d200b29e')
        req.user = user
        next()
    }catch (e){
        console.log(e)
    }
})


//как использовать статические файлы например сss
app.use(express.static(__dirname + '/public'))
//для обработки запроса со страницы что бы правильно приходили данные в нужном формате
app.use(express.urlencoded({extended: true}))

//render pages || routes register
app.use('/', homeRoutes)
app.use('/courses', coursesRoutes)
app.use('/add', addRoutes)
app.use('/cart', cartRoutes)
app.use('/orders', ordersRoutes)
app.use('/auth', authRotes)

const PORT = process.env.PORT || 3000

//подключить функцию старт promise
const password = 12512500
const url = `mongodb+srv://admin:${password}@cluster0.rociosw.mongodb.net/shop`

async function start() {
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
        })
        const candidate = await User.findOne()
        if(!candidate){
            const user = new User({
                email: 'zairovne@gmail.com',
                name: 'Timur',
                cart: {items: []}
            })
            await user.save()
        }
        app.listen(PORT, () => {
            console.log(`Server is started on ${PORT}`)
        })

    } catch (e) {
        console.log(e)
    }
}
start()



