require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const tasksRoute = require('./routes/tasks');

const app = express();

// ------------------------
// Dynamic CORS Setup Start
// ------------------------
const allowedOrigins = [
  'http://localhost:5173',
  /\.vercel\.app$/ // allow any Vercel subdomain
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.some(o => (o instanceof RegExp ? o.test(origin) : o === origin))) {
      return callback(null, true);
    }
    return callback(new Error(`CORS policy does not allow access from: ${origin}`), false);
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
}));

// ------------------------
// Dynamic CORS Setup End
// ------------------------

// Parse JSON requests
app.use(express.json());

// Routes
app.use('/api/tasks', tasksRoute);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Start server
const PORT = process.env.PORT || 5000;
connectDB(process.env.MONGO_URI)
  .then(() => app.listen(PORT, () => console.log(`Server listening on ${PORT}`)))
  .catch(err => console.error(err));
