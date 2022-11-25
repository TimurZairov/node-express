const cart = require('../data/cart.json')
const path = require('path')
const fs = require('fs')
const e = require("express");

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
}

module.exports = Cart
