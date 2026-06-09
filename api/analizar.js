// api/analizar.js
// Proxy seguro hacia Anthropic con reintentos automáticos en caso de rate limit (429)

export const config = {
  api: {
    bodyParser: { sizeLimit: '25mb' },
  },
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function callWithRetry(payload, apiKey, maxRetries = 4) {
  const delays = [10000, 20000, 35000, 60000]; // 10s, 20s, 35s, 60s

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    if (attempt > 0) {
      const waitMs = delays[attempt - 1];
      console.log(`[analizar] Intento ${attempt + 1} — esperando ${waitMs / 1000}s por rate limit...`);
      await sleep(waitMs);
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(payload),
    });

    if (response.status === 429) {
      const errData = await response.json().catch(() => ({}));
      console.warn(`[analizar] 429 en intento ${attempt + 1}: ${errData?.error?.message}`);
      if (attempt < maxRetries) continue;
      throw new Error('Límite de velocidad excedido. Espera un minuto e intenta de nuevo.');
    }

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData?.error?.message ?? `Error HTTP ${response.status}`);
    }

    return await response.json();
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key no configurada en el servidor.' });
  }

  try {
    const data = await callWithRetry(req.body, apiKey);
    return res.status(200).json(data);
  } catch (err) {
    console.error('[analizar]', err.message);
    return res.status(500).json({ error: err.message });
  }
}
