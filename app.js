require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors');
const db = require('./models');

// var indexRouter = require('./routes/index');
var apiRouter = require('./routes/router');
// var invoicesRouter = require('./routes/invoices');

var app = express();

app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// parse application/json
app.use(bodyParser.json())

// app.use('/', indexRouter);
app.use('/api', apiRouter);
// app.use('/invoices', invoicesRouter);

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
  res.render('error');

  create_roles();
});

// db.sequelize.sync().then(() => {
//   create_roles();
//   // app.listen(port, () => console.log(title + " run on " + baseUrl))
// });

// require('./router/router.js')(app);

module.exports = app;


// //Set app config
// const title = process.env.TITLE;
// const port = process.env.PORT;
// const baseUrl = process.env.URL + port;



function create_roles(){
	db.role.create({
		// id: 1,
		name: "USER"
	});
	
	db.role.create({
		// id: 2,
		name: "ADMIN"
	});
	
	db.role.create({
		// id: 3,
		name: "PM"
	});
}