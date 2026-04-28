const mysql = require('mysql2/promise');

async function checkSchema() {
  const connection = await mysql.createConnection({
    host: '10.3.100.30',
    user: 'laogw',
    password: 'Abc@217154',
    database: 'mas',
    port: 3306
  });

  try {
    const [rows] = await connection.query('SELECT * FROM users LIMIT 1');
    console.log('User columns:', Object.keys(rows[0] || {}));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
  }
}

checkSchema();
