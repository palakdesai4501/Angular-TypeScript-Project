import express from 'express';
import cors from 'cors';
import fundRoutes from './routes/fundRoutes';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', fundRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});