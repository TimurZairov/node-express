const {Router, response} = require('express')
const bcrypt = require('bcryptjs')
const main = require('../mailer/nodemailer')

const User = require('../models/user')
const router = Router()





//страница Логина
router.get('/login', async (req, res) => {
    res.render('auth/login', {
        isLogin: true,
        title: 'Войти',
        regError: req.flash('regError'),
        logError: req.flash('logError')
    })
})
//Выход со страницы
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login#login')
    })
})


//проверка сессий LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        //тут тоже передаем как объект  email
        const candidate = await User.findOne({email})
        if(candidate){
            //BCRYPT JS
            // если оставить как тип Number сравнить не получается поэто через toString
                const isTrue = await bcrypt.compare(password, candidate.password)
                if(isTrue){
                    //если все ок тоБ в сееси назначаем candidate
                    req.session.user = candidate
                    req.session.isAuthenticated = true
                    //сохраняем сесси в cookies
                    // принимает функцию с err если будет ошибка то выводим
                    // нужно что бы раньше чем надо не перенаправляло
                    req.session.save(err => {
                        if(err){
                            throw new Error()
                        }
                        res.redirect('/')
                    })
                }else {
                    await req.flash('logError', 'Введены не верные данные')
                    res.redirect('/auth/login')
                }
        }else {
            await req.flash('logError', 'Введены не верные данные')
            res.redirect('/auth/login')
        }
    }catch (e) {
        console.log(e)
    }
})
//проверка сессий REGISTER
router.post('/register', async (req, res) => {
    try {
        const {email, password, confirm, name} = req.body
        //BCRYPT JS  шифруем пароль асинхронно
        const salt = await bcrypt.hash(password, 10)
        // обязательно из email  делаем объект для посика иначе выдаст ошибку
        const candidate = await User.findOne({email})
        if(!candidate){
            //создаем новго пользователя с помощью new User({})
            const user = await new User({
                email, password: salt, name, cart: {items: []}
            })
            //не забудь сохраняем через методы нового объекта
            // await user.save()
            res.redirect('/auth/login')
            main(email).catch(console.error)
        }else {
            await req.flash('regError', 'Такой email уже существует')
            res.redirect('/auth/login#register')
        }
    }catch (e){
        console.log(e)
    }
})
module.exports = router
