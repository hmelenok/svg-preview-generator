import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import App from '../common/App';
import getPixels from 'get-pixels';
import {get} from 'lodash';
import {makeTwoDimentionalMap} from '../lib';

const fileUpload = require('express-fileupload');
const app = express();

app.use(fileUpload());


app.post('/api/map', function(req, res) {
  const file = get(req, 'files.image', false);
  const mimetype = get(file, 'mimetype', 'image/png');
  if (!file)
    return res.status(400).send('No files were uploaded.');

  getPixels(file.data, mimetype, function(err, pixels) {
    if(err) {
      return res.status(500).send(err.toString());
    }

    return res.send({
      message: 'File uploaded!',
      imageMap: makeTwoDimentionalMap(pixels),
      dimensions: {width: get(pixels, 'shape[0]', 0), height: get(pixels, 'shape[1]', 0)}
    });
  });
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
