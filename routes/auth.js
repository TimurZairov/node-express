const {Router} = require('express')

const User = require('../models/user')
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
        //находим пользователя и сохраням  в req.session.user
        const user = await User.findById('63b55765fc37a4c8d200b29e')
        req.session.user = user
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
    }catch (e) {
        console.log(e)
    }
})

module.exports = router
