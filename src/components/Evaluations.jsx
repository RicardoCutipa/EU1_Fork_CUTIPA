import React from "react";
import assets from "../data/assets.json";
import { evaluateAsset } from "../services/AiService";

export default function Evaluations() {
  const results = assets.map(a => evaluateAsset(a));

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Evaluación de Activos</h2>
      {results.map((r, idx) => (
        <div key={idx} style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "1rem",
          marginBottom: "1rem",
          background: "#f9f9f9"
        }}>
          <h3>{r.activo}</h3>
          <p><strong>Tipo:</strong> {r.tipo}</p>
          <p><strong>Criticidad:</strong> {r.criticidad}</p>
          <p><strong>Impacto:</strong> {r.impacto}</p>
          <p><strong>Probabilidad:</strong> {r.probabilidad}</p>
          <p><strong>Recomendaciones:</strong></p>
          <ul>
            {r.recomendaciones.map((rec, i) => <li key={i}>{rec}</li>)}
          </ul>
        </div>
      ))}
    </div>
  );
}
