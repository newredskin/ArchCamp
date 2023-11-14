// GET .ENV (ENVIRONMENT VARIABLES)
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}


// MODULES
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const helmet = require("helmet"); //helmet module, add more security
const localStrategy = require("passport-local"); 
const User = require("./models/user")
// Prevent Mongo injection
const mongoSanitize = require("express-mongo-sanitize");


const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");

// Import routes
const buildingRoutes = require("./routes/buildings");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users");


const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/design-camp";
// "mongodb+srv://newredskin:3OuZ7JJmOFgkTFEc@atlascluster.krgsfef.mongodb.net/?retryWrites=true&w=majority" //Uncomment it when into production
// "mongodb://localhost:27017/design-camp" // local MongoDB server

// MONGOOSE CONNECTION
mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error:"));
db.once("open", () => {
    console.log("Database Connected")
})


// DEPENDENCY CALLS
const app = express();


// GENERAL SETTINGS
// Change ejsMate to be the default engine rather than ejs
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))
// Use Middleware funcs on every single request
app.use(express.urlencoded({extended: true}));
app.use(mongoSanitize({replaceWith: '_'})); // Prevent $ and :. it can be replaced by other char
app.use(methodOverride("_method"));


// Make the public resource folder avaliable to express
app.use(express.static(path.join(__dirname, "public")));

// Make offline style sheets available - path issue is resolved!!!
app.use("/css", express.static(path.join(__dirname,"node_modules/bootstrap/dist/css")));
app.use("/js", express.static(path.join(__dirname,"node_modules/bootstrap/dist/js")));
app.use("/layouts", express.static(path.join(__dirname,"views/layouts")));


// SETUP SESSION
// Setup connection to MongoDB instead of in memory storage
const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: "thisismytinysecret"
    }
});

store.on("error", function(e) {
    console.log("SESSION STORE ERROR!", e)
})

// Configs
const sessionConfig = {
    store,
    name: "miaozu", // create a name for session_id
    secret: "thisismytinysecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true, // security setting to prevent data revealed to the third party. It basically says the cookies are only accessible over HTTP not JavaScript
        // secure: true, // should only work over HTTPS. uncomment it when deploying
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // expires a week later
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));


//SETUP PASSPORT
app.use(passport.initialize());
app.use(passport.session());
// Choose one strategy
passport.use(new localStrategy(User.authenticate()));
// Setup how to store a user in the session
passport.serializeUser(User.serializeUser());
// Setup how to get a user out of the session
passport.deserializeUser(User.deserializeUser());



//SETUP FLASH 
app.use(flash());

// SETUP HELMET
app.use(helmet());

app.use(helmet({contentSecurityPolicy: false})); // Uncomment it if want to disable it all

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dm8wm8xmx/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
            upgradeInsecureRequests: null //add it 'cause safari cannot load app properly
        },
    })
);



// Setup the flash middleware(or GLOBAL SETTINGS) on each request
app.use((req, res, next) => {
    res.locals.currentUser = req.user; //save the logged user info. IMPORTANT! currentUser needs to be defined after passport.serilize()/deserilize
    res.locals.success = req.flash("success"); //flash data are saved in res.locals
    res.locals.error = req.flash("error");
    next(); //don't forget!!!
});




// ***** ROUTES *****

app.get("/", (req, res) => {
    res.render("home.ejs")
});

// USER ROUTES
app.use("/", userRoutes);
// BUILDING ROUTES
app.use("/buildings", buildingRoutes);
// REVIEW ROUTES
app.use("/buildings/:id/reviews", reviewRoutes);


// 404 Error handler. Order Matters!
app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404))
})

// Generic error handler Middleware -> define it last after other app.use and routes calls
app.use((err, req, res, next) => {
    const { statusCode=500 } = err;
    if (!err.message) {err.message = "Sorry! Something went wrong..."}
    res.status(statusCode).render("error.ejs", { err });
})


// MONGODB LISTEN
const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Serving on Port ${port}...`));

