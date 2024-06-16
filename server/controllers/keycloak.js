const axios = require('axios');

const keycloakConfig = {
    serverUrl: 'http://your-keycloak-server/auth',
    realm: 'your-realm',
    clientId: 'your-client-id',
    clientSecret: 'your-client-secret' // If applicable for confidential clients
};

async function login(username, password) {
    try {
        const response = await axios.post(`${keycloakConfig.serverUrl}/realms/${keycloakConfig.realm}/protocol/openid-connect/token`, null, {
            params: {
                grant_type: 'password',
                client_id: keycloakConfig.clientId,
                client_secret: keycloakConfig.clientSecret, // Only if client is confidential
                username: username,
                password: password
            }
        });
        return response.data;
    } catch (error) {
        console.error('Login failed', error.response.data);
        throw error;
    }
}

async function logout(refreshToken) {
    try {
        const response = await axios.post(`${keycloakConfig.serverUrl}/realms/${keycloakConfig.realm}/protocol/openid-connect/logout`, null, {
            params: {
                client_id: keycloakConfig.clientId,
                client_secret: keycloakConfig.clientSecret, // Only if client is confidential
                refresh_token: refreshToken
            }
        });
        return response.data;
    } catch (error) {
        console.error('Logout failed', error.response.data);
        throw error;
    }
}

async function getUsers(accessToken) {
    try {
        const response = await axios.get(`${keycloakConfig.serverUrl}/admin/realms/${keycloakConfig.realm}/users`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Failed to get users', error.response.data);
        throw error;
    }
}

async function getUser(accessToken, userId) {
    try {
        const response = await axios.get(`${keycloakConfig.serverUrl}/admin/realms/${keycloakConfig.realm}/users/${userId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Failed to get user ${userId}`, error.response.data);
        throw error;
    }
}

async function forgotPassword(accessToken, username) {
    try {
        const userResponse = await axios.get(`${keycloakConfig.serverUrl}/admin/realms/${keycloakConfig.realm}/users`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            params: {
                username: username
            }
        });

        if (userResponse.data.length === 0) {
            throw new Error('User not found');
        }

        const userId = userResponse.data[0].id;

        const response = await axios.put(`${keycloakConfig.serverUrl}/admin/realms/${keycloakConfig.realm}/users/${userId}/execute-actions-email`, ['UPDATE_PASSWORD'], {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Forgot password failed', error.response.data);
        throw error;
    }
}

async function createUser(accessToken, user) {
    try {
        const response = await axios.post(`${keycloakConfig.serverUrl}/admin/realms/${keycloakConfig.realm}/users`, user, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Failed to create user', error.response.data);
        throw error;
    }
}

async function updateUser(accessToken, userId, updatedUser) {
    try {
        const response = await axios.put(`${keycloakConfig.serverUrl}/admin/realms/${keycloakConfig.realm}/users/${userId}`, updatedUser, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Failed to update user ${userId}`, error.response.data);
        throw error;
    }
}

async function deleteUser(accessToken, userId) {
    try {
        const response = await axios.delete(`${keycloakConfig.serverUrl}/admin/realms/${keycloakConfig.realm}/users/${userId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Failed to delete user ${userId}`, error.response.data);
        throw error;
    }
}

async function assignRole(accessToken, userId, roleId) {
    try {
        const response = await axios.post(`${keycloakConfig.serverUrl}/admin/realms/${keycloakConfig.realm}/users/${userId}/role-mappings/realm`, [{ id: roleId, name: 'role-name' }], {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Failed to assign role to user ${userId}`, error.response.data);
        throw error;
    }
}

async function createRealm(accessToken, realm) {
    try {
        const response = await axios.post(`${keycloakConfig.serverUrl}/admin/realms`, realm, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Failed to create realm', error.response.data);
        throw error;
    }
}

async function deleteRealm(accessToken, realmName) {
    try {
        const response = await axios.delete(`${keycloakConfig.serverUrl}/admin/realms/${realmName}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Failed to delete realm ${realmName}`, error.response.data);
        throw error;
    }
}

async function createClient(accessToken, client) {
    try {
        const response = await axios.post(`${keycloakConfig.serverUrl}/admin/realms/${keycloakConfig.realm}/clients`, client, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Failed to create client', error.response.data);
        throw error;
    }
}

async function updateClient(accessToken, clientId, updatedClient) {
    try {
        const response = await axios.put(`${keycloakConfig.serverUrl}/admin/realms/${keycloakConfig.realm}/clients/${clientId}`, updatedClient, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Failed to update client ${clientId}`, error.response.data);
        throw error;
    }
}

async function deleteClient(accessToken, clientId) {
    try {
        const response = await axios.delete(`${keycloakConfig.serverUrl}/admin/realms/${keycloakConfig.realm}/clients/${clientId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Failed to delete client ${clientId}`, error.response.data);
        throw error;
    }
}

module.exports = {
    login,
    logout,
    getUsers,
    getUser,
    forgotPassword,
    createUser,
    updateUser,
    deleteUser,
    assignRole,
    createRealm,
    deleteRealm,
    createClient,
    updateClient,
    deleteClient
};
