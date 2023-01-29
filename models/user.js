const {Schema, model} = require('mongoose')

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    password: {
        type: Number,
        required: true
    },
    cart: {
        items: [
            {
                count: {
                    type: Number,
                    required: true,
                    default: 1
                },
                courseId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Course',
                    required: true,
                }
            },
        ]
    }
})

//методы схемы
//используем function что бы сохранить контекст this
// добавляем курс в корзину
userSchema.methods.addToCart = function (course) {
    const clonedItems = [...this.cart.items]
    const idx = clonedItems.findIndex(c => {
        return c.courseId.toString() === course.id.toString()
    })
    if(idx < 0) {
        //если нет в массиве такого курса то добавляем курс со значениями...
        clonedItems.push({
            courseId: course._id,
            count: 1
        })
    }else {
        //если есть, увеличиваем count курса...
        clonedItems[idx].count = clonedItems[idx].count + 1
    }

    this.cart = {items: clonedItems}
    //обязательно сохранить после всего
    return this.save()
}

//удаление курса из корзины

userSchema.methods.removeCartItems = function (courseId) {
    console.log(courseId)
    // копируем масив cart
    let clonedItems = [...this.cart.items]
    // проверяем есть ли в существующем массиве нужный элемент
    const idx = clonedItems.findIndex(c => {
        console.log(c)
        return c._id.toString() === courseId.toString()
    })
    // если есть или нет
    if(clonedItems[idx].count === 1) {
        clonedItems = clonedItems.filter( item => {
            return  item._id.toString() !== courseId.toString()
        })
    }else {
        clonedItems[idx].count = clonedItems[idx].count -1
    }

    this.cart = {items: clonedItems}
    return this.save()
}
// чистим корзину полсе заказа
userSchema.methods.clearCart = function (){
    this.cart= {items: []}
    return this.save()
}

module.exports = model('User', userSchema)
