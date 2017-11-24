import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import App from '../common/App';

const fileUpload = require('express-fileupload');
const app = express();

app.get('/api', (req, res) => {
  res.send({
    message: 'I am a server route and can also be hot reloaded!'
  })
});

app.post('/upload', function(req, res) {
  if (!req.files)
    return res.status(400).send('No files were uploaded.');

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  // let sampleFile = req.files.sampleFile;

  console.log(req.files);
  res.send({
    message: 'File uploaded!'
  });
  // Use the mv() method to place the file somewhere on your server
  // sampleFile.mv('/somewhere/on/your/server/filename.jpg', function(err) {
  //   if (err)
  //     return res.status(500).send(err);
  //
  //   res.send({
  //     message: 'File uploaded!'
  //   });
  // });
});

app.get('*', (req,res) => {
  let application = renderToString(<App />);
  let html = `<!doctype html>
    <html class="no-js" lang="">
        <head>
            <meta charset="utf-8">
            <meta http-equiv="x-ua-compatible" content="ie=edge">
            <title>SVG image preview generator</title>
            <meta name="description" content="">
            <meta name="viewport" 
            content="width=device-width,  initial-scale=1">
        </head>
        <body>
            <div id="root">${application}</div>
            <script src="http://localhost:3001/client.js"></script>
        </body>
    </html>`;
  res.send(html);
});
export default app;
