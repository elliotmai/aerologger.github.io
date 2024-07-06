const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production') {
  app.use(express.static('public'));

  app.get('/config.js', (req, res) => {
    res.type('application/javascript');
    res.send(`
      const firebaseConfig = {
        apiKey: '${process.env.API_KEY}',
        authDomain: '${process.env.AUTH_DOMAIN}',
        projectId: '${process.env.PROJECT_ID}',
        storageBucket: '${process.env.STORAGE_BUCKET}',
        messagingSenderId: '${process.env.MESSAGING_SENDER_ID}',
        appId: '${process.env.APP_ID}',
      };
      firebase.initializeApp(firebaseConfig);
    `);
  });

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
  });
}
