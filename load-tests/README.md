# Load Testing

## Prerequisites

Install k6: https://k6.io/docs/getting-started/installation/

## Running Tests

1. Start your server: `npm run dev`
2. Get an access token by logging in
3. Update `TOKEN` in `leads.js` with your access token
4. Run: `k6 run leads.js`

## Interpreting Results

- **http_req_duration**: Response times
- **http_req_failed**: Failed requests
- **iterations**: Total completed test iterations
- **vus**: Virtual users

Save output to file:
