const {Router} = require('express')
const Order = require('../models/order')
const router = Router()


//получаем покупки пользователя с базы данных
router.get('/', async (req, res) => {
    try {
        const userOrders = await Order.find({
            'user.userId': req.user._id
        }).populate('user.userId')

        //новый объект для передачи на страницу пользователя (данные пользователя)
        res.render('orders', {
            isOrders: true,
            title: 'Покупки',
            orders: userOrders.map(o => {
                // _doc полностью распаковывает данные связанные по моделям
                return {
                    ...o._doc,
                    price: o.courses.reduce((acc, curr) => {
                        console.log(curr.course.price)
                        console.log(curr.count)
                        return acc = acc + curr.count * curr.course.price
                    }, 0)
                }
            })
        })
    }catch (e) {
        console.log(e)
    }
})

//сохраняем купленные товары с корзины в orders
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
            courses,
            user: {
                name: req.user.name,
                userId: req.user._id
            }
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
