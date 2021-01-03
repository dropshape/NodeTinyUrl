## node-tiny-url

Please Share on Twitter if you like __NodeTinyUrl__

<a href="https://twitter.com/intent/tweet?hashtags=NodeTinyUrl&amp;&amp;text=Check%20out%20this%20repo%20on%20github&amp;tw_p=tweetbutton&amp;url=https%3A%2F%2Fgithub.com%2Fdropshape&amp;via=dropshape" style="float:right">
<img src="https://raw.github.com/dropshape/NodeTinyUrl/master/twittershare.png">
</a>

see the live demo at [drpsh.com](http://drpsh.com/QD6U8uM3_) 

### Description
**node-tiny-url** is a NodeJS implementation of a URL shortening service similar to  [bit.ly](http://drpsh.com/QcDH5KdKR) or [tinyurl](http://drpsh.com/QE9-m02K_). node-tiny-url uses a [MEAN](http://drpsh.com/4DEzChU3-) stack to achieve this. 

 [MongoDB](http://drpsh.com/sD5Zt023R)
 [ExpressJS](http://drpsh.com/QEGDIK63_)
 [AngularJS](http://drpsh.com/QD4AZ360e)
 [NodeJS](http://drpsh.com/aDoEe3dKR)

And a few other cool tools as well like: 
[RequireJs](http://drpsh.com/acKuGEdKi), [Amazon Web Services](http://drpsh.com/aEYpUGd0Z) and [D3JS](http://drpsh.com/4DXnbaWC-)

### Local Installation
```   
    //Clone the repo
    git clone https://github.com/dropshape/NodeTinyUrl
    cd NodeTinyUrl
    //Install the dependencies.
    npm install
    //Install the bower dependencies
    bower install
    //start mongodb (you should already have mongo installed)
    mongod
    //run the application 
    grunt
``` 
visit localhost:3001 in your browser to see your very own version of node-tiny-url.

### Installing on AWS:
#### Architecture Overview
We are going to separate our application out into 2 layers the DB Layer and the Application Layer. This means that we can scale either one up independently as needed if our applications requires it. Furthermore we will be using security groups to make sure that only our application server can talk to our DB instances. We will be using [Route 53](http://drpsh.com/sD7Exhi0_) as the DNS for the application so we will also need an Elastic IP so that we can restart our Application Server and not lose our Route 53 configuration. We wont be using a Load Balancer for this installation as we only have one Application Server and the extra cost is not justifiable until you have at least two Application servers therefore we will need to do some extra work to setup ip forwarding on startup.

#### Security Groups
We need two security groups for our application so that we can run the MongoDB and the Application servers on separate EC2 instances and still allow them to talk to each other.

1. Create a App Security Group and expose port 80(http) and port 22(ssh)
1. Create a DB Security Group and expose port 22(ssh)
1. Within your DB Security Group create a custom TCP rule and set it's source to your App Security Group and expose the MongoDB port (27017) this will allow only our application access to the MongoDB EC2 Instance.

### Install MongoDB
* Launch a new EC2 Instance and make sure you associate it with the DB Security Group created earlier.
* Download your Security Key and then SSH Into your EC2 Instance.
```js
ssh -i yourpem.pem ec2-user@some-amazon-ip
```
* Create some required mongodb folders
```js
sudo mkdir /home/mongo/data
sudo mkdir /home/mongo/log
sudo mkdir /home/mongo/journal
```
* Set the MongoDB Source repositories
```js
echo "[10gen]
name=10gen Repository
baseurl=http://downloads-distro.mongodb.org/repo/redhat/os/x86_64
gpgcheck=0" | sudo tee -a     /etc/yum.repos.d/10gen.repo
```
* Next actually install MongoDB
```js
sudo yum -y install mongo-10gen-server
```
* Install systat diagnostic tool
```js
sudo yum -y install sysstat
```
* Give MongoDB control over the previously created folders
```js
sudo chown mongod:mongod /home/mongo/data
sudo chown mongod:mongod /home/mongo/log
sudo chown mongod:mongod /home/mongo/journal
```
* Edit the MongDB configuration file to point to our new folder locations. Also if you are running on a Micro instance then turn journaling off as you wont have enough space and MongoDB will fail to startup.
```js
sudo vim /etc/mongod.conf
    ...
logpath=/home/mongo/log/mongod.log
logappend=true
fork=true
dbpath=/home/mongo/data
nojournal = true //If it fails to load mongodb
```
* Setup MongoDB to automatically start when the Instance is started/rebooted etc..
```js
sudo chkconfig mongod on
sudo /etc/init.d/mongod start
```
You should now have a working copy of MongoDB

### Installing the Application
* Launch another EC2 Instance and associate it with the Application Security group you created earlier.
* SSH into the new machine using your downloaded keys
```
ssh -i yourpem.pem ec2-user@your-amazon-ip
```
* Next you need to install several packages that are required to build NodeJS.
```
sudo yum install gcc-c++ make
sudo yum install openssl-devel
sudo yum install git
git clone git://github.com/joyent/node.git
cd node
```
* Decide which version of node you need to run in this case v0.10.23 check it out and make it.
```
git checkout v0.10.23
./configure
make
sudo make install
```
* Have a coffee whilst it builds
* Add these paths to sudo to allow npm to install modules globally

```
sudo ln -s /usr/local/bin/node /usr/bin/node    
sudo ln -s /usr/local/lib/node /usr/lib/node 
sudo ln -s /usr/local/bin/npm /usr/bin/npm
```

* Install the following dependencies globally 

Grunt for building

```
npm install grunt-cli -g
```
Ruby and Compass for building client side css files.

```
sudo yum install rubygems
sudo gem install compass
```
pm2 for process management and auto starting the node servers on reboot.

```
sudo npm install pm2 -g
```
Install bower so we can download client side dependencies

```
npm install -g bower
```
* Now we need to create a git repository that we can push our local repo to.
```
git init --bare repo
```

This will create a git repository and initialise it for us. Next move into the hooks directory and create a new file called post-receive.

```
cd repo/hooks
sudo vim post-receive
```

Next copy the contents from post-receive hook in the top level application directory into the new file you just created. This hook will automatically deploy our application under the users home directory to a folder called 'app'. It will then run npm install and bower install to make sure that the application dependencies are all up to date. Finally it will restart the application using the pm2 restart all hook.

```
#!/bin/sh
# Post receive hook for git
# vim repo/hooks/post-receive
echo "--Deploying Application to /home/ec2-user/app--"
GIT_WORK_TREE=/home/ec2-user/app
export GIT_WORK_TREE
git checkout -f
cd /home/ec2-user/app
npm install
bower install
NODE_ENV=production grunt prod &
pm2 restart all
```
* Next you must create the folder /ec2-user/app that this hook deploys to otherwise the hook will fail.

```
mkdir /home/ec2-user/app
```
* Setup auto reload and Port Forwarding.
Next we need to setup our auto reload and port forwarding. Our application runs on port 3001 but we want any traffic directed at port 80 (http) to be redirected to our application. We could use ELB for this but since we only need one instance of our application and are not concerned with scaling at the moment then we will go ahead and save ourselves some money by setting up port forwarding manually. We need to create a script that will automatically run on each restart of the application in order to do this copy the following into a file called startup into init.d or from the aws-startup file at the top level of the application 

```
sudo vim /etc/init.d/startup
```

```
#!/bin/bash
# chkconfig: 2345  98 20
# description: Startup script for the application
# Sets up ip forwarding so we do not need a load balancer
# Copy this file into:
# sudo vim /etc/init.d/startup
# Run the following commands
# sudo chmod +x /etc/init.d/startup
# sudo chkconfig startup on
#
# processname: startup

set -x
exec > /home/ec2-user/app/Error.log 2>&1

iptables -A PREROUTING -t nat -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 3001

cd /home/ec2-user/app/
PM2=/usr/local/bin/pm2

HOME=/home/ec2-user/ NODE_ENV=production $PM2 start index.js -i max -e Error.log -o Debug.log

```
* Run the following command to make the file runnable.

```
sudo chmod +x /etc/init.d/startup
```
* Run the following command to make sure that  on restart the startup command will also be run.

```
sudo chkconfig startup on
```
* Test port forwarding is enabled

```
cat /proc/sys/net/ipv4/ip_forward
```
If the preceding command returns 0 then you need to setup port forwarding.

```
sudo vim /etc/sysctl.conf
ip_forward = 1
```
* Reload the config file

```
sudo sysctl -p /etc/sysctl.conf
```
You can test that ip-forwarding has been setup correctly by running the following command

```
sudo iptables -t nat -L
```
#### Deploy

Finally push your local git repo.

* Create a new branch

```
git checkout -b production
```

* Update the config.js file database host to point to the db ec2 instance you created earlier.

```js
function setupProductionConfig() {
    if (conf.get('env') === 'production') {
        conf.load({
            database: {
                host: 'ec2-54-194-160-15.eu-west-1.compute.amazonaws.com'
            }
    }
}
```

* Commit the change

```
git add .
git commit -m "Production db endpoint update"
```

* Setup git to point to your ec2 instance. Remember to point to home/ec2-user/repo

```
git remote add production ec2-user@ec2instance-endpoint /home/ec2-user/repo
```
* Push your local branch to the remote repo

```
git push production production:master -f
```

You should see a successful push and pm2 kick off a restart of the application.

* Finally visit your EC2 instance in the browser!

### Contributing
1. Fork the git repository
1. Add some awesome code
1. Add some awesome tests
1. Run the tests and jshint using the grunt command
1. Create a Pull Request

Please Share on Twitter if you like __NodeTinyUrl__

<a href="https://twitter.com/intent/tweet?hashtags=NodeTinyUrl&amp;&amp;text=Check%20out%20this%20repo%20on%20github&amp;tw_p=tweetbutton&amp;url=https%3A%2F%2Fgithub.com%2Fdropshape&amp;via=dropshape" style="float:right">
<img src="https://raw.github.com/dropshape/NodeTinyUrl/master/twittershare.png">
</a>