const {Router} = require('express')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const {main, resetPass} = require('../mailer/nodemailer')


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
            await user.save()
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

//Восстановить пароль страницы
router.get('/reset', (req, res) => {
    res.render('auth/reset', {
        title: 'Восстановить пароль',
        error: req.flash('error'),

    })
})

//Страница восстановления паролья c токеном
router.get('/password/:token', async (req, res) => {
    if(!req.params.token) {
        res.redirect('auth/login#login')
    }
    const token = req.params.token
    try {
        // Ищем пользователя по токену
        const user = await User.findOne({
            resetToken: token,
            resetTokenExp: {$gt: Date.now()}
        })

        if(!user) {
            return res.redirect('/auth/login')
        }else {
            res.render('auth/password', {
                title: 'Восстановление пароля',
                error: req.flash('error'),
                userId: user?._id.toString(),
                token: token
            })
        }

    }catch (e) {
        console.log(e)
    }

})


//Восстановить пароль POST для отправки на почту
router.post('/reset', (req, res) => {
    //библиотек node для генерации нового кода
    try {
        crypto.randomBytes(32, async (err, buffer) => {
            if(err){
                req.flash('error', 'Что то пошло не так, попробуйте снова...')
                return res.redirect('auth/reset')
            }
            // что бы извлечь из buffer делаем toString
            const token = buffer.toString('hex')
            //проверям если ли такая почта в базе
           const candidate = await User.findOne(req.body)
            if(candidate) {
                //добавляем кондидату в модель User доп поля токен и время жизни токена
                candidate.resetToken = token
                candidate.resetTokenExp = Date.now() + 60 * 60 * 1000
                //пересохраняем кандидата а базу
                await candidate.save()
                //высылаем ссылку и на восстановление
                resetPass(candidate?.email, token).catch(console.error)
                res.redirect('/auth/login#login')

            }else {
                req.flash('error', 'Такой почты не существует в базе')
                return res.redirect('/auth/reset')
            }
        })
    }catch (e){
        console.log(e)
    }

})

router.post('/password', async (req, res) => {
    console.log(req.body)
    try {
        //ищем по данным параметрам И по жизни токена $gt значит больше чем
        const user = await User.findOne({
            _id: req.body.userId,
            resetToken: req.body.token,
            resetTokenExp: {$gt: Date.now()}
            //https://metanit.com/nosql/mongodb/2.8.php почитать где больше и меньше в монго
        })
        if(!user) {
            req.flash('error', 'Ссылка была действительна 1 час, попробуйте снова')
            res.redirect('/auth/login')
        }else {
            //меняем данные и сохраняем. Для криптования делаем await что бы пароль зашифровался
            user.password = await bcrypt.hash(req.body.password, 10)
            user.resetToken = undefined
            user.resetTokenExp = undefined
            await user.save()
            res.redirect('/auth/login')
        }
        console.log(user)
    }catch (e) {
        console.log(e)
    }
})

module.exports = router
