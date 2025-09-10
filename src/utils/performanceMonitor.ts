/**
 * Performance monitoring utilities
 */

interface PerformanceMetrics {
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
  domContentLoaded?: number;
  loadComplete?: number;
}

interface ResourceTiming {
  name: string;
  duration: number;
  size: number;
  type: string;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {};
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.initializeObservers();
    this.measureBasicMetrics();
  }

  /**
   * Initialize performance observers
   */
  private initializeObservers(): void {
    // Observe paint metrics
    if ('PerformanceObserver' in window) {
      try {
        const paintObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
              this.metrics.fcp = entry.startTime;
            }
          }
        });
        paintObserver.observe({ entryTypes: ['paint'] });
        this.observers.push(paintObserver);
      } catch (error) {
        console.warn('Paint observer not supported:', error);
      }

      // Observe largest contentful paint
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.metrics.lcp = lastEntry.startTime;
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);
      } catch (error) {
        console.warn('LCP observer not supported:', error);
      }

      // Observe first input delay
      try {
        const fidObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.metrics.fid = entry.processingStart - entry.startTime;
          }
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.push(fidObserver);
      } catch (error) {
        console.warn('FID observer not supported:', error);
      }

      // Observe layout shifts
      try {
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
          this.metrics.cls = clsValue;
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(clsObserver);
      } catch (error) {
        console.warn('CLS observer not supported:', error);
      }
    }
  }

  /**
   * Measure basic performance metrics
   */
  private measureBasicMetrics(): void {
    if ('performance' in window && performance.timing) {
      const timing = performance.timing;
      
      // Time to First Byte
      this.metrics.ttfb = timing.responseStart - timing.navigationStart;
      
      // DOM Content Loaded
      this.metrics.domContentLoaded = timing.domContentLoadedEventEnd - timing.navigationStart;
      
      // Load Complete
      this.metrics.loadComplete = timing.loadEventEnd - timing.navigationStart;
    }
  }

  /**
   * Get current performance metrics
   */
  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * Get resource timing information
   */
  public getResourceTimings(): ResourceTiming[] {
    if (!('performance' in window) || !performance.getEntriesByType) {
      return [];
    }

    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    
    return resources.map(resource => ({
      name: resource.name,
      duration: resource.duration,
      size: resource.transferSize || 0,
      type: this.getResourceType(resource.name)
    }));
  }

  /**
   * Determine resource type from URL
   */
  private getResourceType(url: string): string {
    if (url.match(/\.(js|jsx|ts|tsx)$/)) return 'script';
    if (url.match(/\.(css)$/)) return 'stylesheet';
    if (url.match(/\.(png|jpg|jpeg|gif|webp|avif|svg)$/)) return 'image';
    if (url.match(/\.(woff|woff2|ttf|eot)$/)) return 'font';
    if (url.match(/\.(json)$/)) return 'data';
    return 'other';
  }

  /**
   * Measure component render time
   */
  public measureComponentRender(componentName: string, renderFn: () => void): number {
    const startTime = performance.now();
    renderFn();
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    console.log(`${componentName} render time: ${duration.toFixed(2)}ms`);
    return duration;
  }

  /**
   * Measure async operation time
   */
  public async measureAsyncOperation<T>(
    operationName: string,
    operation: () => Promise<T>
  ): Promise<{ result: T; duration: number }> {
    const startTime = performance.now();
    const result = await operation();
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    console.log(`${operationName} duration: ${duration.toFixed(2)}ms`);
    return { result, duration };
  }

  /**
   * Get Core Web Vitals score
   */
  public getCoreWebVitalsScore(): {
    fcp: 'good' | 'needs-improvement' | 'poor' | 'unknown';
    lcp: 'good' | 'needs-improvement' | 'poor' | 'unknown';
    fid: 'good' | 'needs-improvement' | 'poor' | 'unknown';
    cls: 'good' | 'needs-improvement' | 'poor' | 'unknown';
  } {
    return {
      fcp: this.scoreMetric(this.metrics.fcp, [1800, 3000]),
      lcp: this.scoreMetric(this.metrics.lcp, [2500, 4000]),
      fid: this.scoreMetric(this.metrics.fid, [100, 300]),
      cls: this.scoreMetric(this.metrics.cls, [0.1, 0.25])
    };
  }

  /**
   * Score individual metric
   */
  private scoreMetric(
    value: number | undefined,
    thresholds: [number, number]
  ): 'good' | 'needs-improvement' | 'poor' | 'unknown' {
    if (value === undefined) return 'unknown';
    if (value <= thresholds[0]) return 'good';
    if (value <= thresholds[1]) return 'needs-improvement';
    return 'poor';
  }

  /**
   * Log performance summary
   */
  public logPerformanceSummary(): void {
    const metrics = this.getMetrics();
    const scores = this.getCoreWebVitalsScore();
    const resources = this.getResourceTimings();
    
    console.group('Performance Summary');
    console.log('Core Web Vitals:', scores);
    console.log('Metrics:', metrics);
    console.log('Resource Count:', resources.length);
    console.log('Total Resource Size:', 
      resources.reduce((sum, r) => sum + r.size, 0) / 1024 + ' KB'
    );
    console.groupEnd();
  }

  /**
   * Send metrics to analytics (placeholder)
   */
  public sendMetricsToAnalytics(): void {
    const metrics = this.getMetrics();
    const scores = this.getCoreWebVitalsScore();
    
    // In a real application, you would send this to your analytics service
    console.log('Sending metrics to analytics:', { metrics, scores });
    
    // Example: Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', 'web_vitals', {
        event_category: 'Performance',
        fcp: metrics.fcp,
        lcp: metrics.lcp,
        fid: metrics.fid,
        cls: metrics.cls
      });
    }
  }

  /**
   * Clean up observers
   */
  public cleanup(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Create singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Auto-log performance summary after page load
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    setTimeout(() => {
      performanceMonitor.logPerformanceSummary();
      performanceMonitor.sendMetricsToAnalytics();
    }, 1000);
  });
}

export default PerformanceMonitor;