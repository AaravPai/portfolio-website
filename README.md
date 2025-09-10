# Portfolio Website

A modern, responsive portfolio website built with React, TypeScript, and Vite.

## Features

- ⚡ Fast development with Vite
- 🔷 TypeScript for type safety
- 🎨 Dark/Light theme support
- 📱 Responsive design
- 🧹 ESLint and Prettier for code quality
- 🎯 Modern React patterns with hooks and context

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

Build the project:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
src/
├── components/          # React components
│   ├── common/         # Reusable components
│   └── sections/       # Page sections
├── contexts/           # React contexts
├── data/              # Static data files
├── styles/            # CSS files and themes
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
└── App.tsx            # Main application component
```

## Technologies Used

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **React Icons** - Icon library
- **EmailJS** - Contact form handling
- **Formik & Yup** - Form handling and validation

## Theme System

The application supports both light and dark themes with:
- System preference detection
- Manual theme switching
- Local storage persistence
- Smooth transitions between themes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.