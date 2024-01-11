import { config } from 'dotenv';
config();

export const firebaseConfig = {
  "apiKey": process.env.FIREBASE_API_KEY,
  "authDomain": "success-clone.firebaseapp.com",
  "databaseURL": process.env.FIREBASE_BD_URI,
  "projectId": "success-clone",
  "storageBucket": "success-clone.appspot.com",
  "messagingSenderId": "189431815177",
  "appId": "1:189431815177:web:15ed22c60195f1d3982cd8",
  "measurementId": "G-0SY60YP3G9"
};


//module.exports = firebaseConfig;