const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Contact = require('../models/contact');

//Create contacts
router.post('/', (req, res) => {
  //getting Socket io connections
  const io = req.app.get('io');
  const newContact = new Contact({
    name: req.body.aname,
    number: req.body.anumber
  });
  	//Informing to client
    newContact.save().then(()=> {
    io.emit('newContactAdded');
  });
});

//Get method
router.get('/', (req, res) => {
  //Get contacts
  Contact.find({}).then((contacts) => {
    res.send(contacts);
  });
});

//Update contacts
router.put('/update/:id', (req, res) => {
  //getting Socket io connections
  const io = req.app.get('io');
  console.log(req.body);
  Contact.findByIdAndUpdate(req.params.id,{ $set: { name: req.body.name,number: req.body.number } },(err, contact) => {
    if (err) {
       res.json({ msg: 'Failed while updating contact', status: 'error' });
   } else {
	//Informing to client
    io.emit('newContactAdded');
       res.json({ msg: 'Contact updated successfully' });
   }
});
});

//Delete method.
router.delete('/delete/:id', (req, res) => {
  //getting Socket io connections
  const io = req.app.get('io');
  console.log(req.params.id);
  //Removing Contact
  Contact.remove({ _id: req.params.id },(err, result) => {
    if (err) {
        res.json({ msg: 'Failed while deleting Contact', status: 'error',success:false });
    } else {
      io.emit('newContactAdded');
      res.json({ msg: 'Contact deleted successfully' });
    }
});
});
module.exports = router;
