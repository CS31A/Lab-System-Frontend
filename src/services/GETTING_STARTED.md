# 🚀 Getting Started with API Service

Welcome to the API service! This guide will help you get up and running quickly.

## 📋 Prerequisites

- Basic knowledge of JavaScript/TypeScript
- Understanding of async/await
- Familiarity with HTTP methods (GET, POST, etc.)

## 🎯 Quick Start (5 minutes)

### 1. Import the API Service

```typescript
import { apiService } from '@/services/api'
```

### 2. Make Your First Request

```typescript
// Get a list of users
try {
  const users = await apiService.get('/users')
  console.log('Users:', users)
}
catch (error) {
  console.error('Error:', error)
}
```

### 3. Create Something New

```typescript
// Create a new user
try {
  const newUser = await apiService.post('/users', {
    name: 'John Doe',
    email: 'john@example.com'
  })
  console.log('Created user:', newUser)
}
catch (error) {
  console.error('Failed to create user:', error)
}
```

That's it! You're now making API calls. 🎉

## 🛠️ Common Tasks

### Fetching Data

```typescript
// Get all items
const items = await apiService.get('/items')

// Get a specific item
const item = await apiService.get('/items/123')

// Search with parameters
const searchResults = await apiService.get('/items', {
  params: {
    search: 'laptop',
    category: 'electronics',
    page: 1
  }
})
```

### Creating Data

```typescript
// Create a new item
const newItem = await apiService.post('/items', {
  name: 'New Laptop',
  price: 999.99,
  category: 'electronics'
})
```

### Updating Data

```typescript
// Update an item (only send changed fields)
const updatedItem = await apiService.patch('/items/123', {
  price: 899.99 // Only update the price
})
```

### Deleting Data

```typescript
// Delete an item
const result = await apiService.delete('/items/123')

if (result.success) {
  console.log('Item deleted!')
}
```

### Logout

```typescript
import { setAuthToken } from '@/boot/axios'

// Logout and clear token
try {
  await apiService.post('/auth/logout')
}
catch (error) {
  console.error('Logout failed:', error)
}
finally {
  setAuthToken(null)
}
```

## 📁 File Uploads

```typescript
// Get file from input
const fileInput = document.getElementById('fileInput') as HTMLInputElement
const file = fileInput.files[0]

// Create form data
const formData = new FormData()
formData.append('file', file)
formData.append('description', 'My uploaded file')

// Upload
const uploadResult = await apiService.upload('/upload', formData)

if (uploadResult.success) {
  console.log('File uploaded:', uploadResult.data.url)
}
```

## ⚠️ Error Handling

### Basic Error Handling

```typescript
const response = await apiService.get('/users')

if (response.success) {
  // Everything went well
  console.log('Data:', response.data)
}
else {
  // Something went wrong
  console.error('Error:', response.message)

  // Check specific error types
  if (response.status === 401) {
    console.log('User needs to login')
  }
  else if (response.status === 404) {
    console.log('Data not found')
  }
}
```

### Advanced Error Handling

```typescript
try {
  const response = await apiService.get('/users')

  if (response.success) {
    // Handle success
    setUsers(response.data)
  }
  else {
    // Handle API errors
    switch (response.status) {
      case 401:
        // Redirect to login
        router.push('/login')
        break
      case 403:
        // Show permission error
        showError('You don\'t have permission to view this')
        break
      case 500:
        // Show server error
        showError('Server error, please try again later')
        break
      default:
        showError(response.message)
    }
  }
}
catch (error) {
  // Handle network errors
  console.error('Network error:', error)
  showError('Network error, please check your connection')
}
```

## 🎨 Using with Vue Components

### Basic Component Example

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { apiService } from '@/services/api'

const users = ref([])
const loading = ref(false)
const error = ref(null)

async function loadUsers() {
  loading.value = true
  error.value = null

  const response = await apiService.get('/users')

  if (response.success) {
    users.value = response.data
  }
  else {
    error.value = response.message
  }

  loading.value = false
}

onMounted(() => {
  loadUsers()
})
</script>

<template>
  <div>
    <div v-if="loading">
      Loading...
    </div>
    <div v-else-if="error">
      Error: {{ error }}
    </div>
    <div v-else>
      <div v-for="user in users" :key="user.id">
        {{ user.name }} - {{ user.email }}
      </div>
    </div>
  </div>
</template>
```

### Form Submission Example

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { apiService } from '@/services/api'

const form = ref({
  name: '',
  email: ''
})

const submitting = ref(false)

async function createUser() {
  submitting.value = true

  const response = await apiService.post('/users', form.value)

  if (response.success) {
    console.log('User created:', response.data)
    // Reset form
    form.value = { name: '', email: '' }
    // Show success message
  }
  else {
    console.error('Failed to create user:', response.message)
    // Show error message
  }

  submitting.value = false
}
</script>

<template>
  <form @submit.prevent="createUser">
    <input v-model="form.name" placeholder="Name" required>
    <input v-model="form.email" type="email" placeholder="Email" required>
    <button type="submit" :disabled="submitting">
      {{ submitting ? 'Creating...' : 'Create User' }}
    </button>
  </form>
</template>
```

## 🔧 TypeScript Tips

### Define Your Data Types

```typescript
// Define interfaces for your data
interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
  createdAt: string
}

// Use them with API calls
const response = await apiService.get<User[]>('/users')
if (response.success) {
  // response.data is now typed as User[]
  response.data.forEach((user) => {
    console.log(user.name) // TypeScript knows this is a string
  })
}
```

### Create Typed API Functions

```typescript
// Create typed functions for your endpoints
async function getUsers(): Promise<User[] | null> {
  const response = await apiService.get<User[]>('/users')
  return response.success ? response.data : null
}

async function createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User | null> {
  const response = await apiService.post<User>('/users', userData)
  return response.success ? response.data : null
}
```

## 🎯 Next Steps

1. **Read the full documentation**: Check out `README.md` for complete API reference
2. **Try the helper functions**: Look at `apiHelpers.ts` for simplified functions
3. **Explore examples**: See more examples in the documentation
4. **Join the team**: Ask questions in team chat or code reviews

## 🆘 Need Help?

- **Check the console**: Look for error messages in browser dev tools
- **Check the Network tab**: See what requests are actually being made
- **Read the error message**: The API service provides helpful error messages
- **Ask the team**: Don't hesitate to ask for help!

---

Happy coding! 🎉
