const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
// const bodyParser = require("body-parser")
const app = express();
const helmet = require('helmet');
const Routes = require('./routes/route.js');

const PORT = process.env.PORT || 5000;

dotenv.config();

// app.use(bodyParser.json({ limit: '10mb', extended: true }))
// app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))

app.use(express.json({ limit: '10mb' }));

// CORS misconfiguration
app.use(
  cors({
    origin: ['http://localhost:3000'], // allowed domain(s)
    methods: ['GET', 'POST'], // allowed methods
    allowedHeaders: ['Content-Type'], // allowed headers
  })
);

// CSP: Failure to Define Directive with No Fallback
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'"],
      imgSrc: ["'self'"],
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

app.use('/', Routes);

app.listen(PORT, () => {
  console.log(`Server started at port no. ${PORT}`);
});
