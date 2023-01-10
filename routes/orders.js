const {Router} = require('express')
const Order = require('../models/order')
const router = Router()


router.get('/', async (req, res) => {
    res.render('orders', {
        isOrders: true,
        title: 'Заказы',
    })
})

router.post('/', async (req, res) => {
    try {
        //из пользователя корзины берем массив курсов
        const cartCourses = await req.user.populate('cart.items.courseId')
        //пробегаемся по мас сиву и возвращем новый массив объектов для модели заказа orders model
        const courses = req.user.cart.items.map(i => {
            //возвращеам объект на каждой иттерации
            return {
                count: i.count,
                course: i.courseId._doc
            }
        })
        const order = new Order({
            user: {
                name: req.user.name,
                userId: req.user._id
            },
            courses
        })
        //сохраняем
        await order.save()
        // очищаеми корзину
        await req.user.clearCart()
        res.redirect('/orders')
    }catch (e) {
        console.log(e)
    }
})


module.exports = router
