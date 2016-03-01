# CSE112-Server-Team8
Node.js server for CSE112 Team 8


### How to run this server locally

#### if you do not have Node.js installed locally
` curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh | bash `

Then close current terminal and open a new terminal

` nvm install 5 `

` nvm use 5 `

#### if you have Node.js locally start from here

` git clone https://github.com/MartinGao/CSE112-Server-Team8.git `

` cd CSE112-Server-Team8`

` npm i`

` npm run start`

### MongoLab
> https://mlab.com/login/
> Username: `admin`
> Password: `Qgj4zFWLnig2YW`

### MongoDB GUI
> http://52.27.142.66:1234/local


### How to connect to the server
` ssh -i CSE112.pem ubuntu@52.27.142.66 `

if there is error, try to type `chmod 600 CSE112.pem` and try again

### How to pull the latest commit from github and run it on the server
` git pull`

` nvm use 5 `

` pm2 restart 0`



Access Key ID:
AKIAI4NUDRT7BVSIRHLA
Secret Access Key:
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
