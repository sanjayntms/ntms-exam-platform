import app from './app.js';
import { config } from './config/index.js';

app.listen(config.port, () => {
  console.log(`🚀 NTMS Exam Platform Backend Server running on http://localhost:${config.port}`);
  console.log(`📚 Swagger OpenAPI Documentation available at http://localhost:${config.port}/api-docs`);
});
