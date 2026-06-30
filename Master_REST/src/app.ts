import express from 'express';

import globalError from './middleware/globalError';
import userRouter from './user/userRouter';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {

    res.send("This is coming from home route : ");
})

app.use('/api/users',userRouter);

// Global error handler 

app.use(globalError);

export default app;