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
// hey-api 등 코드 생성 도구가 raw JSON 스펙을 읽는 전용 엔드포인트.
// swagger-ui-express는 하위 경로를 모두 HTML로 가로채므로 별도 경로로 분리한다.
app.get('/api-spec.json', (_req, res) => res.json(spec));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec));

export default app;

// VITEST 환경(테스트)에서는 listen 생략 — supertest가 앱 객체를 직접 바인딩
if (!process.env['VITEST']) {
  app.listen(PORT, () => {
    console.log(`서버 실행 중: http://localhost:${PORT}`);
    console.log(`Swagger UI: http://localhost:${PORT}/api-docs`);
    console.log(`OpenAPI JSON: http://localhost:${PORT}/api-spec.json`);
  });
}
