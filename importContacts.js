const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Contact = require('./models/contactModel'); 
require('dotenv').config();
const initMongoConnection = require('./db/initMongoConnection'); 

async function importContacts() {
  await initMongoConnection(); 

  
  const filePath = path.join(__dirname, 'contacts.json'); 
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  
  const contacts = JSON.parse(fileContent); 

  try {
   
    await Contact.insertMany(contacts);
    console.log('Contacts successfully imported!');
    process.exit();
  } catch (error) {
    console.error('Error importing contacts:', error.message);
    process.exit(1);
  }
}

importContacts();
