require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const tasksRoute = require('./routes/tasks');
const VERCEL_FRONTEND_URL = 'https://my-task-app.vercel.app'; // replace with real domain


const corsOptions = {
    // This allows requests ONLY from your Vercel frontend domain.
    origin: VERCEL_FRONTEND_URL, 
    // This allows the necessary methods (POST, PUT, DELETE) for your API.
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
};

const app = express();

// 2. Use the configured CORS options instead of simple cors()
app.use(cors(corsOptions)); 

app.use(express.json());

app.use('/api/tasks', tasksRoute);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;
connectDB(process.env.MONGO_URI)
  .then(() => app.listen(PORT, () => console.log(`Server listening on ${PORT}`)))
  .catch(err => console.error(err));