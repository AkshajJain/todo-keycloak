const jwt = require('jsonwebtoken');
const Todo = require("../models/task");

// Middleware to verify JWT token
exports.verifyToken = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    console.log(token);

    try {
        // Check if token is provided
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: Missing token' });
        }

        // Verify token
        const pub_key = `-----BEGIN PUBLIC KEY-----\n${process.env.PUBLIC_KEY}\n-----END PUBLIC KEY-----`;
        jwt.verify(token, pub_key, (err, decoded) => {
            if (err) {
                console.log(err);
                return res.status(401).json({ message: 'Unauthorized: Invalid token' });
            }
            req.decoded = decoded;
            req.user = decoded.email;
            console.log(req.user);
            next();
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getTasks = async (req, res) => {
    try {
        // Fetch tasks
        const tasks = await Todo.find();
        res.json(tasks);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.addTask = async (req, res) => {
    try {
        // Add task
        const task = await Todo.create(req.body);
        res.json({ message: "Todo added successfully", task });
    } catch (error) {
        console.error('Error:', error);
        res.status(400).json({ message: 'Failed to add task', error: error.message });
    }
};

exports.updateTask = async (req, res) => {
    try {
        // Update task
        const task = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ message: "Task updated successfully", task });
    } catch (error) {
        console.error('Error:', error);
        res.status(400).json({ message: 'Failed to update task', error: error.message });
    }
};

exports.delTask = async (req, res) => {
    try {
        // Delete task
        const task = await Todo.findByIdAndDelete(req.params.id);
        res.json({ message: "Task deleted successfully", task });
    } catch (error) {
        console.error('Error:', error);
        res.status(404).json({ message: 'Task not found', error: error.message });
    }
};
