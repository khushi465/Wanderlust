const User=require("../models/user.js");

module.exports.renderSignUpForm=(req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signup=async (req,res)=>{
    try{
        let {username, email, password}=req.body;
        const newUser=new User({email, username});
        const registeredUser=await User.register(newUser, password);
        req.login(registeredUser, (err)=>{
            if(err){
              return next(err);
            }
            req.flash("success","Welcome to WanderLust");
            res.redirect("/listings");
        });
  
    }catch(er){
        req.flash("error", er.message);
        res.redirect("/signup");
    }

}

module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login=async (req,res)=>{
    req.flash("success", "Welcome back to Wanderlust. You are logged in");
    let redirectUrl=res.locals.redirectUrl||"/listings";
    res.redirect(redirectUrl);
    
// here passport automatically resets the session so the value stored in the redirectUrl is gone
// so we get it saved in saveRedirectUrl middleware to res.locals.redirectUrl from req.session.redirectUrl
// gives error if we directly login from home page because there is no isloggedin triggered because direct login not from listings/new or something where they check if it is logged in to allow the functionality
//  and so no value is saved in redirecturl
// so we first check if it is empty or not then redirect 
}

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","You are now logged out");
        res.redirect("/listings");
    });
}