# 🔧 API Service Troubleshooting Guide

Common issues and how to solve them.

## 🚨 Common Errors

### "Network error" or "Failed to fetch"

**Symptoms:**

- API calls fail with network error
- Console shows "Failed to fetch" or similar

**Possible Causes & Solutions:**

1. **Backend server not running**

   ```bash
   # Check if your backend is running
   curl http://localhost:8787/health
   ```

2. **Wrong API base URL**

   ```typescript
   // Check your .env file
   console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL)
   ```

3. **CORS issues**
   - Backend needs to allow requests from your frontend domain
   - Check browser console for CORS error messages

4. **Network connectivity**
   - Check your internet connection
   - Try accessing the API directly in browser

### "401 Unauthorized"

**Symptoms:**

- API returns 401 status
- User gets "Authentication required" message

**Solutions:**

1. **Check if token is set**

   ```typescript
   import { setAuthToken } from '@/boot/axios'

   // Make sure you set the token after login
   setAuthToken(loginResponse.token)
   ```

2. **Token might be expired**

   ```typescript
   import { setAuthToken } from '@/boot/axios'

   // Check token expiration
   try {
     const profile = await apiService.get('/auth/me')
   }
   catch (error) {
     if (error.response?.status === 401) {
       // Token expired, redirect to login
       setAuthToken(null)
     }
   }
   ```

3. **Token format issues**

   ```typescript
   import { setAuthToken } from '@/boot/axios'

   // Make sure token doesn't include 'Bearer ' prefix
   // The service adds it automatically
   setAuthToken('your-jwt-token') // ✅ Correct
   setAuthToken('Bearer your-jwt-token') // ❌ Wrong
   ```

### "403 Forbidden"

**Symptoms:**

- API returns 403 status
- User gets "Access denied" message

**Solutions:**

- User doesn't have permission for this action
- Check user role and permissions
- Contact admin to grant necessary permissions

### "404 Not Found"

**Symptoms:**

- API returns 404 status
- Endpoint not found

**Solutions:**

1. **Check endpoint URL**

   ```typescript
   // Make sure endpoint is correct
   apiService.get('/users') // ✅ Correct
   apiService.get('/user') // ❌ Wrong (missing 's')
   apiService.get('users') // ❌ Wrong (missing '/')
   ```

2. **Check if resource exists**
   ```typescript
   // Make sure the ID exists
   const user = await apiService.get('/users/123')
   if (!user.success && user.status === 404) {
     console.log('User with ID 123 does not exist')
   }
   ```

### "500 Internal Server Error"

**Symptoms:**

- API returns 500 status
- Server error message

**Solutions:**

- This is a backend issue
- Check backend logs
- Contact backend developer
- Try again later (might be temporary)

### Request Timeout

**Symptoms:**

- Request takes too long and fails
- "Request timeout" error

**Solutions:**

1. **Increase timeout**

   ```typescript
   const response = await apiService.get('/slow-endpoint', {
     timeout: 30000 // 30 seconds
   })
   ```

2. **Check backend performance**
   - Backend might be slow
   - Database queries might be inefficient

### TypeScript Errors

**Symptoms:**

- TypeScript compilation errors
- Type mismatch errors

**Solutions:**

1. **Define proper types**

   ```typescript
   interface User {
     id: string
     name: string
     email: string
   }

   const response = await apiService.get<User[]>('/users')
   ```

2. **Handle null responses**
   ```typescript
   const response = await apiService.get<User[]>('/users')
   if (response.success && response.data) {
     // Now TypeScript knows data is not null
     response.data.forEach(user => console.log(user.name))
   }
   ```

## 🔍 Debugging Tips

### 1. Check Browser Network Tab

1. Open browser dev tools (F12)
2. Go to Network tab
3. Make your API request
4. Look at the actual HTTP request/response

**What to check:**

- Request URL (is it correct?)
- Request headers (is Authorization header present?)
- Response status code
- Response body (error details)

### 2. Add Console Logging

