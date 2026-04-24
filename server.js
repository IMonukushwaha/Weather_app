const express = require('express');
const path    = require('path');
const db      = require('./db');        // ← moved to top

const app  = express();
const PORT = 1000;

app.use(express.json());                
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('index.ejs', { appName: 'Smart Weather' });
});

app.get('/history', (req, res) => {
  const rows = db.prepare('SELECT * FROM history ORDER BY searched_at DESC LIMIT 50').all();
  res.json(rows);
});

app.post('/history', (req, res) => {
  const { city, country, temp, description } = req.body;
  db.prepare('INSERT INTO history (city, country, temp, description) VALUES (?, ?, ?, ?)')
    .run(city, country, temp, description);
  res.json({ ok: true });
});

app.delete('/history', (req, res) => {
  db.prepare('DELETE FROM history').run();
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});