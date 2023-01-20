const {Router} = require('express')

const router = Router()

router.get('/login', async (req, res) => {
    res.render('auth/login', {
        isLogin: true,
        title: 'Войти'
    })
})

module.exports = router
