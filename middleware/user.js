const User = require('../models/user')

module.exports = async function (req, res, next) {
    //только в таком порядке иначе не работает
    if(!req.session.user){
        return next()
    }
    // cессии не знают о методах модели мангу, поэтому наодим из сессий узера и пропускаем его черз модель мангус
    req.user = await User.findById(req.session.user._id)
    next()
}
