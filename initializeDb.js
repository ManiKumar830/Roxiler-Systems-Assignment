const sqlite3 = require('sqlite3').verbose();
const axios = require('axios');

const databaseName = 'database.db';

// Create the database or connect to an existing one
const db = new sqlite3.Database(databaseName);

// Create the transactions table if it doesn't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      dateOfSale TEXT,
      product TEXT,
      price REAL
    );
  `);
});

// Function to initialize the database with seed data from the API
async function initializeDatabase() {
  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const jsonData = response.data;

    db.serialize(() => {
      // Clear existing data from the table
      db.run('DELETE FROM transactions');

      // Insert new data from the fetched JSON
      const insertStmt = db.prepare('INSERT INTO transactions (dateOfSale, product, price) VALUES (?, ?, ?)');
      jsonData.forEach((item) => {
        insertStmt.run(item.dateOfSale, item.product, item.price);
      });
      insertStmt.finalize();

      console.log('Database initialized with seed data.');
    });
  } catch (error) {
    console.error('Error initializing database:', error.message);
  }
}

// Call the function to initialize the database
initializeDatabase();
