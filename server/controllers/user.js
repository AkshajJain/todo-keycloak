// controllers/todo.js
const user = require("../models/user");
const jwt = require("jsonwebtoken");
const axios = require( "axios");

exports.getUsers = (req, res) => {
    user.find()
        .then((user) => res.json(user))
        .catch((err) =>
            res
                .status(404)
                .json({ message: "user not found", error: err.message })
        );
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Check if the password is correct
        const body = new URLSearchParams();
        body.append('client_id', 'backend');
        body.append('client_secret', `${process.env.KEYCLOAK_SECRET}`);
        body.append('grant_type', 'password');
        body.append('username', email);
        body.append('password', password);
        try {
            const response = await axios.post(
                'http://auth:8080/realms/testrealm/protocol/openid-connect/token', body
            );
            const token = response.data.access_token;
            return res.status(201).json({ message: 'Password is correct', token });
        }
        catch(error){
            console.error('Error:', error);
            return res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }
    
};

exports.signUp = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Check if the email is already registered
        const body = new URLSearchParams();
        body.append('client_id', 'admin-cli');
        body.append('grant_type', 'password');
        body.append('username', "admin");
        body.append('password', "admin");
        try {
            const response = await axios.post(
                'http://auth:8080/realms/master/protocol/openid-connect/token', body
            );
            var admin_token = response.data.access_token;
            console.log({ message:'Password is correct', admin_token });
        }
        catch(error){
            console.error('Error:', error);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const reqbody = new URLSearchParams();
        body.append('client_id', 'admin-cli');
        body.append('grant_type', 'password');
        body.append('username', email);
        body.append('password', password);
        try {
            const response = await axios.post(
                'http://auth:8080/admin/realms/testrealm/users', {
                    enabled: true,
                    email: email,
                    username: email,
                    emailVerified: "",
                    credentials: [{
                        type: "password",
                        value: password,
                        temporary: false
                    }]
                }, {headers: {Authorization: `Bearer ${admin_token}`}}
            );
            return res.status(201).json({ message: 'User created' });
        }
        catch(error){
            console.error('Error:', error);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        return res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }
    
};