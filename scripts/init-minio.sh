bash
#!/bin/bash

echo "🪣 Initializing MinIO buckets..."

# Wait for MinIO to be ready
sleep 10

# Install mc (MinIO Client)
wget https://dl.min.io/client/mc/release/linux-amd64/mc
chmod +x mc
sudo mv mc /usr/local/bin/

# Configure mc
mc alias set minio http://localhost:9000 ${MINIO_ACCESS_KEY} ${MINIO_SECRET_KEY}

# Create buckets
mc mb minio/${MINIO_BUCKET}
mc mb minio/${MINIO_BUCKET}-thumbnails

# Set public policy for media
mc policy set download minio/${MINIO_BUCKET}

echo "✅ MinIO buckets created successfully!"