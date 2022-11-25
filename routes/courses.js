const {Router} = require('express')
const Course = require('../model')

const router = Router()
//все курсы
router.get('/', async (req,res) => {
    const courses = await Course.getAll()
    res.render('courses', {
        title: "Курсы",
        isCourses: true,
        courses
    })
})
//переход на курс
router.get('/:id', async (req, res) => {
    const course = await Course.findById(req.params.id)

    res.render('course', {
        title: `Курс ${course?.title}`,
        course
    })
})

//редактировать курс
router.get('/:id/edit', async (req, res) => {
    if(!req.query.allow){
        res.redirect('/courses')
    }

    const course = await Course.findById(req.params.id)

    res.render('edit', {
        title: `Редактировать ${course?.title}`,
        course
    })
})

router.post('/edit', async (req, res) => {
    const course = await Course.edit(req.body)
    res.redirect('/courses')
})




module.exports = router

