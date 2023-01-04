const {Schema, model} = require('mongoose')

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
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
userSchema.methods.addToCart = function (course) {
    const clonedItems = [...this.cart.items]
    const idx = clonedItems.findIndex(c => {
        return c.courseId.toString() === course.id.toString()
    })
    console.log(idx)
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

module.exports = model('User', userSchema)
