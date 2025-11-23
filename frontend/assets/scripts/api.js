// Helper para hacer peticiones a la API con autenticación
const API_BASE = 'http://localhost:3000/api';

async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        }
    };
    
    const config = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...(options.headers || {})
        }
    };
    
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, config);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Error en la petición');
        }
        
        return data;
    } catch (error) {
        console.error('Error en apiRequest:', error);
        throw error;
    }
}

// Funciones helper específicas
const api = {
    // Auth
    login: async (username, password) => {
        return await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
    },
    
    // Products
    getProducts: async () => {
        return await apiRequest('/products');
    },
    
    getProduct: async (id) => {
        return await apiRequest(`/products/${id}`);
    },
    
    createProduct: async (productData) => {
        return await apiRequest('/products', {
            method: 'POST',
            body: JSON.stringify(productData)
        });
    },
    
    updateProduct: async (id, productData) => {
        return await apiRequest(`/products/${id}`, {
            method: 'PUT',
            body: JSON.stringify(productData)
        });
    },
    
    deleteProduct: async (id) => {
        return await apiRequest(`/products/${id}`, {
            method: 'DELETE'
        });
    },
    
    // Inventory
    getInventory: async () => {
        return await apiRequest('/inventory');
    },
    
    // Transfers
    getTransfers: async () => {
        return await apiRequest('/transfer');
    }
};

