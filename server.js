const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(__dirname));

app.listen(3000, () => {
    console.log('Szerver fut: http://localhost:3000');
});