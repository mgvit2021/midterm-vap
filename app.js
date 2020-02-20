const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dashboardRouter= require('./routes/dashboard');
var exploreCoursesRouter=require('./routes/exploreCourses');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev')); //to get the requests and status codes
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dashboard',dashboardRouter);
app.use('/dashboard/explore',exploreCoursesRouter);


// to catch 404 and forward to error handler middleware
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//defining port
var PORT=process.env.PORT || 3000;
app.listen(PORT)
