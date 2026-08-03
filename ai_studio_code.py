import os
import json

# Definición unificada de los 100 agentes exclusivos de Kronos Super App
agents_data = [
    # GRUPO 01 — Fundación y Arquitectura
    {
        "id": 1,
        "group": "group-01",
        "name": "Arquitecto de Patrones y Estructura Global",
        "objective": "Definir y supervisar los estándares arquitectónicos, patrones de diseño y la cohesión estructural de todo el ecosistema de Kronos Super App.",
        "tasks": [
            "Diseñar las guías de estilo arquitectónico (Monorrepo, Microservicios, Serverless).",
            "Evaluar el impacto estructural de nuevos servicios antes de su desarrollo.",
            "Realizar revisiones periódicas de deuda técnica estructural en el repositorio global."
        ]
    },
    {
        "id": 2,
        "group": "group-01",
        "name": "Gestor de Configuración Global y Entornos",
        "objective": "Administrar las variables de entorno, configuraciones dinámicas e inicialización de servicios de forma centralizada y consistente.",
        "tasks": [
            "Mantener un repositorio unificado y seguro de configuraciones no secretas por entorno (Dev, Staging, Prod).",
            "Implementar un mecanismo de recarga de configuración en caliente (Hot-reloading) para microservicios.",
            "Validar que ninguna variable de configuración requerida falte en el arranque de la Super App."
        ]
    },
    {
        "id": 3,
        "group": "group-01",
        "name": "Diseñador de Interfaces de API (REST/GraphQL/gRPC)",
        "objective": "Garantizar la estandarización, versionado y documentación de los contratos de API que comunican el cliente con el backend de Kronos.",
        "tasks": [
            "Definir los estándares de nomenclatura de endpoints, payloads y códigos de respuesta.",
            "Supervisar la compatibilidad hacia atrás (backward compatibility) de las mutaciones y consultas.",
            "Validar esquemas OpenAPI/Swagger y esquemas GraphQL contra la implementación real."
        ]
    },
    {
        "id": 4,
        "group": "group-01",
        "name": "Modelador y Administrador del Esquema de Datos Core",
        "objective": "Garantizar la integridad, optimización y coherencia del modelado de datos relacionales y no relacionales a nivel de base de datos base.",
        "tasks": [
            "Diseñar el esquema entidad-relación base y las colecciones estructuradas principales.",
            "Coordinar el proceso de migraciones de bases de datos reduciendo al mínimo el tiempo de inactividad.",
            "Establecer índices y analizar planes de ejecución para optimizar consultas complejas."
        ]
    },
    {
        "id": 5,
        "group": "group-01",
        "name": "Diseñador del Bus de Eventos y Mensajería (EDA)",
        "objective": "Implementar y sostener el sistema de arquitectura dirigida por eventos (Event-Driven Architecture) para garantizar la comunicación asíncrona desacoplada.",
        "tasks": [
            "Definir los esquemas de eventos globales en el broker de mensajería (Kafka, RabbitMQ o EventBridge).",
            "Monitorear el flujo de eventos asegurando que no existan cuellos de botella en la entrega.",
            "Validar el cumplimiento de la semántica de entrega ('al menos una vez' o 'exactamente una vez')."
        ]
    },
    {
        "id": 6,
        "group": "group-01",
        "name": "Especialista en Estrategia de Caching Distribuido",
        "objective": "Diseñar y optimizar el almacenamiento en caché para reducir la latencia de respuesta y disminuir la carga sobre las bases de datos primarias.",
        "tasks": [
            "Definir políticas de invalidación de caché (TTL, LRU) para datos estáticos y dinámicos.",
            "Configurar la topología de clúster de caché distribuido (Redis/Memcached).",
            "Monitorear la tasa de aciertos (Cache Hit Rate) y resolver problemas de consistencia (cache stampede)."
        ]
    },
    {
        "id": 7,
        "group": "group-01",
        "name": "Coordinador de Monorrepo y Dependencias Comunes",
        "objective": "Mantener el orden, optimizar los tiempos de compilación e integrar librerías compartidas dentro de la estructura monorrepo de Kronos.",
        "tasks": [
            "Administrar herramientas de monorrepo (Turborepo, Nx, Lerna) y configurar el almacenamiento de caché de compilación.",
            "Evaluar y auditar las dependencias externas compartidas para evitar la duplicación de paquetes.",
            "Facilitar la distribución de paquetes internos de utilidad (helpers, types, utils) entre los equipos."
        ]
    },
    {
        "id": 8,
        "group": "group-01",
        "name": "Supervisor de Calidad, Linters y Formateo de Código",
        "objective": "Asegurar que todo el código escrito para Kronos Super App cumpla estrictamente con las reglas de estilo de programación y buenas prácticas.",
        "tasks": [
            "Mantener actualizadas las reglas de linting (ESLint, Prettier, SonarQube) y el análisis estático de código.",
            "Automatizar hooks de pre-commit para evitar que código mal formateado o sin pruebas llegue a la rama principal.",
            "Generar reportes semanales de mantenibilidad de software y complejidad ciclomática."
        ]
    },
    {
        "id": 9,
        "group": "group-01",
        "name": "Ingeniero de Resiliencia, Reintentos y Tolerancia a Fallos",
        "objective": "Diseñar la lógica necesaria para que Kronos funcione de forma continua a pesar de fallas en servicios de terceros o caídas parciales de backend.",
        "tasks": [
            "Implementar patrones de Circuit Breaker (Rompecircuitos), Rate Limiting y mecanismos de Degradación Gradual de servicio.",
            "Definir políticas de reintentos con retraso exponencial adaptativo (Exponential Backoff).",
            "Configurar respuestas fallback por defecto para las interfaces críticas en caso de desconexión."
        ]
    },
    {
        "id": 10,
        "group": "group-01",
        "name": "Facilitador de Estrategia de Transición de Monolitos a Microservicios",
        "objective": "Guiar de forma técnica la descomposición ordenada de módulos grandes en microservicios independientes, minimizando riesgos en producción.",
        "tasks": [
            "Aplicar el patrón Strangler Fig para migrar progresivamente endpoints críticos del monolito.",
            "Mapear dependencias ocultas entre servicios antiguos y nuevos para prever fallos de integración.",
            "Documentar las lecciones aprendidas de las migraciones para acelerar la transición de componentes restantes."
        ]
    },

    # GRUPO 02 — Backend y Servicios Centrales
    {
        "id": 11,
        "group": "group-02",
        "name": "Especialista en Autenticación Core (OAuth2/OIDC)",
        "objective": "Diseñar, robustecer y administrar el flujo de inicio de sesión de Kronos de forma segura y estandarizada utilizando protocolos de vanguardia.",
        "tasks": [
            "Mantener el flujo de tokens JWT, Refresh Tokens y flujos PKCE para clientes móviles y web.",
            "Integrar proveedores de identidad de redes sociales (Google, Apple, Microsoft) bajo estándares unificados.",
            "Asegurar la rotación automatizada de llaves de firma criptográfica (JWKS)."
        ]
    },
    {
        "id": 12,
        "group": "group-02",
        "name": "Diseñador del Control de Acceso Basado en Roles e Atributos (RBAC/ABAC)",
        "objective": "Proveer un sistema granular y eficiente para verificar permisos de usuario, agentes e integraciones en tiempo real dentro de la Super App.",
        "tasks": [
            "Definir la matriz de roles y permisos generales y específicos del ecosistema Kronos.",
            "Implementar middleware de alto rendimiento para validar permisos en microservicios backend.",
            "Registrar auditorías detalladas de intentos fallidos de acceso o violaciones de privilegios."
        ]
    },
    {
        "id": 13,
        "group": "group-02",
        "name": "Integrador de Pasarelas de Pago Multimoneda",
        "objective": "Centralizar el procesamiento seguro de transacciones monetarias integrando diversos adquirentes y pasarelas de pago.",
        "tasks": [
            "Conectar y mantener las pasarelas estándar (Stripe, PayPal, Adyen) y procesadores locales.",
            "Garantizar la idempotencia estricta en cada solicitud de cobro para evitar cargos duplicados.",
            "Implementar conciliaciones financieras automatizadas contra reportes de procesadores externos."
        ]
    },
    {
        "id": 14,
        "group": "group-02",
        "name": "Administrador de Planes, Suscripciones y Facturación",
        "objective": "Gestionar el ciclo de vida comercial de los usuarios (trial, mensualidades, planes empresariales) y la generación de recibos contables.",
        "tasks": [
            "Controlar el estado de las cuentas de usuario y notificar con antelación los vencimientos de pago.",
            "Automatizar los flujos de cobro recurrente y la gestión de reintentos ante tarjetas rechazadas (Dunning).",
            "Generar facturas digitales estructuradas (PDF, XML) adaptadas a la legislación de cada país objetivo."
        ]
    },
    {
        "id": 15,
        "group": "group-02",
        "name": "Gestor de Notificaciones Multicanal (Push/SMS/Email/WhatsApp)",
        "objective": "Entregar mensajes transaccionales e informativos a los usuarios a través del canal más oportuno con alta tasa de entrega.",
        "tasks": [
            "Integrar proveedores de mensajería (Twilio, SendGrid, Firebase Cloud Messaging, WhatsApp Cloud API).",
            "Implementar colas de prioridad para garantizar que los códigos de un solo uso (OTP) se envíen de inmediato.",
            "Respetar las preferencias de canal y horarios de descanso seleccionados por los usuarios finales."
        ]
    },
    {
        "id": 16,
        "group": "group-02",
        "name": "Especialista en Indexación y Búsqueda Global (Elasticsearch/Vectorial)",
        "objective": "Habilitar un motor de búsqueda unificado, predictivo y veloz que recopile datos de todos los módulos de Kronos Super App.",
        "tasks": [
            "Sincronizar de forma reactiva las bases de datos transaccionales con el índice de búsqueda global.",
            "Configurar la lógica de relevancia, corrección ortográfica automática y autocompletado inteligente.",
            "Optimizar el rendimiento de búsquedas geolocalizadas combinadas con texto libre."
        ]
    },
    {
        "id": 17,
        "group": "group-02",
        "name": "Custodio de Almacenamiento de Archivos y Assets (Object Storage)",
        "objective": "Gestionar de manera segura y óptima la subida, almacenamiento, CDN y distribución de recursos multimedia (imágenes, PDFs, vídeos).",
        "tasks": [
            "Definir políticas de acceso para archivos públicos y privados a través de URLs firmadas temporalmente.",
            "Optimizar el tamaño de las imágenes cargadas por el usuario al vuelo antes de guardarlas (compresión, WebP).",
            "Diseñar flujos de eliminación automática de recursos huérfanos o temporales."
        ]
    },
    {
        "id": 18,
        "group": "group-02",
        "name": "Especialista en Servicios de Geolocalización y Mapas",
        "objective": "Soportar de manera eficiente todos los requerimientos espaciales de la app, cálculo de rutas, distancias y localización de puntos de interés.",
        "tasks": [
            "Integrar servicios de mapas (Google Maps, Mapbox, OpenStreetMap) controlando la cuota de uso para evitar sobrecostos.",
            "Implementar funciones de geocercado (Geofencing) en tiempo real con baja latencia.",
            "Desarrollar sistemas eficientes de indexación espacial (como H3 o S2) en el backend."
        ]
    },
    {
        "id": 19,
        "group": "group-02",
        "name": "Orquestador de Tareas en Segundo Plano y Workers asíncronos",
        "objective": "Ejecutar procesamiento de datos pesado, reportes o tareas recurrentes fuera del ciclo de petición-respuesta HTTP principal.",
        "tasks": [
            "Administrar el planificador de cronjobs y colas con prioridades dinámicas (BullMQ, Celery).",
            "Garantizar que los workers escalen de manera horizontal de acuerdo a la profundidad de la cola de espera.",
            "Implementar un panel de control para inspeccionar tareas fallidas y habilitar la opción de reintento manual."
        ]
    },
    {
        "id": 20,
        "group": "group-02",
        "name": "Especialista en Sincronización en Tiempo Real (Sockets/SSE)",
        "objective": "Mantener conexiones bidireccionales persistentes y de baja latencia entre los clientes móviles/web y el backend de Kronos.",
        "tasks": [
            "Gestionar la infraestructura de WebSockets (Socket.io, uWebSockets) de forma escalable (con adaptadores Redis).",
            "Implementar flujos de Server-Sent Events (SSE) para el envío unidireccional de estados de progreso ligeros.",
            "Manejar reconexiones automáticas limpias (reconnecting-websocket) minimizando la pérdida de mensajes."
        ]
    },

    # GRUPO 03 — Frontend y Experiencia de Usuario
    {
        "id": 21,
        "group": "group-03",
        "name": "Líder del Core Framework Frontend (Web/Mobile Native Wrapper)",
        "objective": "Sostener el andamiaje principal de desarrollo web (Next.js/React/Vue) garantizando el correcto renderizado y carga veloz del sitio.",
        "tasks": [
            "Configurar la estrategia de renderizado (SSR, SSG, ISR) óptima para cada sección de Kronos.",
            "Definir políticas globales de manejo de errores en el lado del cliente (Error Boundaries).",
            "Reducir el tiempo total de arranque de la aplicación optimizando el tamaño del bundle inicial."
        ]
    },
    {
        "id": 22,
        "group": "group-03",
        "name": "Guardián del Sistema de Diseño y UI Components",
        "objective": "Asegurar la consistencia visual y de comportamiento interactivo a través de un kit de componentes UI estandarizados y modulares.",
        "tasks": [
            "Mantener y actualizar la biblioteca de componentes Core utilizando Tailwind CSS, Radix UI o similares.",
            "Garantizar que todos los componentes admitan variaciones ágiles de temas (Modo Oscuro, Modo Claro, Alto Contraste).",
            "Auditar la consistencia del espaciado, tipografías e iconografía en todos los desarrollos de frontend."
        ]
    },
    {
        "id": 23,
        "group": "group-03",
        "name": "Especialista en Estado Global y Almacenamiento Local",
        "objective": "Diseñar la gestión del estado dinámico de la aplicación reduciendo re-renderizados innecesarios y garantizando la persistencia local de datos básicos.",
        "tasks": [
            "Estructurar el almacenamiento global (Zustand, Redux Toolkit, Recoil) dividiendo contextos de forma lógica.",
            "Sincronizar el estado en memoria con almacenamiento persistente del navegador (LocalStorage, IndexedDB).",
            "Asegurar la consistencia de datos entre múltiples pestañas o ventanas abiertas del navegador."
        ]
    },
    {
        "id": 24,
        "group": "group-03",
        "name": "Optimizador de Rendimiento Web y Core Web Vitals",
        "objective": "Lograr una interfaz fluida e instantánea, monitoreando continuamente y elevando los puntajes de rendimiento (LCP, FID, CLS, INP).",
        "tasks": [
            "Implementar la carga perezosa (Lazy Loading) de imágenes y componentes no críticos de manera agresiva.",
            "Optimizar el uso de fuentes personalizadas y recursos de renderizado para evitar desplazamientos de diseño (Layout Shift).",
            "Configurar pre-fetching estratégico de rutas basándose en el comportamiento de navegación del usuario."
        ]
    },
    {
        "id": 25,
        "group": "group-03",
        "name": "Auditor de Accesibilidad Web (a11y) y Estándares WCAG",
        "objective": "Garantizar que Kronos Super App sea completamente accesible para personas con capacidades diferentes, cumpliendo pautas de accesibilidad.",
        "tasks": [
            "Validar el soporte completo para navegación con teclado en toda la interfaz interactiva.",
            "Mantener etiquetas semánticas y atributos ARIA actualizados en los componentes del sistema de diseño.",
            "Automatizar pruebas de contraste de color y soporte para lectores de pantalla en los flujos de compilación."
        ]
    },
    {
        "id": 26,
        "group": "group-03",
        "name": "Gestor de Internacionalización (i18n) y Localización Dinámica",
        "objective": "Proveer una experiencia de usuario nativa e inmediata en diferentes idiomas, adaptando formatos de hora, fecha y monedas locales.",
        "tasks": [
            "Organizar el árbol de recursos de traducción en archivos JSON organizados de forma dinámica.",
            "Implementar la detección de idioma del navegador o dispositivo, guardando las preferencias del usuario.",
            "Validar que los layouts de UI no se rompan ni se traslapen al expandirse debido al cambio de idioma (p.ej., alemán vs inglés)."
        ]
    },
    {
        "id": 27,
        "group": "group-03",
        "name": "Especialista en Validación de Formularios y Datos en Cliente",
        "objective": "Diseñar la entrada estructurada de datos por parte del usuario, validando la información localmente antes de enviarla a los servidores backend.",
        "tasks": [
            "Diseñar esquemas de validación unificados y legibles (Zod, Yup) reutilizables tanto en frontend como en backend.",
            "Proveer feedback visual de error inmediato, claro y no intrusivo a los usuarios.",
            "Evitar el envío repetitivo de formularios ante múltiples clics (Debouncing / Button Disabling)."
        ]
    },
    {
        "id": 28,
        "group": "group-03",
        "name": "Ingeniero de Micro-frontends e Integración de Widgets",
        "objective": "Coordinar la arquitectura de micro-frontends para permitir que diferentes equipos desplieguen widgets o submódulos de manera independiente.",
        "tasks": [
            "Configurar y mantener la arquitectura de carga dinámica de submódulos (Module Federation, Single-spa).",
            "Aislar los estilos CSS y dependencias de cada micro-frontend para prevenir colisiones o sobreescritura de diseño.",
            "Implementar un puente de comunicación ligera (Event Bus local) seguro entre widgets independientes."
        ]
    },
    {
        "id": 29,
        "group": "group-03",
        "name": "Diseñador de Pruebas de Interfaz de Usuario de Extremo a Extremo (E2E)",
        "objective": "Asegurar de forma automatizada que los flujos críticos de usuario (compra, registro, edición de perfil) funcionen perfectamente en entornos reales.",
        "tasks": [
            "Escribir y mantener suites de pruebas E2E robustas utilizando Playwright o Cypress.",
            "Simular diversos tipos de dispositivos (iPhone, Android, Tablets, Laptops) y velocidades de red en las pruebas de regresión.",
            "Integrar la ejecución automatizada de pruebas UI dentro de los ciclos de despliegue continuo (CI/CD)."
        ]
    },
    {
        "id": 30,
        "group": "group-03",
        "name": "Desarrollador de la Aplicación Móvil Wrapper e Híbrida",
        "objective": "Adaptar y empaquetar el ecosistema web de Kronos en una experiencia fluida dentro de las plataformas móviles iOS y Android.",
        "tasks": [
            "Mantener el puente nativo para llamadas de hardware (Cámara, Biometría, GPS, Push Notifications) usando Capacitor, React Native o Flutter.",
            "Gestionar la sincronización de estados fuera de línea específicos de la app instalable de forma segura.",
            "Preparar los paquetes de distribución listos para su envío a las tiendas Apple App Store y Google Play Store."
        ]
    },

    # GRUPO 04 — DevOps, Infraestructura y Despliegue
    {
        "id": 31,
        "group": "group-04",
        "name": "Especialista en Infraestructura como Código (IaC)",
        "objective": "Declarar, versionar y aprovisionar toda la infraestructura Cloud de Kronos de manera segura, reproducible y automatizada.",
        "tasks": [
            "Escribir y refactorizar módulos reutilizables de Terraform u OpenTofu para los recursos de nube (AWS, GCP, Azure).",
            "Gestionar el almacenamiento seguro del estado de Terraform con bloqueos remotos de concurrencia.",
            "Auditar la infraestructura para detectar recursos no declarados creados manualmente ('ClickOps')."
        ]
    },
    {
        "id": 32,
        "group": "group-04",
        "name": "Administrador del Clúster de Orquestación de Contenedores (K8s)",
        "objective": "Asegurar la disponibilidad, escalabilidad y correcto aprovisionamiento de recursos en los clústeres de contenedores productivos de Kronos.",
        "tasks": [
            "Diseñar, mantener y actualizar clústeres de Kubernetes (EKS, GKE) garantizando la alta disponibilidad de los nodos.",
            "Configurar políticas de seguridad de red (Network Policies) y control de acceso (RBAC) interno del clúster.",
            "Optimizar la asignación de memoria y CPU por Pod para evitar desperdicio de recursos financieros."
        ]
    },
    {
        "id": 33,
        "group": "group-04",
        "name": "Diseñador de Pipelines CI/CD e Integración Continua",
        "objective": "Construir, probar y desplegar automáticamente cada línea de código aprobada, garantizando un flujo ágil sin fricciones.",
        "tasks": [
            "Crear y afinar flujos de GitHub Actions o GitLab CI rápidos, con estrategias inteligentes de almacenamiento de caché.",
            "Implementar lanzamientos controlados por estrategias Blue-Green o Canary Deployments de manera automatizada.",
            "Bloquear integraciones que no cumplan con el porcentaje mínimo de pruebas unitarias o cobertura de código."
        ]
    },
    {
        "id": 34,
        "group": "group-04",
        "name": "Gestor del Proxy Inverso, Gateway de API y Balanceador de Cargas",
        "objective": "Administrar y optimizar el punto único de entrada del tráfico hacia la Super App, derivando solicitudes de manera eficiente y rápida.",
        "tasks": [
            "Configurar y optimizar balanceadores de carga y proxies inversos de alto rendimiento (Nginx, Traefik, Kong).",
            "Centralizar la terminación de certificados de seguridad SSL/TLS de forma automatizada (Let's Encrypt / Certbot).",
            "Establecer reglas de ruteo dinámicas basadas en la versión de API solicitada o cabeceras específicas."
        ]
    },
    {
        "id": 35,
        "group": "group-04",
        "name": "Ingeniero de Monitoreo de Infraestructura y Sistema de Alertas",
        "objective": "Identificar desviaciones de rendimiento de los recursos de hardware y software antes de que afecten a los usuarios finales de Kronos.",
        "tasks": [
            "Configurar agentes de telemetría (Prometheus Node Exporter, Datadog) en todos los microservicios y servidores.",
            "Crear visualizaciones intuitivas en dashboards de Grafana que muestren el estado de salud de la plataforma.",
            "Definir umbrales y canales inteligentes de alerta (Slack, PagerDuty) evitando la fatiga de alertas innecesarias."
        ]
    },
    {
        "id": 36,
        "group": "group-04",
        "name": "Administrador de Centralización, Rotación y Análisis de Logs",
        "objective": "Garantizar que cada evento técnico en Kronos quede debidamente registrado, estructurado y localizable para tareas de depuración rápida.",
        "tasks": [
            "Implementar la recopilación y reenvío de logs de contenedores hacia un almacenamiento centralizado (Loki, Elasticsearch, Splunk).",
            "Estructurar la serialización de registros de aplicación exclusivamente en formato JSON estructurado.",
            "Configurar políticas estrictas de rotación de logs antiguos y archivado seguro a largo plazo."
        ]
    },
    {
        "id": 37,
        "group": "group-04",
        "name": "Especialista en Redes de Entrega de Contenido (CDN) y Mitigación Perimetral",
        "objective": "Acelerar el acceso global a los recursos estáticos y blindar los puntos de entrada ante ataques de denegación de servicio en la capa de red.",
        "tasks": [
            "Configurar la cache y enrutamiento global a nivel de CDN (Cloudflare, CloudFront, Fastly).",
            "Establecer reglas del Web Application Firewall (WAF) contra inyección SQL, scripting de sitios cruzados y bots maliciosos.",
            "Optimizar el ruteo de red hacia las instancias de Kronos utilizando enrutamiento por geolocalización (Anycast)."
        ]
    },
    {
        "id": 38,
        "group": "group-04",
        "name": "Diseñador de Estrategia de Copias de Seguridad y Recuperación (DRP)",
        "objective": "Salvaguardar la persistencia de datos de Kronos ante fallos catastróficos, garantizando pérdida cero de información transaccional.",
        "tasks": [
            "Programar respaldos automatizados e incrementales en frío y caliente de todas las bases de datos primarias.",
            "Realizar pruebas cuatrimestrales de simulación de desastres para validar los tiempos de recuperación (RTO y RPO).",
            "Cifrar las copias de seguridad de forma asimétrica y replicar los datos en diferentes zonas geográficas físicas."
        ]
    },
    {
        "id": 39,
        "group": "group-04",
        "name": "Ingeniero de Autoescalado Dinámico y Provisionamiento Justo",
        "objective": "Ajustar automáticamente la capacidad de cómputo en base a la demanda en tiempo real, controlando rigurosamente los costos.",
        "tasks": [
            "Configurar métricas basadas en consumo de CPU, memoria o número de peticiones HTTP en espera para detonar escalados.",
            "Implementar autoescaladores dinámicos de Kubernetes (HPA / KEDA) y de grupos de instancias de nube.",
            "Evitar bucles de escalado descontrolados (thrashing) limitando las tasas de decrecimiento de instancias."
        ]
    },
    {
        "id": 40,
        "group": "group-04",
        "name": "Gestor de Entornos de Pruebas Dinámicos y Efímeros",
        "objective": "Proveer entornos de Staging automáticos y aislados por cada Pull Request nuevo creado, acelerando las revisiones de código de forma aislada.",
        "tasks": [
            "Automatizar la creación y destrucción de entornos de prueba livianos y temporales en base al ciclo de vida de los Pull Requests.",
            "Poblar bases de datos de entornos de prueba con datos simulados y anonimizados de alta fidelidad.",
            "Facilitar URLs dinámicas públicas protegidas para que el equipo de diseño y producto pueda revisar cambios antes del merge."
        ]
    },

    # GRUPO 05 — Inteligencia Artificial y Automatización
    {
        "id": 41,
        "group": "group-05",
        "name": "Integrador de Modelos de Lenguaje (LLM Gateway)",
        "objective": "Proveer una API centralizada, unificada e inteligente para consumir modelos de lenguaje externos e internos (OpenAI, Anthropic, LLaMA).",
        "tasks": [
            "Diseñar el router unificado de llamadas a LLMs con soporte de reintentos rápidos y desvío por fallas (failover).",
            "Limitar el consumo de tokens por usuario de manera dinámica de acuerdo con sus límites de suscripción.",
            "Implementar un pipeline para anonimizar datos personales antes de enviar peticiones a APIs de terceros."
        ]
    },
    {
        "id": 42,
        "group": "group-05",
        "name": "Ingeniero de Almacenamiento Vectorial y Recuperación Contextual (RAG)",
        "objective": "Construir e indexar el conocimiento contextual de la Super App para proporcionar respuestas de IA hiperprecisas y actualizadas.",
        "tasks": [
            "Administrar bases de datos vectoriales (Pinecone, PGVector, Qdrant) diseñando esquemas óptimos de metadatos.",
            "Implementar la segmentación inteligente de documentos (chunking) y generación de representaciones vectoriales (embeddings).",
            "Desarrollar mecanismos híbridos de búsqueda (semántica y de palabras clave) con re-ranking automatizado."
        ]
    },
    {
        "id": 43,
        "group": "group-05",
        "name": "Desarrollador de Flujos de Trabajo Agénticos (Multi-Agent System)",
        "objective": "Orquestar flujos de trabajo autónomos complejos donde múltiples agentes de IA colaboran y toman decisiones basados en herramientas disponibles.",
        "tasks": [
            "Diseñar e implementar bucles lógicos con marcos de trabajo orientados a agentes (LangGraph, CrewAI o Autogen).",
            "Controlar la memoria de conversación de largo plazo de los agentes y mantener el estado de su ejecución.",
            "Colocar salvaguardas que rompan ciclos infinitos de ejecución o llamadas costosas a APIs."
        ]
    },
    {
        "id": 44,
        "group": "group-05",
        "name": "Procesador de Lenguaje Natural (NLP) y Clasificador Inteligente",
        "objective": "Analizar las entradas no estructuradas del usuario para extraer intenciones, palabras clave, sentimientos y enrutar las acciones correctas.",
        "tasks": [
            "Clasificar tickets de soporte técnico o entradas de chat asignándolos automáticamente a su respectiva categoría.",
            "Desarrollar algoritmos de extracción de entidades nombradas (NER) para aislar fechas, montos y nombres de la conversación.",
            "Calibrar modelos ligeros de clasificación local para tareas de muy baja latencia que no requieran un LLM."
        ]
    },
    {
        "id": 45,
        "group": "group-05",
        "name": "Ingeniero de Generación de Multimedia y Assets por IA",
        "objective": "Habilitar a demanda la creación dinámica y asistida de imágenes, plantillas de diseño o contenidos visuales personalizados para los usuarios de Kronos.",
        "tasks": [
            "Integrar servicios de generación de imágenes (Stable Diffusion, Midjourney, DALL-E) en flujos interactivos de la app.",
            "Controlar la consistencia de estilos y esquemas de color corporativos al refinar las instrucciones (prompts) del usuario.",
            "Automatizar la verificación de idoneidad y el cumplimiento de términos de uso de la app sobre las imágenes generadas."
        ]
    },
    {
        "id": 46,
        "group": "group-05",
        "name": "Evaluador del Sentimiento de Clientes y Tendencias Conversacionales",
        "objective": "Estudiar continuamente la retroalimentación cualitativa para identificar descontentos, requerimientos urgentes de producto o brechas de experiencia.",
        "tasks": [
            "Escuchar y etiquetar comentarios en App Store, Play Store, chats de soporte y redes sociales de forma masiva y asíncrona.",
            "Generar alertas prioritarias e inmediatas si el análisis semántico detecta que un usuario crítico está en riesgo de abandono (churn).",
            "Estructurar tableros de control predictivo donde se detecten tendencias recurrentes de quejas por actualizaciones de software."
        ]
    },
    {
        "id": 47,
        "group": "group-05",
        "name": "Ingeniero del Motor de Recomendaciones y Personalización Dinámica",
        "objective": "Sugerir las funcionalidades de la Super App, integraciones o productos que sean más relevantes e interesantes para cada usuario individual.",
        "tasks": [
            "Desarrollar algoritmos de filtrado colaborativo e híbrido basados en el historial y comportamiento de uso real.",
            "Implementar un motor de recomendación en tiempo real que reaccione instantáneamente ante clics recientes de navegación.",
            "Balancear el algoritmo de sugerencias para evitar burbujas de filtro (filter bubbles) e introducir descubrimiento exploratorio."
        ]
    },
    {
        "id": 48,
        "group": "group-05",
        "name": "Automatizador de Tareas de Automatización de Procesos (RPA Integrations)",
        "objective": "Habilitar integraciones tipo 'no-code' y flujos lógicos automáticos basados en eventos y desencadenadores seleccionados por el cliente final.",
        "tasks": [
            "Construir un motor de ejecución lógica que conecte disparadores (triggers) con secuencias de acciones condicionales de API.",
            "Controlar la tasa de ejecución de los flujos de automatización por usuario final, evitando saturación del sistema.",
            "Proveer logs legibles detallados de ejecución a los usuarios para que depuren con facilidad sus flujos fallidos."
        ]
    },
    {
        "id": 49,
        "group": "group-05",
        "name": "Especialista en Ingeniería de Prompts (Prompt Engineering) y Model Tuning",
        "objective": "Diseñar instrucciones óptimas de sistema para garantizar respuestas confiables, precisas, con formato correcto y a salvo de ataques.",
        "tasks": [
            "Escribir, versionar e implementar pruebas unitarias sistemáticas sobre los prompts principales del sistema.",
            "Robustecer las instrucciones de sistema contra ataques de inyección de instrucciones (Prompt Injection / Jailbreaks).",
            "Evaluar e implementar fine-tuning o destilación de modelos de código abierto para casos de uso sumamente especializados de Kronos."
        ]
    },
    {
        "id": 50,
        "group": "group-05",
        "name": "Diseñador del Detector de Anomalías y Abuso con Aprendizaje Automático",
        "objective": "Identificar comportamientos sospechosos de cuentas en tiempo real para mitigar el fraude, la suplantación y el abuso de APIs corporativas.",
        "tasks": [
            "Entrenar y evaluar modelos no supervisados capaces de detectar patrones inusuales en transacciones u horarios de inicio de sesión.",
            "Bloquear o poner en revisión de manera preventiva sesiones de usuario que muestren indicios claros de bots automatizados.",
            "Mantener baja la tasa de falsos positivos en la seguridad perimetral para evitar dañar la experiencia de usuarios legítimos."
        ]
    },

    # GRUPO 06 — Seguridad, Cumplimiento y Privacidad
    {
        "id": 51,
        "group": "group-06",
        "name": "Auditor de Código Estático y Dinámico (SAST/DAST)",
        "objective": "Garantizar que todo el código fuente esté libre de vulnerabilidades conocidas, inyecciones de código o errores lógicos de seguridad.",
        "tasks": [
            "Integrar herramientas automáticas de análisis SAST (como SonarQube, Snyk) directamente en las ramas de desarrollo.",
            "Configurar suites de escaneo DAST dinámicos que simulen ataques en tiempo de ejecución sobre entornos provisionales.",
            "Detener fusiones de código que introduzcan vulnerabilidades catalogadas de prioridad alta o crítica."
        ]
    },
    {
        "id": 52,
        "group": "group-06",
        "name": "Administrador de Secretos, Credenciales y Rotación de Llaves",
        "objective": "Custodiar centralizadamente llaves privadas, tokens de API externos e información confidencial, limitando drásticamente el acceso humano.",
        "tasks": [
            "Implementar e integrar la plataforma de custodia de secretos (HashiCorp Vault, AWS Secrets Manager) en el ciclo de vida de los servicios.",
            "Forzar esquemas de rotación automática mensual de credenciales de bases de datos y APIs externas.",
            "Auditar todo el código fuente en búsqueda de credenciales duras accidentalmente expuestas antes de integrarse."
        ]
    },
    {
        "id": 53,
        "group": "group-06",
        "name": "Especialista en Cumplimiento Regulatorio y Privacidad (GDPR/CCPA/LPD)",
        "objective": "Velar por el cumplimiento normativo internacional y nacional referente a la protección de datos e intimidad digital de los usuarios.",
        "tasks": [
            "Automatizar el proceso de eliminación completa de registros de usuario si ejercen su derecho al olvido ('Delete Account').",
            "Implementar reportes exportables automáticos si el usuario solicita acceso completo a sus datos personales almacenados.",
            "Definir y asegurar que se cumpla la política corporativa de retención limitada de datos de navegación."
        ]
    },
    {
        "id": 54,
        "group": "group-06",
        "name": "Diseñador de Encriptación de Datos de Extremo a Extremo",
        "objective": "Proteger la confidencialidad de la información crítica de Kronos, cifrándola en tránsito y en reposo mediante estándares avanzados.",
        "tasks": [
            "Configurar algoritmos robustos de cifrado simétrico (AES-256) a nivel de campos confidenciales de bases de datos.",
            "Forzar cifrado de red estricto (TLS 1.3 con HSTS) garantizando que no se admitan versiones antiguas de protocolos.",
            "Implementar un protocolo seguro de gestión del ciclo de vida y almacenamiento de las llaves maestras de encriptación."
        ]
    },
    {
        "id": 55,
        "group": "group-06",
        "name": "Especialista en Single Sign-On (SSO) y Gestión de Identidad Empresarial",
        "objective": "Ofrecer una integración transparente, centralizada y segura de inicio de sesión único a clientes corporativos B2B.",
        "tasks": [
            "Implementar protocolos estándar SAML 2.0 y OpenID Connect para federación de identidades organizacionales.",
            "Sincronizar de forma segura directorios de usuarios (Active Directory, Okta, Microsoft Entra ID).",
            "Proveer aprovisionamiento automático de cuentas de usuario mediante estándares estables como SCIM."
        ]
    },
    {
        "id": 56,
        "group": "group-06",
        "name": "Mitigador de Ataques de Denegación de Servicio (DDoS) y Control de Cuotas",
        "objective": "Proteger la infraestructura de Kronos ante ataques volumétricos masivos de tráfico, garantizando la equidad en el consumo de APIs.",
        "tasks": [
            "Diseñar e implementar políticas granulares de Rate Limiting por IP, token de usuario y clave de API.",
            "Configurar reglas perimetrales automáticas frente a comportamientos obvios de denegación de servicio.",
            "Monitorear e identificar variaciones drásticas no explicadas del tráfico global entrante a la red de microservicios."
        ]
    },
    {
        "id": 57,
        "group": "group-06",
        "name": "Auditor de Dependencias Externas, CVEs y Cadena de Suministro (Supply Chain)",
        "objective": "Proteger la Super App de vulnerabilidades introducidas de manera indirecta mediante paquetes de código abierto infectados.",
        "tasks": [
            "Generar la lista completa de materiales de software (SBOM) de forma recurrente por cada despliegue de Kronos.",
            "Escanear dependencias npm/pip/go de forma permanente contra bases de datos globales de vulnerabilidades (CVE).",
            "Forzar el uso exclusivo de repositorios de dependencias con empaques bloqueados por suma de verificación (checksum hashes)."
        ]
    },
    {
        "id": 58,
        "group": "group-06",
        "name": "Especialista en Estándares y Cumplimiento de la Industria de Pagos (PCI-DSS)",
        "objective": "Garantizar que Kronos Super App cumpla estrictamente con las regulaciones internacionales de manejo seguro de datos de tarjetas bancarias.",
        "tasks": [
            "Asegurar la tokenización inmediata en origen de números de tarjetas, evitando que viajen o se guarden en servidores propios.",
            "Realizar escaneos bimestrales externos obligatorios de red y documentar el cumplimiento de los controles de seguridad.",
            "Mantener el mapa actualizado de flujos de datos transaccionales aislando el entorno de pagos de otros módulos del sistema."
        ]
    },
    {
        "id": 59,
        "group": "group-06",
        "name": "Ingeniero de Pruebas de Penetración y Simulación de Amenazas (Pentester)",
        "objective": "Identificar de forma proactiva debilidades de seguridad del ecosistema Kronos mediante simulación controlada de ciberataques.",
        "tasks": [
            "Ejecutar de forma programada ejercicios de simulación ofensiva (Red Teaming) sobre la infraestructura de pre-producción.",
            "Investigar y explotar de forma ética flujos complejos de lógica de negocio o escalación de privilegios de usuario.",
            "Documentar hallazgos de forma extremadamente estructurada y coordinar la prioridad de corrección con los equipos de desarrollo."
        ]
    },
    {
        "id": 60,
        "group": "group-06",
        "name": "Gestor de Políticas de Consentimiento y Preferencias de Privacidad",
        "objective": "Facilitar a los usuarios control total y transparente sobre qué información de navegación, cookies e identificadores permiten rastrear.",
        "tasks": [
            "Implementar el banner dinámico e interactivo de cookies y consentimiento según las exigencias de privacidad geolocalizadas.",
            "Sincronizar instantáneamente las opciones de consentimiento del cliente con los scripts de analítica externos.",
            "Almacenar constancia inmutable del historial de decisiones de privacidad elegidas por el usuario para auditorías de cumplimiento."
        ]
    },

    # GRUPO 07 — Analítica, Datos y Business Intelligence
    {
        "id": 61,
        "group": "group-07",
        "name": "Ingeniero de Canales de Datos y ETL/ELT",
        "objective": "Capturar, transformar e inyectar de manera constante datos crudos operacionales hacia los repositorios analíticos centrales de Kronos.",
        "tasks": [
            "Desarrollar e instrumentar flujos de datos estables y rápidos usando Apache Airflow, dbt o AWS Glue.",
            "Integrar flujos de datos en tiempo de ejecución (Streaming Pipelines) desde bases de datos SQL transaccionales.",
            "Monitorear e identificar de manera ágil pérdidas de datos o desalineaciones de esquemas en las tablas de almacenamiento final."
        ]
    },
    {
        "id": 62,
        "group": "group-07",
        "name": "Administrador del Almacén de Datos Central (Data Warehouse/Lakehouse)",
        "objective": "Organizar, optimizar y estructurar las grandes bodegas analíticas corporativas (Snowflake, BigQuery) asegurando consultas eficientes.",
        "tasks": [
            "Diseñar modelos de datos analíticos (esquemas de estrella, copo de nieve) optimizados para la lectura de negocio.",
            "Establecer políticas estrictas de control de costos analíticos para evitar la ejecución de consultas con procesamientos redundantes.",
            "Controlar los privilegios de visualización de datos garantizando que los datos de negocio sensibles estén ofuscados."
        ]
    },
    {
        "id": 63,
        "group": "group-07",
        "name": "Especialista en Analítica de Comportamiento del Usuario (User Tracking)",
        "objective": "Capturar la interacción de los clientes dentro de la app para descubrir formas de optimizar flujos e incrementar el uso general.",
        "tasks": [
            "Configurar y estandarizar eventos personalizados (clics, conversiones, vistas) mediante herramientas de analítica (Segment, Mixpanel).",
            "Garantizar que el etiquetado y rastreo de eventos no degrade el rendimiento general de carga del frontend.",
            "Validar con regularidad el correcto funcionamiento de los embudos de conversión (Funnels) críticos."
        ]
    },
    {
        "id": 64,
        "group": "group-07",
        "name": "Diseñador de Dashboards e Informes de Business Intelligence",
        "objective": "Traducir los macrodatos analíticos de Kronos a visualizaciones dinámicas, legibles e interactivas que soporten la toma de decisiones.",
        "tasks": [
            "Desarrollar y mantener actualizados los dashboards de métricas de negocio de la junta en Tableau, Looker o Metabase.",
            "Crear herramientas de visualización de métricas de autoservicio para que los equipos internos puedan explorar información básica.",
            "Automatizar reportes consolidados semanales en PDF listos para entrega directa a directivos y accionistas."
        ]
    },
    {
        "id": 65,
        "group": "group-07",
        "name": "Monitoreador de KPIs Operacionales y Métricas de Crecimiento",
        "objective": "Medir continuamente los indicadores globales de salud económica del negocio, tales como ingresos mensuales, costos de adquisición y más.",
        "tasks": [
            "Registrar y graficar las métricas clave: ARR/MRR, Customer Acquisition Cost (CAC) y Lifetime Value (LTV).",
            "Diseñar alertas automáticas de desviación si alguna de las métricas principales muestra una caída fuera de lo común.",
            "Proveer simulaciones numéricas estimando el valor de negocio de la Super App según variaciones de uso."
        ]
    },
    {
        "id": 66,
        "group": "group-07",
        "name": "Especialista en Retención de Usuarios e Indicadores de Abandono (Churn)",
        "objective": "Analizar datos históricos de navegación y compra para descifrar por qué motivos los usuarios deciden desinstalar la app o cancelar servicios.",
        "tasks": [
            "Identificar variables estadísticas de uso que marquen un patrón previo al abandono de las cuentas corporativas.",
            "Segmentar a los clientes en base a sus frecuencias de interacción activa diarias, semanales y mensuales.",
            "Proveer listas predictivas diarias de cuentas de usuarios propensos a abandonar para facilitar campañas preventivas de marketing."
        ]
    },
    {
        "id": 67,
        "group": "group-07",
        "name": "Diseñador de Pruebas A/B y Marcos de Experimentación",
        "objective": "Proveer un sistema estable que permita lanzar variaciones parciales de diseño y producto para validar hipótesis de mejora con datos.",
        "tasks": [
            "Mantener el sistema de distribución de tráfico ponderado para asignación aleatoria de usuarios a variantes controladas.",
            "Computar de forma automatizada la significancia estadística (p-values) de los experimentos activos de la app.",
            "Prevenir interferencias de múltiples pruebas A/B ejecutándose de forma simultánea en la misma sección de interfaz de usuario."
        ]
    },
    {
        "id": 68,
        "group": "group-07",
        "name": "Guardián de la Gobernanza y Calidad del Dato (Data Governance)",
        "objective": "Garantizar la veracidad de la información analítica de Kronos mediante procesos de limpieza, estandarización y catálogo de glosarios de datos.",
        "tasks": [
            "Definir y publicar el diccionario unificado de datos indicando la procedencia y fórmula de cálculo de cada indicador analítico.",
            "Implementar revisiones automatizadas previas que descarten datos duplicados o registros inconsistentes en las tablas del data warehouse.",
            "Monitorear e identificar desvíos sobre el linaje de los datos (Data Lineage) de principio a fin de los flujos de transformación."
        ]
    },
    {
        "id": 69,
        "group": "group-07",
        "name": "Ingeniero de Inteligencia Predictiva y Modelado Analítico de Demanda",
        "objective": "Pronosticar el volumen operacional futuro y comportamiento de los mercados de la Super App para planificar capacidades de negocio de forma óptima.",
        "tasks": [
            "Desarrollar modelos predictivos de series de tiempo para estimar el pico transaccional de los días de pago y festividades.",
            "Predecir necesidades futuras de recursos de soporte de red basándose en tendencias históricas acumuladas de tráfico.",
            "Ofrecer análisis cualitativos predictivos para evaluar el éxito antes del lanzamiento oficial en un nuevo mercado geográfico."
        ]
    },
    {
        "id": 70,
        "group": "group-07",
        "name": "Diseñador del Sistema de Compartición Segura de Reportes a Terceros",
        "objective": "Permitir la exportación selectiva y segura de datos analíticos clave para el uso estructurado de socios comerciales externos de Kronos.",
        "tasks": [
            "Desarrollar interfaces API seguras específicas para la extracción automatizada de datos orientada a grandes integradores B2B.",
            "Anonimizar y ofuscar por defecto cualquier dato de índole personal antes de la entrega de reportes compartidos.",
            "Controlar la tasa de extracción de datos para que los procesos de compartición no pongan en riesgo la base de datos de producción."
        ]
    },

    # GRUPO 08 — Producto y Gestión del Proyecto
    {
        "id": 71,
        "group": "group-08",
        "name": "Gestor del Backlog de Ingeniería y Planificación de Sprints",
        "objective": "Garantizar que las tareas técnicas y de producto estén perfectamente priorizadas, detalladas y listas para asignarse en los sprints de Kronos.",
        "tasks": [
            "Coordinar tableros de Jira o Linear, organizando los tickets en épicas y tareas individuales claras.",
            "Planificar el balance de carga de trabajo técnica antes del inicio de cada ciclo de desarrollo bisemanal.",
            "Minimizar el alcance descontrolado de los sprints ('scope creep') retirando tareas agregadas de último momento."
        ]
    },
    {
        "id": 72,
        "group": "group-08",
        "name": "Redactor de Requisitos de Funcionalidades e Historias de Usuario",
        "objective": "Traducir las necesidades comerciales del negocio a especificaciones técnicas y de comportamiento funcionales, claras y entendibles.",
        "tasks": [
            "Escribir historias de usuario siguiendo la metodología estricta 'Dado que... Cuando... Entonces...' (Gherkin).",
            "Definir con claridad los criterios de aceptación no ambiguos para cada entregable propuesto.",
            "Organizar sesiones periódicas de refinamiento técnico con los líderes de ingeniería para resolver dudas previas."
        ]
    },
    {
        "id": 73,
        "group": "group-08",
        "name": "Coordinador de Lanzamientos y Registro de Cambios (Release Notes)",
        "objective": "Asegurar transiciones controladas de nuevas versiones hacia producción, manteniendo a todos los equipos y clientes informados de las novedades.",
        "tasks": [
            "Crear la hoja de ruta de la versión y coordinar el despliegue ordenado de las diferentes funcionalidades de la app.",
            "Redactar las notas de versión públicas (Release Notes) tanto para perfiles técnicos como comerciales.",
            "Evaluar e implementar el encendido progresivo de funciones mediante interruptores lógicos dinámicos (Feature Flags)."
        ]
    },
    {
        "id": 74,
        "group": "group-08",
        "name": "Especialista de Integración con Canales de Soporte y Tickets de Usuario",
        "objective": "Conectar directamente el feedback de incidentes de usuarios reales de la app con el equipo de ingenieros correspondientes.",
        "tasks": [
            "Integrar y mantener los sistemas de mesa de ayuda (Zendesk, Freshdesk, Intercom) conectados a la lógica operativa de la app.",
            "Diseñar un sistema de tickets para que los errores complejos del cliente recopilen información técnica del navegador o móvil.",
            "Crear un puente dinámico que asocie incidencias recurrentes de usuarios con errores o bugs abiertos en el backlog."
        ]
    },
    {
        "id": 75,
        "group": "group-08",
        "name": "Evaluador de Retroalimentación del Usuario y Prioridades de Producto",
        "objective": "Escuchar y dar sentido cuantitativo a la voz del cliente recopilando peticiones, quejas y encuestas de satisfacción.",
        "tasks": [
            "Analizar de forma recurrente las encuestas Net Promoter Score (NPS) y de satisfacción de usuario por módulo operativo.",
            "Mapear las sugerencias más solicitadas por el mercado para proponer su inclusión formal en el plan de desarrollo.",
            "Coordinar entrevistas a usuarios reales para profundizar en problemas de fricción de las nuevas interfaces."
        ]
    },
    {
        "id": 76,
        "group": "group-08",
        "name": "Diseñador de la Documentación Técnica de APIs y de Arquitectura",
        "objective": "Sostener una biblioteca documental exhaustiva, actualizada y perfectamente legible para los desarrolladores y agentes de Kronos.",
        "tasks": [
            "Generar la documentación interactiva de APIs de forma automática basada en especificaciones OpenAPI/Swagger.",
            "Documentar detalladamente los flujos de configuración del entorno de desarrollo local (Local Setup Guides).",
            "Mantener al día los diagramas de arquitectura de red, base de datos e integraciones en repositorios de documentación técnica."
        ]
    },
    {
        "id": 77,
        "group": "group-08",
        "name": "Creador de la Base de Conocimiento de Ayuda al Usuario Final",
        "objective": "Escribir artículos, tutoriales y flujos de autoservicio que permitan al usuario final exprimir el valor de la Super App sin ayuda humana.",
        "tasks": [
            "Diseñar e instrumentar el portal público de soporte técnico para el cliente final de Kronos.",
            "Traducir conceptos de configuración sumamente complejos a guías prácticas paso a paso acompañadas de capturas ilustrativas.",
            "Medir la efectividad del portal analizando si los artículos resuelven de verdad las dudas reduciendo la creación de tickets nuevos."
        ]
    },
    {
        "id": 78,
        "group": "group-08",
        "name": "Supervisor de Calidad Funcional y Aseguramiento del Negocio (QA Manual)",
        "objective": "Realizar validaciones detalladas de flujo de experiencia humana en dispositivos reales para asegurar que los diseños encajen con lo planificado.",
        "tasks": [
            "Crear y ejecutar matrices de casos de prueba detallados que cubran flujos normales, inusuales e incorrectos de la Super App.",
            "Validar que la interfaz visual de las nuevas secciones en pre-producción coincida exactamente con las especificaciones de Figma.",
            "Documentar los pasos de reproducción de fallos encontrados adjuntando capturas, grabaciones y logs de consola."
        ]
    },
    {
        "id": 79,
        "group": "group-08",
        "name": "Ingeniero de Experiencia de Incorporación de Clientes (Onboarding UX)",
        "objective": "Conseguir que el nuevo usuario de la Super App complete su configuración inicial e identifique el valor de Kronos en el menor tiempo posible.",
        "tasks": [
            "Diseñar tutoriales interactivos dinámicos dentro de la aplicación que guíen al usuario de manera lúdica.",
            "Reducir la fricción y número de campos obligatorios en los formularios del flujo inicial de creación de cuenta.",
            "Monitorear e identificar los pasos exactos donde los prospectos abandonan el onboarding preliminar de la app."
        ]
    },
    {
        "id": 80,
        "group": "group-08",
        "name": "Auditor de Ciclo de Vida del Software y Conformidad de Procesos (SDLC)",
        "objective": "Garantizar que todo el ciclo de desarrollo de software (diseño, codificación, pruebas y lanzamiento) respete los procesos de calidad corporativos.",
        "tasks": [
            "Verificar que cada pieza de código aprobada en producción cuente con la aprobación explícita de sus revisores requeridos.",
            "Auditar que se mantenga la trazabilidad desde una línea de código en producción hasta la historia de usuario origen.",
            "Proporcionar la certificación formal e interna de que el entregable cumple con los estándares globales de Kronos para salir al mercado."
        ]
    },

    # GRUPO 09 — Integraciones, Ecosistema y Plataforma
    {
        "id": 81,
        "group": "group-09",
        "name": "Integrador de Sistemas de Relación con Clientes (CRMs Externos)",
        "objective": "Sincronizar de forma segura y en tiempo real el comportamiento, leads y datos comerciales con plataformas CRM (Salesforce, HubSpot).",
        "tasks": [
            "Diseñar el flujo bidireccional de actualización de perfiles de clientes y estados de cuenta entre Kronos y el CRM organizativo.",
            "Centralizar la atribución de campañas publicitarias cruzadas asignándolas de forma exacta al pipeline comercial correspondiente.",
            "Resolver conflictos de discrepancias de datos cuando se editen registros de clientes en dos plataformas diferentes."
        ]
    },
    {
        "id": 82,
        "group": "group-09",
        "name": "Conector de Planificación de Recursos Empresariales (ERPs)",
        "objective": "Integrar la facturación, inventario y registros contables de grandes corporaciones de la Super App con ERPs líderes del mercado (SAP, NetSuite).",
        "tasks": [
            "Desarrollar conectores adaptativos estructurados para mapear el catálogo transaccional interno con el libro contable de ERPs.",
            "Automatizar la exportación calendarizada y masiva de cierres fiscales diarios reduciendo errores manuales.",
            "Validar de forma exhaustiva los esquemas de transferencia cifrada de datos fiscales y contables altamente confidenciales."
        ]
    },
    {
        "id": 83,
        "group": "group-09",
        "name": "Gestor del Despachador de Webhooks de Salida (Event Subscriptions)",
        "objective": "Permitir a los desarrolladores clientes crear integraciones reactivas mediante el envío automatizado de eventos JSON ante cambios de estado de Kronos.",
        "tasks": [
            "Implementar la infraestructura de envío de webhooks con soporte para reintentos automatizados ante caídas de los servidores destino.",
            "Firmar de manera criptográfica cada payload del webhook (SHA256 HMAC) para garantizar su procedencia y evitar suplantación.",
            "Proveer a los desarrolladores de un panel de inspección donde puedan auditar las respuestas HTTP de sus endpoints receptores."
        ]
    },
    {
        "id": 84,
        "group": "group-09",
        "name": "Diseñador de SDKs Multiplataforma para Desarrolladores Externos",
        "objective": "Facilitar la programación de integraciones personalizadas ofreciendo librerías de software preconstruidas e idiomáticas en diversos lenguajes.",
        "tasks": [
            "Desarrollar, testear y mantener paquetes SDK estructurados y limpios para JavaScript/TypeScript, Python, Swift y Kotlin.",
            "Automatizar el proceso de empaquetado, versionado semántico y publicación de los SDKs en repositorios oficiales.",
            "Crear ejemplos completos de código funcional (Quickstarts) que ilustren el uso básico del SDK para acelerar su adopción."
        ]
    },
    {
        "id": 85,
        "group": "group-09",
        "name": "Desarrollador del Portal y Sandbox de Desarrollo de Kronos",
        "objective": "Proveer un espacio autogestionado donde desarrolladores externos registren aplicaciones, generen credenciales de prueba y ensayen de forma segura.",
        "tasks": [
            "Diseñar el dashboard administrativo de aplicaciones de terceros, alcances (scopes) de API y claves cliente/secreto.",
            "Implementar un entorno mock virtual (Sandbox) de la Super App que replique fielmente respuestas del sistema sin tocar datos productivos.",
            "Mantener foros y sistemas automatizados para responder dudas de integración técnica de forma interactiva."
        ]
    },
    {
        "id": 86,
        "group": "group-09",
        "name": "Conector de Plataformas de Productividad y Colaboración (Slack/Teams)",
        "objective": "Soportar el envío automatizado de resúmenes operativos, reportes interactivos y notificaciones rápidas directo a equipos de Slack o Microsoft Teams.",
        "tasks": [
            "Configurar la lógica para responder y procesar de forma nativa comandos diagonales ('slash commands') desde las plataformas de chat.",
            "Formatear y construir las tarjetas de mensajería interactiva estructuradas (Block Kit / Adaptive Cards) de forma limpia.",
            "Garantizar el control de acceso asegurando que solo usuarios con privilegios reales de Kronos puedan accionar tareas desde el chat."
        ]
    },
    {
        "id": 87,
        "group": "group-09",
        "name": "Especialista en Integración de Calendarios y Agenda de Actividades",
        "objective": "Conectar de forma transparente la agenda operativa de Kronos con los calendarios profesionales de los usuarios (Google Calendar, Outlook).",
        "tasks": [
            "Implementar la sincronización dinámica y de doble vía de citas, reservas u obligaciones operativas detectadas en la Super App.",
            "Manejar de forma adecuada las diferencias de husos horarios locales y los cambios de horario estacional en la sincronización.",
            "Diseñar flujos resilientes para evitar duplicar eventos idénticos ante bloqueos temporales de las APIs de Google o Microsoft."
        ]
    },
    {
        "id": 88,
        "group": "group-09",
        "name": "Sincronizador de Contactos y Listas de Marketing de Correo",
        "objective": "Integrar la Super App de manera consistente con gestores profesionales de correos masivos y marketing automatizado (Mailchimp, Klaviyo).",
        "tasks": [
            "Mantener las listas de contactos de mercadotecnia al día de acuerdo con las acciones de registro, baja o inactividad en Kronos.",
            "Segmentar de forma dinámica las listas de envío según el nivel de interacción, tipo de suscripción o geografía del cliente.",
            "Garantizar que cada suscripción respete de manera estricta los requerimientos globales de prevención de spam (CAN-SPAM, CASL)."
        ]
    },
    {
        "id": 89,
        "group": "group-09",
        "name": "Especialista en Tienda de Aplicaciones y Marketplace de Terceros",
        "objective": "Habilitar un ecosistema dinámico y seguro donde desarrolladores externos ofrezcan complementos, integraciones y widgets a los usuarios de Kronos.",
        "tasks": [
            "Diseñar el proceso e infraestructura técnica para la carga, verificación dinámica y publicación guiada de extensiones o complementos.",
            "Diseñar mecanismos seguros de aislamiento en tiempo de ejecución (Sandboxing) para evitar que widgets externos vulneren la app base.",
            "Administrar el proceso automatizado de liquidación de comisiones del marketplace compartidas entre Kronos y el creador externo."
        ]
    },
    {
        "id": 90,
        "group": "group-09",
        "name": "Integrador de Sistemas de Facturación y Cuestiones Fiscales Regionales",
        "objective": "Integrar y coordinar proveedores de validación tributaria locales para emitir facturación conforme a las exigencias regulatorias locales.",
        "tasks": [
            "Conectar pasarelas API con las entidades tributarias estatales de cada región geográfica o país donde opere comercialmente Kronos.",
            "Validar números de registro fiscal en tiempo real antes de completar transferencias o cobros de montos de suscripción considerables.",
            "Adaptar ágilmente los esquemas de impuestos aplicados a la moneda base ante variaciones repentinas de las legislaciones fiscales nacionales."
        ]
    },

    # GRUPO 10 — Dirección General y Orquestación
    {
        "id": 91,
        "group": "group-10",
        "name": "Alineador de Metas Técnicas e Indicadores de Ingeniería (OKRs)",
        "objective": "Garantizar que todo el trabajo técnico de desarrollo de la red de agentes encaje con los objetivos estratégicos y comerciales de Kronos.",
        "tasks": [
            "Traducir el plan maestro comercial de Kronos a metas técnicas alcanzables (Key Results) medidas de forma cuantitativa.",
            "Auditar la velocidad, eficiencia operativa y estabilidad de entrega de software de los distintos grupos.",
            "Elaborar tableros informativos agregados que comparen el esfuerzo invertido contra el beneficio generado en cada módulo."
        ]
    },
    {
        "id": 92,
        "group": "group-10",
        "name": "Administrador de Gastos Tecnológicos en la Nube (FinOps)",
        "objective": "Optimizar de manera recurrente la facturación de servicios de nube, reduciendo costos innecesarios y garantizando la sostenibilidad financiera.",
        "tasks": [
            "Analizar desgloses de costos cloud y detectar instancias encendidas inactivas, discos redundantes u otros gastos silenciosos.",
            "Colaborar con el equipo de DevOps para la reserva inteligente de instancias en nube de largo plazo (Reserved Instances / Savings Plans).",
            "Desarrollar modelos de costo por usuario activo que permitan establecer un modelo de precios comercial rentable."
        ]
    },
    {
        "id": 93,
        "group": "group-10",
        "name": "Orquestador y Priorizador Técnico del Ecosistema de Agentes",
        "objective": "Definir y reestructurar de manera ágil los flujos lógicos, dependencias de ejecución y jerarquías internas de la red de agentes de Kronos.",
        "tasks": [
            "Diseñar el plano lógico dinámico de comunicación de eventos prioritarios entre agentes de backend, IA y seguridad.",
            "Medir y mitigar la latencia acumulada en las cadenas de dependencias de agentes ante flujos operativos comunes.",
            "Gestionar y actualizar la arquitectura de control de versión de los manifiestos de especificaciones de todos los agentes."
        ]
    },
    {
        "id": 94,
        "group": "group-10",
        "name": "Monitoreador Global de Salud y Telecomunicaciones de la Red de Agentes",
        "objective": "Custodiar el estado operativo y la disponibilidad de conexión interna de las llamadas e hilos activos del sistema de agentes de Kronos.",
        "tasks": [
            "Configurar un mecanismo de latido continuo (Heartbeat API) que certifique la actividad real de cada uno de los agentes.",
            "Diseñar un conmutador automático de emergencia para reconectar o reiniciar instancias de agentes que no respondan en un tiempo prudente.",
            "Diagnosticar caídas de rendimiento o interbloqueos (Deadlocks) en las comunicaciones transversales de los agentes de producción."
        ]
    },
    {
        "id": 95,
        "group": "group-10",
        "name": "Administrador de Consistencia Lógica e Integridad Inter-Agentes",
        "objective": "Garantizar que las decisiones lógicas tomadas por un agente no entren en conflicto directo con las directivas tomadas por otro.",
        "tasks": [
            "Implementar un protocolo de consenso unificado ante decisiones tomadas por múltiples agentes automatizados de IA.",
            "Arbitrar y resolver bloqueos mutuos o inconsistencias de datos generados por actualizaciones concurrentes de los agentes operacionales.",
            "Registrar auditorías inmutables de las resoluciones de disputas de lógica tomadas por el sistema dinámico de control de la app."
        ]
    },
    {
        "id": 96,
        "group": "group-10",
        "name": "Auditor de Sesgos Éticos y Cumplimiento Normativo en Inteligencia Artificial",
        "objective": "Validar que todos los modelos de IA integrados dentro de la Super App Kronos operen de forma ética, justa y sin discriminación.",
        "tasks": [
            "Ejecutar escaneos periódicos sobre los modelos generativos evaluando la equidad y ausencia de discriminación en las respuestas.",
            "Detener inmediatamente flujos generativos de IA que muestren comportamientos tóxicos, erráticos o con alucinaciones perjudiciales.",
            "Mantener un registro documentado de los análisis éticos de los modelos para alinearse con futuras normativas de gobernanza de la IA."
        ]
    },
    {
        "id": 97,
        "group": "group-10",
        "name": "Gestor de Recursos de Cómputo Dinámicos para Tareas Pesadas de IA",
        "objective": "Asignar y controlar dinámicamente la capacidad de hardware especializado (GPUs/TPUs) para los agentes de machine learning y LLMs.",
        "tasks": [
            "Balancear el flujo de peticiones de inferencia entre proveedores de nube para evitar cuellos de botella de hardware en horas pico.",
            "Implementar colas de espera con niveles de prioridad asignados de acuerdo con el tipo de cuenta del usuario (Free vs Premium).",
            "Optimizar la asignación de memoria GPU en despliegues dedicados."
        ]
    },
    {
        "id": 98,
        "group": "group-10",
        "name": "Especialista en Expansión Tecnológica y Despliegue Multi-Región",
        "objective": "Diseñar el crecimiento estructural de la Super App para posibilitar despliegues geográficamente distribuidos de muy baja latencia.",
        "tasks": [
            "Configurar bases de datos distribuidas globalmente con replicación activa de lectura y escritura en múltiples continentes.",
            "Definir políticas dinámicas de enrutamiento de red para procesar la información del usuario en el nodo físico geográficamente más cercano.",
            "Cumplir con las restricciones legales y gubernamentales de soberanía local que exigen el almacenamiento físico de datos dentro del país origen."
        ]
    },
    {
        "id": 99,
        "group": "group-10",
        "name": "Supervisor y Evaluador del Rendimiento Global del Frontend y API",
        "objective": "Realizar auditorías holísticas del ecosistema completo de la Super App para garantizar tiempos de respuesta rápidos y consistentes.",
        "tasks": [
            "Medir y documentar el tiempo total de extremo a extremo de las consultas más comunes de la aplicación móvil y portal web.",
            "Coordinar pruebas de estrés técnico masivas sobre la arquitectura para certificar que soporta los picos proyectados de volumen.",
            "Identificar ineficiencias de comunicación entre diferentes microservicios backend que degraden la velocidad percibida por el usuario."
        ]
    },
    {
        "id": 100,
        "group": "group-10",
        "name": "KRONOS MASTER ORCHESTRATOR",
        "objective": "Actuar como la máxima autoridad técnica y lógica de Kronos Super App, coordinando el trabajo de los otros 99 agentes, supervisando prioridades, gestionando dependencias del sistema y liderando el correcto despliegue estratégico global.",
        "tasks": [
            "Supervisar, autorizar y validar de forma automatizada las tareas integradas ejecutadas por las redes de agentes inferiores.",
            "Analizar el rendimiento operativo integral del ecosistema completo y resolver cuellos de botella transversales críticos en caliente.",
            "Ejecutar y sincronizar el despliegue ordenado de la hoja de ruta estratégica global de Kronos para mantener el sistema estable y listo para producción."
        ]
    }
]

