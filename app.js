const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const databaseName = 'database.db';

// Helper function to query the database
function queryDatabase(sql, params = []) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(databaseName);
    db.all(sql, params, (error, rows) => {
      db.close();
      if (error) {
        reject(error);
      } else {
        resolve(rows);
      }
    });
  });
}

// API 1
app.get('/transactions/:month', async (req, res) => {
  const { month } = req.params;
  if (!/^(0?[1-9]|1[0-2])$/.test(month)) {
    return res.status(400).json({ error: 'Invalid month. Expected value between 01 and 12.' });
  }

  try {
    const sql = 'SELECT * FROM transactions WHERE strftime("%m", dateOfSale) = ?';
    const transactions = await queryDatabase(sql, [month.padStart(2, '0')]);

    res.json({ transactions });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve transactions from the database.' });
  }
});

// API 2
app.get('/transactions/:month', async (req, res) => {
    const { month } = req.params;
    if (!/^(0?[1-9]|1[0-2])$/.test(month)) {
      return res.status(400).json({ error: 'Invalid month. Expected value between 01 and 12.' });
    }
  
    try {
      const sql = 'SELECT * FROM transactions WHERE strftime("%m", dateOfSale) = ?';
      const transactions = await queryDatabase(sql, [month.padStart(2, '0')]);
  
      // Calculate total sale amount of selected month
      const totalSaleAmount = transactions.reduce((total, transaction) => total + transaction.price, 0);
  
      // Calculate total number of sold items of selected month
      const totalSoldItems = transactions.length;
  
      // Calculate total number of not sold items of selected month
      const totalNotSoldItems = /* You need to calculate this based on your definition of "not sold items" */
  
      res.json({ transactions, totalSaleAmount, totalSoldItems, totalNotSoldItems });
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve transactions from the database.' });
    }
  });
  
// API 3
app.get('/transactions/:month', async (req, res) => {
    const { month } = req.params;
    if (!/^(0?[1-9]|1[0-2])$/.test(month)) {
      return res.status(400).json({ error: 'Invalid month. Expected value between 01 and 12.' });
    }
  
    try {
      const sql = 'SELECT * FROM transactions WHERE strftime("%m", dateOfSale) = ?';
      const transactions = await queryDatabase(sql, [month.padStart(2, '0')]);
  
      // Calculate total sale amount of selected month
      const totalSaleAmount = transactions.reduce((total, transaction) => total + transaction.price, 0);
  
      // Calculate total number of sold items of selected month
      const totalSoldItems = transactions.length;
  
      // Calculate total number of not sold items of selected month
      const priceRanges = [
        { min: 0, max: 100 },
        { min: 101, max: 200 },
        { min: 201, max: 300 },
        { min: 301, max: 400 },
        { min: 401, max: 500 },
        { min: 501, max: 600 },
        { min: 601, max: 700 },
        { min: 701, max: 800 },
        { min: 801, max: 900 },
        { min: 901, max: Infinity }, // "Above 900" range
      ];
  
      const priceRangeCounts = priceRanges.map((range) => ({
        range: `${range.min}-${range.max === Infinity ? 'above' : range.max}`,
        count: transactions.filter((transaction) => transaction.price >= range.min && transaction.price <= range.max).length,
      }));
  
      res.json({ transactions, totalSaleAmount, totalSoldItems, priceRangeCounts });
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve transactions from the database.' });
    }
  });
  

  // API 4
app.get('/transactions/:month', async (req, res) => {
    const { month } = req.params;
    if (!/^(0?[1-9]|1[0-2])$/.test(month)) {
      return res.status(400).json({ error: 'Invalid month. Expected value between 01 and 12.' });
    }
  
    try {
      const sql = 'SELECT * FROM transactions WHERE strftime("%m", dateOfSale) = ?';
      const transactions = await queryDatabase(sql, [month.padStart(2, '0')]);
  
      // Calculate total sale amount of selected month
      const totalSaleAmount = transactions.reduce((total, transaction) => total + transaction.price, 0);
  
      // Calculate total number of sold items of selected month
      const totalSoldItems = transactions.length;
  
      // Find unique categories and number of items from each category for the selected month
      const categoryCount = {};
      transactions.forEach((transaction) => {
        const category = transaction.product;
        if (categoryCount[category]) {
          categoryCount[category] += 1;
        } else {
          categoryCount[category] = 1;
        }
      });
  
      res.json({ transactions, totalSaleAmount, totalSoldItems, categoryCount });
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve transactions from the database.' });
    }
  });

// API 5
app.get('/transactions/:month', async (req, res) => {
    const { month } = req.params;
    if (!/^(0?[1-9]|1[0-2])$/.test(month)) {
      return res.status(400).json({ error: 'Invalid month. Expected value between 01 and 12.' });
    }
  
    try {
      const externalAPIUrl1 = 'http://localhost:3005/transactions/01'; 
      const externalAPIUrl2 = 'http://localhost:3005/transactions/05'; 
  
      const [data1, data2] = await Promise.all([
        fetchDataFromExternalAPI(externalAPIUrl1),
        fetchDataFromExternalAPI(externalAPIUrl2),
      ]);
  
  
      const combinedData = {
        data1: data1,
        data2: data2,
      };
  
      // You can also perform additional processing or calculations on the combinedData here
  
      res.json(combinedData);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve data from the APIs.' });
    }
  });

// Start the server
const port = 3005;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
