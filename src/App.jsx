import { useState } from "react";

const SYSTEM_PROMPT = `Sos María, la asistente de marketing digital de Farmacia Santa María, ubicada en Juana Koslay, provincia de San Luis, Argentina. Sos una farmacéutica joven, moderna y simpática. Hablás siempre en primera persona como María. Nunca hagas recomendaciones médicas específicas. Siempre escribí en español rioplatense. Para Instagram incluí entre 5 y 10 hashtags al final. Respondé de forma clara, lista para copiar y pegar.`;

const CONTENT_TYPES = [
  { id: "instagram", label: "Post Instagram", icon: "📸", color: "#E1306C" },
  { id: "facebook", label: "Post Facebook", icon: "👍", color: "#1877F2" },
  { id: "whatsapp", label: "WhatsApp", icon: "💬", color: "#25D366" },
  { id: "campana", label: "Campaña Especial", icon: "🎯", color: "#FF6B35" },
  { id: "respuesta", label: "Respuesta a Cliente", icon: "🤝", color: "#8B5CF6" },
  { id: "ideas", label: "Ideas Semanales", icon: "💡", color: "#F59E0B" },
];

const QUICK_PROMPTS = {
  instagram: ["Vitaminas para el invierno", "Turno para vacunas", "Tip de salud", "Nuevo producto"],
  facebook: ["Servicios de la farmacia", "Prevención de gripe", "Horarios de atención", "Salud bucal"],
  whatsapp: ["Oferta del día", "Recordatorio de medicación", "Cierre por feriado", "Bienvenida"],
  campana: ["Día de la Madre", "Día del Niño", "Campaña de invierno", "Navidad", "Vuelta al cole"],
  respuesta: ["Demora en pedido", "Cliente agradece", "Consulta de horarios", "Info medicamento"],
  ideas: ["Plan semanal", "Ideas para julio", "Época de gripe", "Posts educativos"],
};

const speak = (text) => {
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "es-AR";
  utterance.rate = 0.95;
  utterance.pitch = 1.1;
  window.speechSynthesis.speak(utterance);
};

export default function App() {
  const [selectedType, setSelectedType] = useState(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mariaMessage, setMariaMessage] = useState("¡Hola! Soy María 👩‍⚕️ Tu asistente de marketing. ¿Qué contenido creamos hoy?");

  const generate = async (promptText) => {
    if (!selectedType || !promptText.trim()) return;
    setLoading(true);
    setResult("");
    setMariaMessage("Estoy creando el contenido perfecto para vos... ✨");
    speak("Estoy creando el contenido perfecto para vos...");
    const typeLabel = CONTENT_TYPES.find((t) => t.id === selectedType)?.label;
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: `Generá un ${typeLabel} para: ${promptText}` }],
        }),
      });
      const data = await res.json();
      const text = data.content?.map((b) => b.text || "").join("") || "Error al generar.";
      setResult(text);
      setMariaMessage("¡Listo! Acá tenés el contenido 💚");
      speak("¡Listo! Acá tenés el contenido. Podés copiarlo y pegarlo en tus redes.");
    } catch {
      setResult("❌ Error. Intentá de nuevo.");
      setMariaMessage("Ups, algo salió mal 😊");
      speak("Ups, algo salió mal. Intentá de nuevo.");
    }
    setLoading(false);
  };

  const selectedTypeData = CONTENT_TYPES.find((t) => t.id === selectedType);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f1923 0%, #1a2a3a 50%, #0f1923 100%)", fontFamily: "'Georgia', serif", color: "#e8e0d4" }}>
      <div style={{ background: "linear-gradient(90deg, #1a3a2a 0%, #0d2818 100%)", borderBottom: "2px solid #2d6a4f", padding: "16px 20px", display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ width: 40, height: 40, background: "linear-gradient(135deg, #2d6a4f, #52b788)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>💊</div>
        <div>
          <div style={{ fontSize: 17, fontWeight: "bold", color: "#52b788" }}>Farmacia Santa María</div>
          <div style={{ fontSize: 11, color: "#8ab4a0", letterSpacing: "1px", textTransform: "uppercase" }}>Asistente de Marketing · Juana Koslay, San Luis</div>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "20px 16px" }}>

        <div style={{ background: "rgba(45,106,79,0.12)", border: "1.5px solid rgba(82,183,136,0.3)", borderRadius: 20, padding: "20px", marginBottom: 24, display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <img src="/IMG_5692.png" alt="María"
              style={{ width: 90, height: 90, borderRadius: "50%", objectFit: "cover", objectPosition: "top", border: "3px solid #52b788", boxShadow: "0 0 20px rgba(82,183,136,0.4)", animation: "float 3s ease-in-out infinite" }} />
            <div style={{ position: "absolute", bottom: 4, right: 4, width: 14, height: 14, background: loading ? "#F59E0B" : "#52b788", borderRadius: "50%", border: "2px solid #0f1923", animation: "blink 2s infinite" }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: "bold", color: "#52b788", marginBottom: 4, fontFamily: "'Arial', sans-serif" }}>María · Farmacéutica & Marketing</div>
            <div style={{ fontSize: 13, color: "#dde8e4", fontFamily: "'Arial', sans-serif", lineHeight: 1.5, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px 12px 12px 4px", padding: "10px 14px" }}>
              {mariaMessage}
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: "#8ab4a0", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 10 }}>1 · ¿Qué querés crear?</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            {CONTENT_TYPES.map((type) => (
              <button key={type.id}
                onClick={() => { setSelectedType(type.id); setCustomPrompt(""); setResult(""); setMariaMessage(`¡Buena elección! ¿Sobre qué tema hacemos el ${type.label}? 😊`); speak(`Buena elección. ¿Sobre qué tema hacemos el ${type.label}?`); }}
                style={{ background: selectedType === type.id ? `linear-gradient(135deg, ${type.color}22, ${type.color}44)` : "rgba(255,255,255,0.04)", border: `1.5px solid ${selectedType === type.id ? type.color : "rgba(255,255,255,0.1)"}`, borderRadius: 12, padding: "12px 8px", cursor: "pointer", color: selectedType === type.id ? "#fff" : "#a0b4a8", fontSize: 12, display: "flex", flexDirection: "column", alignItems: "center", gap: 5, boxShadow: selectedType === type.id ? `0 0 16px ${type.color}33` : "none" }}>
                <span style={{​​​​​​​​​​​​​​​​
