const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const errorMiddleware = require('./middlewares/error.middleware');
const { ResponseStatus } = require('./utils/response');

dotenv.config();
const { APP_PORT } = process.env;
const app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors('*'));

app.get('/api', (req, res) => {
    return res.json({
        success: true,
        message: 'Backend is running well',
    });
});

app.use('/api', require('./routes/auth.routes') /* , require('./routes/user.routes') */);

app.all('*', (req, res) => {
    return ResponseStatus(res, 404, 'Endpoint Not Found');
});

// Error middleware
app.use(errorMiddleware);

app.listen(APP_PORT, () => {
    console.log(`App listening at http://localhost:${APP_PORT}/api`);
});
