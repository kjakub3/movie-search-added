const express = require('express');
const { movieRouter } = require('./routers/movies');
const { homeRouter } = require('./routers/home');

const bodyParser = require('body-parser');
const { ValidationError, } = require('express-validation');

const app = express();

app.use(express.json());
app.use(bodyParser.json())
app.use((_, res, next) => {
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use('/', homeRouter);
app.use('/movies', movieRouter);
app.use(function (err, req, res, next) {
    if (err instanceof ValidationError) {
        return res.status(err.statusCode).json(err)
    }
    return res.status(500).json(err)
});

app.listen(3000, 'localhost', () => {
    console.log('listening on http://localhost:3000');
});
