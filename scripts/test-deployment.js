#!/usr/bin/env node

/**
 * Deployment Test Script
 * Run this after deployment to verify everything is working
 * Usage: node scripts/test-deployment.js [deployment-url]
 */

const https = require('https');

const DEFAULT_URL = 'https://market-intelligence-platform.vercel.app';
const deploymentUrl = process.argv[2] || DEFAULT_URL;

console.log(`🚀 Testing deployment at: ${deploymentUrl}`);
console.log('=' .repeat(50));

const tests = [
  {
    name: 'Health Check',
    endpoint: '/api/health',
    validate: (data) => data.status === 'healthy'
  },
  {
    name: 'API Status',
    endpoint: '/api/config/status',
    validate: (data) => data.stats && typeof data.stats.configured === 'number'
  },
  {
    name: 'Query Expansion',
    endpoint: '/api/ai/query-expansion',
    method: 'POST',
    body: { query: 'OxiClean' },
    validate: (data) => data.originalQuery && data.category && data.competitors
  }
];

async function testEndpoint(test) {
  return new Promise((resolve) => {
    const url = new URL(deploymentUrl + test.endpoint);
    const options = {
      method: test.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const passed = test.validate ? test.validate(json) : res.statusCode === 200;
          resolve({
            test: test.name,
            endpoint: test.endpoint,
            status: res.statusCode,
            passed,
            data: json
          });
        } catch (error) {
          resolve({
            test: test.name,
            endpoint: test.endpoint,
            status: res.statusCode,
            passed: false,
            error: error.message
          });
        }
      });
    });

    req.on('error', (error) => {
      resolve({
        test: test.name,
        endpoint: test.endpoint,
        passed: false,
        error: error.message
      });
    });

    if (test.body) {
      req.write(JSON.stringify(test.body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('\n📋 Running deployment tests...\n');
  
  const results = [];
  for (const test of tests) {
    const result = await testEndpoint(test);
    results.push(result);
    
    const icon = result.passed ? '✅' : '❌';
    console.log(`${icon} ${result.test}`);
    console.log(`   Endpoint: ${result.endpoint}`);
    console.log(`   Status: ${result.status || 'N/A'}`);
    
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
    
    if (result.test === 'API Status' && result.passed) {
      const { configured, total, percentage } = result.data.stats;
      console.log(`   APIs: ${configured}/${total} configured (${percentage}%)`);
    }
    
    if (result.test === 'Query Expansion' && result.passed) {
      console.log(`   Category: ${result.data.category.name} (${Math.round(result.data.category.confidence * 100)}% confidence)`);
      console.log(`   Competitors: ${result.data.competitors.join(', ')}`);
    }
    
    console.log('');
  }
  
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  
  console.log('=' .repeat(50));
  console.log(`\n📊 Results: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('\n✅ All tests passed! Deployment is healthy.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the logs above.');
    console.log('\nCommon fixes:');
    console.log('- Ensure environment variables are set in Vercel');
    console.log('- Check API rate limits');
    console.log('- Verify build completed successfully');
  }
}

runTests().catch(console.error);
