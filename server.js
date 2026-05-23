const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use('/ke-hoach', express.static(path.join(__dirname, 'ke-hoach')));

app.get('/', (req, res) => {
  res.send('ASSP AI Starter Kit');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
