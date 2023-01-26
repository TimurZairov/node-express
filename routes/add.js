const {Router} = require('express')
const auth = require('../middleware/auth')
const Course = require('../models/courses')
const router = Router()

//добавить курс
router.get('/', auth, (req, res) => {
    res.render('add', {
        title: "Добавить курс",
        isAdd: true
    })
})

router.post('/', auth, async (req, res) => {
    // const course = new Course(req.body.title, req.body.price, req.body.img)
    const course = new Course({
        title: req.body.title,
        price: req.body.price,
        img: req.body.img,
        userId: req.user
    })
    // после как передали данные и проверили валидацию сохраняем курс в базу данных
    try {
        // сохрянем в базу данных
        await course.save()
        res.redirect('/courses')
    } catch (err) {
        console.log(err)
    }
})

module.exports = router
