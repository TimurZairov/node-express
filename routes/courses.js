const {Router} = require('express')
const Course = require('../model')

const router = Router()

router.get('/', async (req,res) => {
    const courses = await Course.getAll()
    res.render('courses', {
        title: "Курсы",
        isCourses: true,
        courses
    })
})

router.get('/:id', async (req, res) => {
    const course = await Course.findById(req.params.id)

    res.render('course', {
        title: `Курс ${course?.title}`,
        course
    })
})

module.exports = router
