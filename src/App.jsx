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

function speak(text) {
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "es-AR";
  u.rate = 0.95;
  u.pitch = 1.1;
  window.speechSynthesis.speak(u);
}

export default function App() {
  const [selectedType, setSelectedType] = useState(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [msg, setMsg] = useState("¡Hola! Soy María 👩‍⚕️ Tu asistente de marketing. ¿Qué contenido creamos hoy?");

  const generate = async (promptText) => {
    if (!selectedType || !promptText.trim()) return;
    setLoading(true);
    setResult("");
    setMsg("Estoy creando el contenido perfecto para vos... ✨");
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
      setMsg("¡Listo! Acá tenés el contenido 💚");
      speak("¡Listo! Acá tenés el contenido. Podés copiarlo y pegarlo en tus redes.");
    } catch {
      setResult("❌ Error. Intentá de nuevo.");
      setMsg("Ups, algo salió mal. Intentá de nuevo 😊");
      speak("Ups, algo salió mal.");
    }
    setLoading(false);
  };

  const selectedTypeData = CONTENT_TYPES.find((t) => t.id === selectedType);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f1923 0%, #1a2a3a 50%, #0f1923 100%)", color: "#e8e0d4" }}>
      <div style={{ background: "linear-gradient(90deg, #1a3a2a, #0d2818)", borderBottom: "2px solid #2d6a4f", padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 40, height: 40, background: "linear-gradient(135deg, #2d6a4f, #52b788)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>💊</div>
        <div>
          <div style={{ fontSize: 17, fontWeight: "bold", color: "#52b788", fontFamily: "Georgia" }}>Farmacia Santa María</div>
          <div style={{ fontSize: 11, color: "#8ab4a0", letterSpacing: 1, textTransform: "uppercase", fontFamily: "Arial" }}>Asistente de Marketing · Juana Koslay, San Luis</div>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "20px 16px" }}>

        <div style={{ background: "rgba(45,106,79,0.12)", border: "1.5px solid rgba(82,183,136,0.3)", borderRadius: 20, padding: 20, marginBottom: 24, display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <img src="/IMG_5692.png" alt="María" style={{ width: 90, height: 90, borderRadius: "50%", objectFit: "cover", objectPosition: "top", border: "3px solid #52b788", boxShadow: "0 0 20px rgba(82,183,136,0.4)" }} />
            <div style={{ position: "absolute", bottom: 4, right: 4, width: 14, height: 14, background: loading ? "#F59E0B" : "#52b788", borderRadius: "50%", border: "2px solid #0f1923" }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: "bold", color: "#52b788", marginBottom: 4, fontFamily: "Arial" }}>María · Farmacéutica & Marketing</div>
            <div style={{ fontSize: 13, color: "#dde8e4", fontFamily: "Arial", lineHeight: 1.5, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px 12px 12px 4px", padding: "10px 14px", marginBottom: 8 }}>{msg}</div>
            <button onClick={() => speak(msg)} style={{ background: "rgba(82,183,136,0.15)", border: "1px solid #52b788", borderRadius: 16, padding: "5px 12px", cursor: "pointer", color: "#52b788", fontSize: 12, fontFamily: "Arial" }}>🔊 Escuchar a María</button>
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: "#8ab4a0", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10, fontFamily: "Arial" }}>1 · ¿Qué querés crear?</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            {CONTENT_TYPES.map((type) => (
              <button key={type.id}
                onClick={() => { setSelectedType(type.id); setCustomPrompt(""); setResult(""); setMsg(`¡Buena elección! ¿Sobre qué tema hacemos el ${type.label}? 😊`); speak(`Buena elección. ¿Sobre qué tema?`); }}
                style={{ background: selectedType === type.id ? `linear-gradient(135deg, ${type.color}22, ${type.color}44)` : "rgba(255,255,255,0.04)", border: `1.5px solid ${selectedType === type.id ? type.color : "rgba(255,255,255,0.1)"}`, borderRadius: 12, padding: "12px 8px", cursor: "pointer", color: selectedType === type.id ? "#fff" : "#a0b4a8", fontSize: 12, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                <span style={{ fontSize: 20 }}>{type.icon}</span>
                <span style={{ fontFamily: "Arial" }}>{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        {selectedType && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, color: "#8ab4a0", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10, fontFamily: "Arial" }}>2 · ¿Sobre qué tema?</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
              {QUICK_PROMPTS[selectedType]?.map((p) => (
                <button key={p} onClick={() => setCustomPrompt(p)}
                  style={{ background: customPrompt === p ? `${selectedTypeData.color}33` : "rgba(255,255,255,0.06)", border: `1px solid ${customPrompt === p ? selectedTypeData.color : "rgba(255,255,255,0.12)"}`, borderRadius: 20, padding: "6px 12px", cursor: "pointer", color: customPrompt === p ? "#fff" : "#a0b4a8", fontSize: 12, fontFamily: "Arial" }}>{p}</button>
              ))}
            </div>
            <textarea value={customPrompt} onChange={(e) => setCustomPrompt(e.target.value)} placeholder="O escribí tu propio tema..." rows={2}
              style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1.5px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "12px 14px", color: "#e8e0d4", fontSize: 14, fontFamily: "Arial", resize: "none", outline: "none", boxSizing: "border-box" }} />
            <button onClick={() => generate(customPrompt)} disabled={!customPrompt.trim() || loading}
              style={{ marginTop: 10, width: "100%", background: loading ? "rgba(82,183,136,0.3)" : "linear-gradient(135deg, #2d6a4f, #52b788)", border: "none", borderRadius: 10, padding: 14, cursor: loading ? "not-allowed" : "pointer", color: "#fff", fontSize: 15, fontFamily: "Arial", fontWeight: "600" }}>
              {loading ? "✨ María está escribiendo..." : "✨ Pedirle a María"}
            </button>
          </div>
        )}

        {result && (
          <div style={{ background: "rgba(45,106,79,0.12)", border: "1.5px solid rgba(82,183,136,0.3)", borderRadius: 14, padding: 18, marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ fontSize: 11, color: "#52b788", letterSpacing: 2, textTransform: "uppercase", fontFamily: "Arial" }}>✅ Contenido de María</div>
              <button onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setMsg("¡Copiado! Ya podés pegarlo en tus redes 🎉"); speak("¡Copiado!"); setTimeout(() => setCopied(false), 2000); }}
                style={{ background: copied ? "rgba(82,183,136,0.3)" : "rgba(255,255,255,0.08)", border: "1px solid rgba(82,183,136,0.4)", borderRadius: 8, padding: "6px 12px", cursor: "pointer", color: copied ? "#52b788" : "#a0b4a8", fontSize: 12, fontFamily: "Arial" }}>
                {copied ? "✓ Copiado" : "📋 Copiar"}
              </button>
            </div>
            <div style={{ whiteSpace: "pre-wrap", fontSize: 14, lineHeight: 1.7, color: "#dde8e4", fontFamily: "Arial" }}>{result}</div>
          </div>
        )}

        {!selectedType && (
          <div style={{ textAlign: "center", padding: "20px 0", color: "#4a6a5a", fontFamily: "Arial", fontSize: 13 }}>
            Seleccioná un tipo de contenido para que María empiece a trabajar 💊
          </div>
        )}
      </div>

      <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}`}</style>
    </div>
  );
}
