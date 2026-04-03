# Deployment Configuration

## Environment Variables

### Backend (.env file - optional)
```
PORT=5000
NODE_ENV=development
```

### Frontend (.env file - optional)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Default Configuration

The bot comes pre-configured for Devnet testing:

```json
{
  "network": "devnet",
  "rpc": "https://api.devnet.solana.com",
  "tokenAddress": "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
  "minTrade": 0.01,
  "maxTrade": 0.05,
  "delayMin": 5000,
  "delayMax": 20000,
  "slippage": 10,
  "priorityFee": 0.0005,
  "minSolBalance": 0.1
}
```

## Production Deployment

### Prerequisites
- Node.js 16+
- PM2 (for production)
- Nginx (optional, for reverse proxy)

### Install PM2
```bash
npm install -g pm2
```

### Build Frontend
```bash
cd frontend
npm run build
```

### Start Backend with PM2
```bash
cd backend
pm2 start server.js --name solana-bot-api
pm2 save
pm2 startup
```

### Serve Frontend
Option 1 - Using serve:
```bash
npm install -g serve
cd frontend/build
serve -s -p 3000
```

Option 2 - Using PM2:
```bash
pm2 serve frontend/build 3000 --name solana-bot-frontend
```

### Monitor
```bash
pm2 status
pm2 logs solana-bot-api
pm2 monit
```

## Docker Deployment (Optional)

### Backend Dockerfile
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm install
COPY backend/ ./
EXPOSE 5000
CMD ["node", "server.js"]
```

### Frontend Dockerfile
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend
    restart: unless-stopped
```

## Security Considerations

### Production Checklist
- [ ] Use environment variables for sensitive data
- [ ] Enable HTTPS
- [ ] Set up CORS properly
- [ ] Use rate limiting
- [ ] Monitor server resources
- [ ] Set up error logging
- [ ] Use strong RPC endpoints
- [ ] Regular backups of configuration

### API Security
```javascript
// Add to server.js for production
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

## Monitoring & Logging

### Log Files
```bash
# Backend logs
tail -f backend/logs/app.log

# PM2 logs
pm2 logs solana-bot-api --lines 100
```

### Health Checks
```bash
# Check API health
curl http://localhost:5000/api/health

# Check bot status
curl http://localhost:5000/api/status
```

## Backup & Recovery

### Backup Configuration
```bash
# Backup wallet data (if storing locally)
cp backend/wallets.json backup/wallets-$(date +%Y%m%d).json

# Backup configuration
curl http://localhost:5000/api/config > backup/config-$(date +%Y%m%d).json
```

### Restore
```bash
# Restore configuration via API
curl -X POST http://localhost:5000/api/config \
  -H "Content-Type: application/json" \
  -d @backup/config-20240101.json
```

## Performance Optimization

### Backend
- Use clustering for multiple CPU cores
- Implement caching for RPC calls
- Use WebSocket for real-time updates
- Optimize database queries (if using)

### Frontend
- Enable production build
- Use lazy loading for components
- Implement service workers
- Enable gzip compression
- Use CDN for static assets

## Troubleshooting Production Issues

### High CPU Usage
- Check number of concurrent wallets
- Reduce polling frequency
- Optimize trade execution logic

### Memory Leaks
- Monitor with `pm2 monit`
- Restart periodically: `pm2 restart solana-bot-api --cron "0 */6 * * *"`

### Network Issues
- Use reliable RPC provider
- Implement retry logic
- Add circuit breakers
- Monitor RPC response times

## Scaling

### Horizontal Scaling
- Run multiple bot instances
- Use load balancer
- Separate wallet pools per instance

### Vertical Scaling
- Upgrade server resources
- Optimize Node.js heap size
- Use faster SSD storage

## Maintenance

### Regular Tasks
- Update dependencies: `npm update`
- Check for security issues: `npm audit`
- Review logs daily
- Monitor wallet balances
- Test configuration changes on Devnet first

### Automated Maintenance
```bash
# Cron job for daily restart (4 AM)
0 4 * * * pm2 restart solana-bot-api

# Cron job for log cleanup (weekly)
0 0 * * 0 pm2 flush
```
