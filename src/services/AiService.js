export function evaluateAsset(asset) {
    const name = (asset.name || "").toLowerCase();
    const type = asset.type || "General";
    const crit = asset.criticality || "Media";
  
    let impacto = "Medio";
    let probabilidad = "Media";
    let recomendaciones = [];
  
    if (type.toLowerCase().includes("base de datos") || name.includes("cliente") || crit === "Alta") {
      impacto = "Alto";
      probabilidad = "Media";
      recomendaciones = [
        "Cifrado en reposo y tránsito (A.10)",
        "Control de accesos mínimo privilegio (A.9)",
        "Backups encriptados y plan de restauración (A.17)"
      ];
    } else if (type.toLowerCase().includes("firewall") || name.includes("perimetral")) {
      impacto = "Medio";
      probabilidad = "Baja";
      recomendaciones = ["Revisar reglas y logs", "Actualizar firmware", "Segmentación de red"];
    } else {
      impacto = "Medio";
      probabilidad = "Baja";
      recomendaciones = ["Parches regulares", "Política de contraseñas", "Educación al personal"];
    }
  
    return {
      activo: asset.name,
      tipo: type,
      criticidad: crit,
      impacto,
      probabilidad,
      recomendaciones
    };
  }
  