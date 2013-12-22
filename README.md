http://www.drpsh.com/

1. Create Security Group drpsh_db
1. Open port 22
1. Create Security Group drpsh_app
1. Add drpsh_app security group to drpsh_db security group for port 27017
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


Add these paths to sudo to allow npm to install modules globally

    sudo ln -s /usr/local/bin/node /usr/bin/node
    sudo ln -s /usr/local/lib/node /usr/lib/node
    sudo ln -s /usr/local/bin/npm /usr/bin/npm

install the grunt cli
   
    npm install grunt-cli -g

Install Compass so that we can compile the css

    sudo yum install rubygems
    sudo gem install compass

Install bower so we can download client side dependencies

    npm install -g bower

    sudo vim post-receive

#!/bin/sh
echo "--Deploying Application to /home/ec2-user/app--"
GIT_WORK_TREE=/home/ec2-user/app
export GIT_WORK_TREE
git checkout -f
cd /home/ec2-user/app
npm install
bower install
forever stop index.js
forever start -l forever.log -o out.log -e err.log NODE_ENV=production grunt prod --verbose &
killall node
NODE_ENV=production grunt prod -verbose &



Testing hook
# Print the log with full hashes and commit subject, so that you can
# figure out which hashes to use for the FROM and TO range.
/path/to/repo$ git log --pretty=%H\ %s

# assuming the FROM commit identifies as 999988887777
# and te TO commit identifies as 000011112222
# (Note: use the full length hashes; I've shortened them for the example)
/path/to/repo$ .git/hooks/post-receive <<MARK
999988887777 000011112222 refs/heads/master
MARK


##Port forwarding
cat /proc/sys/net/ipv4/ip_forward
0 = no port forwarding

sudo vim /etc/sysctl.conf

set
cat /proc/sys/net/ipv4/ip_forward = 1

reload the config

sudo sysctl -p /etc/sysctl.conf

reload the application whilst removing the 3001 port number. It should still load.

sudo iptables -A PREROUTING -t nat -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 3001

