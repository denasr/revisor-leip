// api/analizar.js
// Función serverless de Vercel — actúa como proxy seguro hacia la API de Anthropic.
// La API key NUNCA llega al navegador del estudiante; solo vive en las variables
// de entorno del servidor de Vercel.

export const config = {
  // Necesario para recibir PDFs en base64 (pueden ser grandes)
  api: {
    bodyParser: {
      sizeLimit: '25mb',
    },
  },
};

export default async function handler(req, res) {
  // Solo aceptamos POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key no configurada en el servidor.' });
  }

  try {
    // El cuerpo que llega del frontend ya tiene la forma exacta que Anthropic espera
    const payload = req.body;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error?.message ?? `Error de la API: ${response.status}`,
      });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('[api/analizar]', err);
    return res.status(500).json({ error: 'Error interno del servidor: ' + err.message });
  }
}
