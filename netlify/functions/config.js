exports.handler = async (event, context) => {
  // Verificar se é uma requisição GET
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Retornar todas as variáveis de ambiente necessárias
    const config = {
      SHEETS_ID: process.env.SHEETS_ID,
      SHEETS_API_KEY: process.env.SHEETS_API_KEY,
      EMAILJS_KEY: process.env.EMAILJS_KEY,
      SERVICE_ID: process.env.SERVICE_ID,
      ADMIN_TEMPLATE_ID: process.env.ADMIN_TEMPLATE_ID,
      CLIENT_TEMPLATE_ID: process.env.CLIENT_TEMPLATE_ID,
      WEB_APP_URL: process.env.WEB_APP_URL,
      GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY
    };

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify(config)
    };
  } catch (error) {
    console.error('Erro na function config:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: 'Erro interno do servidor',
        message: error.message 
      })
    };
  }
};
