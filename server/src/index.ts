import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import productsRouter from './routes/products';
import { generateOpenApiSpec } from './lib/openapi';

const app = express();
const PORT = process.env['PORT'] ?? 4000;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// productsRouter import 시점에 registry.registerPath()가 실행되므로
// generateOpenApiSpec() 호출은 반드시 라우터 등록(use) 이후에 위치해야 한다.
app.use('/api/products', productsRouter);

const spec = generateOpenApiSpec();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec));

app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
  console.log(`Swagger UI: http://localhost:${PORT}/api-docs`);
});
