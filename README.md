# Informe de Auditoría — Unidad I  

**Asignatura:** Auditoría de Sistemas  
**Tema:** Evaluación de Activos de Información en un Banco  
**Alumno:** Ricardo Cutipa Gutierrez  
**Fecha:** 10/09/2025  
**Repositorio GitHub:** [EU1_Fork_CUTIPA](https://github.com/RicardoCutipa/EU1_Fork_CUTIPA.git)  

---

## Introducción  

El presente informe corresponde al desarrollo de la **Unidad I de Auditoría de Sistemas**, en el que se implementa un sistema de evaluación de riesgos para activos de información en un banco ficticio.  

La solución se construyó con las siguientes tecnologías:  
- **Frontend:** React 18 + Vite.  
- **UI:** Ant Design.  
- **Motor heurístico:** Implementado en JavaScript (`AiService.js`).  
- **Repositorio:** GitHub para control de versiones y entrega.  

El sistema permite:  
- Autenticación mediante **login ficticio** sin base de datos.  
- Visualización de un **dashboard de activos**.  
- Evaluación heurística de **probabilidad, impacto y criticidad**.  
- Generación de **recomendaciones alineadas a ISO 27001**.  

---

## 1. Proyecto de Auditoría de Riesgos  

### 1.1 Login ficticio  

**Evidencia:**  
![Captura login](evidencias/login_form.png)  
![Captura dashboard](evidencias/dashboard_after_login.png)  

**Descripción:**  
Se implementó un sistema de inicio de sesión ficticio sin base de datos.  
Las credenciales están definidas en memoria (ejemplo: `auditor / auditor123`).  
Una vez autenticado, el usuario accede al dashboard principal del sistema de gestión de riesgos.  

---

### 1.2 Motor de Inteligencia Artificial

**Evidencia:**  
![Captura código motor](evidencias/tabla_inicial.png)  
![Captura salida motor](evidencias/tabla_con_tratamientos.png)  

**Descripción:**  
Se desarrolló un motor heurístico en JavaScript que, a partir de la criticidad y tipo de activo, determina:  
- La **probabilidad (riesgo)**  
- El **impacto**  
- La **criticidad total del activo**  
- Las **recomendaciones de mitigación**, alineadas con la norma ISO 27001.  

Este motor se integra al dashboard: al pulsar “Recomendar tratamientos”, la tabla se actualiza con las recomendaciones correspondientes.  

---

## 2. Hallazgos — Evaluación de Activos  

### Activo 1: Base de Datos Clientes  
**Evidencia:**  
![Base de datos clientes](evidencias/bd_clientes.png)  

**Condición:**  
La base de datos contiene información sensible sin cifrado en reposo. Los respaldos no cuentan con pruebas de restauración verificadas.  

**Criticidad:** Alta  
**Recomendaciones:**  
- Cifrado en reposo y tránsito (A.10).  
- Control de accesos mínimo privilegio (A.9).  
- Backups encriptados y plan de restauración (A.17).  

**Riesgo:**  
Probabilidad: Media  
Impacto: Alto  

---

### Activo 2: Aplicación Web de Banca  
**Evidencia:**  
![Aplicación banca](evidencias/app_banca.png)  

**Condición:**  
El portal de clientes presenta criticidad alta. Los controles de cifrado y de acceso requieren fortalecimiento.  

**Criticidad:** Alta  
**Recomendaciones:**  
- Cifrado en reposo y tránsito (A.10).  
- Control de accesos mínimo privilegio (A.9).  
- Backups encriptados y plan de restauración (A.17).  

**Riesgo:**  
Probabilidad: Media  
Impacto: Alto  

---

### Activo 3: Backup NAS Central  
**Evidencia:**  
![Backup NAS](evidencias/backup_nas.png)  

**Condición:**  
El sistema de respaldo no está segmentado y depende de una única ubicación, lo que eleva la vulnerabilidad en caso de fallo físico.  

**Criticidad:** Media  
**Recomendaciones:**  
- Parches regulares.  
- Política de contraseñas.  
- Educación al personal.  

**Riesgo:**  
Probabilidad: Baja  
Impacto: Medio  

---

### Activo 4: Firewall Perimetral  
**Evidencia:**  
![Firewall](evidencias/firewall.png)  

**Condición:**  
El firewall protege la red, pero las reglas no se revisan periódicamente y el firmware está desactualizado.  

**Criticidad:** Media  
**Recomendaciones:**  
- Revisar reglas y logs.  
- Actualizar firmware.  
- Segmentación de red.  

**Riesgo:**  
Probabilidad: Baja  
Impacto: Medio  

---

### Activo 5: Módulo KYC  
**Evidencia:**  
![Módulo KYC](evidencias/modulo_kyc.png)  

**Condición:**  
El módulo de verificación de identidad (KYC) maneja datos críticos. No se garantiza cifrado extremo a extremo en las comunicaciones.  

**Criticidad:** Alta  
**Recomendaciones:**  
- Cifrado en reposo y tránsito (A.10).  
- Control de accesos mínimo privilegio (A.9).  
- Backups encriptados y plan de restauración (A.17).  

**Riesgo:**  
Probabilidad: Media  
Impacto: Alto  

---

## 3. Anexos  

### 3.1 Listado de activos evaluados  
- Base de Datos Clientes  
- Aplicación Web de Banca  
- Backup NAS Central  
- Firewall Perimetral  
- Módulo KYC  

---

## 4. Conclusión  
El sistema de auditoría desarrollado permite gestionar de manera intuitiva los riesgos de los activos evaluados, mostrando un login sencillo, un motor heurístico reproducible y un informe claro con evidencias.  

---

## 5. Exportación  
Este informe fue elaborado en formato Markdown (`README.md`) y exportado a PDF para su entrega final.  
