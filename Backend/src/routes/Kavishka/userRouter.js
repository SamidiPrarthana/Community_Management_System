const express = require('express');
const UserController = require('../../controller/Kavishka/userController');
const authMiddleware = require('../../middleware/auth.middleware');

const router = express.Router();


router.post('/register', UserController.registerController);
router.post('/login', UserController.loginController);


router.get('/users', authMiddleware, UserController.getAllUsersController);
router.get('/users/:id', authMiddleware, UserController.getUserByIdController);
router.put('/users/:id', authMiddleware, UserController.updateUserController);
router.delete('/users/:id', authMiddleware, UserController.deleteUserController);

module.exports = router;