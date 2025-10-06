
```bash
#!/bin/bash

echo "🔧 Setting up Etincel on Ubuntu Server..."

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
echo "🐳 Installing Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
echo "📦 Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Node.js
echo "📗 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Nginx
echo "🌐 Installing Nginx..."
sudo apt install -y nginx
sudo systemctl enable nginx

# Create SSL directory
sudo mkdir -p /etc/nginx/ssl

# Install certbot for SSL
sudo apt install -y certbot python3-certbot-nginx

# Clone repository
echo "📥 Cloning repository..."
git clone https://github.com/yourorg/etincel.git /opt/etincel
cd /opt/etincel

# Setup environment
echo "⚙️  Setting up environment..."
cp .env.example .env.production

echo "✅ Setup complete!"
echo "📝 Next steps:"
echo "1. Edit /opt/etincel/.env.production with your credentials"
echo "2. Run: cd /opt/etincel && bash scripts/deploy.sh"
echo "3. Setup SSL: sudo certbot --nginx -d etincel.app -d www.etincel.app"
