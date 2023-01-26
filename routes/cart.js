const {Router} = require('express')
const auth = require('../middleware/auth')
const Course = require('../models/courses')

const router = Router()


// вычитываем стоимость всех курсов
function cartTotalPrice (price) {
    return price.reduce((acc, curr) => {
       /* console.log(curr.courseId.price)*/
        return acc = acc + (curr.courseId.price * curr.count)
    }, 0)
}


//роут добавить в корзину курс
router.post('/add', auth, async (req, res) => {
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
router.get('/', auth, async (req, res ) => {
    try {
        //получаем user из req.user
        //метод populate и указываем путь в виде строки что бы полчуить доступ
        const user = await req.user.populate('cart.items.courseId')
        const courses = user.cart.items
        res.render('cart' , {
            title: "Корзина",
            isCart: true,
            courses,
            price: cartTotalPrice(courses)
        })
    }catch (e) {
        console.log(e)
    }
})
//удаление курса
router.post('/remove', auth, async (req, res) => {
    try{
    await req.user.removeCartItems(req.body.id)
    }catch (e) {
        console.log(e)
    }
    res.redirect('/cart')
})

module.exports = router

