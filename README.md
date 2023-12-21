# Cloud-Computing

API for Catora application

The documentation can be seen here: https://documenter.getpostman.com/view/30042250/2s9YkoegsV

The API is built with expressjs for the main back-end service, flask for the main service of machine learning, and MySQL for the database. We deploy the API in a virtual machine because it is simple and clean, we use reverse proxy too.

This is our GitHub for development: https://github.com/Mikophi/Catora


#Setup Project
To run this project, install it locally using npm on your pc

```
# clone repository
$ git clone https://github.com/CH2-PS226/Cloud-Computing.git

# change directory to Cloud-Computing
$ cd .\Cloud-Computing\

```

#Import The Database


#Configure Your .env

```
DNS=http://localhost:3000
SECRET_KEY=kaela
SERVER_KEY=<Your_Midtrans_KEY>
CLIENT_KEY=<Your_midtrnas_Key>

HOST=localhost
USER=root
PASSWORD=
DATABASE=catora

```


#Insatall Modules NodeJs

```
$ npm install

```

#Install Modules Python Flask

```

$ pip install -r requirements.txt
$ pip install Pillow

```

#Running NodeJs

```

$ nodemon

```

#Running Flask

```
$ cd .\Back-End\Upload\
$ python .\h5.py

```

