import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || 'file:./dev.db',
  jwt: {
    secret: process.env.JWT_SECRET || 'ntms-super-secret-enterprise-jwt-key-2026',
    expiresIn: process.env.JWT_EXPIRES_IN || '8h',
  },
  azure: {
    tenantId: process.env.AZURE_TENANT_ID || '00000000-0000-0000-0000-000000000000',
    clientId: process.env.AZURE_CLIENT_ID || '00000000-0000-0000-0000-000000000000',
    clientSecret: process.env.AZURE_CLIENT_SECRET || '',
    storageConnectionString: process.env.AZURE_STORAGE_CONNECTION_STRING || '',
    containerName: process.env.AZURE_STORAGE_CONTAINER_NAME || 'ntms-exam-assets',
    appInsightsConnectionString: process.env.APPLICATIONINSIGHTS_CONNECTION_STRING || '',
  },
};
