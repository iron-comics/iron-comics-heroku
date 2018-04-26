

const ensureLoggedIn = (redirectTo) => (req,res,next) => req.user ? next(): res.redirect(redirectTo)



module.exports = ensureLoggedIn;
