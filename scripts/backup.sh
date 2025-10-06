bash
#!/bin/bash

BACKUP_DIR="/backup/etincel"
DATE=$(date +%Y%m%d_%H%M%S)

echo "💾 Starting backup at $DATE..."

# Create backup directory
mkdir -p "$BACKUP_DIR/$DATE"

# Backup MongoDB
echo "📦 Backing up MongoDB..."
docker exec etincel-mongodb mongodump \
  --out="/backup/$DATE/mongodb" \
  --username=admin \
  --password=$MONGO_PASSWORD \
  --authenticationDatabase=admin

# Backup MinIO
echo "📦 Backing up MinIO..."
docker exec etincel-minio mc mirror \
  minio/etincel-media \
  "/backup/$DATE/minio"

# Backup Redis (if needed for sessions)
echo "📦 Backing up Redis..."
docker exec etincel-redis redis-cli \
  --rdb "/backup/$DATE/redis-dump.rdb"

# Compress backups
echo "🗜️  Compressing backups..."
tar -czf "$BACKUP_DIR/backup_$DATE.tar.gz" -C "$BACKUP_DIR" "$DATE"

# Remove uncompressed backup
rm -rf "$BACKUP_DIR/$DATE"

# Keep only last 7 days of backups
find "$BACKUP_DIR" -name "backup_*.tar.gz" -mtime +7 -delete

echo "✅ Backup completed: backup_$DATE.tar.gz"