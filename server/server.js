const express = require('express');
const app = express();
const port = 3001;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });


const userRoutes = require('./routes/userRoutes');

app.use('/user', userRoutes);