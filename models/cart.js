const path = require('path')
const fs = require('fs')

class Cart {
//все курсы на странице корзины
    static async fetch() {
        return new Promise((resolve, reject) => {
            fs.readFile(path.join(__dirname, '..', 'data', 'cart.json'), 'utf8', (err, data) => {
                if (err) {
                    reject(err)
                } else {
                    //не забываем парсить, это все таки JSON!
                    resolve(JSON.parse(data))
                }
            })
        })
    }

// добавить в корзину курс
    static async add(course) {
        const cartCourses = await Cart.fetch()
        const idx = cartCourses.courses.findIndex(index => index.id === course.id)
        const candidate = cartCourses.courses[idx]
        if (candidate) {
            // то увеличиваем коичество
            candidate.count++
            //заменяем курс находя по индексу
            cartCourses.courses[idx] = candidate
        } else {
            //добавляем курс
            // Добавляем ему ключ и значени count = 1 что бы выводить потом количество на странице
            course.count = 1
            cartCourses.courses.push(course)
        }
        //цена курсов
        cartCourses.price += +course.price
        return new Promise((resolve, reject) => {
            fs.writeFile(path.join(__dirname, '..', 'data', 'cart.json'), JSON.stringify(cartCourses), (err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
        })

    }
    //удаление курса или убрать количство курсов при необходимоси
    static async remove(course){

        const cartCourses = await Cart.fetch()
        const idx = cartCourses.courses.findIndex(i => i.id === course.id)
        const candidate = cartCourses.courses[idx]
        if(candidate.count > 1) {
            candidate.count--
            cartCourses.courses[idx] = candidate
        }else if(candidate.count === 1){
            const idCourse = cartCourses.courses.filter(item => item.id !== course.id)
            cartCourses.courses = idCourse
        }
        //пересчитать курс
        cartCourses.price -= course.price
        return new Promise((resolve, reject) => {
            fs.writeFile(path.join(__dirname, '..', 'data', 'cart.json'), JSON.stringify(cartCourses), (err) => {
                if(err) {
                    reject(err)
                }else{
                    resolve()
                }
            })
        })

    }
}

module.exports = Cart
