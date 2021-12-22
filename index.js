const mongoose = require('mongoose');
const dotenv = require('dotenv');
const express = require('express');
const redis = require('redis');
const assetRoutes = require('./routers/assetRoutes');
const scanJobRoutes = require('./routers/scanJobRoutes');
const { globalErrorHandler} = require('./errorHandler');
const bodyParser = require('body-parser');

dotenv.config({ path: `./config.env` });

const app = express();
app.use(bodyParser.json());

const port = process.env.PORT || 3000;
const client = redis.createClient(process.env.REDIS_PORT);

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true
}).then(con => {
    console.log('db connection secsesful');
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

app.use('/asset', assetRoutes);
app.use('/scanJob', scanJobRoutes);


//error for uncorrect route
//all stands for all kinds of requests:get,fetch,post..
//'*' stands for all router that havent been declared untill this

app.all('*', (req, res, next) => {

    const err = new Error(`cannot find ${req.originalUrl} url`);
    err.statusCode = 404;
    err.status = 'fail';

    next(err);
})

//midlleware for global error handling,500 stands for server error
app.use(globalErrorHandler);


