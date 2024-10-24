import express from 'express';
import leadRoutes from './routes/leadRoutes';
import campaignRoutes from './routes/campaignRoutes';
import metricRoutes from './routes/metrics';
import reportRoutes from './routes/report';
import dotenv from 'dotenv';


const app = express();
dotenv.config();
const port = 3000;
//For Checking the server is running or not
app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use("/leads",leadRoutes);

app.use("/campaigns",campaignRoutes)

app.use("/metrics",metricRoutes);

app.use("/report",reportRoutes);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});