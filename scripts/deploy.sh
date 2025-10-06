
bash
#!/bin/bash
echo "🚀 Deploying Etincel to Production..."

# Pull latest code
git pull origin main

# Build Docker images
echo "📦 Building Docker images..."
docker-compose build

# Run database migrations
echo "🗄️  Running database migrations..."
docker-compose run --rm auth-service npx prisma migrate deploy

# Start services
echo "🔄 Starting services..."
docker-compose up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 30

# Run health checks
echo "🏥 Running health checks..."
curl -f http://localhost:3001/health || exit 1
curl -f http://localhost:3002/health || exit 1
curl -f http://localhost:3003/health || exit 1
curl -f http://localhost:3004/health || exit 1
curl -f http://localhost:3005/health || exit 1

echo "✅ Deployment complete!"
echo "🌐 Application running at: https://etincel.app"
echo "🛠️  Admin dashboard: https://admin.etincel.app"
