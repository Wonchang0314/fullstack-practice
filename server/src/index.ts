import express from 'express';
import cors from 'cors';
import productsRouter from './routes/products';

const app = express();
const PORT = process.env['PORT'] ?? 4000;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/products', productsRouter);

app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
