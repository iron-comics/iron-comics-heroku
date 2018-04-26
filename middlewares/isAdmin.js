
const isAdmin = redirectTo => (req, res, next) => req.user && req.user.isAdmin ? next() : res.redirect(redirectTo);


module.exports = isAdmin;