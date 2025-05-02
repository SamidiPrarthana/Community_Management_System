const express = require('express');
const UserController = require('../../controller/Kavishka/userController');
const authMiddleware = require('../../middleware/auth.middleware');

const router = express.Router();


router.post('/register', UserController.registerController);
router.post('/login', UserController.loginController);


router.get('/', authMiddleware, UserController.getAllUsersController);
router.get('/:id', authMiddleware, UserController.getUserByIdController);
router.put('/:id', authMiddleware, UserController.updateUserController);
router.delete('/:id', authMiddleware, UserController.deleteUserController);
router.get('/qr/scan/:id', UserController.getUserByQRCode);


module.exports = router;