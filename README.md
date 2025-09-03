# Plataforma de Gestión Legal Corporativa - LegalCorp

## Descripción

Plataforma premium de gestión legal corporativa desarrollada con React, TypeScript, Tailwind CSS, Framer Motion, React Router v6 y Zustand. Implementa un sistema completo de gestión de casos legales con roles diferenciados para clientes, abogados y administradores.

## Características Principales

### 🎨 Diseño y UX
- **Tema Dark + Glass**: Interfaz moderna con efectos de cristal y tema oscuro
- **Responsive Design**: Compatible con dispositivos móviles y desktop
- **Animaciones Fluidas**: Implementadas con Framer Motion
- **UI Profesional**: Diseño premium para entorno corporativo

### 👥 Sistema de Roles

#### Cliente
- Dashboard con métricas de casos
- Creación de solicitudes legales por categorías corporativas
- Timeline de hitos y progreso de casos
- Sistema de mensajería con abogados
- Visualización de SLA con semáforos (verde, amarillo, rojo)

#### Abogado
- Dashboard con casos asignados y disponibles
- Sistema de alertas y notificaciones en tiempo real
- Campana de notificaciones con contador
- Gestión de estados de casos (nuevo, tomado, en revisión, en curso, pendiente cliente, resuelto, archivado, rechazado)
- Sistema de solicitud de documentos
- Mensajería bidireccional con clientes

#### Administrador
- Panel de métricas completo con:
  - Casos por estado y categoría
  - Tiempos promedio de resolución
  - Cumplimiento de SLA
  - Ranking de abogados por rendimiento
  - Log de auditoría con exportación simulada
- Gestión de casos y abogados
- Supervisión general de la plataforma

### 📋 Categorías Legales Corporativas
- **Societario**: Constitución de sociedades, estatutos sociales
- **Contratos Comerciales**: Minutas, antecedentes de partes
- **Compliance**: Manuales de procedimientos, políticas internas
- **Propiedad Intelectual**: Registro de marcas, diseños
- **Laboral**: Contratos de trabajo, reglamentos internos
- **Litigios**: Documentos de casos, pruebas disponibles
- **M&A (Fusiones y Adquisiciones)**: Estados financieros, due diligence
- **Tributario**: Declaraciones tributarias, fiscalizaciones

### 🔔 Sistema de Notificaciones
- **Notificaciones en Tiempo Real**: EventBus para comunicación instantánea
- **Toasts**: Notificaciones emergentes con diferentes tipos (éxito, error, advertencia, info)
- **Campana de Notificaciones**: Contador visual y bandeja desplegable
- **Persistencia**: Las notificaciones se mantienen entre sesiones

### 📊 Gestión de SLA
- **Semáforos Visuales**: Indicadores de cumplimiento de tiempos
- **Alertas Automáticas**: Notificaciones por vencimiento de SLA
- **Métricas de Cumplimiento**: Estadísticas detalladas por abogado y categoría

## Tecnologías Utilizadas

- **React 18** con TypeScript
- **Tailwind CSS** para estilos
- **Framer Motion** para animaciones
- **React Router v6** para navegación
- **Zustand** para gestión de estado
- **localStorage** para persistencia
- **EventBus** para comunicación en tiempo real

## Instalación y Uso

### Prerrequisitos
- Node.js 18+
- npm o yarn

### Instalación
```bash
# Clonar el repositorio
git clone [url-del-repositorio]

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start

# Compilar para producción
npm run build
```

### Acceso al Sistema

La aplicación incluye usuarios de demostración:

#### Cliente
- **Email**: contacto@empresaabc.cl
- **Contraseña**: demo123
- **Rol**: Cliente (Empresa ABC S.A.)

#### Abogado
- **Email**: mperez@legalcorp.cl
- **Contraseña**: demo123
- **Rol**: Abogado (María Fernanda Pérez)

#### Administrador
- **Email**: admin@legalcorp.cl
- **Contraseña**: demo123
- **Rol**: Administrador Principal

## Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Layout.tsx      # Layout principal
│   ├── LoginForm.tsx   # Formulario de login
│   ├── NotificationBell.tsx # Campana de notificaciones
│   ├── ToastContainer.tsx   # Contenedor de toasts
│   └── ProtectedRoute.tsx   # Rutas protegidas
├── pages/              # Páginas por rol
│   ├── client/         # Páginas del cliente
│   ├── lawyer/         # Páginas del abogado
│   └── admin/          # Páginas del administrador
├── store.ts            # Estado global con Zustand
├── types.ts            # Definiciones de tipos TypeScript
├── data.ts             # Datos simulados
└── App.tsx             # Componente principal
```

## Funcionalidades Implementadas

### ✅ Sistema de Autenticación
- Login simulado con roles diferenciados
- Rutas protegidas por rol
- Persistencia de sesión

### ✅ Gestión de Casos
- Creación de casos con formulario multi-paso
- Estados de casos con flujo completo
- Timeline de eventos y hitos
- Sistema de prioridades

### ✅ Comunicación
- Mensajería bidireccional
- Notificaciones en tiempo real
- Sistema de documentos y adjuntos

### ✅ Panel Administrativo
- Métricas y KPIs en tiempo real
- Gestión de abogados y casos
- Reportes y auditoría

### ✅ Experiencia de Usuario
- Interfaz responsive
- Animaciones fluidas
- Feedback visual inmediato
- Tema dark profesional

## Datos Simulados

El sistema funciona completamente con datos simulados almacenados en:
- **Zustand Store**: Estado en memoria
- **localStorage**: Persistencia entre sesiones
- **EventBus**: Comunicación en tiempo real

No requiere backend ni base de datos externa.

## Compilación

El proyecto compila exitosamente con:
- ✅ `npm start` - Servidor de desarrollo
- ✅ `npm run build` - Build de producción
- ⚠️ Warnings menores de ESLint (variables no utilizadas)

## Características Técnicas

- **Totalmente Frontend**: Sin dependencias de backend
- **Datos Simulados**: Sistema completo de demostración
- **Responsive**: Compatible con móviles y desktop
- **Accesible**: Navegación por teclado y lectores de pantalla
- **Performante**: Optimizado para producción

## Licencia

Proyecto de demostración - Todos los derechos reservados.

---

**Desarrollado con ❤️ para demostrar capacidades de desarrollo frontend avanzado**

