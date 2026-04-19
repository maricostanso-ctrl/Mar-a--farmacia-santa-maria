import { useState } from "react";

const SYSTEM_PROMPT = `Sos María, la asistente de marketing digital de **Farmacia Santa María**, ubicada en Juana Koslay, provincia de San Luis, Argentina.

Sos una farmacéutica joven, moderna y simpática. Hablás siempre en primera persona como María. Cuando saludes, presentate como María.

Tu rol es ayudar a crear contenido de marketing auténtico, cercano y profesional para las redes sociales y canales de comunicación de la farmacia.

**Sobre la farmacia:**
- Nombre: Farmacia Santa María
- Ubicación: Juana Koslay, San Luis, Argentina
- Tono de comunicación: cálido, cercano, confiable, profesional pero accesible
- Público: vecinos de Juana Koslay y alrededores

**Reglas importantes:**
- Siempre escribí en español rioplatense (vos, sos, etc.)
- Nunca hagas recomendaciones médicas específicas ni indicaciones de medicamentos con dosis
- Mencioná siempre que ante cualquier duda consulten al farmacéutico
- El contenido debe sentirse local y genuino, no corporativo
- Usá emojis con moderación pero de forma efectiva
- Para Instagram siempre incluí entre 5 y 10 hashtags al final

Respondé siempre de forma clara, lista para copiar y pegar en la red social indicada.`;

const CONTENT_TYPES = [
  { id: "instagram", label: "Post Instagram", icon: "📸", color: "#E1306C" },
  { id: "facebook", label: "Post Facebook", icon: "👍", color: "#1877F2" },
  { id: "whatsapp", label: "WhatsApp", icon: "💬", color: "#25D366" },
  { id: "campana", label: "Campaña Especial", icon: "🎯", color: "#FF6B35" },
  { id: "respuesta", label: "Respuesta a Cliente", icon: "🤝", color: "#8B5CF6" },
  { id: "ideas", label: "Ideas Semanales", icon: "💡", color: "#F59E0B" },
];

const QUICK_PROMPTS = {
  instagram: ["Promoción de vitaminas para el invierno", "Recordatorio de turno para vacunas", "Tip de salud para esta semana", "Presentación de un nuevo producto"],
  facebook: ["Información sobre servicios de la farmacia", "Campaña de prevención de gripe", "Novedades y horarios de atención", "Concientización sobre salud bucal"],
  whatsapp: ["Oferta especial del día", "Recordatorio de medicación", "Aviso de cierre por feriado", "Bienvenida al grupo de clientes"],
  campana: ["Día de la Madre", "Día del Niño", "Campaña de invierno", "Navidad y Año Nuevo", "Vuelta al cole", "Semana de la Lactancia"],
  respuesta: ["Cliente consulta por demora en pedido", "Cliente agradece la atención", "Cliente pregunta por horarios", "Cliente pide info sobre un medicamento"],
  ideas: ["Plan de contenido para esta semana", "Ideas para el mes de julio", "Contenido para la época de gripe", "Posts educativos sobre salud"],
};

export default function App() {
  const [selectedType, setSelectedType] = useState(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState([]);
  const [mariaMessage, setMariaMessage] = useState("¡Hola! Soy María 👩‍⚕️ Tu asistente de marketing. ¿Qué contenido creamos hoy?");

  const generate = async (promptText) => {
    if (!selectedType || !promptText.trim()) return;
    setLoading(true);
    setResult("");
    setMariaMessage("Estoy creando el contenido perfecto para vos... ✨");
    const typeLabel = CONTENT_TYPES.find((t) => t.id === selectedType)?.label;
    const fullPrompt = `Generá un ${typeLabel} para: ${promptText}`;
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: fullPrompt }],
        }),
      });
      const data = await res.json();
      const text = data.content?.map((b) => b.text || "").join("") || "Error al generar contenido.";
      setResult(text);
      setMariaMessage("¡Listo! Acá tenés el contenido. Podés copiarlo y pegarlo directamente 💚");
      setHistory((prev) => [{ type: type​​​​​​​​​​​​​​​​
