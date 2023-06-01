const router = require('express').Router();
const { validateLogin, validateRegister } = require('../middlewares/auth.middleware');
const { login, register } = require('../controllers/auth.controller');

router.post('/auth/login', validateLogin, login);
router.post('/auth/register', validateRegister, register);

module.exports = router;
