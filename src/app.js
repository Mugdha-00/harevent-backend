const express = require('express');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();
app.use(express.json({ limit: '100kb' }));

app.get('/api/health', (req, res) => res.json({ success: true, message: 'HarEvent API is running' }));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/vendors', require('./routes/vendorRoutes'));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
