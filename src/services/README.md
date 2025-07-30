# API Service Documentation

## 🚀 Getting Started

The API service provides a simple way to make HTTP requests to your backend. It handles authentication, error handling, and response parsing automatically.

## 📖 Table of Contents

- [Quick Start](#quick-start)
- [Basic Usage](#basic-usage)
- [Advanced Usage](#advanced-usage)
- [Error Handling](#error-handling)
- [Authentication](#authentication)
- [File Uploads](#file-uploads)
- [Common Patterns](#common-patterns)
- [Troubleshooting](#troubleshooting)

## 🏃‍♂️ Quick Start

```typescript
import { apiService } from '@/services/api'

// GET request - fetch data
const users = await apiService.get('/users')
console.log('Users:', users)

// POST request - create new data
const newUser = await apiService.post('/users', {
  name: 'John Doe',
  email: 'john@example.com'
})

// PUT request - update existing data
const updatedUser = await apiService.put('/users/123', {
  name: 'Jane Doe'
})

// DELETE request - remove data
await apiService.delete('/users/123')
```

## 📚 Basic Usage

### Making GET Requests

```typescript
// Simple GET request
const response = await apiService.get('/users')

// GET with query parameters
const response = await apiService.get('/users', {
  params: {
    page: 1,
    limit: 10,
    search: 'john'
  }
})
// This calls: /users?page=1&limit=10&search=john
```

### Making POST Requests

```typescript
// Create a new user
const response = await apiService.post('/users', {
  name: 'John Doe',
  email: 'john@example.com',
  role: 'user'
})

// The data will be sent as JSON in the request body
```

### Making PATCH Requests

```typescript
// Update specific fields of a user
const response = await apiService.patch('/users/123', {
  name: 'Updated Name',
  email: 'newemail@example.com'
})

// Only the provided fields will be updated
```

### Making DELETE Requests

```typescript
// Delete a user
const response = await apiService.delete('/users/123')

// Delete with query parameters
const response = await apiService.delete('/users/123', {
  params: {
    force: true
  }
})
```

## 🔧 Advanced Usage

### TypeScript Support

```typescript
// Define your data types
interface User {
  id: string
  name: string
  email: string
}

// Use types with requests
const response = await apiService.get<User[]>('/users')
if (response.success) {
  // response.data is now typed as User[]
  response.data.forEach((user) => {
    console.log(user.name) // TypeScript knows this is a string
  })
}
```

### Custom Headers

```typescript
const response = await apiService.get('/users', {
  headers: {
    'Custom-Header': 'value',
    'Another-Header': 'another-value'
  }
})
```

### Request Timeout

```typescript
// Set custom timeout (in milliseconds)
const response = await apiService.get('/slow-endpoint', {
  timeout: 30000 // 30 seconds
})
```

### Pagination

```typescript
// Use the built-in pagination helper
const response = await apiService.getPaginated('/users', {
  page: 1,
  limit: 20,
  sortBy: 'name',
  sortOrder: 'asc'
})

if (response.success) {
  console.log('Users:', response.data.data)
  console.log('Total pages:', response.data.pagination.totalPages)
}
```

## ❌ Error Handling

### Basic Error Handling

```typescript
const response = await apiService.get('/users')

if (response.success) {
  // Request was successful
  console.log('Data:', response.data)
}
else {
  // Request failed
  console.error('Error:', response.message)
  console.error('Status:', response.status)
}
```

### Advanced Error Handling

```typescript
try {
  const response = await apiService.get('/users')

  if (!response.success) {
    // Handle different error types
    switch (response.status) {
      case 401:
        console.log('User not authenticated')
        // Redirect to login
        break
      case 403:
        console.log('User not authorized')
        // Show permission error
        break
      case 404:
        console.log('Resource not found')
        break
      case 500:
        console.log('Server error')
        break
      default:
        console.log('Unknown error:', response.message)
    }
  }
}
catch (error) {
  console.error('Network or unexpected error:', error)
}
```

## 🔐 Authentication

### Setting Auth Token

```typescript
import { setAuthToken } from '@/boot/axios'

// When you log in, set the token:
setAuthToken('your-jwt-token-here')

// All subsequent requests will include the Authorization header
// To clear the token (logout):
setAuthToken(null)
```

### Example Login Flow

```typescript
// Login request
const loginResponse = await apiService.post('/auth/login', {
  email: 'user@example.com',
  password: 'password123'
})

if (loginResponse.success) {
  // Set the token for future requests
  apiService.setAuthToken(loginResponse.data.token)

  // Now all API calls will be authenticated
  const userProfile = await apiService.get('/auth/me')
}
```

## 📁 File Uploads

### Uploading Files

```typescript
// Create FormData for file upload
const formData = new FormData()
formData.append('file', fileInput.files[0])
formData.append('description', 'Profile picture')

// Upload the file
const response = await apiService.upload('/users/avatar', formData)

if (response.success) {
  console.log('File uploaded:', response.data.url)
}
```

### Multiple Files

```typescript
const formData = new FormData()
formData.append('files', file1)
formData.append('files', file2)
formData.append('category', 'documents')

const response = await apiService.upload('/documents', formData)
```

## 🎯 Common Patterns

### Loading States in Components

```typescript
// In a Vue component
import { ref } from 'vue'
import { apiService } from '@/services/api'

const isLoading = ref(false)
const users = ref([])
const error = ref(null)

async function loadUsers() {
  isLoading.value = true
  error.value = null

  const response = await apiService.get('/users')

  if (response.success) {
    users.value = response.data
  }
  else {
    error.value = response.message
  }

  isLoading.value = false
}
```

### CRUD Operations

```typescript
// Create, Read, Update, Delete pattern
class UserService {
  async getAll() {
    return apiService.get('/users')
  }

  async getById(id: string) {
    return apiService.get(`/users/${id}`)
  }

  async create(userData: any) {
    return apiService.post('/users', userData)
  }

  async update(id: string, userData: any) {
    return apiService.patch(`/users/${id}`, userData)
  }

  async delete(id: string) {
    return apiService.delete(`/users/${id}`)
  }
}
```

### Search and Filtering

```typescript
async function searchUsers(searchTerm: string, filters: any) {
  return apiService.get('/users', {
    params: {
      search: searchTerm,
      role: filters.role,
      active: filters.active,
      page: 1,
      limit: 20
    }
  })
}
```

## 🐛 Troubleshooting

### Common Issues

**1. "Network error" message**

```typescript
// Check if the API base URL is correct
console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL)

// Make sure your backend server is running
// Check browser network tab for actual error
```

**2. "Authentication required" (401 error)**

```typescript
// Make sure you've set the auth token
apiService.setAuthToken('your-token')

// Check if token is expired
const response = await apiService.get('/auth/validate')
```

**3. "Request timeout" error**

```typescript
// Increase timeout for slow endpoints
const response = await apiService.get('/slow-endpoint', {
  timeout: 60000 // 1 minute
})
```

**4. CORS errors**

```
// This is a backend configuration issue
// Make sure your backend allows requests from your frontend domain
```

### Debug Mode

```typescript
// Enable debug logging (add this to your .env file)
// VITE_LOG_LEVEL=debug

// Check network requests in browser dev tools
// Look at the Network tab to see actual HTTP requests
```

## 🌟 Best Practices

1. **Always check response.success** before using data
2. **Handle errors gracefully** with user-friendly messages
3. **Use TypeScript types** for better development experience
4. **Set loading states** for better UX
5. **Cache data when appropriate** to reduce API calls
6. **Use environment variables** for API configuration

## 📞 Need Help?

- Check the browser console for error messages
- Look at the Network tab in dev tools
- Verify your backend API is working with tools like Postman
- Ask team members or check internal documentation

---

Happy coding! 🎉
