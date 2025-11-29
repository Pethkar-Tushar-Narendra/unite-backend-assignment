import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '30s', target: 20 }, // Ramp up to 20 users
    { duration: '1m', target: 50 }, // Stay at 50 users for 1 minute
    { duration: '30s', target: 100 }, // Peak at 100 users
    { duration: '1m', target: 100 }, // Stay at peak
    { duration: '30s', target: 0 }, // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
    http_req_failed: ['rate<0.01'], // Error rate must be below 1%
  },
};

const BASE_URL = 'http://localhost:3003/api';

// Replace with actual token after login
const TOKEN = 'YOUR_ACCESS_TOKEN_HERE';

export default function () {
  // Test GET /api/leads
  let leadsResponse = http.get(`${BASE_URL}/leads`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });

  check(leadsResponse, {
    'leads status is 200': (r) => r.status === 200,
    'leads response time OK': (r) => r.timings.duration < 500,
  });

  sleep(1);

  // Test GET /api/reports/daily-summary
  let reportResponse = http.get(`${BASE_URL}/reports/daily-summary`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });

  check(reportResponse, {
    'report status is 200': (r) => r.status === 200,
    'report response time OK': (r) => r.timings.duration < 1000,
  });

  sleep(1);
}
