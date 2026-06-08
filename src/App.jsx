import { useState, useRef } from "react";
import {
  UploadCloud, FileText, CheckCircle, AlertTriangle, XCircle,
  Search, Download, Copy, RefreshCw, Loader2, ChevronDown, ChevronUp,
  BookOpen, Award, Lightbulb, BarChart3
} from "lucide-react";

// ─────────────────────────────────────────────
// LISTA DE COTEJO COMPLETA — extraída del docx
// ─────────────────────────────────────────────
const CHECKLIST = [
  // CRITERIOS EDITORIALES
  { id: 1, seccion: "CRITERIOS EDITORIALES", criterio: "Fuente Arial número 11, o Times New Roman 12 en todo el documento" },
  { id: 2, seccion: "CRITERIOS EDITORIALES", criterio: "Interlineado de 1.5 en todo el documento incluidas tablas y referencias" },
  { id: 3, seccion: "CRITERIOS EDITORIALES", criterio: "Todo el texto justificado, incluyendo referencias" },
  { id: 4, seccion: "CRITERIOS EDITORIALES", criterio: "Márgenes de 2.54 cm en los cuatro lados de la página" },
  { id: 5, seccion: "CRITERIOS EDITORIALES", criterio: "Número de página sencillo sin adornos en la esquina superior derecha" },
  // PORTADA Y PORTADILLA
  { id: 6, seccion: "PORTADA Y PORTADILLA", criterio: "Logo UPN arriba a la derecha y logo SEDUZAC a la izquierda" },
  { id: 7, seccion: "PORTADA Y PORTADILLA", criterio: "Todos los datos de la portada y portadilla centrados" },
  { id: 8, seccion: "PORTADA Y PORTADILLA", criterio: "Texto en negritas del número 12 (Times New Roman) o 11 (Arial)" },
  { id: 9, seccion: "PORTADA Y PORTADILLA", criterio: "Fecha en minúsculas al final de ambas páginas" },
  { id: 10, seccion: "PORTADA Y PORTADILLA", criterio: "No usar líneas como márgenes ni adornos en la portada" },
  // INTRODUCCIÓN
  { id: 11, seccion: "INTRODUCCIÓN", criterio: "Presenta el tema central del proyecto y contextualiza la problemática a intervenir" },
  { id: 12, seccion: "INTRODUCCIÓN", criterio: "Define el concepto, fenómeno, tema o problemática principal de estudio, así como los propósitos" },
  // CAPÍTULO I — DIAGNÓSTICO
  { id: 13, seccion: "CAP. I — DIAGNÓSTICO", criterio: "Desarrolla el contexto externo: comunidad o municipio donde se ubica la institución (geográfico, económico, social, cultural y educativo) con citas APA" },
  { id: 14, seccion: "CAP. I — DIAGNÓSTICO", criterio: "Desarrolla el contexto interno (escuela): breve historia, fundación y descripción general con datos cuantitativos verificables (docentes, alumnos, grupos, infraestructura)" },
  { id: 15, seccion: "CAP. I — DIAGNÓSTICO", criterio: "Describe al grupo participante: grado, grupo, turno y composición por sexo o edad" },
  { id: 16, seccion: "CAP. I — DIAGNÓSTICO", criterio: "Enuncia con claridad la problemática detectada en el grupo" },
  { id: 17, seccion: "CAP. I — DIAGNÓSTICO", criterio: "Describe técnicas e instrumentos de recolección de información congruentes con el enfoque cualitativo (cuestionarios, entrevistas, encuestas, diarios de campo)" },
  { id: 18, seccion: "CAP. I — DIAGNÓSTICO", criterio: "Especifica los autores y las teorías que sustentarán el proyecto" },
  // CAPÍTULO II — PLANTEAMIENTO DEL PROBLEMA
  { id: 19, seccion: "CAP. II — PLANTEAMIENTO", criterio: "Problematiza el fenómeno desde al menos cuatro niveles: internacional, nacional, estatal e institucional, con datos y fuentes APA en cada nivel" },
  { id: 20, seccion: "CAP. II — PLANTEAMIENTO", criterio: "Formula explícitamente el problema de investigación mediante una pregunta clara con los seis elementos requeridos" },
  { id: 21, seccion: "CAP. II — PLANTEAMIENTO", criterio: "Enuncia un propósito general coherente con la pregunta de investigación y propósitos específicos alineados con él" },
  { id: 22, seccion: "CAP. II — PLANTEAMIENTO", criterio: "Incluye una justificación que argumenta la pertinencia educativa, relevancia pedagógica, viabilidad, beneficios e impacto del proyecto" },
  { id: 23, seccion: "CAP. II — PLANTEAMIENTO", criterio: "Realiza los supuestos hipotéticos por cada uno de los propósitos específicos" },
  // CAPÍTULO III — MARCO TEÓRICO
  { id: 24, seccion: "CAP. III — MARCO TEÓRICO", criterio: "Organiza la estructura del marco teórico en apartados y subapartados temáticos jerarquizados" },
  { id: 25, seccion: "CAP. III — MARCO TEÓRICO", criterio: "Desarrolla los títulos y subtítulos con párrafos de al menos 4 renglones" },
  { id: 26, seccion: "CAP. III — MARCO TEÓRICO", criterio: "Cita a los autores siguiendo el sistema de referencia APA séptima edición de manera consistente" },
  // CAPÍTULO IV — DESARROLLO DEL PROYECTO
  { id: 27, seccion: "CAP. IV — DESARROLLO", criterio: "Define qué se entiende por investigación-acción con apoyo de autores y citas APA séptima edición" },
  { id: 28, seccion: "CAP. IV — DESARROLLO", criterio: "Presenta una descripción sintética de la intervención y explica cómo puede solucionar o mitigar la problemática detectada" },
  // ESTRATEGIAS DE INTERVENCIÓN
  { id: 29, seccion: "ESTRATEGIAS DE INTERVENCIÓN", criterio: "Presenta al menos tres estrategias de intervención, cada una con un nombre que la identifica" },
  { id: 30, seccion: "ESTRATEGIAS DE INTERVENCIÓN", criterio: "Cada estrategia especifica: problemática concreta que aborda, tiempo destinado (frecuencia y duración), y lugar de desarrollo" },
  { id: 31, seccion: "ESTRATEGIAS DE INTERVENCIÓN", criterio: "Cada estrategia enuncia el aprendizaje esperado o PDA en los participantes" },
  { id: 32, seccion: "ESTRATEGIAS DE INTERVENCIÓN", criterio: "Cada estrategia presenta una justificación argumentada y detalla el desarrollo en secuencia lógica (inicio, desarrollo y cierre)" },
  { id: 33, seccion: "ESTRATEGIAS DE INTERVENCIÓN", criterio: "Cada estrategia enumera los recursos utilizados y define cómo será evaluada (con instrumento integrado)" },
  { id: 34, seccion: "ESTRATEGIAS DE INTERVENCIÓN", criterio: "Se presentan los resultados mediante gráficas y análisis cuantitativo y cualitativo por estrategia, más un análisis global" },
  // CONCLUSIONES
  { id: 35, seccion: "CONCLUSIONES", criterio: "Retoma la pregunta de investigación y presenta un resumen de los hallazgos principales" },
  { id: 36, seccion: "CONCLUSIONES", criterio: "Explica cómo los hallazgos responden a la pregunta y cumplen los objetivos; reflexiona sobre limitaciones del estudio" },
  { id: 37, seccion: "CONCLUSIONES", criterio: "Señala implicaciones de los hallazgos y ofrece recomendaciones para futuras investigaciones o aplicaciones prácticas" },
  { id: 38, seccion: "CONCLUSIONES", criterio: "Termina con una declaración que resume la importancia del trabajo y su contribución al conocimiento" },
  // REFERENCIAS Y ANEXOS
  { id: 39, seccion: "REFERENCIAS Y ANEXOS", criterio: "Listado completo de referencias en formato APA 7ª edición con sangría francesa, interlineado 1.5 y texto justificado" },
  { id: 40, seccion: "REFERENCIAS Y ANEXOS", criterio: "El número total de referencias es igual o mayor a 50 y las referencias están ordenadas alfabéticamente" },
  { id: 41, seccion: "REFERENCIAS Y ANEXOS", criterio: "Se incluye el apartado de Anexos (Título 1) con los anexos desglosados por número (Anexo 1, Anexo 2, etc.)" },
  // ACCESORIOS — PÁRRAFOS
  { id: 42, seccion: "ACCESORIOS — PÁRRAFOS", criterio: "Sangría en el primer renglón de cada párrafo de 1.27 cm (excepto en títulos nivel 4)" },
  { id: 43, seccion: "ACCESORIOS — PÁRRAFOS", criterio: "Párrafos no menores de tres renglones ni mayores de 15 renglones; punto al final de cada párrafo" },
  // ACCESORIOS — TABLAS Y FIGURAS
  { id: 44, seccion: "ACCESORIOS — TABLAS Y FIGURAS", criterio: "Número de tabla/figura en negrita (esquina superior izquierda, sin punto); título en cursiva (Letra Capital) en el renglón siguiente" },
  { id: 45, seccion: "ACCESORIOS — TABLAS Y FIGURAS", criterio: "Nota al pie debajo de la tabla/figura con información de la fuente; tabla/figura centrada en la página" },
  { id: 46, seccion: "ACCESORIOS — TABLAS Y FIGURAS", criterio: "Diseño de tablas preferentemente sin líneas verticales" },
  // ACCESORIOS — TÍTULOS
  { id: 47, seccion: "ACCESORIOS — TÍTULOS", criterio: "Títulos y subtítulos en negrita con numeración lógica progresiva; sin títulos huérfanos" },
  { id: 48, seccion: "ACCESORIOS — TÍTULOS", criterio: "Nivel 1: Centrado, Negrita, Letra Capital, sin numeración. Nivel 2: Izquierda, Negrita, Letra Capital, numeración 1.1." },
  { id: 49, seccion: "ACCESORIOS — TÍTULOS", criterio: "Nivel 3: Izquierda, Negrita Cursiva, Letra Capital, numeración 1.1.1. Nivel 4: Sangría, Negrita, Letra Capital, punto final. Nivel 5: Sangría, Negrita Cursiva, punto final." },
  // REFERENCIAS EN TEXTO — APA 7ª
  { id: 50, seccion: "CITAS APA 7ª — EN TEXTO", criterio: "Citas textuales <40 palabras: narrativas (Autor, año, 'cita', página) y parentéticas ('cita', Autor, año, página) correctamente aplicadas" },
  { id: 51, seccion: "CITAS APA 7ª — EN TEXTO", criterio: "Citas textuales >40 palabras: párrafo aparte con sangría, sin comillas, con referencia (Autor, año, página) correctamente aplicadas" },
  { id: 52, seccion: "CITAS APA 7ª — EN TEXTO", criterio: "Paráfrasis narrativas y parentéticas: el Autor y año se integran correctamente; en citas parentéticas solo el primer apellido del autor" },
];

