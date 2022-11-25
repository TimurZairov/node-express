const {Router} = require('express')
const Cart = require('../models/cart')
const Course = require('./../model')

const router = Router()


//роут добавить в корзину курс
router.post('/add', async (req, res) => {
    const course = await Course.findById(req.body.id)
    const add = Cart.add(course)
    res.redirect('/cart')
})

//роут самой корзины
router.get('/',   async (rea, res ) => {
    const courses = await Cart.fetch()
    res.render('cart' , {
        title: "Корзина",
        isCart: true,
        courses
    })
    console.log(courses)
})

module.exports = router

