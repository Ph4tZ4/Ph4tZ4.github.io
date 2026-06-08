import 'dotenv/config';

function required(name: string, value: string | undefined, fallback?: string): string {
  if (value && value.length > 0) return value;
  if (fallback !== undefined) return fallback;
  throw new Error(`Missing required environment variable: ${name}`);
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 4000),
  corsOrigin: required('CORS_ORIGIN', process.env.CORS_ORIGIN, 'http://localhost:5173'),
  mongoUri: required('MONGODB_URI', process.env.MONGODB_URI, 'mongodb://127.0.0.1:27017/portfolio'),

  jwtSecret: required('JWT_SECRET', process.env.JWT_SECRET, 'dev-jwt-secret-change-me-in-production'),
};

export const isProd = env.nodeEnv === 'production';
