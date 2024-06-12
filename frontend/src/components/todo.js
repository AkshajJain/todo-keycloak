import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie'; // Import js-cookie library
import { useNavigate } from 'react-router-dom'; // Import useHistory hook
import { BACKEND_HOST, BACKEND_PORT } from '../consts';

function Todo() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tasks, setTasks] = useState([]);
  const history = useNavigate(); // Initialize useHistory hook

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = Cookies.get('token'); // Get token from cookie
      const response = await axios.get(`http://${BACKEND_HOST}:${BACKEND_PORT}/api/todo`, { headers: { 'Authorization': `Bearer ${token}` }}); // Pass token in headers
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleAddTask = async () => {
    try {
      const token = Cookies.get('token'); // Get token from cookie
      await axios.post(`http://${BACKEND_HOST}:${BACKEND_PORT}/api/todo`, { "title": name, "description": description }, { headers: { 'Authorization': `Bearer ${token}` } });
      fetchTasks();
      setName('');
      setDescription('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const token = Cookies.get('token'); // Get token from cookie
      await axios.delete(`http://${BACKEND_HOST}:${BACKEND_PORT}/api/todo/${id}`, { headers: { 'Authorization': `Bearer ${token}` } });
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleLogout = () => {
    // Add your logout logic here
    // For example, clear any authentication tokens or user session data
    // Redirect to the login page
    history('/login');
  };

  return (
    <div>
      <h1 className="text-3xl mb-6 text-center font-semibold text-gray-800">Todo App</h1>
      <button
        className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300 mb-4"
        onClick={handleLogout}
      >
        Logout
      </button>
      <div className="flex mb-8">
        <input
          className="mr-2 px-4 py-2 border border-gray-300 rounded-md w-1/2 focus:outline-none focus:border-blue-500"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="mr-2 px-4 py-2 border border-gray-300 rounded-md w-1/2 focus:outline-none focus:border-blue-500"
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
          onClick={handleAddTask}
        >
          Add Task
        </button>
      </div>

      <table className="w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Description</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task._id} className="bg-white">
              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.title}</td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{task.description}</td>
              <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  className="mr-2 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
                  onClick={() => handleDeleteTask(task._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Todo;
