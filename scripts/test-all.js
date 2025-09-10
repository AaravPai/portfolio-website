#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🧪 Running Comprehensive Test Suite\n');

const testResults = {
  unit: { passed: false, error: null },
  integration: { passed: false, error: null },
  accessibility: { passed: false, error: null },
  performance: { passed: false, error: null },
  e2e: { passed: false, error: null },
  visual: { passed: false, error: null }
};

function runCommand(command, description) {
  console.log(`\n📋 ${description}`);
  console.log(`Running: ${command}\n`);
  
  try {
    execSync(command, { stdio: 'inherit', cwd: process.cwd() });
    return true;
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    return false;
  }
}

function generateReport() {
  console.log('\n📊 Test Results Summary');
  console.log('========================\n');
  
  const results = Object.entries(testResults);
  const passed = results.filter(([_, result]) => result.passed).length;
  const total = results.length;
  
  results.forEach(([testType, result]) => {
    const status = result.passed ? '✅' : '❌';
    const name = testType.charAt(0).toUpperCase() + testType.slice(1);
    console.log(`${status} ${name} Tests`);
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
  });
  
  console.log(`\n📈 Overall: ${passed}/${total} test suites passed`);
  
  if (passed === total) {
    console.log('\n🎉 All tests passed! Ready for deployment.');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some tests failed. Please review and fix issues.');
    process.exit(1);
  }
}

async function runAllTests() {
  // 1. Unit Tests with Coverage
  console.log('1️⃣  Unit Tests');
  testResults.unit.passed = runCommand('npm run test:coverage', 'Unit Tests with Coverage');
  if (!testResults.unit.passed) {
    testResults.unit.error = 'Unit tests failed or coverage below threshold';
  }
  
  // 2. Integration Tests
  console.log('\n2️⃣  Integration Tests');
  testResults.integration.passed = runCommand('npm run test:integration', 'Integration Tests');
  if (!testResults.integration.passed) {
    testResults.integration.error = 'Integration tests failed';
  }
  
  // 3. Build Application (required for E2E tests)
  console.log('\n🏗️  Building Application');
  const buildSuccess = runCommand('npm run build', 'Building Application');
  if (!buildSuccess) {
    console.error('❌ Build failed - skipping E2E tests');
    testResults.e2e.error = 'Build failed';
    testResults.visual.error = 'Build failed';
    testResults.accessibility.error = 'Build failed';
    testResults.performance.error = 'Build failed';
    generateReport();
    return;
  }
  
  // Start preview server for E2E tests
  console.log('\n🚀 Starting Preview Server');
  execSync('npm run preview &', { stdio: 'pipe' });
  
  // Wait for server to start
  console.log('⏳ Waiting for server to start...');
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  try {
    // 4. Accessibility Tests
    console.log('\n3️⃣  Accessibility Tests');
    testResults.accessibility.passed = runCommand('npm run test:accessibility', 'Accessibility Tests');
    if (!testResults.accessibility.passed) {
      testResults.accessibility.error = 'Accessibility tests failed';
    }
    
    // 5. Performance Tests
    console.log('\n4️⃣  Performance Tests');
    testResults.performance.passed = runCommand('npm run test:performance', 'Performance Tests');
    if (!testResults.performance.passed) {
      testResults.performance.error = 'Performance tests failed';
    }
    
    // 6. E2E Tests
    console.log('\n5️⃣  End-to-End Tests');
    testResults.e2e.passed = runCommand('npm run test:e2e', 'End-to-End Tests');
    if (!testResults.e2e.passed) {
      testResults.e2e.error = 'E2E tests failed';
    }
    
    // 7. Visual Regression Tests
    console.log('\n6️⃣  Visual Regression Tests');
    testResults.visual.passed = runCommand('npm run test:visual', 'Visual Regression Tests');
    if (!testResults.visual.passed) {
      testResults.visual.error = 'Visual regression tests failed';
    }
    
  } finally {
    // Clean up server process
    console.log('\n🧹 Cleaning up...');
    try {
      execSync('pkill -f "vite preview"', { stdio: 'ignore' });
    } catch (e) {
      // Ignore cleanup errors
    }
  }
  
  generateReport();
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n\n⚠️  Test suite interrupted');
  try {
    execSync('pkill -f "vite preview"', { stdio: 'ignore' });
  } catch (e) {
    // Ignore cleanup errors
  }
  process.exit(1);
});

runAllTests().catch(error => {
  console.error('❌ Test suite failed:', error);
  process.exit(1);
});