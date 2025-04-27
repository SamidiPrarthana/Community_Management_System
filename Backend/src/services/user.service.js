const User = require('../model/Kavishka/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user
const register = async (name, userType, phoneNumber, email, password) => {
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return { success: false, error: 'User with this email already exists' };
        }

        // Validate password length
        if (password.length < 6) {
            return { success: false, error: 'Password must be at least 6 characters long' };
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = await User.create({ name, userType, phoneNumber, email, password: hashedPassword });
        return { success: true, data: user };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// Login user
const login = async (email, password) => {
    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) return { success: false, error: 'Invalid credentials' };

        // Compare password with the hashed password stored in the database
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return { success: false, error: 'Invalid credentials' };

        // Update last login time
        user.lastLogin = Date.now();
        await user.save();

        // Create JWT token
        const token = jwt.sign(
            { id: user._id, userType: user.userType },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Set token expiry time (1 hour)
        );

        // Return token and user info
        return { success: true, data: { user, token } };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// Get all users
const getAllUsers = async () => {
    try {
        const users = await User.find();
        return { success: true, data: users };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// Get a user by ID
const getUserById = async (id) => {
    try {
        const user = await User.findById(id);
        return user
            ? { success: true, data: user }
            : { success: false, error: 'User not found' };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// Update user information
const updateUser = async (id, data) => {
    try {
        const user = await User.findByIdAndUpdate(id, data, { new: true });
        return user
            ? { success: true, data: user }
            : { success: false, error: 'Update failed' };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// Delete a user
const deleteUser = async (id) => {
    try {
        await User.findByIdAndDelete(id);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

module.exports = {
    register,
    login,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
};
