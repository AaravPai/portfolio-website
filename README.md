# 🚀 Portfolio Website

A modern, responsive portfolio website built with React, TypeScript, and Vite. Showcasing professional projects, skills, and experience with optimal performance and accessibility.

[![Deploy to GitHub Pages](https://github.com/yourusername/portfolio-website/actions/workflows/github-pages.yml/badge.svg)](https://github.com/yourusername/portfolio-website/actions/workflows/github-pages.yml)
[![Tests](https://github.com/yourusername/portfolio-website/actions/workflows/test.yml/badge.svg)](https://github.com/yourusername/portfolio-website/actions/workflows/test.yml)

## ✨ Features

- **🎨 Modern Design** - Clean, professional interface with dark/light theme
- **📱 Fully Responsive** - Optimized for all devices and screen sizes
- **⚡ High Performance** - Lighthouse score 95+, optimized bundle size
- **♿ Accessible** - WCAG 2.1 AA compliant, screen reader friendly
- **🔧 Type Safe** - Built with TypeScript for better development experience
- **📧 Contact Form** - Integrated EmailJS for direct contact
- **🧪 Well Tested** - Comprehensive test suite with 95%+ coverage
- **🚀 Easy Deployment** - Multiple deployment options included

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: CSS3 with CSS Variables, Responsive Design
- **Forms**: Formik + Yup validation
- **Email**: EmailJS integration
- **Testing**: Vitest, Cypress, Testing Library
- **CI/CD**: GitHub Actions
- **Deployment**: GitHub Pages, Netlify, Vercel support

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**:
```bash
git clone https://github.com/yourusername/portfolio-website.git
cd portfolio-website
```

2. **Install dependencies**:
```bash
npm install
```

3. **Set up environment variables**:
```bash
cp .env.example .env.local
# Edit .env.local with your actual values
```

4. **Start development server**:
```bash
npm run dev
```

Visit `http://localhost:5173` to see your portfolio!

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run end-to-end tests |
| `npm run test:all` | Run all tests |
| `npm run lint` | Run ESLint |
| `npm run deploy:github` | Deploy to GitHub Pages |

## 🌐 Deployment to GitHub Pages

### Automatic Deployment (Recommended)

1. **Push to GitHub**:
```bash
git add .
git commit -m "Ready for deployment"
git branch -M main
git remote add origin https://github.com/yourusername/portfolio-website.git
git push -u origin main
```

2. **Enable GitHub Pages**:
   - Go to your repository settings
   - Navigate to "Pages" section
   - Set source to "GitHub Actions"
   - The site will auto-deploy on every push!

3. **Your site will be live at**: `https://yourusername.github.io/portfolio-website`

### Manual Deployment
```bash
npm run deploy:github
```

## 📁 Project Structure

```
portfolio-website/
├── src/
│   ├── components/          # React components
│   │   ├── common/         # Reusable UI components
│   │   ├── sections/       # Page sections (Hero, Projects, etc.)
│   │   └── lazy/           # Lazy-loaded components
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   ├── styles/             # Global styles and variables
│   ├── data/               # Static data (projects, skills, etc.)
│   ├── services/           # External services (EmailJS)
│   └── types/              # TypeScript type definitions
├── public/                 # Static assets
├── cypress/                # E2E tests
└── scripts/                # Build and deployment scripts
```

## 🎯 Performance Metrics

- **Lighthouse Performance**: 95+
- **Bundle Size**: <100KB gzipped
- **First Contentful Paint**: <1.5s
- **Largest Contentful Paint**: <2.5s
- **Cumulative Layout Shift**: <0.1

## ♿ Accessibility Features

- WCAG 2.1 AA compliant
- Screen reader compatible
- Keyboard navigation support
- High contrast mode support
- Focus management and skip links
- Semantic HTML structure

## 🧪 Testing

The project includes comprehensive testing:

- **Unit Tests**: Component and utility testing with Vitest
- **Integration Tests**: User workflow testing
- **E2E Tests**: Full application testing with Cypress
- **Accessibility Tests**: Automated a11y testing
- **Performance Tests**: Bundle size and performance monitoring

Run all tests:
```bash
npm run test:all
```

## 🔧 Customization

### Personal Information
Update your details in `src/data/`:
- `resume.ts` - Personal info, experience, education
- `projects.ts` - Your projects and portfolio items
- `skills.ts` - Technical skills and proficiencies

### Styling
- Global styles: `src/styles/`
- Component styles: Co-located with components
- Theme variables: `src/styles/variables.css`

### Environment Variables
Required for full functionality:
```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id  
VITE_EMAILJS_PUBLIC_KEY=your_public_key
VITE_SITE_URL=https://yourusername.github.io/portfolio-website
```

## 🌟 Features Showcase

- **Hero Section**: Professional introduction with animated text
- **Projects**: Interactive project cards with detailed modals
- **Skills**: Visual skill representation with proficiency levels
- **Resume**: Professional experience timeline and downloadable PDF
- **Contact**: Working contact form with EmailJS integration
- **Responsive Design**: Optimized for mobile, tablet, and desktop

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm run test:all`
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern web technologies and best practices
- Inspired by contemporary portfolio design trends
- Accessibility guidelines from WCAG 2.1
- Performance optimizations based on Core Web Vitals

---

**Live Demo**: [https://yourusername.github.io/portfolio-website](https://yourusername.github.io/portfolio-website)

**Questions?** Open an issue or reach out via the contact form on the live site!