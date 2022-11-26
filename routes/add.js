const {Router} = require('express')
const Course = require('../models/courses')
const router = Router()

//добавить курс
router.get('/', (req, res) => {
    res.render('add', {
        title: "Добавить курс",
        isAdd: true
    })
})

router.post('/', async (req, res) => {
    // const course = new Course(req.body.title, req.body.price, req.body.img)
    const course = new Course({
        title: req.body.title,
        price: req.body.price,
        img: req.body.img
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
