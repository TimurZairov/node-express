const {Router} = require('express')

const router = Router()


router.get('/', async (req, res) => {
    res.render('orders', {
        isOrders: true,
        title: 'Заказы',
    })
})

router.post('/', async (req, res) => {
    
})


module.exports = router
