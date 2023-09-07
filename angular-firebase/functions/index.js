/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
const axios = require('axios');
const cors = require('cors')({origin: true});
const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
require ('dotenv').config();

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// Changed

exports.getCountryStats = onRequest(async (req, res) => {
  const country = req.path.split('/')[1] || 'Sweden';
  let url = `https://api.tradingeconomics.com/historical/country/${country}/indicator/Balance%20of%20Trade?c=${process.env.TE_KEY}`

  try {
      const response = await axios.get(url);
      const data = response.data;
      //data = JSON.stringify(data);
      data.pop(); // Remove last row
      const x = data.map((row) => row.DateTime.substr(0,10));
      const y = data.map((row) => row.Value);
      const Country = data[0].Country;
      const Category = data[0].Category;
      const Frequency = data[0].Frequency;
      const HistoricalDataSymbol = data[0].HistoricalDataSymbol;


      res.set('Access-Control-Allow-Methods', 'GET');
      res.set('Access-Control-Allow-Headers', 'Content-Type');
      //res.set('Access-Control-Allow-Origin', 'http://localhost:4200');
      res.set('Access-Control-Allow-Origin', '*');

      res.json({ x: x, y: y, Country:Country, Category:Category, Frequency:Frequency, HistoricalDataSymbol:HistoricalDataSymbol });
    } catch (error) {
      res.status(500).send(error.message);
    }
});