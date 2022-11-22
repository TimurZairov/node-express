const {Router} = require('express')
const Course = require('../model')
const router = Router()

router.get('/', (req,res) => {
    res.render('add', {
        title: "Добавить курс",
        isAdd: true
    })
})

router.post('/', async (req, res) => {
    const course = new Course(req.body.title, req.body.price, req.body.img)
    // работа с классами
    await course.save()
    //если не сделать редирект получится многоразовая запись.
    res.redirect('/courses')
})

module.exports = router
