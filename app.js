if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

console.log(process.env.SECRET)
// Modulos que necesitamos importar
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const mongoose  = require('mongoose');
const path =require('path');
const methodOverride = require('method-override');
const engine = require('ejs-mate')
const main = require('./config/mongo'); // llamo la configuracion de mi Base de Datos
const ExpressError = require('./helpers/ExpressErrors')
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet'); 
const MongoDBStore = require('connect-mongo');

// ---------------- El codigo empieza aca ---------------------------------------------
const app = express(); // Inicio mi express app
const dbURL = process.env.DB_URL || 'mongodb://127.0.0.1:27017/yelp-campDB'

// Configurando  HELMET
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
    "https://cdn.jsdelivr.net",
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
                "https://res.cloudinary.com/dgf2oawvr/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);
// ------------------------------------------
app.engine('ejs', engine) // configuramos en view engine

app.use(express.urlencoded({extended: true})); // Para que reciba elementos en el body

// Configuracion EJS View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views')); // Directorio

// Config Method- override
app.use(methodOverride('_method'));

// DATA BASE CONFIG
main().catch(e => console.log(e));

// Serving static files (public directory)
app.use(express.static(path.join(__dirname,'public')));

// Config sessions
const secret = process.env.SECRET || 'secretWord'
const store =  MongoDBStore.create({
    mongoUrl: dbURL,
    crypto: {
        secret: secret
    },
    touchAfter: 24*3600, // revisar docs esta en s 
})
store.on('error', function(e){
    console.log('SESSION STORE ERROR',e);
});

const  sessionConfig = { 
    store,
    name: 'sessionNanme', // we should put another name that is no easy to recognize
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true, // Solo son accesibles por Http NO por Javascript
        // secure: true, // Only work for HTTPS so gonna break things because localhost is NOT https
        expires: Date.now() + 1000*60*60*24*7, // Para que expire en 1 semana
        maxAge: 1000*60*60*24*7
    },
}
app.use(session(sessionConfig))

//Config flash ,Recordar definir el middleware
app.use(flash());

// Configuracion de Passport
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); // SERIALIZATION HOW DO WE STORE A USER IN A SESSION
passport.deserializeUser(User.deserializeUser()) // HOW DO WE UNSTORED IN A SESSION

// Mongo sanatize
app.use(mongoSanitize()); // bloqs and delete querys bodys and params wit $ or . (reserved for Mongo)

// Defino middleware para flash
app.use((req,res,next)=>{
    if(!['/api/users/login','/','api/users/logout'].includes(req.originalUrl)){
        req.session.returnTo = req.originalUrl;
    }
    res.locals.usuario = req.user;
    res.locals.success = req.flash('success'); // on every single req pass to a local res the message
    res.locals.error = req.flash('error'); // on every single req pass to a local res the message
    next();
});


app.get('/', (req,res)=>{
    res.render('home'); // Mi HTML de Home
});

// Para cargar de manera dinamica las rutas
app.use("/api", require('./routes'));

//Ruta de manejo de errores
app.all('*',(req,res,next)=>{
    next( new ExpressError('Page Not Found', 404) );
})
// defining a generic route for errors
app.use((err,req,res,next)=>{
    const {statusCode=500} = err
    if(!err.message) err.message = 'Something went Wrong mate';
    res.status(statusCode).render('error', {err})
})


// EL listen siempre al final
app.listen(3000, ()=>{
    console.log('Serving On port 3000: http://localhost:3000/ ')
});

// mongodb+srv://<username>:<password>@cluster0.6vgom.mongodb.net/?retryWrites=true&w=majority