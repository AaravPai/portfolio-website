import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')
  
  // Set base path for GitHub Pages
  const base = env.VITE_BASE_PATH || (mode === 'production' ? '/portfolio-website/' : '/')
  
  return {
    base,
    plugins: [react()],
    
    // Define global constants
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
      __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
    },
    
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            // Vendor chunks
            'react-vendor': ['react', 'react-dom'],
            'form-vendor': ['formik', 'yup'],
            'email-vendor': ['@emailjs/browser', 'emailjs-com'],
            'icons-vendor': ['react-icons'],
            
            // Feature chunks based on lazy loading
            'projects': [
              './src/components/sections/Projects/index.ts',
              './src/components/sections/Projects/Projects.tsx',
              './src/components/sections/Projects/ProjectCard.tsx',
              './src/components/sections/Projects/ProjectModal.tsx'
            ],
            'contact': [
              './src/components/sections/Contact/index.ts',
              './src/components/sections/Contact/Contact.tsx',
              './src/components/sections/Contact/ContactForm.tsx',
              './src/components/sections/Contact/SocialLinks.tsx'
            ],
            'resume': [
              './src/components/sections/Resume/index.ts',
              './src/components/sections/Resume/Resume.tsx',
              './src/components/sections/Resume/ExperienceTimeline.tsx',
              './src/components/sections/Resume/ExperienceCard.tsx',
              './src/components/sections/Resume/Education.tsx',
              './src/components/sections/Resume/ResumeDownload.tsx'
            ],
            'skills': [
              './src/components/sections/Skills/index.ts',
              './src/components/sections/Skills/Skills.tsx'
            ]
          }
        }
      },
      // Enable source maps for production debugging
      sourcemap: command === 'serve' ? true : 'hidden',
      // Optimize chunk size
      chunkSizeWarningLimit: 1000,
      // Enable minification
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: command === 'build',
          drop_debugger: command === 'build',
          pure_funcs: command === 'build' ? ['console.log', 'console.info'] : []
        },
        mangle: {
          safari10: true
        }
      },
      // Generate bundle analysis
      reportCompressedSize: true,
      // Optimize asset handling
      assetsInlineLimit: 4096,
      // CSS code splitting
      cssCodeSplit: true
    },
    
    // Enable performance optimizations
    optimizeDeps: {
      include: [
        'react', 
        'react-dom', 
        'formik', 
        'yup', 
        '@emailjs/browser',
        'react-icons/fa',
        'react-icons/md',
        'react-icons/hi'
      ]
    },
    
    // Server configuration
    server: {
      port: 5173,
      host: true,
      open: true
    },
    
    // Preview configuration
    preview: {
      port: 4173,
      host: true
    },
    
    // CSS configuration
    css: {
      devSourcemap: true,
      preprocessorOptions: {
        css: {
          charset: false
        }
      }
    }
  }
})
