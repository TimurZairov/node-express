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
router.get('/',   async (req, res ) => {
    const courses = await Cart.fetch()
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

