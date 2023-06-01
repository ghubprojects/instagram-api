const router = require('express').Router();
const { authCheck } = require('../middlewares/auth.middleware');
const { updateUser, getUser } = require('../controllers/user.controller');

router.route('/user/:id').patch(authCheck, updateUser).get(authCheck, getUser);

module.exports = router;
