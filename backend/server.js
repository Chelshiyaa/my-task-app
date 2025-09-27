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
  'https://my-task-app.vercel.app'  // replace with your actual Vercel frontend URL
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
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
