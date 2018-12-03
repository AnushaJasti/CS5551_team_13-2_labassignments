const express = require('express');
const http = require('http');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const contactRoutes = require('./routes/contact');
const socketIO = require('socket.io');
const cors = require("cors");

const port = process.env.PORT || 3000;

const app = express();

const contact = require('./models/contact');

mongoose.connect('mongodb://admin:A123456@ds131971.mlab.com:31971/lab')
.then(() => {
  console.log('Connected');
})

//Cors is used to allow other domains to access our application.
app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.use('/contact', contactRoutes);


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
