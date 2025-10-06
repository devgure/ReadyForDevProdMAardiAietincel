bash
#!/bin/bash

BACKUP_FILE=$1

if [ -z "$BACKUP_FILE" ]; then
  echo "Usage: ./restore.sh "
  exit 1
fi

echo "🔄 Restoring from $BACKUP_FILE..."

# Extract backup
TEMP_DIR="/tmp/etincel_restore_$"
mkdir -p "$TEMP_DIR"
tar -xzf "$BACKUP_FILE" -C "$TEMP_DIR"

# Restore MongoDB
echo "📥 Restoring MongoDB..."
docker exec -i etincel-mongodb mongorestore \
  --drop \
  --username=admin \
  --password=$MONGO_PASSWORD \
  --authenticationDatabase=admin \
  "$TEMP_DIR/mongodb"

# Restore MinIO
echo "📥 Restoring MinIO..."
docker exec etincel-minio mc mirror \
  "$TEMP_DIR/minio" \
  minio/etincel-media

# Cleanup
rm -rf "$TEMP_DIR"

echo "✅ Restore completed!"