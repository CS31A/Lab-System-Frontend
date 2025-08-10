# Contributing to Lab System Frontend

Welcome to the Lab System Frontend project! This guide will help you get started with Vue 3 development, especially if you're new to the framework.

## Table of Contents

- [Getting Started](#getting-started)
- [Vue 3 Fundamentals](#vue-3-fundamentals)
- [Project Guidelines](#project-guidelines)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Testing Guidelines](#testing-guidelines)
- [Common Patterns](#common-patterns)
- [Troubleshooting](#troubleshooting)

## Getting Started

### Prerequisites

Before you start, make sure you have:

1. **Node.js 18+** installed
2. **pnpm** package manager (recommended)
3. **VSCode** with Volar extension
4. Basic knowledge of JavaScript/TypeScript
5. Familiarity with HTML and CSS

### First-Time Setup

```bash
# 1. Clone the repository
git clone <repository-url>
cd lab-system-frontend

# 2. Install dependencies
pnpm install

# 3. Copy environment file
cp .env.example .env

# 4. Start development server
pnpm dev
```

### VSCode Extensions (Required)

Install these extensions for the best development experience:

```
Vue Language Features (Volar) - Vue.volar
TypeScript Vue Plugin (Volar) - Vue.vscode-typescript-vue-plugin
ESLint - dbaeumer.vscode-eslint
```

**Important**: Disable the Vetur extension if you have it installed.

## Vue 3 Fundamentals

### Understanding Vue Components

Vue components are the building blocks of our application. Here's a basic structure:

```vue
<script setup lang="ts">
// This is where your component logic goes
import { computed, ref } from 'vue'

// Reactive data
const count = ref(0)

// Computed properties
const doubleCount = computed(() => count.value * 2)

// Functions
function increment() {
  count.value++
}
</script>

<template>
  <!-- This is your HTML template -->
  <div class="my-component">
    <h2>Count: {{ count }}</h2>
    <p>Double: {{ doubleCount }}</p>
    <button @click="increment">
      Increment
    </button>
  </div>
</template>

<style scoped>
/* Component-specific styles */
.my-component {
  padding: 1rem;
  border: 1px solid var(--color-border);
}
</style>
```

### Key Vue 3 Concepts

#### 1. Reactivity with `ref()` and `reactive()`

```typescript
import { reactive, ref } from 'vue'

// For primitive values
const count = ref(0)
const message = ref('Hello')

// For objects
const user = reactive({
  name: 'John',
  email: 'john@example.com'
})

// Accessing values
console.log(count.value) // Note the .value for ref
console.log(user.name) // Direct access for reactive
```

#### 2. Props and Emits

```vue
<script setup lang="ts">
// Define props with TypeScript
interface Props {
  title: string
  count?: number
}

const props = defineProps<Props>()

// Define emits
const emit = defineEmits<{
  update: [value: number]
  close: []
}>()

function handleUpdate() {
  emit('update', props.count + 1)
}
</script>

<template>
  <div>
    <h3>{{ title }}</h3>
    <button @click="handleUpdate">
      Update
    </button>
  </div>
</template>
```

#### 3. Computed Properties

```typescript
import { computed, ref } from 'vue'

const firstName = ref('John')
const lastName = ref('Doe')

// Computed property automatically updates when dependencies change
const fullName = computed(() => `${firstName.value} ${lastName.value}`)
```

#### 4. Watchers

```typescript
import { ref, watch } from 'vue'

const count = ref(0)

// Watch for changes
watch(count, (newValue, oldValue) => {
  console.log(`Count changed from ${oldValue} to ${newValue}`)
})
```

## Project Guidelines

### File Organization

```
src/
├── components/          # Reusable components
│   ├── ui/             # Generic UI components (buttons, inputs)
│   ├── lab/            # Lab-specific components
│   └── __tests__/      # Component tests
├── views/              # Page components (one per route)
├── composables/        # Reusable composition functions
├── stores/             # Pinia stores for state management
├── services/           # API and external services
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

### Naming Conventions

- **Components**: PascalCase (`LabEquipment.vue`, `UserProfile.vue`)
- **Files**: kebab-case (`lab-equipment.vue`, `user-profile.ts`)
- **Variables**: camelCase (`userName`, `isLoading`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`, `MAX_RETRIES`)

### Component Guidelines

#### 1. Component Structure Order

```vue
<script setup lang="ts">
// 1. Imports
import { ref } from 'vue'
import MyComponent from './MyComponent.vue'

// 2. Props and emits
interface Props {
  title: string
}
const props = defineProps<Props>()
const emit = defineEmits<{ close: [] }>()

// 3. Reactive data
const isVisible = ref(true)

// 4. Computed properties
const displayTitle = computed(() => props.title.toUpperCase())

// 5. Functions
function handleClose() {
  emit('close')
}

// 6. Lifecycle hooks
onMounted(() => {
  console.log('Component mounted')
})
</script>

<template>
  <div>
    <!-- Keep template simple and readable -->
    <h1>{{ title }}</h1>
  </div>
</template>

<style scoped>
/* Use scoped styles to avoid conflicts */
</style>
```

#### 2. Props Validation

Always use TypeScript interfaces for props:

```typescript
interface Props {
  // Required prop
  id: string

  // Optional prop with default
  size?: 'small' | 'medium' | 'large'

  // Optional prop
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  disabled: false
})
```

### State Management with Pinia

#### Creating a Store

```typescript
// stores/equipment.ts
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useEquipmentStore = defineStore('equipment', () => {
  // State
  const equipment = ref([])
  const loading = ref(false)

  // Getters
  const activeEquipment = computed(() =>
    equipment.value.filter(item => item.status === 'active')
  )

  // Actions
  async function fetchEquipment() {
    loading.value = true
    try {
      const data = await apiService.get('/equipment')
      equipment.value = data
    }
    finally {
      loading.value = false
    }
  }

  return {
    equipment,
    loading,
    activeEquipment,
    fetchEquipment
  }
})
```

#### Using a Store

```vue
<script setup lang="ts">
import { useEquipmentStore } from '@/stores/equipment'

const equipmentStore = useEquipmentStore()

// Access state and getters
console.log(equipmentStore.equipment)
console.log(equipmentStore.activeEquipment)

// Call actions
equipmentStore.fetchEquipment()
</script>
```

## Development Workflow

### 1. Creating a New Feature

```bash
# 1. Create a new branch
git checkout -b feature/equipment-monitoring

# 2. Create necessary files
# - Component: src/components/lab/EquipmentMonitor.vue
# - Store: src/stores/equipment.ts
# - Types: src/types/equipment.ts
# - Tests: src/components/__tests__/EquipmentMonitor.spec.ts

# 3. Implement the feature
# 4. Write tests
# 5. Update documentation
```

### 2. API Integration

Use the existing API service:

```typescript
import type { Equipment } from '@/types/equipment'
// services/equipment.ts
import { apiService } from './api'

export const equipmentService = {
  async getAll(): Promise<Equipment[]> {
    return apiService.get('/equipment')
  },

  async getById(id: string): Promise<Equipment> {
    return apiService.get(`/equipment/${id}`)
  },

  async create(data: Partial<Equipment>): Promise<Equipment> {
    return apiService.post('/equipment', data)
  },

  async update(id: string, data: Partial<Equipment>): Promise<Equipment> {
    return apiService.put(`/equipment/${id}`, data)
  }
}
```

### 3. Error Handling

```vue
<script setup lang="ts">
import { ref } from 'vue'

const error = ref<string | null>(null)
const loading = ref(false)

async function loadData() {
  loading.value = true
  error.value = null

  try {
    const data = await apiService.get('/data')
    // Handle success
  }
  catch (err) {
    error.value = err instanceof Error ? err.message : 'An error occurred'
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <div v-if="loading">
      Loading...
    </div>
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    <div v-else>
      <!-- Your content -->
    </div>
  </div>
</template>
```

## Code Standards

### TypeScript Guidelines

1. **Always use TypeScript**: No plain JavaScript files
2. **Define interfaces**: For all data structures
3. **Use strict mode**: Already configured in the project
4. **Avoid `any`**: Use proper types or `unknown`

```typescript
// Good
interface User {
  id: string
  name: string
  email: string
}

// Bad
const user: any = { name: 'John', age: 30 }
```

### ESLint Rules

The project uses strict ESLint rules. Common issues:

```typescript
// Use const for values that don't change
const API_URL = 'http://localhost:3000'

// Use proper spacing
const items = [1, 2, 3]

// Use template literals for string interpolation
const message = `Hello, ${name}!`

// Use optional chaining
const email = user?.profile?.email
```

### CSS Guidelines

1. **Use CSS custom properties**: For theming
2. **Scoped styles**: Always use `<style scoped>`
3. **Mobile-first**: Design for mobile, enhance for desktop
4. **Consistent spacing**: Use rem units

```vue
<style scoped>
.component {
  /* Use CSS custom properties */
  color: var(--color-text);
  background: var(--color-background);

  /* Mobile-first responsive design */
  padding: 1rem;
}

@media (min-width: 768px) {
  .component {
    padding: 2rem;
  }
}
</style>
```

## Testing Guidelines

### Component Testing

```typescript
// __tests__/EquipmentCard.spec.ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import EquipmentCard from '../EquipmentCard.vue'

describe('EquipmentCard', () => {
  it('renders equipment name', () => {
    const wrapper = mount(EquipmentCard, {
      props: {
        equipment: {
          id: '1',
          name: 'Microscope',
          status: 'active'
        }
      }
    })

    expect(wrapper.text()).toContain('Microscope')
  })

  it('emits select event when clicked', async () => {
    const wrapper = mount(EquipmentCard, {
      props: { equipment: mockEquipment }
    })

    await wrapper.find('.card').trigger('click')

    expect(wrapper.emitted('select')).toBeTruthy()
  })
})
```

### Running Tests

```bash
# Run all tests
pnpm test:unit

# Run tests in watch mode
pnpm test:unit --watch

# Run specific test file
pnpm test:unit EquipmentCard.spec.ts

# Run with coverage
pnpm test:unit --coverage
```

## Common Patterns

### 1. Loading States

```vue
<script setup lang="ts">
const { data, loading, error } = await useAsyncData()
</script>

<template>
  <div>
    <LoadingSpinner v-if="loading" />
    <ErrorMessage v-else-if="error" :message="error" />
    <div v-else>
      <!-- Your content -->
    </div>
  </div>
</template>
```

### 2. Form Handling

```vue
<script setup lang="ts">
import { reactive } from 'vue'

const form = reactive({
  name: '',
  email: '',
  message: ''
})

const errors = reactive({})

function validateForm() {
  // Validation logic
}

async function submitForm() {
  if (!validateForm())
    return

  try {
    await apiService.post('/contact', form)
    // Handle success
  }
  catch (error) {
    // Handle error
  }
}
</script>
```

### 3. Composables (Reusable Logic)

```typescript
// composables/useApi.ts
import { ref } from 'vue'

export function useApi<T>(url: string) {
  const data = ref<T | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetch() {
    loading.value = true
    error.value = null

    try {
      data.value = await apiService.get(url)
    }
    catch (err) {
      error.value = err.message
    }
    finally {
      loading.value = false
    }
  }

  return { data, loading, error, fetch }
}
```

## Troubleshooting

### Common Issues

#### 1. "Cannot find module" errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

#### 2. TypeScript errors in .vue files

- Make sure Volar extension is installed and enabled
- Restart VSCode
- Check that Vetur is disabled

#### 3. Hot reload not working

```bash
# Restart the dev server
pnpm dev
```

#### 4. ESLint errors

```bash
# Auto-fix most issues
pnpm lint:fix
```

### Getting Help

1. **Check the console**: Browser and terminal errors
2. **Vue DevTools**: Install the browser extension
3. **Documentation**: Vue 3, Pinia, Vite official docs
4. **Team**: Ask other developers for help

### Useful Commands

```bash
# Type checking
pnpm type-check

# Build for production
pnpm build

# Preview production build
pnpm preview

# Analyze bundle size
pnpm build --analyze
```

## Best Practices Summary

1. **Use Composition API**: Prefer `<script setup>` syntax
2. **Type everything**: Use TypeScript interfaces and types
3. **Keep components small**: Single responsibility principle
4. **Use Pinia for state**: Avoid prop drilling
5. **Write tests**: Especially for complex logic
6. **Follow naming conventions**: Consistent naming across the project
7. **Use CSS custom properties**: For maintainable styling
8. **Handle errors gracefully**: Always provide user feedback
9. **Optimize performance**: Use `v-memo` and lazy loading when needed
10. **Document your code**: Write clear comments and documentation

---

Welcome to the team! If you have questions, don't hesitate to ask other developers or refer to the official Vue 3 documentation.
