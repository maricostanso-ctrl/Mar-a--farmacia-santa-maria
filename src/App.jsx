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
const speak = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-AR";
    utterance.rate = 0.95;
    utterance.pitch = 1.1;
    window.speechSynthesis.speak(utterance);
  };
  const setMariaMessage("¡Hola! Soy María 👩‍⚕️ Tu asistente de marketing. ¿Qué contenido creamos hoy?");
setTimeout(() => speak("¡Hola! Soy María, tu asistente de marketing de Farmacia Santa María. ¿Qué contenido creamos hoy?"), 500);


  const generate = async (promptText) => {
    if (!selectedType || !promptText.trim()) return;
    setLoading(true);
    setResult("");
     setMariaMessage("Estoy creando el contenido perfecto para vos... ✨");
speak("Estoy creando el contenido perfecto para vos...");

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
      setMariaMessage("¡Listo! Acá tenés el contenido 💚");
speak("¡Listo! Acá tenés el contenido. Podés copiarlo y pegarlo en tus redes.");

      setHistory((prev) => [{ type: typeLabel, prompt: promptText, result: text }, ...prev.slice(0, 4)]);
    } catch {
      setResult("❌ Error de conexión. Intentá de nuevo.");
      setMariaMessage("Ups, algo salió mal. ¿Podés intentarlo de nuevo? 😊");
    }
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setMariaMessage("¡Copiado! Ya podés pegarlo en tus redes 🎉");
    setTimeout(() => setCopied(false), 2000);
  };

  const selectedTypeData = CONTENT_TYPES.find((t) => t.id === selectedType);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f1923 0%, #1a2a3a 50%, #0f1923 100%)",
      fontFamily: "'Georgia', serif",
      color: "#e8e0d4",
    }}>
      <div style={{
        background: "linear-gradient(90deg, #1a3a2a 0%, #0d2818 100%)",
        borderBottom: "2px solid #2d6a4f",
        padding: "16px 20px",
        display: "flex", alignItems: "center", gap: "12px",
      }}>
        <div style={{ width: 40, height: 40, background: "linear-gradient(135deg, #2d6a4f, #52b788)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>💊</div>
        <div>
          <div style={{ fontSize: 17, fontWeight: "bold", color: "#52b788" }}>Farmacia Santa María</div>
          <div style={{ fontSize: 11, color: "#8ab4a0", letterSpacing: "1px", textTransform: "uppercase" }}>Asistente de Marketing · Juana Koslay, San Luis</div>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "20px 16px" }}>

        {/* María Avatar */}
        <div style={{
          background: "rgba(45,106,79,0.12)",
          border: "1.5px solid rgba(82,183,136,0.3)",
          borderRadius: 20,
          padding: "20px",
          marginBottom: 24,
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <img
              src="/IMG_5692.png"
              alt="María"
              style={{
                width: 90,
                height: 90,
                borderRadius: "50%",
                objectFit: "cover",
                objectPosition: "top",
                border: "3px solid #52b788",
                boxShadow: "0 0 20px rgba(82,183,136,0.4)",
                animation: "float 3s ease-in-out infinite",
              }}
            />
            <div style={{
              position: "absolute", bottom: 4, right: 4,
              width: 14, height: 14,
              background: loading ? "#F59E0B" : "#52b788",
              borderRadius: "50%",
              border: "2px solid #0f1923",
              animation: "blink 2s infinite",
            }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: "bold", color: "#52b788", marginBottom: 4, fontFamily: "'Arial', sans-serif" }}>
              María · Farmacéutica & Marketing
            </div>
            <div style={{
              fontSize: 13,
              color: "#dde8e4",
              fontFamily: "'Arial', sans-serif",
              lineHeight: 1.5,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "12px 12px 12px 4px",
              padding: "10px 14px",
            }}>
              {mariaMessage}
            </div>
          </div>
        </div>

        {/* Step 1 */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: "#8ab4a0", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 10 }}>1 · ¿Qué querés crear?</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            {CONTENT_TYPES.map((type) => (
              <button key={type.id} onClick={() => { setSelectedType(type.id); setCustomPrompt(""); setResult(""); setMariaMessage(`¡Buena elección! ¿Sobre qué tema hacemos el ${type.label}? 😊`); }}
                style={{
                  background: selectedType === type.id ? `linear-gradient(135deg, ${type.color}22, ${type.color}44)` : "rgba(255,255,255,0.04)",
                  border: `1.5px solid ${selectedType === type.id ? type.color : "rgba(255,255,255,0.1)"}`,
                  borderRadius: 12, padding: "12px 8px", cursor: "pointer",
                  color: selectedType === type.id ? "#fff" : "#a0b4a8", fontSize: 12,
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
                  boxShadow: selectedType === type.id ? `0 0 16px ${type.color}33` : "none",
                }}>
                <span style={{ fontSize: 20 }}>{type.icon}</span>
                <span style={{ fontFamily: "'Arial', sans-serif" }}>{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2 */}
        {selectedType && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, color: "#8ab4a0", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 10 }}>2 · ¿Sobre qué tema?</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
              {QUICK_PROMPTS[selectedType]?.map((p) => (
                <button key={p} onClick={() => setCustomPrompt(p)}
                  style={{
                    background: customPrompt === p ? `${selectedTypeData.color}33` : "rgba(255,255,255,0.06)",
                    border: `1px solid ${customPrompt === p ? selectedTypeData.color : "rgba(255,255,255,0.12)"}`,
                    borderRadius: 20, padding: "6px 12px", cursor: "pointer",
                    color: customPrompt === p ? "#fff" : "#a0b4a8", fontSize: 12,
                    fontFamily: "'Arial', sans-serif",
                  }}>{p}</button>
              ))}
            </div>
            <textarea value={customPrompt} onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="O escribí tu propio tema..." rows={2}
              style={{
                width: "100%", background: "rgba(255,255,255,0.05)",
                border: "1.5px solid rgba(255,255,255,0.12)", borderRadius: 10,
                padding: "12px 14px", color: "#e8e0d4", fontSize: 14,
                fontFamily: "'Arial', sans-serif", resize: "none", outline: "none", boxSizing: "border-box",
              }} />
            <button onClick={() => generate(customPrompt)} disabled={!customPrompt.trim() || loading}
              style={{
                marginTop: 10, width: "100%",
                background: loading ? "rgba(82,183,136,0.3)" : "linear-gradient(135deg, #2d6a4f, #52b788)",
                border: "none", borderRadius: 10, padding: "14px", cursor: loading ? "not-allowed" : "pointer",
                color: "#fff", fontSize: 15, fontFamily: "'Arial', sans-serif", fontWeight: "600",
                boxShadow: loading ? "none" : "0 4px 16px rgba(82,183,136,0.3)",
              }}>
              {loading ? "✨ María está escribiendo..." : "✨ Pedirle a María"}
            </button>
          </div>
        )}

        {/* Result */}
        {result && (
          <div style={{ background: "rgba(45,106,79,0.12)", border: "1.5px solid rgba(82,183,136,0.3)", borderRadius: 14, padding: "18px", marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ fontSize: 11, color: "#52b788", letterSpacing: "2px", textTransform: "uppercase" }}>✅ Contenido de María</div>
              <button onClick={handleCopy}
                style={{ background: copied ? "rgba(82,183,136,0.3)" : "rgba(255,255,255,0.08)", border: "1px solid rgba(82,183,136,0.4)", borderRadius: 8, padding: "6px 12px", cursor: "pointer", color: copied ? "#52b788" : "#a0b4a8", fontSize: 12, fontFamily: "'Arial', sans-serif" }}>
                {copied ? "✓ Copiado" : "📋 Copiar"}
              </button>
            </div>
            <div style={{ whiteSpace: "pre-wrap", fontSize: 14, lineHeight: 1.7, color: "#dde8e4", fontFamily: "'Arial', sans-serif" }}>{result}</div>
            <button onClick={() => generate(customPrompt)}
              style={{ marginTop: 12, background: "transparent", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, padding: "8px 14px", cursor: "pointer", color: "#8ab4a0", fontSize: 12, fontFamily: "'Arial', sans-serif" }}>
              🔄 Pedirle otra versión a María
            </button>
          </div>
        )}

        {!selectedType && (
          <div style={{ textAlign: "center", padding: "20px 0", color: "#4a6a5a" }}>
            <div style={{ fontSize: 13, fontFamily: "'Arial', sans-serif" }}>Seleccioná un tipo de contenido para que María empiece a trabajar 💊</div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-6px); } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </div>
  );
}
