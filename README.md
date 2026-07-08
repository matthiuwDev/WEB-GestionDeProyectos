# WEB-GestionDeProyectos (Frontend)

Aplicación web para la gestión de proyectos bajo metodologías ágiles (Scrum). Desarrollada con las últimas características del ecosistema de Angular, enfocada en un alto rendimiento y una arquitectura escalable basada en dominios.

> ⚠️ **Nota Importante:** Este proyecto se encuentra en desarrollo activo y su estructura, arquitectura o funcionalidades están sujetas a modificaciones sin previo aviso.

---

## 🚀 Tecnologías y Prácticas Clave

- **Framework:** Angular 20
- **UI / Componentes:** Angular Material & Angular CDK (Drag & Drop)
- **Reactividad y Estado:** Signals (`signal`, `computed`, `effect`)
- **Rendimiento:** Zoneless (sin dependencia de Zone.js) y `ChangeDetectionStrategy.OnPush`
- **Arquitectura:** Feature-Based Architecture (Domain-Driven Design)

## 📁 Estructura del Proyecto (Domain-Driven)

El proyecto está organizado estrictamente por dominios de negocio, separando las responsabilidades de forma clara:

```
src/app/
├── core/             # Elementos globales (Guards, Interceptors, Context Services)
├── shared/           # UI reutilizable, pipes y utilidades sin lógica de negocio
└── features/         # Dominios principales de la aplicación
    ├── auth/         # Autenticación y acceso
    ├── projects/     # Gestión de Proyectos y Layout principal (Shell)
    ├── sprints/      # Gestión de Sprints, Planificación y Tablero Kanban Activo
    ├── user-stories/ # Backlog e Historias de Usuario
    └── tasks/        # Gestión de tareas individuales
```

Cada *feature* agrupa sus propias páginas (`pages/`), componentes de interfaz (`components/`), servicios (`services/`) y modelos (`models/`).

## 🛠️ Características Principales

1. **Autenticación:** Acceso seguro al sistema.
2. **Gestión de Proyectos:** CRUD de proyectos y navegación contextualizada.
3. **Backlog de Producto:** Gestión de Historias de Usuario sin asignar.
4. **Sprint Planning:** Asignación visual (Drag & Drop) de Historias de Usuario desde el Backlog hacia el Sprint en curso.
5. **Active Sprint (Kanban):** Tablero interactivo con *swimlanes* (carriles) por historia de usuario para mover tareas (TODO, IN PROGRESS, DONE) en tiempo real.

## ⚙️ Configuración y Ejecución Local

### Prerrequisitos
- Node.js (versión compatible con Angular 20)
- npm o yarn
- CLI de Angular (`npm install -g @angular/cli`)

### Pasos
1. Clona el repositorio.
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo:
   ```bash
   ng serve
   ```
4. Navega a `http://localhost:4200/`. La aplicación se recargará automáticamente al guardar cambios en los archivos fuente.

## 📝 Convenciones de Código y Arquitectura

- **Componentes Standalone:** No se utilizan `NgModules`. Todo nuevo componente debe ser `standalone: true`.
- **Control Flow:** Se utiliza el nuevo Control Flow de Angular (`@if`, `@for`, `@defer`) en lugar de directivas estructurales antiguas (`*ngIf`, `*ngFor`).
- **Manejo del DOM:** Las interacciones complejas como arrastrar y soltar se gestionan exclusivamente con `@angular/cdk/drag-drop`.
- **Inyección de Dependencias:** Se prefiere el uso de la función `inject()` sobre la inyección por constructor.
