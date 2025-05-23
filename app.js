if(process.env.NODE_ENV!="production"){
    require('dotenv').config();
    // only if it is not in production we cannot send the env if it is production
}
console.log(process.env.SECRET);
const MONGO_URL='mongodb://127.0.0.1:27017/wanderlust';
const dburl=process.env.ATLASDB_URL;

const express=require("express");
const app=express();
const path=require("path");
const mongoose=require("mongoose");
const methodOverride=require("method-override");
const port=8080;
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError");
const session=require("express-session");
const MongoStore=require("connect-mongo");
const flash=require("connect-flash");

const passport=require("passport");
const localStrategy=require("passport-local");
const User=require("./models/user.js");

const listingRouter=require('./routes/listing.js');
const reviewRouter=require('./routes/review.js');
const userRouter=require('./routes/user.js');


main().then(()=>console.log("Connection successful")).catch(err=>console.log(err));
async function main(){
    await mongoose.connect(dburl);
}

app.listen(port,()=>{
    console.log("Listening on port",port);
});

app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"));

app.engine("ejs",ejsMate);

const store=MongoStore.create({
    mongoUrl:dburl,
    crypto:{
        secret:process.env.SESSION_SECRET
    },
    touchAfter:24*3600
})

// now our session info will be stored in the atlas database

store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE",err);
})
const sessionOptions={
    store,
    // knows which store we are talking about
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly:true
    }
}
// sessionOptions having cookie option



app.use(session(sessionOptions));
app.use(flash());

// we need the session for passport as well
app.use(passport.initialize());
// middleware initializes passport
// then as a middlware we implement passport.session
app.use(passport.session());
// website needs to know that if the same user is sending the request that is the same session
// in a single session we need a single login
passport.use(new localStrategy(User.authenticate()));
// all users need to be authenticated through localStrategy. and localStrategy is using the User.authenticate method to authenticate(login or sign up) the users
// use static authenticate mehtod of model in localStrategy. generates a function tha tis  used in passport's localStrategy

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// user se related information session me store karvana means serialize karvana

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});//middleware

// HOME ROUTE
// app.get("/",(req,res)=>{
//     res.send("Hi, I am root");
// });

app.get("/demouser", async (req,res)=>{
    let fakeUser=new User({
        email:"khushi@gmail.com",
        username:"delta_student"
    })
   let registeredUser= await User.register(fakeUser,"helloworld");
    // register(user,password, callbackmethod) convienience method that registers a new user instance with a password. checks if username is unique
    res.send(registeredUser);
});
// schema automatically adds the username field as well so we can define it as well

app.use('/listings',listingRouter);
app.use('/listings/:id/reviews',reviewRouter);
app.use('/',userRouter);

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
});
// if no path matches then this path is called

app.use((err,req,res,next)=>{
    let {status=500,message="Something went wrong"}=err;
    // next(err);
    // res.status(status).send(message);
    res.render("error.ejs",{err});
});
