## Shuttle JS

#### Introduction

Built with `Express`, `Node.JS`, using `Typescript`

#### Setup

Install latest `Node.js` from [here](https://nodejs.org/en/download/)

Install latest `MongoDB` from [here](https://www.mongodb.com/download-center/community)

Start the `MongoDB` using command

```bash
mongod
```

##### macOS

On macOS, you can install a mongdb GUI client using

```bash
brew cask install mongodb
```

##### Linux

On linux, you should run `MongoDB` as a service

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
User=your_user_name
ExecStart=/usr/bin/mongod
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

##### Windows

On windows

##### Add dotenv file

create a `.env` file in project directory, with content like this:

you can change it to whatever port you prefer

```javascript
PORT = 7777;
DOC_PORT = 3000;
SECRET = 'SOME_RANDOM_STRING';
JWT_EXPIRATION_MS = 259200000;
MONGODB_CONNECT_STRING = 'mongodb://127.0.0.1:27017/shuttlejs';
```

##### Install dependencies

Install the dependencies using:

```bash
yarn install
```

or

```bash
npm install
```

#### Run

Enter the project directory and

```shell
yarn dev
```

or

```bash
npm start
```

or

```bash
npm run dev
```

#### Compile Typescrit and run the JS

Enter the project directory and

```shell
yarn prod
```

or

```bash
npm run prod
```

#### Lint

You need eslint installed globally

```bash
yarn lint
```

or

```bash
npm run lint
```

#### Debug

if you are using `Visual Studio Code`

Go to `Settings-> Debug: Node: Auto Attach`, Set it to be `On`

And then

```bash
yarn debug
```

or

```bash
npm debug
```

#### Run tests

You need jest installed globally

```bash
yarn test
```

or

```bash
npm test
```
