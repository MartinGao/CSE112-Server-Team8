curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh | bash
source ~/.nvm/nvm.sh
nvm install 5
nvm use 5
npm i nodemon -g
npm i pm2 -g
pm2 delete all
sudo rm -rf /home/ubuntu/cse112-server/
