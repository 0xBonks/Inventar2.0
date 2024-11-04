const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const http = require('http');
const routes = require('./routes');
const { errorHandler } = require('./middleware/errorHandler');
const { initializeSocket } = require('./socket');

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
initializeSocket(server);

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api', routes);

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; 