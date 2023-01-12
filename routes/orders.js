const {Router} = require('express')
const Order = require('../models/order')
const router = Router()


//получаем покупки пользователя с базы данных
router.get('/', async (req, res) => {
    try {
        const userOrders = await Order.find()
        //новый объект для передачи на страницу пользователя (данные пользователя)
        const user = {
            name: req.user.name,
            email: req.user.email,
            date: userOrders[0].date,
            price: userOrders[0].courses.reduce((acc, curr) => {
                return acc = acc + curr.course.price * curr.count
            }, 0),
            id: userOrders[0]._id
        }

        //новый массив для передачи на страницу пользователя (данные о купленных курсах)
        const courses = []
        const orders = userOrders.filter(item => {
            return item.user.userId.toString() === req.user._id.toString()
        })
        if(orders){
            orders.map(item => {
                item.courses.map(c => {
                    courses.push(c.course)
                })
            })
        }
        res.render('orders', {
            isOrders: true,
            title: 'Покупки',
            courses,
            user
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
