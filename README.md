# Eiger
>_This is an academic project, so it's not designed to be used in production or other scenarios_

Eiger will make it easier to manage all your business's vehicles within a nice and sharp looking interface.

Integrations with other systems can be done without any headache, just because Eiger is natively built as a _RESTful_ service, so it can be accessed by other systems as easy as making simple HTTP requests.
It also provides an easy-to-use interface based on `Google's Material Design` to bring this well known look and feel to the business world.
All data protection and security is backed by an authentication and authorization system that lets only the right person to see what they should access.

#### With Eiger you can:
* Register all your company's vehicles and employees
* Book reservations for those vehicles
* Search for schedules
* Receive e-mail notification when your reservation got confirmed

<br>

## Running
Before trying to run this project, make sure you have the most recent version of [`Node.js`](https://nodejs.org/) and [`MySQL Server`](http://dev.mysql.com/downloads/) installed on your machine.

After download this project, you should see 4 `.cmd` files inside Eiger's root folder, they will help you to _install_, _setup_, _run_ and _build_ Eiger **without any typing at all**. Lets take a look on each of them:
* ***install.cmd -*** It will download and install all the needed dependencies packages for the REST service and the webserver.
* ***database.cmd -*** It will run all SQL scripts to setup the database.
* ***start.cmd -*** If you want to run directly on the code, this script will start Eiger's REST and webserver.
* ***build.cmd -*** It will bundle the application into a folder containing its executable file. _(Not implemented yet)_

<br>

## Dependencies
- [Electron](http://electron.atom.io/)
- [Express](http://expressjs.com/)
- [MySQL](https://github.com/mysqljs/mysql)
- [Nodemailer](https://nodemailer.com/)
- [Node-uuid](https://github.com/broofa/node-uuid)
- [Mkdirp](https://github.com/substack/node-mkdirp)
- [Morgan](https://github.com/expressjs/morgan)
- [Body-parser](https://github.com/expressjs/body-parser)

<br>

## License
Copyright (c) 2016 Guilherme Reginaldo Ruella (potentii@gmail.com)
