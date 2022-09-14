var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

var adminRouter = require('./routes/admin');
var studentRouter = require('./routes/student');
var announcementsRouter = require('./routes/announcements');
var authRouter = require('./routes/auth');
var teacherRouter = require('./routes/teacher');
var paymentRouter = require('./routes/payment');
var recordsRouter = require('./routes/recordKeeper');



var { transporter } = require('./utils/userUtil');

var app = express();

mongoose.connect(process.env.mongoConnection, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true}, function(err) {
  if(err) {console.log(err)}
  else {console.log("Connected")}
});

// verify smtp connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log('Email server is not connected.');
  } else {
    console.log("Server is ready to send e-mails.");
  }
});

app.use(cors({
  origin: '*'
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/v1/auth', authRouter);
app.use('/v1/admin', adminRouter);
app.use('/v1/student', studentRouter);
app.use('/v1/teacher', teacherRouter);
app.use('/v1/payment', paymentRouter);
app.use('/v1/announcements', announcementsRouter);
app.use('/v1/records', recordsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log(err);
  res.send('server error');
});

module.exports = app;
