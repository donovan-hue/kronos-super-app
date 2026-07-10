### Informe de Tareas Pendientes y Priorización de Estabilidad

**Análisis:** Se ha procesado el `TASK_CATALOG` definido en `agents/task-master.js`. A continuación, se presenta un informe que re-prioriza dichas tareas en función de su impacto directo en la integridad y estabilidad del proyecto Kronos.

**Metodología de Priorización:**
1.  **Prioridad 1: Crítica (Integridad y Seguridad).** Tareas que corrigen vulnerabilidades o previenen ataques. Suponen un riesgo directo para el proyecto y sus usuarios.
2.  **Prioridad 2: Alta (Estabilidad y Pruebas).** Tareas que garantizan el correcto funcionamiento del sistema, previenen regresiones y aseguran la consistencia de los datos. Incluye la creación de tests y la corrección de bugs estructurales.
3.  **Prioridad 3: Media (Rendimiento y Escalabilidad).** Tareas que optimizan el uso de recursos y preparan al sistema para un crecimiento sostenido. Prevenir la degradación del servicio es una forma de mantener la estabilidad a largo plazo.
4.  **Prioridad 4: Normal (Evolución Funcional y UX).** Tareas que introducen nuevas capacidades o mejoran la experiencia del usuario. Se abordan una vez que la base del sistema es segura, estable y eficiente.

---

### **Prioridad 1: Crítica (Integridad y Seguridad)**
*Estas tareas son de ejecución inmediata para proteger la integridad del proyecto.*

*   **ID:** `api-rate-limit` (Prioridad Original: 1)
    *   **Título:** Rate limiting por endpoint sensible.
    *   **Justificación:** Protege contra ataques de fuerza bruta y abuso de API, salvaguardando la disponibilidad del servicio (Estabilidad) y las cuentas de usuario (Integridad).
*   **ID:** `sec-input-sanitize` (Prioridad Original: 1)
    *   **Título:** Sanitizar inputs con express-mongo-sanitize.
    *   **Justificación:** Previene inyecciones NoSQL, una vulnerabilidad crítica que puede comprometer la integridad de la base de datos.
*   **ID:** `sec-xss-clean` (Prioridad Original: 2)
    *   **Título:** Protección XSS con xss-clean.
    *   **Justificación:** Mitiga ataques de Cross-Site Scripting, protegiendo a los usuarios de robo de sesiones y acciones maliciosas en sus cuentas (Integridad).

### **Prioridad 2: Alta (Estabilidad y Pruebas)**
*Estas tareas garantizan el correcto funcionamiento del sistema, previenen regresiones y aseguran la consistencia de los datos.*

*   **ID:** `test-wallet-unit` (Prioridad Original: 4)
    *   **Título:** Unit tests del walletController.
    *   **Justificación:** La lógica de la billetera es crítica. Los tests unitarios garantizan que las transferencias y depósitos funcionen correctamente, previniendo errores que podrían llevar a la pérdida de fondos o inconsistencias de datos (Estabilidad, Integridad).
*   **ID:** `test-api-smoke` (Prioridad Original: 5)
    *   **Título:** Smoke tests para endpoints críticos.
    *   **Justificación:** Valida que los componentes fundamentales del sistema (auth, wallet, communities) estén operativos. Es la primera línea de defensa para detectar regresiones mayores que afecten la estabilidad.
*   **ID:** `api-pagination-cursor` (Prioridad Original: 6)
    *   **Título:** Migrar paginación de offset a cursor.
    *   **Justificación:** La paginación por offset es propensa a errores (datos duplicados/omitidos) en contenido dinámico. La migración a cursor garantiza la consistencia de los datos presentados al usuario, un pilar de la estabilidad funcional.

### **Prioridad 3: Media (Rendimiento y Escalabilidad)**
*Estas tareas optimizan el uso de recursos y preparan al sistema para el crecimiento.*

*   **ID:** `api-compress-responses` (Prioridad Original: 2)
    *   **Título:** Compresión gzip/brotli en respuestas del servidor.
    *   **Justificación:** Reduce el consumo de ancho de banda y mejora los tiempos de carga. Es una optimización de rendimiento fundamental para la escalabilidad y la estabilidad bajo carga.
*   **ID:** `perf-virtual-list` (Prioridad Original: 4)
    *   **Título:** Virtualizar lista del Feed para manejar 1000+ posts.
    *   **Justificación:** Previene la degradación del rendimiento y posibles bloqueos del cliente en feeds muy largos, impactando directamente en la estabilidad percibida por el usuario.
*   **ID:** `api-morgan-logging` (Prioridad Original: 4)
    *   **Título:** Request logging con Morgan en el servidor.
    *   **Justificación:** Un logging adecuado es indispensable para la monitorización y el diagnóstico rápido de problemas en producción, acelerando la resolución de incidentes de estabilidad.
*   **ID:** `api-search-debounce` (Prioridad Original: 7)
    *   **Título:** Debounce en búsqueda universal del cliente.
    *   **Justificación:** Evita la sobrecarga del servidor por peticiones excesivas, protegiendo la estabilidad del backend bajo uso intensivo.

### **Prioridad 4: Normal (Evolución Funcional y UX)**
*Estas tareas añaden valor al usuario y se deben abordar sobre una base estable y segura. Se listan por su prioridad original.*

*   `ui-loading-skeleton` (Prioridad Original: 1)
*   `ui-notif-in-navbar` (Prioridad Original: 1)
*   `ui-skeleton-wallet` (Prioridad Original: 1)
*   `feat-notifications-center` (Prioridad Original: 2)
*   `ui-dark-empty-states` (Prioridad Original: 2)
*   `ui-skeleton-communities` (Prioridad Original: 2)
*   `feat-follow-suggestions` (Prioridad Original: 2)
*   `ui-toast-system` (Prioridad Original: 3)
*   `feat-wallet-qr` (Prioridad Original: 3)
*   `ui-post-image-upload` (Prioridad Original: 3)
*   `feat-token-daily-reward` (Prioridad Original: 3)
*   `perf-image-lazy` (Prioridad Original: 5)
*   `feat-trending-hashtags` (Prioridad Original: 5)
*   `feat-search-history` (Prioridad Original: 6)
*   `feat-post-bookmarks` (Prioridad Original: 7)
*   `feat-story-reactions` (Prioridad Original: 8)
*   `feat-community-roles` (Prioridad Original: 9)

---
**Conclusión del Análisis:**

El plan de trabajo debe enfocarse primero en cerrar las brechas de seguridad e implementar una base sólida de pruebas. Una vez garantizada la integridad y estabilidad, el foco puede pasar a las optimizaciones de rendimiento y, finalmente, a la expansión funcional. Este enfoque asegura la continuidad y calidad del proyecto Kronos a largo plazo.
