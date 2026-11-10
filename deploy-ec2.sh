
set -euo pipefail

echo "=========================================================="
echo "🚀 Starting CampusVibe Deployment on Ubuntu EC2..."
echo "=========================================================="

# 1. Update system packages
echo "📦 Updating apt packages..."
sudo apt update -y
sudo apt install -y nginx curl git ufw

# 2. Configure UFW Firewall
echo "🛡️ Configuring firewall rules..."
sudo ufw allow OpenSSH || true
sudo ufw allow 'Nginx Full' || true
echo "y" | sudo ufw enable || true

# 3. Create target web root
echo "📂 Setting up /var/www/campusvibe/dist..."
sudo mkdir -p /var/www/campusvibe/dist

# 4. Check if current folder contains dist/
if [ -d "./dist" ]; then
    echo " Copying local dist/ to /var/www/campusvibe/dist..."
    sudo cp -r ./dist/* /var/www/campusvibe/dist/
else
    echo " Local dist/ directory not found in current folder."
    echo "Please ensure you have built the app (npm run build) and copied the dist directory."
fi

# 5. Deploy Nginx Configuration
echo "⚙️ Configuring Nginx virtual host..."
if [ -f "./nginx.conf" ]; then
    sudo cp ./nginx.conf /etc/nginx/sites-available/campusvibe
    sudo ln -sf /etc/nginx/sites-available/campusvibe /etc/nginx/sites-enabled/campusvibe
    sudo rm -f /etc/nginx/sites-enabled/default
fi

# 6. Set correct permissions
sudo chown -R www-data:www-data /var/www/campusvibe
sudo chmod -R 755 /var/www/campusvibe

# 7. Test and reload Nginx
echo "🔍 Testing Nginx configuration..."
sudo nginx -t
echo "🔄 Reloading Nginx service..."
sudo systemctl enable nginx
sudo systemctl reload nginx

echo "=========================================================="
echo "🎉 CampusVibe deployed successfully!"
echo "Public IP: $(curl -s http://checkip.amazonaws.com || curl -s https://ifconfig.me || echo 'Check AWS Console')"
echo "=========================================================="

