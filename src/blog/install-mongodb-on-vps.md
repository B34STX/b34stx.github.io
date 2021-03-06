---
title: "Install MongoDB on VPS"
time: 10
date: 2021-02-12
description: "In this blog I will show you how to install MongoDB on VPS, I will use GCP's Server and install MongoDB on it, also will allow remote connections"
category: "Database"
author: "Tuhin Kanti Pal"
imgurl: "https://miro.medium.com/max/640/1*-ivYkzeuYJedPKdEdfnNlg.png"
---

**In** this Blog I'm gonna show you how can you install MongoDB on Your server. Some times free mongodb atlas becone slow that's why we are going to install mongodb on a vps. Firstly i created a vps and expose its `27017` and `22` port. Then I connected it with a ssh client.

### Install MongoDB

```shell
apt install wget -y
wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | apt-key add -
apt-get install gnupg -y
wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | apt-key add -
echo "deb http://repo.mongodb.org/apt/debian buster/mongodb-org/4.4 main" | tee /etc/apt/sources.list.d/mongodb-org-4.4.list
apt-get update
apt-get install -y mongodb-org
systemctl start mongod
systemctl daemon-reload
systemctl enable mongod
```

### Now let's create an admin and an user

```shell
mongo
use admin
```

#### 1. Create an admin

```shell
db.createUser({user: "admin", pwd: "adminpassword", roles: [{role: "root", db: "admin"}]})
```

#### 2. Create an normal user with read write permission

```shell
db.createUser({user: "user", pwd: "userpassword", roles: [{role: "readWriteAnyDatabase", db: "admin"}]})
```

Type `exit` and hit enter to exit from MongoShell

### BindIP For Remote Connection & Enable authentication

You have to edit a configuration file to bind the ip so that you can use it remotely.

```shell
nano /etc/mongod.conf
```

#### Edit the configuration file like this:

```shell
net:
  port: 27017
  bindIp: 0.0.0.0
security:
  authorization: enabled
```

### Restart the server:

```shell
systemctl restart mongod
```

### Connect:

Now everything is ready to go. Connect MongoDB with your application like this

```
mongodb://<username>:<userpassword>@<ip-address>:27017/
```

<iframe width="100%" src="https://www.youtube.com/embed/nZ3UVz89dXg" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
