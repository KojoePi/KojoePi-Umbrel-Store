const express = require('express')
const cors = require('cors')
const sqlite3 = require('sqlite3').verbose()

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

const db = new sqlite3.Database('./data/pantry.db')

// Tabelle erstellen

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      amount INTEGER,
      expiration TEXT,
      location TEXT,
      barcode TEXT
    )
  `)
})

// Alle Produkte
app.get('/products', (req, res) => {
  db.all('SELECT * FROM products ORDER BY expiration ASC', [], (err, rows) => {
    if (err) {
      return res.status(500).json(err)
    }

    res.json(rows)
  })
})

// Produkte die bald ablaufen
app.get('/expiring', (req, res) => {
  db.all(`
    SELECT * FROM products
    WHERE julianday(expiration) - julianday('now') <= 14
    ORDER BY expiration ASC
  `, [], (err, rows) => {
    if (err) {
      return res.status(500).json(err)
    }

    res.json(rows)
  })
})

// Neues Produkt
app.post('/products', (req, res) => {
  const { name, amount, expiration, location, barcode } = req.body

  db.run(
    `INSERT INTO products (name, amount, expiration, location, barcode)
     VALUES (?, ?, ?, ?, ?)`,
    [name, amount, expiration, location, barcode],
    function(err) {
      if (err) {
        return res.status(500).json(err)
      }

      res.json({ id: this.lastID })
    }
  )
})

// Produkt löschen
app.delete('/products/:id', (req, res) => {
  db.run('DELETE FROM products WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      return res.status(500).json(err)
    }

    res.json({ deleted: true })
  })
})

app.listen(PORT, () => {
  console.log(`Backend läuft auf Port ${PORT}`)
})