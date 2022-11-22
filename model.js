const fs = require('fs')
const path = require('path')
const { v4: uuidv4 } = require('uuid');

// es6 классы
class Course {
    constructor(title, price, img) {
        this.title = title
        this.price = price
        this.img = img
        this.id = uuidv4()
    }

    newCourse() {
        //вспомогательная функция для создания нового курса
        return {
            title: this.title,
            price: this.price,
            img: this.img,
            id: this.id
        }
    }

    async save() {
        const courses = await Course.getAll()
        courses.push(this.newCourse())
        //работа с промисом и путями
        return new Promise((resolve, reject) => {
            fs.writeFile(path.join(__dirname, 'data', 'data.json'),
                JSON.stringify(courses),
                (err) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve()
                    }
                }
            )
        })
    }
    // все курсы | вызов фунции происходит в save(), каждый раз вызывается после добавления нового курса
    static getAll() {
        //считываение с фала data.json | кодировка | пути
        return new Promise((resolve, reject) => {
            fs.readFile(path.join(__dirname, 'data', 'data.json'),
                'utf-8',
                (err, data) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(JSON.parse(data))
                    }
                })
        })
    }
}

module.exports = Course
