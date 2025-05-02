const {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    register, login,
} = require('../../services/user.service');


const registerController = async (req, res) => {
    const { name, userType, phoneNumber, email, password } = req.body;
    const result = await register(name, userType, phoneNumber, email, password);
    result.success
        ? res.status(201).json(result.data)
        : res.status(400).json({ error: result.error });
};

const loginController = async (req, res) => {

    const { email, password } = req.body;
    const result = await login(email, password);
    result.success
        ? res.status(200).json(result.data)
        : res.status(401).json({ error: result.error });
};


const getAllUsersController = async (req, res) => {
    const result = await getAllUsers();
    result.success
        ? res.status(200).json(result.data)
        : res.status(500).json({ error: result.error });
};

const getUserByIdController = async (req, res) => {
    const { id } = req.params;
    const result = await getUserById(id);
    result.success
        ? res.status(200).json(result.data)
        : res.status(404).json({ error: result.error });
};

const updateUserController = async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const result = await updateUser(id, data);
    result.success
        ? res.status(200).json(result.data)
        : res.status(400).json({ error: result.error });
};

const deleteUserController = async (req, res) => {
    const { id } = req.params;
    const result = await deleteUser(id);
    result.success
        ? res.status(204).send()
        : res.status(500).json({ error: result.error });
};

const getUserByQRCode = async (req, res) => {
    const { id } = req.params;

    const result = await getUserById(id);  // This uses your service function
    result.success
        ? res.status(200).json(result.data)
        : res.status(404).json({ error: result.error });
};



module.exports = {
    registerController,
    loginController,
    getAllUsersController,
    getUserByIdController,
    updateUserController,
    deleteUserController,
    getUserByQRCode,
};
