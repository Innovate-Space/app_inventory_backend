const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const createHttpError = require('http-errors');
const logger = require('morgan');
const cors = require("cors");
const db = require('./models/index');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const routeConfig = require('./routes/routes')

const app = express();

(async  ()=>{
    try{
        await db.sequelize.sync({alter: true, force: true});
        console.log('...successfully connected to the database..');
    }catch(e){
        console.log(e);
        console.log('...Failed to connect to the database...');
    }
})();




app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
routeConfig(app);


// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : err;
    // render the error page
    res.status(err.status || 500).json(res.locals.error);
});

module.exports = app;