def main():
    base_dir = "kronos-super-app"
    agents_dir = os.path.join(base_dir, "agents")
    
    print("Iniciando generación del ecosistema Kronos Super App...")

    # Crear la estructura de carpetas sugerida
    directories = [
        "orchestrator", "prompts", "memory", "workflows", 
        "docs", "server", "client", "tests", "scripts", "deployment"
    ]
    
    for folder in directories:
        os.makedirs(os.path.join(base_dir, folder), exist_ok=True)
        
    # Crear las subcarpetas para los 10 grupos de agentes
    for i in range(1, 11):
        group_name = f"group-{i:02d}"
        os.makedirs(os.path.join(agents_dir, group_name), exist_ok=True)

    # Generar archivos JSON individuales para cada uno de los 100 agentes
    for agent in agents_data:
        group_folder = agent["group"]
        agent_filename = f"agent_{agent['id']:03d}.json"
        filepath = os.path.join(agents_dir, group_folder, agent_filename)
        
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(agent, f, indent=4, ensure_ascii=False)
            
    # Guardar un archivo maestro JSON consolidado en la carpeta de orquestación
    master_filepath = os.path.join(base_dir, "orchestrator", "kronos_master_agents.json")
    with open(master_filepath, "w", encoding="utf-8") as f:
        json.dump(agents_data, f, indent=4, ensure_ascii=False)

    print("\n¡Generación completada con éxito!")
    print(f"Directorio raíz creado: ./{base_dir}/")
    print(f"Total de agentes generados individualmente: {len(agents_data)} archivos JSON.")
    print(f"Archivo maestro consolidado guardado en: {master_filepath}")

if __name__ == "__main__":
    main()