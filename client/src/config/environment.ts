// Configuração de ambiente para aplicação estática
export const config = {
  // Se estiver em produção ou modo estático, usar versões estáticas das páginas
  isStatic: import.meta.env.MODE === 'production' || import.meta.env.VITE_STATIC_MODE === 'true',
  
  // URL base para APIs (não usado no modo estático)
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '',
  
  // Configuração JSONBin
  jsonbin: {
    enabled: true
  }
};

export default config;