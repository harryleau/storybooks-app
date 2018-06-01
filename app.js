const express = require('express');
const hbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');

// Load user model
require('./models/Story');
require('./models/User');

// Load Routes
const auth = require('./routes/auth');
const index = require('./routes/index');
const stories = require('./routes/stories');

// Passport config
require('./config/passport')(passport);

// Load Keys
const keys = require('./config/keys');

// Handlebars Helpers
const {truncate, stripTags, formatDate, select} = require('./helpers/hbs');

// Map global promises
mongoose.Promise = global.Promise;

// Mongoose connect
mongoose.connect(keys.mongoURI)
  .then(() => console.log('MongoDB connected...'))
  .catch(e => console.log(e));

const app = express();

// body parser  middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// method override middleware
app.use(methodOverride('_method'));

// handlebars middleware
app.engine('handlebars', hbs({
  helpers: {
    truncate,
    stripTags,
    formatDate,
    select
  },
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

const port = process.env.PORT || 5000;

app.use(cookieParser());
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// set global vars
app.use((req, res, next) => {
  res.locals.user = req.user || null; // set the authorized user to global var 'user'
  next();
});

// set static folder
app.use(express.static(path.join(__dirname, 'public')));



// Use Routes
app.use('/', index);
app.use('/auth', auth);
app.use('/stories', stories);

app.listen(port, () => {
  console.log('started up on port', port);
});