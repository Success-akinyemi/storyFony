import { config } from 'dotenv';
config();
import express from 'express'
import router from './routes/auth.js'
import privateRouter from './routes/privateRoute.js'
import subscriptionRouter from './routes/subscriptionRoute.js';
import errorHandler from './middleware/error.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });

const corsOptions = {
    origin: `${process.env.CLIENT_URL}`,
    credentials: true,
};

app.use(cors(corsOptions));

/**HTTP get request */
app.get('/', (req, res) => {
    res.status(201).json('Home GET Request')
})

//Import DB
import './config/db.js'


app.use('/api', router)
app.use('/api', privateRouter)
app.use('/api/subscription', subscriptionRouter)



//Error Handler Last piece of middleware
app.use(errorHandler)

const PORT = process.env.PORT || 9001

const server =  app.listen(PORT, () => console.log (`server runing on port http://localhost:${PORT}`))

process.on('unhandledRejection', (err, promise) => {
    console.log(`LOGGED ERROR>>: ${err}`);
    server.close(() => process.exit(1));
})