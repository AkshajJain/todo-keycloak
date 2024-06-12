// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/login';
import Todo from './components/todo';
import SignUp from './components/signup';
import { keycloak } from './components/keycloak';

try {
  const authenticated = await keycloak.init({onLoad: "login-required", checkLoginIframe: false});
  console.log(`User is ${authenticated ? 'authenticated' : 'not authenticated'}`);
} catch (error) {
  console.error('Failed to initialize adapter:', error);
}


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/tasks" element={<Todo />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
