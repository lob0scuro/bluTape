echo "switching to restart branch"
git checkout restart

echo "deploying files to server"
scp -r server/* cameron@45.56.74.113:/var/www/bluTape/app/

echo "Done!"