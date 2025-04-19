const express = require('express');
const env = require('dotenv');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

// environment variables
env.config();

// middlewares
app.use(cors());
app.use(express.json());

// Root route to fix "Cannot GET /" error
app.get('/', (req, res) => {
    res.send('Welcome to MonitorPal!');
});

// routes
const userRoutes = require('./routes/user.routes');
const testRoutes = require('./routes/test.routes');

app.use('/public', express.static(path.join(__dirname, "uploads")));
app.use('/api', userRoutes);
app.use('/api', testRoutes);

// mongodb connection
const connectDB = (dburl) => {
    return mongoose.connect(dburl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log('Database Connected');
    }).catch((error) => {
        console.log('Error connecting to MongoDB:', error);
    });
}

const start = async () => {
    try {
        await connectDB(process.env.MONGODB_URI); // use the correct env variable here
        app.listen(process.env.PORT || 3000, () => { // fallback to 3000 if PORT is not defined
            console.log(`Server is running on port ${process.env.PORT || 3000}`);
        });
    } catch (error) {
        console.log('Error starting the server:', error);
    }
}

start();
