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
// ---------------- El codigo empieza aca ---------------------------------------------
const app = express(); // Inicio mi express app

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
const  sessionConfig = { 
    secret: 'secretWord',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
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

// Defino middleware para flash
app.use((req,res,next)=>{
    res.locals.usuario = req.user;
    res.locals.success = req.flash('success'); // on every single req pass to a local res the message
    res.locals.error = req.flash('error'); // on every single req pass to a local res the message
    next();
});

app.get('/fakeUser', async(req, res) =>{
    const user=new User({ email: 'coltttt@gmail.com', username: 'coltt'})
    const newUser = await User.register(user,'chicken'); // Pasa el usuario y la contraseña
    res.send(newUser);
})

app.get('/', (req,res)=>{
    res.render('home'); // Mi HTML de Home
})
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
})