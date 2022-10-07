const http = require('http');
const app = require('./app');

const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT ||'3000');
app.set('port', port);

const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port);


/*const http = require('http');
const app = require ('./app') // importer le fichier app.js sur le fichier serveur.js

app.set('port',process.env.PORT || 3000 ) // Permet de dire à l'application express sur quel port du serveur elle va tourner et la déployer

const server = http.createServer(app); // appelle de la fonction app, pour appeler l'application dans la serveur

server.listen(process.env.PORT || 3000); // permet d'écouter (déployer) le serveur surle port 300

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});*/

/*
// Utilisation de mongoose (Mongo DB) sur le projet

const mongoose = require ('mongoose')
// Nous précisons sur quel DB nous allons travailler

mongoose.connect('mongodb://localhost/blog', function(err) {
  if (err) { throw err; }
});

// Permet de se déconnecter de MongoDB
mongoose.connection.close();

*/