const {Router} = require('express')

const router = Router()

router.get('/login', async (req, res) => {
    res.render('auth/login', {
        isLogin: true,
        title: 'Войти'
    })
})


//проверка сессий
router.post('/login', (req, res) => {
    req.session.isAuthenticated = true
    res.redirect('/')
})

module.exports = router
