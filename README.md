# Revisor Académico LEIP
**Sistema automático de retroalimentación para proyectos de intervención pedagógica**
Universidad Pedagógica Nacional · Unidad 321 Zacatecas

---

## Descripción
Herramienta web que permite a los estudiantes del programa LEIP subir el PDF de su avance
y recibir retroalimentación automática basada en los 52 criterios de la Lista de Cotejo oficial.

## Estructura del proyecto
```
revisor-leip/
├── api/
│   └── analizar.js        ← Función serverless (proxy seguro a Anthropic)
├── src/
│   ├── App.jsx            ← Interfaz principal React
│   └── main.jsx           ← Punto de entrada
├── index.html
├── package.json
├── vite.config.js
└── vercel.json
```

## Despliegue en Vercel

### Requisitos previos
- Cuenta en [github.com](https://github.com)
- Cuenta en [vercel.com](https://vercel.com) (gratis, inicia sesión con GitHub)
- API Key de Anthropic en [console.anthropic.com](https://console.anthropic.com)

### Pasos

**1. Instalar dependencias y probar localmente**
```bash
npm install
npm run dev
# Abre http://localhost:5173
```

**2. Subir a GitHub**
```bash
git init
git add .
git commit -m "Revisor LEIP v1"
```
Crea un repositorio en github.com y luego:
```bash
git remote add origin https://github.com/TU_USUARIO/revisor-leip.git
git push -u origin main
```

**3. Conectar con Vercel**
1. Entra a vercel.com → Add New Project
2. Selecciona el repositorio `revisor-leip`
3. Vercel detecta Vite automáticamente → clic en **Deploy**

**4. Agregar la API Key (PASO CRÍTICO)**
En el dashboard de Vercel de tu proyecto:
- Settings → Environment Variables
- Agregar: `ANTHROPIC_API_KEY` = `sk-ant-...` (tu key de Anthropic)
- Clic en Save
- Ir a Deployments → "Redeploy" para que tome efecto

**5. Listo**
Tu app estará disponible en `https://revisor-leip.vercel.app`
Comparte esa URL con tus estudiantes.

---

## Costo estimado por uso
- Cada análisis completo consume ~2 llamadas a Claude Sonnet
- Costo aproximado: $0.03–0.08 USD por documento analizado
- Para 30 estudiantes = aprox. $2 USD por ciclo de revisión