const SECCIONES = [...new Set(CHECKLIST.map(c => c.seccion))];
const TOTAL = CHECKLIST.length;

// ─────────────────────────────────────────────
// PROMPTS — divididos en dos llamadas para evitar truncamiento
// ─────────────────────────────────────────────

// LLAMADA 1: Resumen + todos los criterios
const buildPrompt1 = () => `
Eres un evaluador académico experto en proyectos LEIP (investigación-acción cualitativa) de la UPN.
Analiza el documento contra estos ${TOTAL} criterios. Tono FORMATIVO y empático, nunca punitivo.

CRITERIOS (evalúa TODOS, no omitas ninguno):
${CHECKLIST.map(c => `[${c.id}][${c.seccion}] ${c.criterio}`).join('\n')}

REGLAS:
- Estado por criterio: "Cumplido", "Parcial", "No cumplido" o "No encontrado"
- Porcentaje = ((Cumplidos×1 + Parciales×0.5) / ${TOTAL}) × 100, redondeado a entero
- Valoración: ≥80%→"Excelente", 60-79%→"Suficiente", <60%→"Requiere mejora"
- observacion: máx. 15 palabras por criterio (MUY BREVE)

Devuelve SOLO JSON válido, sin markdown:
{
  "resumen": {
    "porcentaje": número,
    "cumplidos": número,
    "parciales": número,
    "noCumplidos": número,
    "noEncontrados": número,
    "valoracion": "Excelente|Suficiente|Requiere mejora",
    "comentarioGeneral": "2-3 oraciones sobre calidad global."
  },
  "criterios": [
    { "id": número, "seccion": "sección", "criterio": "texto breve del criterio", "estado": "estado", "observacion": "breve" }
  ]
}`;

