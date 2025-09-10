# Deployment Guide

This guide covers deploying the portfolio website to various hosting platforms.

## Quick Start

1. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your actual values
   ```

2. **Run pre-deployment checks**:
   ```bash
   npm run pre-deploy
   ```

3. **Deploy to your chosen platform**:
   ```bash
   npm run deploy:netlify    # Deploy to Netlify
   npm run deploy:vercel     # Deploy to Vercel  
   npm run deploy:github     # Deploy to GitHub Pages
   ```

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_EMAILJS_SERVICE_ID` | EmailJS service ID | `service_abc123` |
| `VITE_EMAILJS_TEMPLATE_ID` | EmailJS template ID | `template_xyz789` |
| `VITE_EMAILJS_PUBLIC_KEY` | EmailJS public key | `your_public_key` |
| `VITE_SITE_URL` | Production site URL | `https://yourportfolio.com` |
| `VITE_CONTACT_EMAIL` | Your contact email | `contact@example.com` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_SITE_NAME` | Site name for meta tags | `Portfolio` |
| `VITE_SITE_DESCRIPTION` | Site description | `Professional portfolio...` |
| `VITE_GITHUB_URL` | GitHub profile URL | - |
| `VITE_LINKEDIN_URL` | LinkedIn profile URL | - |
| `VITE_TWITTER_URL` | Twitter profile URL | - |
| `VITE_GA_TRACKING_ID` | Google Analytics ID | - |

## Platform-Specific Setup

### Netlify

1. **Automatic Deployment** (Recommended):
   - Connect your GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Add environment variables in Netlify dashboard

2. **Manual Deployment**:
   ```bash
   npm install -g netlify-cli
   netlify login
   npm run deploy:netlify
   ```

3. **Configuration**:
   - The `netlify.toml` file is already configured
   - Includes redirects for SPA routing
   - Security headers and caching rules

### Vercel

1. **Automatic Deployment** (Recommended):
   - Connect your GitHub repository to Vercel
   - Vercel will auto-detect Vite configuration
   - Add environment variables in Vercel dashboard

2. **Manual Deployment**:
   ```bash
   npm install -g vercel
   vercel login
   npm run deploy:vercel
   ```

3. **Configuration**:
   - The `vercel.json` file is already configured
   - Includes SPA routing and security headers

### GitHub Pages

1. **Setup**:
   ```bash
   npm run deploy:github
   ```

2. **Configuration**:
   - Enable GitHub Pages in repository settings
   - Set source to `gh-pages` branch
   - Custom domain can be configured in repository settings

## CI/CD Setup

### GitHub Actions

The repository includes comprehensive GitHub Actions workflows:

1. **Test Workflow** (`.github/workflows/test.yml`):
   - Runs on every push and PR
   - Includes unit tests, integration tests, E2E tests
   - Accessibility and performance testing

2. **Deploy Workflow** (`.github/workflows/deploy.yml`):
   - Runs on push to main branch
   - Deploys to multiple platforms
   - Includes post-deployment Lighthouse audits

### Required Secrets

Add these secrets to your GitHub repository:

#### For Netlify:
- `NETLIFY_AUTH_TOKEN`: Your Netlify personal access token
- `NETLIFY_SITE_ID`: Your site ID from Netlify

#### For Vercel:
- `VERCEL_TOKEN`: Your Vercel token
- `VERCEL_ORG_ID`: Your Vercel organization ID
- `VERCEL_PROJECT_ID`: Your Vercel project ID

#### Environment Variables:
- `VITE_EMAILJS_SERVICE_ID`
- `VITE_EMAILJS_TEMPLATE_ID`
- `VITE_EMAILJS_PUBLIC_KEY`
- `VITE_SITE_URL`
- `VITE_SITE_NAME`
- `VITE_SITE_DESCRIPTION`
- `VITE_CONTACT_EMAIL`
- `VITE_GITHUB_URL`
- `VITE_LINKEDIN_URL`
- `VITE_TWITTER_URL`

## Build Optimization

The build process includes several optimizations:

### Code Splitting
- Vendor libraries are split into separate chunks
- Feature-based code splitting for lazy-loaded sections
- Optimal chunk sizes for better caching

### Asset Optimization
- Image compression and modern formats
- CSS minification and purging
- JavaScript minification with Terser

### Performance Features
- Service worker for offline functionality
- Lazy loading for images and components
- Preloading of critical resources

## Monitoring and Analytics

### Performance Monitoring
- Lighthouse CI integration
- Core Web Vitals tracking
- Bundle size monitoring

### Error Tracking
Consider adding error tracking services:
- Sentry for error monitoring
- LogRocket for session replay
- Google Analytics for user analytics

## Troubleshooting

### Common Issues

1. **Build Failures**:
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

2. **Environment Variables Not Working**:
   - Ensure variables start with `VITE_`
   - Check variable names match exactly
   - Restart development server after changes

3. **EmailJS Not Working**:
   - Verify service ID, template ID, and public key
   - Check EmailJS dashboard for service status
   - Ensure template variables match form fields

4. **Routing Issues on Deployment**:
   - Check platform-specific redirect rules
   - Ensure SPA routing is configured correctly
   - Verify `netlify.toml` or `vercel.json` settings

### Debug Commands

```bash
# Test build locally
npm run build
npm run preview

# Run deployment dry-run
npm run deploy:dry-run

# Check bundle analysis
npm run analyze

# Run all tests
npm run test:all
```

## Security Considerations

### Content Security Policy
Consider adding CSP headers for enhanced security:

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' https://cdn.emailjs.com;
               style-src 'self' 'unsafe-inline';
               img-src 'self' data: https:;
               connect-src 'self' https://api.emailjs.com;">
```

### Environment Security
- Never commit `.env.local` or `.env.production`
- Use platform-specific secret management
- Regularly rotate API keys and tokens

## Performance Targets

The application is optimized to meet these targets:

- **Lighthouse Performance**: > 90
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Bundle Size**: < 500KB (gzipped)

## Support

For deployment issues:
1. Check the troubleshooting section above
2. Review platform-specific documentation
3. Check GitHub Actions logs for CI/CD issues
4. Verify environment variables are set correctly