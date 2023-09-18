// IMPORT MODEL
const User = require("../models/user");



// CONTROLLERS
module.exports.renderRegisterForm = (req, res) => {
    res.render("users/register.ejs")
}

module.exports.register = async(req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, function(err) { //use req.login so after a user is registered it can be assigned the req.user data immediately
            if(err) {return next(err);}
            req.flash("success", "Welcome to Design Camp!")
            res.redirect("/buildings");
        })
    } catch (error) {
        req.flash("error", error.message); //error.message comes from passport-local-mongoose. User own try-catch here to show nice message to the user instead of the default error handler.
        res.redirect("/register");
    }
}


module.exports.renderLoginForm = (req, res) => {
    res.render("users/login");
}

module.exports.login = (req, res) => { 
    req.flash("success", "Welcome Back!"); //Note req.flash NOT res.flash
    const redirectUrl = res.locals.returnTo || "/buildings";
    delete req.session.returTo; //clear the cache after return to the previous page
    res.redirect(redirectUrl);
}


module.exports.logout = (req, res, next) => {
    req.logout(function(err) {
        if (err) {
            return next(err);
        }
        req.flash("success", "Good Bye!");
        res.redirect("/buildings");
    });
}