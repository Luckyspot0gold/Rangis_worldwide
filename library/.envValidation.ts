// lib/envValidation.ts
export function validateEnvironment() {
  const required = ['FMP_API_KEY'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.warn('Missing environment variables:', missing);
    return false;
  }
  return true;
}
