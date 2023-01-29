const {Router} = require('express')

const User = require('../models/user')
const {route} = require("express/lib/router");
const router = Router()

router.get('/login', async (req, res) => {
    res.render('auth/login', {
        isLogin: true,
        title: 'Войти'
    })
})

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login#login')
    })
})


//проверка сессий
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        //тут тоже передаем как объект  email
        const candidate = await User.findOne({email})
        if(candidate){
            // если оставить как тип Number сравнить не получается поэто через toString
                const isTrue = password.toString() === candidate.password.toString()
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
                    res.redirect('/auth/login')
                }
        }else {
            res.redirect('/auth/login')
        }
    }catch (e) {
        console.log(e)
    }
})

router.post('/register', async (req, res) => {
    try {
        const {email, password, confirm, name} = req.body
        //обязательно из email  делаем объект для посика иначе выдаст ошибку
        const candidate = await User.findOne({email})
        if(!candidate){
            //создаем новго пользователя с помощью new User({})
            const user = await new User({
                email, password, name, cart: {items: []}
            })
            //не забудь сохраняем через методы нового объекта
            await user.save()
            res.redirect('/auth/login')
        }
    }catch (e){
        console.log(e)
    }
})

module.exports = router
