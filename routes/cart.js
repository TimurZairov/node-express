const {Router} = require('express')
const Cart = require('../models/cart')
const Course = require('../models/courses')

const router = Router()


//роут добавить в корзину курс
router.post('/add', async (req, res) => {
    const course = await Course.findById(req.body.id)
    //методы из модели user
    try{
        await req.user.addToCart(course)
        res.redirect('/courses')
    }catch (e) {
        console.log(e)
    }
})

//роут самой корзины
router.get('/',   async (req, res ) => {
    console.log(req.user.cart.items)
    const courseItems = req.user.cart.items
    courseItems.forEach(i => {
        console.log(i.courseId.populate)
    })
    const courses = await req.user.cart
    res.render('cart' , {
        title: "Корзина",
        isCart: true,
        courses
    })
})
//удаление курса
router.post('/remove', async (req, res) => {
    const course = await Course.findById(req.body.id)
    await Cart.remove(course)
    res.redirect('/cart')
})

module.exports = router