```typescript
// Add logging to see what's happening
console.log('Making API request to:', endpoint)
console.log('Request data:', data)

const response = await apiService.post('/users', data)

console.log('Response status:', response.status)
console.log('Response success:', response.success)
console.log('Response data:', response.data)
console.log('Response message:', response.message)
```

### 3. Test with Simple Tools

```bash
# Test your API with curl
curl -X GET http://localhost:3000/api/users

# Test with authentication
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer your-token-here"
```

### 4. Check Environment Variables

```typescript
// Make sure environment variables are loaded
console.log('Environment variables:')
console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL)
console.log('Mode:', import.meta.env.MODE)
console.log('Dev mode:', import.meta.env.DEV)
```

## 🛠️ Development Setup Issues

### Environment Variables Not Loading

**Problem:** `import.meta.env.VITE_API_BASE_URL` is undefined

**Solutions:**

1. **Check .env file exists**

   ```bash
   # Make sure you have .env file in project root
   ls -la .env
   ```

2. **Check variable name**

   ```bash
   # Must start with VITE_
   VITE_API_BASE_URL=http://localhost:3000/api  # ✅ Correct
   API_BASE_URL=http://localhost:3000/api       # ❌ Wrong
   ```

3. **Restart dev server**
   ```bash
   # Environment changes require restart
   npm run dev
   # or
   pnpm dev
   ```

### Import Errors

**Problem:** Can't import API service

**Solutions:**

1. **Check import path**

   ```typescript
   import { apiService } from '@/services' // ✅ Also correct
   import { apiService } from '@/services/api' // ✅ Correct
   import { apiService } from './services/api' // ✅ Relative path
   ```

2. **Check TypeScript configuration**
   - Make sure `@` alias is configured in `vite.config.ts`
   - Check `tsconfig.json` paths

## 🔄 Common Patterns That Cause Issues

### 1. Not Checking Response Success

```typescript
// ❌ Wrong - doesn't check if request succeeded
const response = await apiService.get('/users')
console.log(response.data) // Might be null if request failed

// ✅ Correct - always check success
const response = await apiService.get('/users')
if (response.success) {
  console.log(response.data)
}
else {
  console.error('Request failed:', response.message)
}
```

### 2. Forgetting to Set Auth Token

```typescript
// ❌ Wrong - token not set after login
const loginResponse = await apiService.post('/auth/login', credentials)
const profile = await apiService.get('/auth/me') // Will fail with 401

// ✅ Correct - set token after login
const loginResponse = await apiService.post('/auth/login', credentials)
if (loginResponse.success) {
  apiService.setAuthToken(loginResponse.data.token)
  const profile = await apiService.get('/auth/me') // Now works
}
```

### 3. Not Handling Async Properly

```typescript
// ❌ Wrong - not awaiting
const response = apiService.get('/users') // Returns Promise, not data
console.log(response.data) // undefined

// ✅ Correct - await the promise
const response = await apiService.get('/users')
if (response.success) {
  console.log(response.data)
}
```

## 📞 Getting Help

### 1. Check Documentation

- Read `README.md` for complete API reference
- Check `GETTING_STARTED.md` for basic usage
- Look at `examples.ts` for code examples

### 2. Search Error Messages

- Copy the exact error message
- Search in codebase for similar issues
- Check browser console for more details

### 3. Ask for Help

- Include the exact error message
- Share the code that's not working
- Mention what you've already tried
- Include browser network tab screenshots if relevant

### 4. Create Minimal Reproduction

```typescript
// Create a simple test case
async function testAPI() {
  console.log('Testing API...')
  const response = await apiService.get('/users')
  console.log('Response:', response)
}

testAPI()
```

---

## 🎯 Prevention Tips

1. **Always check response.success** before using data
2. **Set up proper error handling** early in development
3. **Use TypeScript types** to catch errors at compile time
4. **Test API endpoints** with simple tools first
5. **Keep environment variables** in version control (example files)
6. **Document your API endpoints** for team members

Remember: Most API issues are configuration or usage problems, not bugs in the service itself! 🐛➡️✅
