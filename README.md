# Lab System Frontend

A modern Vue 3 application for laboratory management built with TypeScript and Vue

## Prerequisites

- **Node.js**: Version 18 or higher
- **Package Manager**: pnpm
- **IDE**: VSCode with Volar extension (recommended)

## Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd lab-system-frontend
pnpm install
```

### 2. Environment Setup

```bash
cp .env.example .env
# Edit .env with your API configuration
```

### 3. Start Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:5173`

## Development

### Available Scripts

```bash
# Development
pnpm dev              # Start development server with hot reload
pnpm build            # Build for production
pnpm preview          # Preview production build locally

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint issues automatically
pnpm type-check       # Run TypeScript type checking

# Testing
pnpm test:unit        # Run unit tests with Vitest
```

### Project Structure

```
src/
├── components/       # Reusable Vue components
│   ├── icons/       # SVG icon components
│   └── __tests__/   # Component tests
├── views/           # Page-level components (routes)
├── router/          # Vue Router configuration
├── stores/          # Pinia state management
├── services/        # API services and HTTP client
├── boot/            # App initialization (Axios setup)
├── utils/           # Utility functions
└── assets/          # CSS and static assets
```

## Configuration

### API Configuration

The application uses environment variables for configuration:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=Lab System Frontend
VITE_DEV_MODE=true
```

### IDE Setup

**Recommended**: [VSCode](https://code.visualstudio.com/) with the following extensions:

- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) - Vue 3 support
- [TypeScript Vue Plugin](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)

**Important**: Disable Vetur if you have it installed, as it conflicts with Volar.

## Testing

The project uses Vitest for unit testing with Vue Test Utils:

```bash
# Run tests
pnpm test:unit

# Run tests in watch mode
pnpm test:unit --watch

# Run tests with coverage
pnpm test:unit --coverage
```

## Documentation

- **API Service**: See `src/services/README.md` for detailed API usage
- **Getting Started**: Check `src/services/GETTING_STARTED.md` for quick examples
- **Troubleshooting**: Refer to `src/services/TROUBLESHOOTING.md` for common issues

## Contributing

We welcome contributions from internal developers! Please read our [CONTRIBUTION.md](./CONTRIBUTION.md) for detailed guidelines, especially if you're new to Vue development.

## Architecture

### State Management

- **Pinia**: Modern state management for Vue 3
- **Composition API**: Reactive state with `ref()` and `reactive()`

### HTTP Client

- **Axios**: Configured with interceptors for auth and error handling
- **Type Safety**: Full TypeScript support for API responses
- **Error Handling**: Global error handling with user-friendly messages

## License

Internal use only - see company guidelines for usage and distribution.

---

For detailed development guidelines and Vue.js best practices, see [CONTRIBUTION.md](./CONTRIBUTION.md).
