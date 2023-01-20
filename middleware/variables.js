
// req.session.isAuthenticated => берем из authRoutes   проверка на вход
module.exports = function (req, res, next) {
    res.locals.isAuth = req.session.isAuthenticated
    next()
}
