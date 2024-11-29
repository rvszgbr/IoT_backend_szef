const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 8000;

// CORS engedélyezése
app.use(cors());

// Lokális változók
const secureNumbers = [1, 2, 3, 4]; // A helyes kód
let userNumbers = [0, 0, 0, 0]; // A felhasználó által módosítható tömb
let isChecked=false;


app.use("/", express.static("public"));

// 1. A teljes `userNumbers` tömb visszaadása
app.get('/numbers', (req, res) => {
  return res.json(userNumbers);
});

// 2. Az első elem módosítása
app.get('/numbers/first/:value', (req, res) => {
  const { value } = req.params;
  userNumbers[0] = parseInt(value); // Módosítjuk az első elemet
  return res.json(userNumbers);
});

// 3. A második elem módosítása
app.get('/numbers/second/:value', (req, res) => {
  const { value } = req.params;
  userNumbers[1] = parseInt(value); // Módosítjuk a második elemet
  return res.json(userNumbers);
});

// 4. A harmadik elem módosítása
app.get('/numbers/third/:value', (req, res) => {
  const { value } = req.params;
  userNumbers[2] = parseInt(value); // Módosítjuk a harmadik elemet
  return res.json(userNumbers);
});

// 5. A negyedik elem módosítása
app.get('/numbers/fourth/:value', (req, res) => {
  const { value } = req.params;
  userNumbers[3] = parseInt(value); // Módosítjuk a negyedik elemet
  return res.json(userNumbers);
});

// 6. Reset végpont: visszaállítja a userNumbers értékét [0,0,0,0]-ra
app.get('/numbers/reset', (req, res) => {
  userNumbers = [0, 0, 0, 0]; // Alapállapot visszaállítása
  isChecked=false;
  return res.json(userNumbers);
});

// 7. Check végpont: ellenőrzi, hogy a userNumbers megegyezik-e a secureNumbers tömbbel
app.get('/numbers/check', (req, res) => {
  isChecked=true;
  const isMatch = JSON.stringify(userNumbers) === JSON.stringify(secureNumbers); // Egyezés ellenőrzése
  return res.json(isMatch);
});

app.get('/is_checked', (req, res)=>{
  return res.json(isChecked);
});

// Szerver indítása
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
