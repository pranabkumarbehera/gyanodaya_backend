#!/bin/bash

# Exit on any error
set -e

echo "============================================="
echo " Gyanodaya Backend - AWS EC2 Deploy Script   "
echo "============================================="

# Define variables
DOMAIN="v1api.gyanodaya.net"
EMAIL="admin@gyanodaya.net"
PORT=5002

# 1. Update system packages
echo "--> Updating system packages..."
sudo apt-get update -y
sudo apt-get upgrade -y

# 2. Install essential tools
echo "--> Installing Git, Curl, Nginx, and Certbot..."
sudo apt-get install -y git curl nginx certbot python3-certbot-nginx

# 3. Install Node.js v20 LTS
echo "--> Installing Node.js v20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installations
node -v
npm -v

# 4. Install PM2 globally
echo "--> Installing PM2 Process Manager..."
sudo npm install -g pm2

# 5. Check for .env file
if [ ! -f .env ]; then
  echo "WARNING: .env file not found in the current directory!"
  echo "Please create a .env file with your production environment variables (like MONGO_URI, JWT_ACCESS_SECRET, etc.)."
  echo "You can copy the template from .env.example"
  echo "Example: cp .env.example .env && nano .env"
  exit 1
fi

# 6. Install dependencies
echo "--> Installing application dependencies..."
npm install --production

# 7. Configure Nginx Reverse Proxy
echo "--> Configuring Nginx..."
NGINX_CONF="/etc/nginx/sites-available/gyanodaya"

sudo bash -c "cat > $NGINX_CONF" <<EOF
server {
    listen 80;
    server_name $DOMAIN;

    client_max_body_size 10M;

    location / {
        proxy_pass http://localhost:$PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Enable the Nginx site
sudo ln -sf $NGINX_CONF /etc/nginx/sites-enabled/
# Remove default site if it exists
sudo rm -f /etc/nginx/sites-enabled/default

# Test and reload Nginx
echo "--> Testing Nginx config..."
sudo nginx -t
echo "--> Restarting Nginx..."
sudo systemctl restart nginx

# 8. Set up SSL with Let's Encrypt Certbot
echo "--> Provisioning free SSL Certificate for $DOMAIN..."
echo "NOTE: Make sure your DNS A-Record for $DOMAIN is already pointed to this server's public IP!"
sudo certbot --nginx -d $DOMAIN --non-interactive --agree-tos -m $EMAIL --redirect

# 9. Start Application with PM2
echo "--> Starting backend with PM2..."
pm2 start ecosystem.config.js --env production
pm2 save

# Setup PM2 startup script to automatically load processes on server reboot
echo "--> Configuring PM2 startup on system boot..."
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp $HOME

echo "============================================="
echo " Deployment Completed Successfully!          "
echo " Your API is now running at https://$DOMAIN  "
echo "============================================="