// LLAMADA 2: Solo recomendaciones (basadas en los criterios no cumplidos)
const buildPrompt2 = (criteriosNoCumplidos) => `
Eres evaluador académico LEIP. Basándote en estos criterios no cumplidos o parciales del proyecto, 
genera entre 3 y 6 recomendaciones prioritarias, concretas y formativas.

CRITERIOS CON PROBLEMAS:
${criteriosNoCumplidos.map(c => `- [${c.seccion}] ${c.criterio}: ${c.estado}. ${c.observacion}`).join('\n')}

Devuelve SOLO JSON válido sin markdown:
[
  {
    "aspecto": "Nombre del aspecto (máx. 8 palabras)",
    "importancia": "Por qué es metodológicamente relevante (1 oración)",
    "accion": "Cómo mejorarlo concretamente (1-2 oraciones)"
  }
]`;

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      let encoded = reader.result.toString().replace(/^data:(.*,)?/, "");
      if (encoded.length % 4 > 0) encoded += "=".repeat(4 - (encoded.length % 4));
      resolve(encoded);
    };
    reader.onerror = reject;
  });

const STATUS_CFG = {
  Cumplido:      { color: "bg-emerald-100 text-emerald-800 border-emerald-300", icon: <CheckCircle className="w-4 h-4 text-emerald-600" />, bar: "bg-emerald-500" },
  Parcial:       { color: "bg-amber-100 text-amber-800 border-amber-300",   icon: <AlertTriangle className="w-4 h-4 text-amber-500" />, bar: "bg-amber-400" },
  "No cumplido": { color: "bg-red-100 text-red-800 border-red-300",         icon: <XCircle className="w-4 h-4 text-red-500" />, bar: "bg-red-500" },
  "No encontrado":{ color: "bg-slate-100 text-slate-600 border-slate-300",  icon: <Search className="w-4 h-4 text-slate-400" />, bar: "bg-slate-300" },
};

