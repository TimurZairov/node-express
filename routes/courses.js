const {Router} = require('express')
const Course = require('../models/courses')

const router = Router()


//все курсы
router.get('/', async (req, res) => {

    try {
        const courses = await Course.find()
            .populate('userId', 'email name')
            .select('price title img')
        // пока лог оставить что бы не забыть и вмдеть как это я сделал
        // console.log(courses)
        res.render('courses', {
            title: "Курсы",
            isCourses: true,
            courses
        })
    } catch (err) {
        console.log(err)
    }

})
//переход на курс
router.get('/:id/', async (req, res) => {
    const id = req.params.id
    try{
        const course = await Course.findById(id)
        res.render('course', {
            title: `Курс ${course?.title}`,
            course
        })
    }catch (err){
        console.log(err)
    }

})

// Страница редактирования курса
router.get('/:id/edit', async (req, res) => {
    //видимо будет защита
    if (!req.query.allow) {
        res.redirect('/courses')
    }
    try{
        const id = req.params.id
        const course = await Course.findById(id)
        res.render('edit', {
            title: `Редактировать ${course?.title}`,
            course
        })
    }catch (err) {
        console.log(err)
    }

})
//редактировать курс
router.post('/edit', async (req, res) => {
    const id = req.body.id
    //удаляем айди что бы ге мешал при редактировании файлов
    delete req.body.id
    try{
        await Course.findByIdAndUpdate(id, req.body)
        res.redirect('/courses')
    }catch (err){
        console.log(err)
    }
})
//удаление курса
router.post('/remove', async (req, res) => {
    const id = req.body.id
    await Course.findByIdAndRemove(id)
    res.redirect('/courses')
})




module.exports = router

