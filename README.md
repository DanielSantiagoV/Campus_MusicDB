# Campus_MusicDB
<p align="center"> 
  <img src="assets/mongodb.png" width="350"/> 
</p>

<p align="center"> 
  <img src="https://img.shields.io/badge/MongoDB-6.0+-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
  <img src="https://img.shields.io/badge/Regex-Expresiones%20Regulares-brightgreen?style=for-the-badge&logo=regex" alt="Regex">
  <img src="https://img.shields.io/badge/Database-NoSQL-darkgreen?style=for-the-badge&logo=database&logoColor=white" alt="NoSQL">
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" alt="MIT License">
  <img src="https://img.shields.io/badge/Status-Completed-green?style=for-the-badge" alt="Completed">
  <img src="https://img.shields.io/badge/Version-1.0-blue?style=for-the-badge" alt="Version">
</p>


🎵 Campus Music es un sistema de escuela de música multi-ciudad que migra de hojas de cálculo a MongoDB para mejor consistencia de datos, análisis y transacciones. 💻 Este proyecto incluye diseño de esquemas, datos de prueba realistas, consultas analíticas, acceso basado en roles y manejo completo de transacciones 📚 Estudiantes, profesores, cursos e instrumentos todo en un sistema unificado


---

## 📚 Investigación

### ❓ ¿Qué es una base de datos NoSQL?

Una base de datos NoSQL (Not Only SQL) permite almacenar información en formatos no tabulares. Es ideal para sistemas que requieren flexibilidad en la estructura de los datos, alto rendimiento y escalabilidad horizontal.

### 🍃 ¿Qué es MongoDB?

MongoDB es una base de datos NoSQL orientada a documentos. Utiliza documentos BSON (muy similares a JSON) para representar y almacenar datos complejos, anidados y semiestructurados.

### ⚖️ Diferencias clave entre MySQL (Relacional) y MongoDB (Documental)

| Característica         | MySQL (Relacional)                                  | MongoDB (Documental)                                |
|:-----------------------|:----------------------------------------------------|:----------------------------------------------------|
| **Modelo de datos**    | Tablas con filas y columnas definidas.              | Colecciones con documentos BSON (similares a JSON). |
| **Esquema**            | Rígido y predefinido.                               | Flexible y dinámico.                                |
| **Relaciones**         | `JOIN`s a través de claves foráneas.                | Embebido de documentos o referencias (`$lookup`).   |
| **Escalabilidad**      | Vertical (aumentando la potencia del servidor).     | Horizontal (distribuyendo datos en más servidores). |
| **Lenguaje de Consulta** | SQL (`Structured Query Language`).                  | MQL (`MongoDB Query Language`) y Aggregation Pipeline.|
| **Casos de uso**       | Sistemas transaccionales, ERPs, contabilidad.       | Big Data, catálogos de productos, redes sociales.   |

### 📄 ¿Qué son documentos y colecciones?

- **Documento**: Es una unidad de datos en formato JSON (ej. un producto o un cliente).
- **Colección**: Es un conjunto de documentos similares (ej. todos los productos o todos los clientes).

---

## 🧩 Diseño del Modelo

En lugar de normalizar como en SQL (con tablas separadas para estudiantes, profesores, cursos, etc.), usaremos documentos para agrupar datos relacionados. El objetivo es equilibrar la flexibilidad con la eficiencia en las consultas, evitando redundancias excesivas.

### 🗂️ Colecciones Principales

- **`usuarios`**: Sistema de autenticación y roles unificado para estudiantes, profesores y administradores con validaciones de seguridad.
- **`sedes`**: Almacena información completa sobre las ubicaciones físicas de Campus Music, incluyendo capacidad, contacto y estado operativo.
- **`estudiantes`**: Contiene información detallada sobre el alumnado, incluyendo datos personales, contacto de emergencia y historial académico.
- **`profesores`**: Gestiona el personal docente con especialidades musicales, experiencia, horarios disponibles y certificaciones.
- **`cursos`**: Es el núcleo educativo, almacenando programas con detalles de nivel, duración, cupos y requisitos específicos.
- **`inscripciones`**: Controla las matriculaciones de estudiantes en cursos con fechas, costos congelados y estados de pago.
- **`instrumentos`**: Gestiona el inventario de instrumentos musicales con información de marca, modelo, estado y ubicación.
- **`reservas_instrumentos`**: Sistema de préstamos que conecta estudiantes con instrumentos disponibles, controlando fechas y devoluciones.