// ─────────────────────────────────────────────
// COMPONENTES AUXILIARES
// ─────────────────────────────────────────────
function Badge({ estado }) {
  const cfg = STATUS_CFG[estado] ?? STATUS_CFG["No encontrado"];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${cfg.color}`}>
      {cfg.icon}{estado}
    </span>
  );
}

function RadialGauge({ pct, valoracion }) {
  const r = 54; const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  const color = pct >= 80 ? "#10b981" : pct >= 60 ? "#f59e0b" : "#ef4444";
  return (
    <div className="flex flex-col items-center">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={r} fill="none" stroke="#e2e8f0" strokeWidth="12" />
        <circle cx="70" cy="70" r={r} fill="none" stroke={color} strokeWidth="12"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round" transform="rotate(-90 70 70)"
          style={{ transition: "stroke-dashoffset 1s ease" }} />
        <text x="70" y="66" textAnchor="middle" fontSize="28" fontWeight="800" fill={color}>{pct}%</text>
        <text x="70" y="86" textAnchor="middle" fontSize="11" fill="#64748b">cumplimiento</text>
      </svg>
      <span className={`mt-1 text-sm font-bold px-3 py-1 rounded-full border
        ${pct >= 80 ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
          pct >= 60 ? "bg-amber-50 text-amber-700 border-amber-200" :
          "bg-red-50 text-red-700 border-red-200"}`}>
        {valoracion}
      </span>
    </div>
  );
}

function MiniBar({ label, value, total, color }) {
  const pct = total > 0 ? (value / total) * 100 : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-slate-500">
        <span>{label}</span><span className="font-bold text-slate-700">{value}</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function SeccionAccordion({ seccion, criterios }) {
  const [open, setOpen] = useState(false);
  const cumplidos  = criterios.filter(c => c.estado === "Cumplido").length;
  const totSec = criterios.length;
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors text-left">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-700 text-sm">{seccion}</span>
          <span className="text-xs text-slate-400">{cumplidos}/{totSec} criterios cumplidos</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>
      {open && (
        <div className="divide-y divide-slate-100">
          {criterios.map((c) => (
            <div key={c.id} className="p-4 grid grid-cols-[1fr_auto] gap-4 items-start">
              <div>
                <p className="text-sm text-slate-700 mb-1">{c.criterio}</p>
                <p className="text-xs text-slate-500 italic">{c.observacion}</p>
              </div>
              <Badge estado={c.estado} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// APP PRINCIPAL
// ─────────────────────────────────────────────
export default function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("resumen");
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); };
  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (e.dataTransfer.files?.[0]) validateAndSetFile(e.dataTransfer.files[0]);
  };
  const handleFileSelect = (e) => {
    if (e.target.files?.[0]) validateAndSetFile(e.target.files[0]);
  };
  const validateAndSetFile = (f) => {
    setError(null);
    if (f.type !== "application/pdf") { setError("Solo se aceptan archivos PDF."); return; }
    if (f.size > 20 * 1024 * 1024) { setError("El archivo supera los 20 MB. Reduce el tamaño del PDF."); return; }
    setFile(f); setResults(null);
  };

  // Repara JSON truncado: cierra arrays/objetos abiertos y lo parsea
  const repairAndParse = (raw) => {
    let txt = raw.replace(/```json|```/g, "").trim();
    // Eliminar coma trailing antes de cierre
    txt = txt.replace(/,\s*([\]}])/g, "$1");
    // Contar llaves/corchetes para cerrar lo que falta
    let depth = 0; let inStr = false; let escape = false;
    for (let i = 0; i < txt.length; i++) {
      const ch = txt[i];
      if (escape) { escape = false; continue; }
      if (ch === "\\") { escape = true; continue; }
      if (ch === '"') { inStr = !inStr; continue; }
      if (!inStr) {
        if (ch === "{" || ch === "[") depth++;
        if (ch === "}" || ch === "]") depth--;
      }
    }
    // Cerrar string abierto si hay uno
    if (inStr) txt += '"';
    // Cerrar objetos/arrays abiertos
    const stack = [];
    inStr = false; escape = false;
    for (let i = 0; i < txt.length; i++) {
      const ch = txt[i];
      if (escape) { escape = false; continue; }
      if (ch === "\\") { escape = true; continue; }
      if (ch === '"') { inStr = !inStr; continue; }
      if (!inStr) {
        if (ch === "{") stack.push("}");
        else if (ch === "[") stack.push("]");
        else if ((ch === "}" || ch === "]") && stack.length) stack.pop();
      }
    }
    // Eliminar trailing comma antes de cerrar
    txt = txt.replace(/,\s*$/, "");
    txt += stack.reverse().join("");
    return JSON.parse(txt);
  };

  const callClaude = async (system, userContent, maxTokens = 16000) => {
    const response = await fetch("/api/analizar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: maxTokens,
        system,
        messages: [{ role: "user", content: userContent }]
      })
    });
    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`HTTP ${response.status}: ${errBody.slice(0, 200)}`);
    }
    const data = await response.json();
    return data.content?.find(b => b.type === "text")?.text ?? "";
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true); setError(null); setResults(null);
    try {
      setStatusMsg("Codificando documento PDF…");
      const base64Data = await fileToBase64(file);

      // ── LLAMADA 1: resumen + criterios ──
      setStatusMsg(`Paso 1/2 · Evaluando ${TOTAL} criterios (puede tardar ~90 s)…`);
      const raw1 = await callClaude(
        buildPrompt1(),
        [
          { type: "document", source: { type: "base64", media_type: "application/pdf", data: base64Data } },
          { type: "text", text: "Analiza este proyecto LEIP y devuelve el JSON solicitado con resumen y criterios." }
        ],
        16000
      );

      let parte1;
      try { parte1 = repairAndParse(raw1); }
      catch (e) { throw new Error("No se pudo interpretar la respuesta de criterios. Intenta con un PDF más pequeño."); }

      // Garantizar que criterios tenga todos los IDs (rellenar faltantes)
      const criteriosMap = {};
      (parte1.criterios || []).forEach(c => { criteriosMap[c.id] = c; });
      const criteriosCompletos = CHECKLIST.map(item => criteriosMap[item.id] ?? {
        id: item.id, seccion: item.seccion, criterio: item.criterio,
        estado: "No encontrado", observacion: "No fue evaluado por longitud del documento."
      });
      // Recalcular resumen con datos reales
      const cum  = criteriosCompletos.filter(c => c.estado === "Cumplido").length;
      const par  = criteriosCompletos.filter(c => c.estado === "Parcial").length;
      const noC  = criteriosCompletos.filter(c => c.estado === "No cumplido").length;
      const noE  = criteriosCompletos.filter(c => c.estado === "No encontrado").length;
      const pct  = Math.round(((cum + par * 0.5) / TOTAL) * 100);
      const val  = pct >= 80 ? "Excelente" : pct >= 60 ? "Suficiente" : "Requiere mejora";

      // ── LLAMADA 2: recomendaciones ──
      setStatusMsg("Paso 2/2 · Generando recomendaciones formativas…");
      const problemáticos = criteriosCompletos.filter(c => c.estado !== "Cumplido").slice(0, 20);
      const raw2 = await callClaude(
        "Eres evaluador académico LEIP. Responde SOLO con JSON válido sin markdown.",
        [{ type: "text", text: buildPrompt2(problemáticos) }],
        3000
      );

      let recomendaciones = [];
      try { recomendaciones = repairAndParse(raw2); }
      catch { recomendaciones = []; }
      if (!Array.isArray(recomendaciones)) recomendaciones = [];

      setResults({
        resumen: {
          ...parte1.resumen,
          cumplidos: cum, parciales: par, noCumplidos: noC, noEncontrados: noE,
          porcentaje: pct, valoracion: val
        },
        criterios: criteriosCompletos,
        recomendaciones
      });
      setActiveTab("resumen");
    } catch (err) {
      console.error(err);
      setError("Error al analizar: " + err.message);
    } finally {
      setLoading(false); setStatusMsg("");
    }
  };

  const copyResumen = () => {
    if (!results) return;
    const txt = `REVISIÓN LEIP — ${file?.name ?? ""}
══════════════════════════════════════
Valoración: ${results.resumen.valoracion} (${results.resumen.porcentaje}%)
Cumplidos: ${results.resumen.cumplidos} | Parciales: ${results.resumen.parciales} | No cumplidos: ${results.resumen.noCumplidos} | No encontrados: ${results.resumen.noEncontrados}

COMENTARIO GENERAL:
${results.resumen.comentarioGeneral}

RECOMENDACIONES PRIORITARIAS:
${results.recomendaciones.map((r, i) => `${i + 1}. ${r.aspecto}\n   ¿Por qué? ${r.importancia}\n   Acción: ${r.accion}`).join("\n\n")}`;
    navigator.clipboard.writeText(txt).then(() => alert("Resumen copiado al portapapeles ✓")).catch(() => {
      const ta = document.createElement("textarea"); ta.value = txt;
      document.body.appendChild(ta); ta.select(); document.execCommand("copy");
      document.body.removeChild(ta); alert("Resumen copiado ✓");
    });
  };

  // agrupar criterios por sección
  const criteriosPorSeccion = results
    ? SECCIONES.map(sec => ({ seccion: sec, criterios: results.criterios.filter(c => c.seccion === sec) })).filter(g => g.criterios.length > 0)
    : [];

  return (
    <div style={{ fontFamily: "'Georgia', 'Times New Roman', serif", background: "#f8f6f0", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Source+Serif+4:ital,wght@0,300;0,400;0,600;1,400&display=swap');
        * { box-sizing: border-box; }
        .serif-display { font-family: 'Playfair Display', Georgia, serif; }
        .serif-body { font-family: 'Source Serif 4', Georgia, serif; }
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .print-page { box-shadow: none !important; }
        }
        .tab-active { border-bottom: 3px solid #1e3a5f; color: #1e3a5f; font-weight: 700; }
        .tab-inactive { color: #94a3b8; }
        .tab-inactive:hover { color: #475569; }
        .upload-zone:hover { border-color: #1e3a5f; background: #f0f4f8; }
        .btn-primary { background: #1e3a5f; color: white; }
        .btn-primary:hover:not(:disabled) { background: #152d4a; }
        .btn-primary:disabled { background: #94a3b8; cursor: not-allowed; }
      `}</style>

      <div style={{ maxWidth: 880, margin: "0 auto", padding: "2rem 1rem" }}>

        {/* ── CABECERA ── */}
        <header style={{ textAlign: "center", marginBottom: "2rem", paddingBottom: "1.5rem", borderBottom: "2px solid #1e3a5f" }}>
          <p style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#64748b", marginBottom: 6 }} className="serif-body">
            Universidad Pedagógica Nacional · Unidad 321 Zacatecas
          </p>
          <h1 style={{ fontSize: "clamp(1.8rem, 5vw, 2.8rem)", fontWeight: 900, color: "#1e3a5f", lineHeight: 1.1, margin: "0 0 8px" }} className="serif-display">
            Revisor Académico LEIP
          </h1>
          <p style={{ color: "#64748b", fontSize: 14, fontStyle: "italic" }} className="serif-body">
            Sistema de retroalimentación automática para proyectos de intervención pedagógica · {TOTAL} criterios evaluados
          </p>
        </header>

        {/* ── ZONA DE CARGA ── */}
        {!results && (
          <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 12, padding: "2rem", marginBottom: "1.5rem", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }} className="no-print">
            <div className="upload-zone" onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver} onDrop={handleDrop}
              style={{ border: `2px dashed ${file ? "#10b981" : "#cbd5e1"}`, borderRadius: 10, padding: "3rem 2rem", textAlign: "center", cursor: "pointer", transition: "all 0.2s", background: file ? "#f0fdf4" : "transparent" }}>
              <input type="file" accept=".pdf" ref={fileInputRef} onChange={handleFileSelect} style={{ display: "none" }} />
              {file ? (
                <>
                  <FileText style={{ width: 44, height: 44, color: "#10b981", margin: "0 auto 12px" }} />
                  <p style={{ fontWeight: 700, color: "#065f46", marginBottom: 4 }} className="serif-body">{file.name}</p>
                  <p style={{ fontSize: 13, color: "#6ee7b7" }}>{(file.size / 1048576).toFixed(2)} MB · listo para analizar</p>
                </>
              ) : (
                <>
                  <UploadCloud style={{ width: 44, height: 44, color: "#94a3b8", margin: "0 auto 12px" }} />
                  <p style={{ fontWeight: 600, color: "#475569", marginBottom: 4 }} className="serif-body">Arrastra tu proyecto en PDF aquí</p>
                  <p style={{ fontSize: 13, color: "#94a3b8" }}>o haz clic para seleccionar el archivo · máx. 20 MB</p>
                </>
              )}
            </div>

            {error && (
              <div style={{ marginTop: 16, padding: "12px 16px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, color: "#dc2626", fontSize: 14 }} className="serif-body">
                {error}
              </div>
            )}

            <div style={{ textAlign: "center", marginTop: 24 }}>
              <button onClick={handleAnalyze} disabled={!file || loading} className="btn-primary"
                style={{ padding: "12px 36px", borderRadius: 8, border: "none", fontSize: 15, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 10, cursor: "pointer", transition: "background 0.2s" }}>
                {loading ? (
                  <><Loader2 style={{ width: 20, height: 20, animation: "spin 1s linear infinite" }} />{statusMsg}</>
                ) : (
                  <><Search style={{ width: 20, height: 20 }} />Iniciar Revisión Automática</>
                )}
              </button>
            </div>

            {/* Info strip */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginTop: 28 }}>
              {[
                { icon: <BookOpen style={{ width: 20, height: 20, color: "#1e3a5f" }} />, txt: "52 criterios de la Lista de Cotejo oficial LEIP" },
                { icon: <BarChart3 style={{ width: 20, height: 20, color: "#1e3a5f" }} />, txt: "Reporte por sección con porcentaje de cumplimiento" },
                { icon: <Lightbulb style={{ width: 20, height: 20, color: "#1e3a5f" }} />, txt: "Recomendaciones formativas y accionables" },
              ].map((d, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "12px 14px", background: "#f8f6f0", borderRadius: 8, border: "1px solid #e9e5db" }}>
                  {d.icon}
                  <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.4 }} className="serif-body">{d.txt}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── RESULTADOS ── */}
        {results && (
          <div className="print-page">
            {/* Botones de acción */}
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginBottom: 16 }} className="no-print">
              <button onClick={() => { setResults(null); setFile(null); }}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", border: "1px solid #e2e8f0", borderRadius: 8, background: "white", color: "#475569", fontSize: 13, cursor: "pointer" }}>
                <RefreshCw style={{ width: 15, height: 15 }} />Nuevo análisis
              </button>
              <button onClick={copyResumen}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", border: "1px solid #bfdbfe", borderRadius: 8, background: "#eff6ff", color: "#1d4ed8", fontSize: 13, cursor: "pointer" }}>
                <Copy style={{ width: 15, height: 15 }} />Copiar resumen
              </button>
              <button onClick={() => window.print()}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, background: "#1e3a5f", color: "white", fontSize: 13, border: "none", cursor: "pointer" }}>
                <Download style={{ width: 15, height: 15 }} />Imprimir / PDF
              </button>
            </div>

            {/* Panel de resultados */}
            <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              {/* Tabs */}
              <div style={{ display: "flex", borderBottom: "1px solid #e2e8f0", background: "#f8fafc" }} className="no-print">
                {[
                  { id: "resumen", label: "Resumen", icon: <Award style={{ width: 15, height: 15 }} /> },
                  { id: "criterios", label: "Por criterio", icon: <BookOpen style={{ width: 15, height: 15 }} /> },
                  { id: "recomendaciones", label: "Recomendaciones", icon: <Lightbulb style={{ width: 15, height: 15 }} /> },
                ].map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={activeTab === tab.id ? "tab-active" : "tab-inactive"}
                    style={{ flex: 1, padding: "14px 8px", border: "none", background: "transparent", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "color 0.2s" }}>
                    {tab.icon}{tab.label}
                  </button>
                ))}
              </div>

              <div style={{ padding: "2rem" }}>

                {/* ── TAB: RESUMEN ── */}
                {(activeTab === "resumen") && (
                  <div>
                    <h2 style={{ fontWeight: 900, fontSize: "1.4rem", color: "#1e3a5f", marginBottom: "1.5rem" }} className="serif-display">
                      Resumen Ejecutivo
                    </h2>

                    <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 24, alignItems: "start", marginBottom: 24 }}>
                      <RadialGauge pct={results.resumen.porcentaje} valoracion={results.resumen.valoracion} />
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <MiniBar label="Cumplidos" value={results.resumen.cumplidos} total={TOTAL} color="bg-emerald-500" />
                        <MiniBar label="Parciales" value={results.resumen.parciales} total={TOTAL} color="bg-amber-400" />
                        <MiniBar label="No cumplidos" value={results.resumen.noCumplidos} total={TOTAL} color="bg-red-500" />
                        <MiniBar label="No encontrados" value={results.resumen.noEncontrados} total={TOTAL} color="bg-slate-300" />
                        <div style={{ gridColumn: "1/-1", paddingTop: 8 }}>
                          <p style={{ fontSize: 12, color: "#94a3b8", fontStyle: "italic" }} className="serif-body">
                            Total de criterios evaluados: {TOTAL}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div style={{ background: "#f0f4f8", borderLeft: "4px solid #1e3a5f", padding: "16px 20px", borderRadius: "0 8px 8px 0" }}>
                      <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#1e3a5f", marginBottom: 6 }}>Comentario del revisor</p>
                      <p style={{ color: "#334155", lineHeight: 1.7, fontSize: 14 }} className="serif-body">{results.resumen.comentarioGeneral}</p>
                    </div>

                    {/* Mini resumen por sección */}
                    <h3 style={{ fontWeight: 700, fontSize: "1rem", color: "#1e3a5f", margin: "24px 0 12px" }} className="serif-display">
                      Estado por sección
                    </h3>
                    <div style={{ display: "grid", gap: 8 }}>
                      {criteriosPorSeccion.map(({ seccion, criterios }) => {
                        const cum = criterios.filter(c => c.estado === "Cumplido").length;
                        const par = criterios.filter(c => c.estado === "Parcial").length;
                        const pct = Math.round(((cum + par * 0.5) / criterios.length) * 100);
                        const color = pct >= 80 ? "#10b981" : pct >= 60 ? "#f59e0b" : "#ef4444";
                        return (
                          <div key={seccion} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
                            <span style={{ fontSize: 12, color: "#64748b", width: 240, flexShrink: 0 }} className="serif-body">{seccion}</span>
                            <div style={{ flex: 1, height: 6, background: "#e2e8f0", borderRadius: 3 }}>
                              <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 3, transition: "width 0.7s ease" }} />
                            </div>
                            <span style={{ fontSize: 12, fontWeight: 700, color, width: 38, textAlign: "right" }}>{pct}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ── TAB: CRITERIOS ── */}
                {(activeTab === "criterios") && (
                  <div>
                    <h2 style={{ fontWeight: 900, fontSize: "1.4rem", color: "#1e3a5f", marginBottom: "1.5rem" }} className="serif-display">
                      Evaluación por Criterio
                    </h2>
                    <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }} className="no-print">
                      {Object.entries(STATUS_CFG).map(([estado, cfg]) => {
                        const count = results.criterios.filter(c => c.estado === estado).length;
                        return (
                          <span key={estado} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${cfg.color}`}>
                            {cfg.icon}{estado}: {count}
                          </span>
                        );
                      })}
                    </div>
                    <div style={{ display: "grid", gap: 10 }}>
                      {criteriosPorSeccion.map(({ seccion, criterios }) => (
                        <SeccionAccordion key={seccion} seccion={seccion} criterios={criterios} />
                      ))}
                    </div>
                  </div>
                )}

                {/* ── TAB: RECOMENDACIONES ── */}
                {(activeTab === "recomendaciones") && (
                  <div>
                    <h2 style={{ fontWeight: 900, fontSize: "1.4rem", color: "#1e3a5f", marginBottom: "1.5rem" }} className="serif-display">
                      Recomendaciones Prioritarias
                    </h2>
                    {results.recomendaciones.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "3rem", background: "#f0fdf4", borderRadius: 12, border: "1px solid #a7f3d0" }}>
                        <CheckCircle style={{ width: 48, height: 48, color: "#10b981", margin: "0 auto 12px" }} />
                        <p style={{ fontWeight: 700, fontSize: "1.1rem", color: "#065f46" }}>¡Excelente trabajo!</p>
                        <p style={{ color: "#6ee7b7", fontSize: 14 }}>No se detectaron áreas críticas que requieran atención inmediata.</p>
                      </div>
                    ) : (
                      <div style={{ display: "grid", gap: 16 }}>
                        {results.recomendaciones.map((rec, i) => (
                          <div key={i} style={{ borderLeft: "4px solid #f59e0b", padding: "16px 20px", background: "white", borderRadius: "0 10px 10px 0", border: "1px solid #e2e8f0", borderLeftColor: "#f59e0b", borderLeftWidth: 4 }}>
                            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                              <span style={{ width: 28, height: 28, borderRadius: "50%", background: "#fef3c7", color: "#92400e", fontSize: 13, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                {i + 1}
                              </span>
                              <div style={{ flex: 1 }}>
                                <h3 style={{ fontWeight: 700, color: "#1e3a5f", fontSize: 15, marginBottom: 8 }} className="serif-display">{rec.aspecto}</h3>
                                <p style={{ fontSize: 13, color: "#64748b", marginBottom: 8, lineHeight: 1.5 }} className="serif-body">
                                  <strong style={{ color: "#475569" }}>¿Por qué importa?</strong> {rec.importancia}
                                </p>
                                <div style={{ background: "#f8f6f0", padding: "10px 14px", borderRadius: 8, fontSize: 13, color: "#334155" }} className="serif-body">
                                  <strong style={{ color: "#1e3a5f" }}>Acción sugerida: </strong>{rec.accion}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>
          </div>
        )}

        {/* Pie */}
        <footer style={{ textAlign: "center", marginTop: 32, paddingTop: 16, borderTop: "1px solid #e2e8f0" }}>
          <p style={{ fontSize: 11, color: "#94a3b8", letterSpacing: "0.05em" }} className="serif-body">
            Revisor LEIP · UPN Unidad 321 Zacatecas · {TOTAL} criterios según Lista de Cotejo oficial
          </p>
        </footer>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
