echo "switching to master branch"
git checkout master

echo "bundling app..."
npm run build

echo "deploying files to server"
scp -r dist/* cameron@45.56.74.113:/var/www/blutape.net/

echo "Done!"