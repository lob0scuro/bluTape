echo "Switching to master branch"
git checkout master

echo "Deploying files to server"
scp -r server/* cameron@45.56.74.113:/var/www/backend/

echo "Done!"