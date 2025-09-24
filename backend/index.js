const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
// const bodyParser = require("body-parser")
const app = express();
const helmet = require('helmet');
const Routes = require('./routes/route.js');
const session = require('express-session');
const passport = require('passport');
require('./passportConfig');

const PORT = process.env.PORT || 5000;

dotenv.config();

// app.use(bodyParser.json({ limit: '10mb', extended: true }))
// app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))

app.use(express.json({ limit: '10mb' }));

// CORS misconfiguration
app.use(
  cors({
    origin: ['http://localhost:3000'], // allowed domain(s)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // allowed methods
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
    ], // allowed headers
    credentials: true,
  })
);

// CSP: Failure to Define Directive with No Fallback
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      'script-src': [
        "'self'",
        'https://accounts.google.com',
        'https://apis.google.com',
      ],
      'frame-src': ["'self'", 'https://accounts.google.com'],
      'img-src': ["'self'", 'https://lh3.googleusercontent.com', 'data:'],
    },
  })
);

// Prevent clickjacking
app.use(helmet.frameguard({ action: 'DENY' }));

// Fix X-Powered-By leak
app.disable('x-powered-by');

// Add Helmet noSniff middleware (sets X-Content-Type-Options: nosniff):
app.use(helmet.noSniff());

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log('Connected to MongoDB'))
  .catch((err) => console.log('NOT CONNECTED TO NETWORK', err));

// Oauth Init
app.use(
  session({
    secret: '123456789',
    resave: false,
    saveUninitialized: true,
  })
);

app.use(
  session({
    name: 'sid',
    secret: process.env.SESSION_SECRET || 'change-me-in-env',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax', // 'none' if you need cross-site cookies on HTTPS
      secure: false, // true in production with HTTPS
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/', Routes);

app.listen(PORT, () => {
  console.log(`Server started at port no. ${PORT}`);
});
