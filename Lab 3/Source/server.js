const express = require('express');
const http = require('http');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const toDoRoutes = require('./routes/todo.js');
const socketIO = require('socket.io');

const port = process.env.PORT || 3001;

const app = express();

const ToDo = require('./models/todo');

mongoose.connect('mongodb://admin:A123456@ds147723.mlab.com:47723/lab3')
.then(() => {
  console.log('Connected');
})

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.use('/todo', toDoRoutes);

const server = http.createServer(app);
const io = socketIO(server);
app.set('io', io);

//Static folder
app.use(express.static(path.join(__dirname, 'public')));

//Required for navigating angular routes without server routes
app.all('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

server.listen(port);