### ⚖️ Justificación: Embeber vs. Referenciar

La decisión clave en MongoDB es cuándo anidar datos (embeber) y cuándo crear un enlace (referenciar).

- **Embebemos** datos cuando la relación es de "contiene" y los datos no se consultan fuera de su documento padre.
  - **Ventaja**: Lecturas atómicas y rápidas (un solo viaje a la base de datos).
  - **Ejemplo**: Los datos de contacto están embebidos en estudiantes para consultas rápidas.

- **Referenciamos** datos cuando la relación es de "usa" o para evitar la duplicación de grandes volúmenes de datos que cambian con frecuencia.
  - **Ventaja**: Mantiene los datos consistentes (DRY - Don't Repeat Yourself).
  - **Ejemplo**: Referenciamos cursos desde inscripciones para mantener integridad de cupos y precios.

### 🧬 Estructura de Campos Clave

- **Campos de texto**: Para nombres, especialidades, direcciones y descripciones de cursos.
- **Campos numéricos**: Para cupos, costos, duraciones y capacidades de sedes.
- **Campos de fecha**: Para fechas de inscripción, inicio de cursos y reservas de instrumentos.
- **Campos de estado**: Para el control de disponibilidad, estados de pago y condiciones de instrumentos.
- **Campos anidados**: Para arrays de especialidades, contactos de emergencia y horarios disponibles.

---

## 📁 Estructura de Archivos

```
📁 Campus_MusicDB/
├── 📄 db_config.js          # 🏗️ Configuración y creación de esquemas MongoDB
├── 📄 test_dataset.js       # 🎲 Datos de prueba realistas para el sistema
├── 📄 aggregation.js        # 📊 Consultas analíticas y agregaciones MongoDB
├── 📄 roles.js              # 🔐 Sistema RBAC (Control de acceso basado en roles)
├── 📄 transacciones.js      # ⚡ Manejo de transacciones atómicas MongoDB
├── 📁 assets/               # 🖼️ Recursos gráficos del proyecto
│   └── mongodb.png          # Logo de MongoDB
├── 📄 README.md             # 📖 Documentación completa del proyecto
└── 📄 LICENSE               # ⚖️ Licencia MIT del proyecto
```

### 🚀 Orden de Ejecución

Para configurar el sistema completo, ejecuta los archivos en este orden específico:

1. **`db_config.js`** - Crea las colecciones, validaciones e índices
2. **`test_dataset.js`** - Pobla la base de datos con datos de prueba
3. **`roles.js`** - Configura usuarios y permisos de seguridad
4. **`aggregation.js`** - Ejecuta consultas analíticas de ejemplo
5. **`transacciones.js`** - Demuestra operaciones transaccionales

```bash
# Ejecutar desde la terminal con mongosh
mongosh --file db_config.js
mongosh --file test_dataset.js  
mongosh --file roles.js
mongosh --file aggregation.js
mongosh --file transacciones.js
```

---

## 🎯 Características del Sistema

### 🏫 Gestión Multi-Sede
- **Sedes distribuidas**: Bogotá, Medellín, Cali
- **Capacidades variables**: 80-150 estudiantes por sede
- **Estados operativos**: Activas e inactivas
- **Información de contacto**: Teléfonos y emails específicos

### 👥 Sistema de Usuarios
- **Roles diferenciados**: Estudiantes, profesores, administradores
- **Autenticación segura**: Passwords hasheados con bcrypt
- **Estados de cuenta**: Activo, inactivo, suspendido
- **Validaciones robustas**: Username, email y documento únicos

### 📚 Gestión Académica
- **Cursos especializados**: Piano, guitarra, violín, batería, canto
- **Niveles progresivos**: Básico, intermedio, avanzado
- **Control de cupos**: Límites por curso y disponibilidad en tiempo real
- **Precios flexibles**: Costos variables por curso y nivel

### 🎸 Gestión de Instrumentos
- **Inventario completo**: Instrumentos de cuerda, viento, percusión
- **Estados controlados**: Disponible, reservado, en mantenimiento
- **Sistema de reservas**: Préstamos con fechas de inicio y devolución
- **Trazabilidad**: Historial completo de uso por estudiante

### 💰 Sistema Transaccional
- **Inscripciones atómicas**: Garantiza integridad de cupos
- **Costos congelados**: Precio fijo al momento de inscripción
- **Rollback automático**: Reversión en caso de errores
- **Consistencia de datos**: Previene estados inconsistentes

---

## 📊 Consultas Analíticas Implementadas

El archivo `aggregation.js` incluye consultas para responder preguntas de negocio clave:

1. **📈 Inscripciones por sede** - Análisis de demanda por ubicación
2. **🎵 Instrumentos más populares** - Ranking de instrumentos más reservados
3. **💰 Ingresos por curso** - Análisis financiero de programas educativos
4. **👨‍🏫 Carga de trabajo docente** - Distribución de cursos por profesor
5. **📅 Ocupación de instrumentos** - Análisis de uso del inventario
6. **🎯 Estudiantes activos por sede** - Métricas de participación
7. **📊 Análisis de capacidad** - Utilización de espacios por sede

---

## 🔐 Sistema de Seguridad

### Roles Implementados
- **`admin_campus`**: Acceso total al sistema
- **`coordinador_sede`**: Gestión completa de una sede específica  
- **`profesor`**: Acceso a sus cursos y estudiantes asignados
- **`estudiante`**: Consulta de sus inscripciones y reservas

### Permisos Granulares
- **Lectura**: Consultas específicas por rol y contexto
- **Escritura**: Operaciones limitadas según responsabilidades
- **Administración**: Solo para roles administrativos
- **Filtros automáticos**: Datos limitados por sede o asignación

---

## ⚡ Transacciones MongoDB

### Casos de Uso Implementados
1. **Inscripción de estudiante**: Operación atómica que actualiza inscripciones y cupos
2. **Reserva de instrumento**: Transacción que verifica disponibilidad y asigna
3. **Cancelación de curso**: Rollback completo de inscripciones y liberación de cupos

### Garantías ACID
- **Atomicidad**: Todas las operaciones se ejecutan o ninguna
- **Consistencia**: Los datos mantienen reglas de negocio
- **Aislamiento**: Transacciones concurrentes no interfieren
- **Durabilidad**: Cambios confirmados persisten permanentemente

---

## 🛡️ Validaciones $jsonSchema

MongoDB permite validar la estructura y contenido de los documentos usando **$jsonSchema**, garantizando la integridad de datos sin sacrificar la flexibilidad de NoSQL. Campus Music implementa validaciones robustas en todas sus colecciones.

### 🔍 ¿Qué es $jsonSchema?

**$jsonSchema** es un estándar de MongoDB que permite definir reglas de validación para documentos:
- **Estructura**: Qué campos son obligatorios y cuáles opcionales
- **Tipos de datos**: String, number, date, ObjectId, arrays, etc.
- **Restricciones**: Longitud mínima/máxima, patrones regex, valores enum
- **Validaciones complejas**: Usando $expr para reglas de negocio avanzadas

### 📋 Validaciones por Colección

#### 👥 Colección `usuarios`
```javascript
// Campos obligatorios
required: ["username", "documento", "email", "password", "rol", "estado", "createdAt"]

// Validaciones clave:
username: {
  pattern: "^[a-zA-Z0-9._-]{3,30}$"  // Solo alfanuméricos y ._- (3-30 chars)
}
documento: {
  pattern: "^[0-9]{8,15}$"           // Solo números (8-15 dígitos)
}
email: {
  pattern: "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"  // Email válido
}
rol: {
  enum: ["admin", "profesor", "estudiante", "empleado_sede"]
}
estado: {
  enum: ["activo", "inactivo", "suspendido"]
}
```

#### 🏢 Colección `sedes`
```javascript
// Campos obligatorios
required: ["nombre", "ciudad", "direccion", "capacidad", "estado", "createdAt"]

// Validaciones clave:
nombre: {
  minLength: 3, maxLength: 50        // Nombre descriptivo
}
capacidad: {
  minimum: 1, maximum: 1000          // Entre 1 y 1000 estudiantes
}
telefono: {
  pattern: "^[0-9+()\\-\\s]{7,20}$" // Formato flexible para teléfonos
}
estado: {
  enum: ["activa", "inactiva", "cerrada"]
}
```

#### 👨‍🎓 Colección `estudiantes`
```javascript
// Campos obligatorios
required: ["usuarioId", "nivelMusical", "sedeId", "estado"]

// Validaciones clave:
usuarioId: {
  bsonType: "objectId"              // Relación 1:1 con usuarios
}
nivelMusical: {
  enum: ["basico", "intermedio", "avanzado"]
}
instrumentosInteres: {
  bsonType: "array",
  items: {
    enum: ["piano", "guitarra", "violin", "canto", "teoria musical", "bajo", "bateria"]
  }
}
estado: {
  enum: ["activo", "inactivo", "suspendido", "egresado"]
}
```

#### 👨‍🏫 Colección `profesores`
```javascript
// Campos obligatorios
required: ["usuarioId", "especialidades", "estado", "createdAt"]

// Validaciones clave:
especialidades: {
  bsonType: "array",
  minItems: 1,                      // Mínimo 1 especialidad
  uniqueItems: true,                // Sin duplicados
  items: {
    enum: ["piano", "guitarra", "violin", "canto", "teoria musical", "bajo", "bateria"]
  }
}
nivelAcademico: {
  enum: ["tecnico", "profesional", "especializacion", "maestria", "doctorado"]
}
experienciaAnios: {
  minimum: 0                        // No puede ser negativo
}
```

#### 📚 Colección `cursos`
```javascript
// Campos obligatorios
required: ["nombre", "nivel", "instrumento", "costo", "sedeId", "profesorId", "cupos", "estado", "createdAt"]

// Validaciones clave:
nivel: {
  enum: ["basico", "intermedio", "avanzado"]
}
instrumento: {
  enum: ["piano", "guitarra", "violin", "canto", "teoria musical", "bajo", "bateria"]
}
costo: {
  minimum: 0                        // No puede ser negativo
}
cupos: {
  bsonType: "object",
  required: ["maximo", "disponibles"],
  properties: {
    maximo: { minimum: 1 },
    disponibles: { minimum: 0 }
  }
}

// Validación de negocio con $expr
$expr: {
  $lte: ["$cupos.disponibles", "$cupos.maximo"]  // disponibles ≤ máximo
}
```

#### 📝 Colección `inscripciones`
```javascript
// Campos obligatorios
required: ["estudianteId", "cursoId", "fechaInscripcion", "costoCongelado", "estado", "createdAt"]

// Validaciones clave:
costoCongelado: {
  minimum: 0                        // Costo fijo al momento de inscripción
}
estado: {
  enum: ["activa", "completada", "cancelada", "suspendida"]
}
fechaInscripcion: {
  bsonType: "date"                  // Fecha válida obligatoria
}
```

#### 🎸 Colección `instrumentos`
```javascript
// Campos obligatorios
required: ["nombre", "tipo", "sedeId", "codigoInventario", "estado", "createdAt"]

// Validaciones clave:
codigoInventario: {
  pattern: "^[A-Z0-9-]{4,15}$"      // Código único de inventario
}
tipo: {
  enum: ["piano", "guitarra", "violin", "bateria", "canto", "bajo", "otro"]
}
estado: {
  enum: ["disponible", "reservado", "mantenimiento", "fuera_de_servicio"]
}
```

#### 🎺 Colección `reservas_instrumentos`
```javascript
// Campos obligatorios
required: ["estudianteId", "instrumentoId", "fechaReserva", "estado", "createdAt"]

// Validaciones clave:
estado: {
  enum: ["activa", "completada", "cancelada"]
}
fechaReserva: {
  bsonType: "date"                  // Fecha de inicio de reserva
}
fechaDevolucion: {
  bsonType: "date"                  // Fecha de devolución (opcional)
}
```

### 🎯 Beneficios de las Validaciones

#### ✅ Integridad de Datos
- **Campos obligatorios**: Garantiza que los documentos tengan información esencial
- **Tipos de datos**: Previene errores de tipo en runtime
- **Formatos específicos**: Emails, teléfonos y códigos con patrones válidos

#### 🔒 Reglas de Negocio
- **Estados controlados**: Solo valores predefinidos para estados operativos
- **Rangos numéricos**: Capacidades, costos y experiencia dentro de límites lógicos
- **Relaciones 1:1**: Garantiza integridad referencial entre usuarios y perfiles

#### 🚀 Validaciones Avanzadas
- **$expr**: Validaciones complejas como `cupos.disponibles ≤ cupos.maximo`
- **Validaciones condicionales**: SedeId obligatorio solo para empleados de sede
- **Arrays únicos**: Especialidades sin duplicados en profesores

#### 📊 Ventajas Operativas
- **Prevención temprana**: Errores detectados antes de insertar datos
- **Documentación viva**: El schema sirve como documentación técnica
- **Consistencia**: Todos los documentos siguen las mismas reglas
- **Debugging facilitado**: Mensajes de error claros y específicos

---

