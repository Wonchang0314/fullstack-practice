import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';

// Registry를 싱글톤으로 export해서 각 라우트 파일이 import 후
// registerPath()를 호출할 수 있게 한다.
// generateOpenApiSpec()은 모든 라우트가 import된 이후에 호출해야
// 등록된 경로들이 스펙에 포함된다 (index.ts에서 라우트 import 후 호출).
export const registry = new OpenAPIRegistry();

export function generateOpenApiSpec() {
  const generator = new OpenApiGeneratorV3(registry.definitions);
  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      title: '상품 관리 대시보드 API',
      version: '1.0.0',
    },
    servers: [{ url: '/api' }],
  });
}
