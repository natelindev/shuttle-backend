## Lonefire JS

#### Introduction

Built with `Express`, `Node.JS`

#### Setup

Install latest `Node.js` from [here](https://nodejs.org/en/download/)

Install latest `MongoDB` from [here](https://www.mongodb.com/download-center/community)

Start the `MongoDB` using command

```bash
mongod
```

Or alternatively, run `MongoDB` as a service

```bash
vi /etc/systemd/system/mongo.service
```

Then enter the following:

```plaintext
[Unit]
Description=Mongo DB
After=network.target

[Service]
Type=simple
User=root
ExecStart=/usr/bin/mongod
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

create a `.env` file in project directory, with content like this:

you can change it to whatever port you prefer

```javascript
PORT=8080;
DOC_PORT=3000;
MONGODB_CONNECT_STRING='mongodb://127.0.0.1/lonefireJs';
```

Install the dependencies using:

```bash
npm install
```

#### Run

Enter the project directory and

```shell
npm start
```

#### Lint

```bash
npm run lint
```

#### Debug

if you are using `Visual Studio Code`

Go to `Settings-> Debug: Node: Auto Attach`, Set it to be `On`

And then

```bash
npm run debug
```
