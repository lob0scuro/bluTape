echo "bundling app..."
npm run build

echo "deploying files to server"
scp -r dist/* lobo@192.168.1.77:/var/www/192.168.1.77/

echo "Done!"