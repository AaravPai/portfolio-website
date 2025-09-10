#!/usr/bin/env node

/**
 * Deployment script for portfolio website
 * Handles pre-deployment checks, build optimization, and deployment
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const DEPLOYMENT_PLATFORMS = {
  netlify: 'Netlify',
  vercel: 'Vercel',
  'github-pages': 'GitHub Pages'
};

class DeploymentManager {
  constructor() {
    this.platform = process.argv[2] || 'netlify';
    this.isDryRun = process.argv.includes('--dry-run');
    this.skipTests = process.argv.includes('--skip-tests');
    this.verbose = process.argv.includes('--verbose');
  }

  log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = level === 'error' ? '❌' : level === 'warn' ? '⚠️' : '✅';
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  exec(command, options = {}) {
    if (this.verbose) {
      this.log(`Executing: ${command}`, 'info');
    }
    
    if (this.isDryRun) {
      this.log(`[DRY RUN] Would execute: ${command}`, 'warn');
      return '';
    }

    try {
      return execSync(command, { 
        encoding: 'utf8', 
        stdio: this.verbose ? 'inherit' : 'pipe',
        ...options 
      });
    } catch (error) {
      this.log(`Command failed: ${command}`, 'error');
      this.log(`Error: ${error.message}`, 'error');
      process.exit(1);
    }
  }

  checkPrerequisites() {
    this.log('Checking deployment prerequisites...');

    // Check if platform is supported
    if (!DEPLOYMENT_PLATFORMS[this.platform]) {
      this.log(`Unsupported platform: ${this.platform}`, 'error');
      this.log(`Supported platforms: ${Object.keys(DEPLOYMENT_PLATFORMS).join(', ')}`, 'info');
      process.exit(1);
    }

    // Check if required files exist
    const requiredFiles = [
      'package.json',
      'vite.config.ts',
      'src/App.tsx'
    ];

    for (const file of requiredFiles) {
      if (!existsSync(file)) {
        this.log(`Required file missing: ${file}`, 'error');
        process.exit(1);
      }
    }

    // Check environment variables
    if (!existsSync('.env.local') && !existsSync('.env.production')) {
      this.log('No environment file found. Creating from template...', 'warn');
      if (existsSync('.env.example')) {
        this.exec('cp .env.example .env.local');
        this.log('Please update .env.local with your actual values', 'warn');
      }
    }

    this.log('Prerequisites check passed');
  }

  runTests() {
    if (this.skipTests) {
      this.log('Skipping tests as requested', 'warn');
      return;
    }

    this.log('Running test suite...');
    
    // Type checking
    this.log('Running type check...');
    this.exec('npm run type-check');
    
    // Linting
    this.log('Running linter...');
    this.exec('npm run lint');
    
    // Unit tests
    this.log('Running unit tests...');
    this.exec('npm run test:run');
    
    this.log('All tests passed');
  }

  optimizeBuild() {
    this.log('Building optimized production bundle...');
    
    // Clean previous build
    this.exec('rm -rf dist');
    
    // Build with production optimizations
    this.exec('npm run build');
    
    // Generate bundle analysis
    this.log('Generating bundle analysis...');
    this.exec('npm run analyze');
    
    // Check bundle size
    this.checkBundleSize();
    
    this.log('Build optimization completed');
  }

  checkBundleSize() {
    const distPath = join(process.cwd(), 'dist');
    if (!existsSync(distPath)) {
      this.log('Build directory not found', 'error');
      return;
    }

    // Get build stats
    const stats = this.exec('du -sh dist').trim();
    this.log(`Total bundle size: ${stats.split('\t')[0]}`);

    // Check individual chunk sizes
    const jsFiles = this.exec('find dist -name "*.js" -type f').trim().split('\n').filter(Boolean);
    const largeChunks = [];

    for (const file of jsFiles) {
      const size = parseInt(this.exec(`stat -f%z "${file}"`).trim());
      const sizeKB = Math.round(size / 1024);
      
      if (sizeKB > 500) { // Warn for chunks larger than 500KB
        largeChunks.push({ file: file.replace('dist/', ''), size: sizeKB });
      }
    }

    if (largeChunks.length > 0) {
      this.log('Large chunks detected:', 'warn');
      largeChunks.forEach(chunk => {
        this.log(`  ${chunk.file}: ${chunk.size}KB`, 'warn');
      });
    }
  }

  deployToNetlify() {
    this.log('Deploying to Netlify...');
    
    // Check if Netlify CLI is installed
    try {
      this.exec('netlify --version');
    } catch {
      this.log('Netlify CLI not found. Installing...', 'warn');
      this.exec('npm install -g netlify-cli');
    }

    // Deploy
    this.exec('netlify deploy --prod --dir=dist');
    this.log('Deployment to Netlify completed');
  }

  deployToVercel() {
    this.log('Deploying to Vercel...');
    
    // Check if Vercel CLI is installed
    try {
      this.exec('vercel --version');
    } catch {
      this.log('Vercel CLI not found. Installing...', 'warn');
      this.exec('npm install -g vercel');
    }

    // Deploy
    this.exec('vercel --prod');
    this.log('Deployment to Vercel completed');
  }

  deployToGitHubPages() {
    this.log('Deploying to GitHub Pages...');
    
    // Check if gh-pages is installed
    try {
      this.exec('npx gh-pages --version');
    } catch {
      this.log('Installing gh-pages...', 'warn');
      this.exec('npm install --save-dev gh-pages');
    }

    // Deploy
    this.exec('npx gh-pages -d dist');
    this.log('Deployment to GitHub Pages completed');
  }

  deploy() {
    this.log(`Starting deployment to ${DEPLOYMENT_PLATFORMS[this.platform]}...`);

    switch (this.platform) {
      case 'netlify':
        this.deployToNetlify();
        break;
      case 'vercel':
        this.deployToVercel();
        break;
      case 'github-pages':
        this.deployToGitHubPages();
        break;
      default:
        this.log(`Deployment method for ${this.platform} not implemented`, 'error');
        process.exit(1);
    }
  }

  generateDeploymentReport() {
    const report = {
      timestamp: new Date().toISOString(),
      platform: this.platform,
      version: JSON.parse(readFileSync('package.json', 'utf8')).version,
      buildSize: this.exec('du -sh dist').trim().split('\t')[0],
      nodeVersion: process.version,
      environment: process.env.NODE_ENV || 'production'
    };

    writeFileSync('deployment-report.json', JSON.stringify(report, null, 2));
    this.log('Deployment report generated: deployment-report.json');
  }

  run() {
    try {
      this.log(`🚀 Starting deployment process for ${DEPLOYMENT_PLATFORMS[this.platform]}...`);
      
      this.checkPrerequisites();
      this.runTests();
      this.optimizeBuild();
      
      if (!this.isDryRun) {
        this.deploy();
        this.generateDeploymentReport();
      }
      
      this.log('🎉 Deployment process completed successfully!');
      
      if (this.isDryRun) {
        this.log('This was a dry run. No actual deployment was performed.', 'warn');
      }
      
    } catch (error) {
      this.log(`Deployment failed: ${error.message}`, 'error');
      process.exit(1);
    }
  }
}

// Show usage if help is requested
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
Portfolio Deployment Script

Usage: node scripts/deploy.js [platform] [options]

Platforms:
  netlify       Deploy to Netlify (default)
  vercel        Deploy to Vercel
  github-pages  Deploy to GitHub Pages

Options:
  --dry-run     Show what would be done without executing
  --skip-tests  Skip running tests before deployment
  --verbose     Show detailed output
  --help, -h    Show this help message

Examples:
  node scripts/deploy.js netlify
  node scripts/deploy.js vercel --dry-run
  node scripts/deploy.js github-pages --skip-tests --verbose
`);
  process.exit(0);
}

// Run deployment
const deployment = new DeploymentManager();
deployment.run();