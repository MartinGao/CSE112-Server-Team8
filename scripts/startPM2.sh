curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh | bash
source ~/.nvm/nvm.sh
nvm install 5
nvm use 5
cd /home/ubuntu/cse112-server
npm i
npm i nodemon -g
npm i pm2 -g
npm i babel-register -g
npm test
npm i apidoc -g
apidoc -i /home/ubuntu/cse112-server/route -o /home/ubuntu/cse112-server/doc/
pm2 start /home/ubuntu/cse112-server/fakeIndex.js -f
