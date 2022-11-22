const {Router} = require('express')
const Course = require('../model')

const router = Router()

router.get('/', (req,res) => {
    res.render('courses', {
        title: "Курсы",
        isCourses: true
    })
})

module.exports = router
