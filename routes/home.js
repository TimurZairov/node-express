const {Router} = require('express')

const router = Router()
 // Сраница Главная
router.get('/', (req, res) => {
    res.status(200)
    res.render('index', {
        title: "Гавная страница",
        isHome: true
    })
})

module.exports = router
