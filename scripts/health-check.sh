#!/bin/bash

echo "🏥 Running health checks..."

# Check all services
services=(
  "http://localhost:3001/health:auth-service"
  "http://localhost:3002/health:profile-service"
  "http://localhost:3003/health:match-service"
  "http://localhost:3004/health:chat-service"
  "http://localhost:3005/health:payment-service"
  "http://localhost:9000/health:location-service"
  "http://localhost:8000/health:ai-service"
  "http://localhost:3010/health:blockchain-service"
)

failed=0

for service in "${services[@]}"; do
  IFS=':' read -r url name <<< "$service"
  
  if curl -f -s "$url" > /dev/null; then
    echo "✅ $name is healthy"
  else
    echo "❌ $name is unhealthy"
    ((failed++))
  fi
done

# Check databases
if mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
  echo "✅ MongoDB is healthy"
else
  echo "❌ MongoDB is unhealthy"
  ((failed++))
fi

if redis-cli ping > /dev/null 2>&1; then
  echo "✅ Redis is healthy"
else
  echo "❌ Redis is unhealthy"
  ((failed++))
fi

if curl -f -s "http://localhost:9200/_cluster/health" > /dev/null; then
  echo "✅ Elasticsearch is healthy"
else
  echo "❌ Elasticsearch is unhealthy"
  ((failed++))
fi

if [ $failed -eq 0 ]; then
  echo "🎉 All services are healthy!"
  exit 0
else
  echo "⚠️  $failed service(s) are unhealthy"
  exit 1
fi