1. Create Security Group drpsh_db
1. Open port 22
1. Create Security Group drpsh_app
1. Open ports 22 and 80
1. Install MongoDB.

Create the required MongoDB directories

    sudo mkdir /home/mongo/data
    sudo mkdir /home/mongo/log
    sudo mkdir /home/mongo/journal

Set the MongoDB Source repositories

    echo "[10gen]
    name=10gen Repository
    baseurl=http://downloads-distro.mongodb.org/repo/redhat/os/x86_64
    gpgcheck=0" | sudo tee -a     /etc/yum.repos.d/10gen.repo

Install MongoDB

    sudo yum -y install mongo-10gen-server
Install systat diagnostic tool

    sudo yum -y install sysstat

Give MongoDB control over the folders

    sudo chown mongod:mongod /home/mongo/data
    sudo chown mongod:mongod /home/mongo/log
    sudo chown mongod:mongod /home/mongo/journal


Edit the MongDB configuration file

    sudo vim /etc/mongod.conf
    ...
    logpath=/home/mongo/log/mongod.log
    logappend=true
    fork=true
    dbpath=/home/mongo/data
    nojournal = true //If it fails to load mongodb

Starting MongoDB at startup

    sudo chkconfig mongod on
    sudo /etc/init.d/mongod start

We now have a working version of MongoDB


Next launch another EC2 instance and name it drpsh_app. Give it the drpsh_app security group specified earlier.

ssh into your new instance and run the following commands to install dependent packages for building NodeJS.

    sudo yum install gcc-c++ make
    sudo yum install openssl-devel
    sudo yum install git
    git clone git://github.com/joyent/node.git
    cd node

Decide which version of node you need to run in this case v0.10.23 check it out and make it.

    git checkout v0.10.23
    ./configure
    make
    sudo make install

Time for a coffee while node installs.
