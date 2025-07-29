echo "switching to master branch"
git checkout master

echo "creating tar archive without __pycache__ and env"
tar --exclude='env' --exclude='__pycache__' --exclude='*.pyc' --exclude='.git' -czf deploy.tar.gz -C server .

echo "deploying  flask files to server"
scp deploy.tar.gz cameron@45.56.74.113:/var/www/bluTape/app/

echo "Files sent. Unpack manually on the server"


echo "bundling react files..."
cd client && npm run build

echo "deploying react files to server"
scp -r dist/* cameron@45.56.74.113:/var/www/bluTape/bluTape.net/

echo "Done! Go to server and run 'unloadappzip' and 'restartapp'"