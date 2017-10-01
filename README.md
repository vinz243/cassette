# cassette

## This project is discontinued. You may check it's successor at https://github.com/compactd/compactd


![](https://travis-ci.org/vinz243/cassette.svg?branch=master) [![Coverage Status](https://coveralls.io/repos/github/vinz243/cassette/badge.svg?branch=master)](https://coveralls.io/github/vinz243/cassette?branch=master)

Cassette is music manager supporting major torrents site to download, sync and stream tracks on-the-go :headphones:

[![alt](http://i.imgur.com/NkAHEK0l.png)](http://imgur.com/NkAHEK0)

### Features

 - [x] scan a music folder for tracks and artists
 - [ ] complete REST API (only endpoints used by frontend are implemented right now)
 - [x] search on Gazelle based trackers, like PTH.
 - [x] download torrents using rTorrent
 - [x] stream music in the browser

### How to use

Finally beta release is here!

#### Prequisites

You will need :

 - [creationix/nvm](creationix/nvm) for node version management. 
 - [yarn](https://yarnpkg.com/) for a faster installation
 - [nginx](https://nginx.org/en/) for proxying and setting a password. Apache is fine too, but you will need to adapt the instructions (you can ask if you want to  know how)
 
#### Installation

Installing :

``` 
nvm install v6
yarn global add pm2 node-cassette
cassette-www
```

Latest command should start cassette, you can close it now (`^C`) so we can configure it.

#### Configuring rTorrent

Open with your favorite text editor `~/.rtorrent.rc`. Inside, find the line that begins with `network.scgi.open_port`. 
If you can't find it, add this line somewhere: 
```
network.scgi.open_port = localhost:58081
```
If you found it, just write the down the port number somewhere.

#### Editing configuration

This steps is only if you have a PTH account and you want to download from cassette. If you don't, skip this step, you will still be able to remotely play music.
Use your favorite text editor to edit `~/.cassette/config.json` (create folder if it doesn't exists).

Make it look like that:

```json
{
  "pthUsername": "<your PTH username>",
  "pthPassword": "<your pth password>",
  "scgiPort": "58081"
}
```
Please note that `scgiPort` has to take your rtorrent scgi port value, as configured/found above.

#### Proxying via nginx:

The site configuration should look like that

```nginx
server {
       listen 0.0.0.0:26230 default_server;
       root /var/www/html;
       server_name _;
       location / {
             auth_basic "closed site";
             auth_basic_user_file conf/htpasswd;
             proxy_pass http://127.0.0.1:9000/;
             proxy_set_header Host $host;
             proxy_set_header X-Real-IP $remote_addr;
             proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
}
```

Then you can generate a `htpasswd` using:

```
sudo mkdir /etc/nginx/conf
htpasswd -c /etc/nginx/conf/htpasswd <desired username>
```

#### Running cassette in the background

Once everything is configured, just run:
```
pm2 start cassette-www
```

if you need to stop it:
```
pm2 stop cassette-www
```
 
### How to build and develop

```
$ git clone https://github.com/vinz243/cassette.git
$ npm install yarn -g
$ yarn
$ yarn start
```
Then head over to `localhost:3000/app/library`.
I prefer using yarn over npm, it's like 10x faster.


### Other

If you feel like you are super generous, you could offer me a beer using this address `1L6VwuRNwT9GgcpNcScesg6wcZbGQx5hf5`, but there is probably better ways to spend you money :P
