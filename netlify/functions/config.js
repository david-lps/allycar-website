exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      SHEETS_ID: process.env.SHEETS_ID,
      SHEETS_API_KEY: process.env.SHEETS_API_KEY,
      EMAILJS_KEY: process.env.EMAILJS_KEY,
      SERVICE_ID: process.env.SERVICE_ID,
      ADMIN_TEMPLATE_ID: process.env.ADMIN_TEMPLATE_ID,
      CLIENT_TEMPLATE_ID: process.env.CLIENT_TEMPLATE_ID,
      WEB_APP_URL: process.env.WEB_APP_URL,
      GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY
    })
  };
};
