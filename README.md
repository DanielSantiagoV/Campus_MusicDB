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

## 📊 Índices MongoDB

Los índices son estructuras de datos que mejoran significativamente el rendimiento de las consultas. Campus Music implementa una **estrategia minimalista pero inteligente** con índices específicos que cubren múltiples casos de uso sin redundancia.

### 🎯 Filosofía de Índices

**Principio**: Cada índice tiene un propósito específico y cubre múltiples casos de uso. No hay redundancia ni sobrecarga innecesaria.

- **Minimalistas**: Solo los índices esenciales para el negocio
- **Estratégicos**: Cada uno optimiza las consultas más frecuentes  
- **Únicos**: Garantizan integridad referencial y reglas de negocio
- **Compuestos**: Combinan múltiples campos para máxima eficiencia

### 📋 Lista Completa de Índices

#### 👥 Colección `usuarios`
```javascript
// 1. Username único (login)
db.usuarios.createIndex({ username: 1 }, { unique: true });

// 2. Email único (recuperación de cuenta)  
db.usuarios.createIndex({ email: 1 }, { unique: true });

// 3. Documento único (identificación legal)
db.usuarios.createIndex({ documento: 1 }, { unique: true });
```
**Justificación**: Garantiza unicidad en los 3 identificadores críticos del sistema de autenticación.

#### 🏢 Colección `sedes`
```javascript
// 1. Nombre único (identificador de negocio)
db.sedes.createIndex({ nombre: 1 }, { unique: true });

// 2. Ciudad + dirección única (prevención de duplicados geográficos)
db.sedes.createIndex({ ciudad: 1, direccion: 1 }, { unique: true });

// 3. Consulta principal (sedes por ciudad y estado)
db.sedes.createIndex({ ciudad: 1, estado: 1 });
```
**Justificación**: Optimiza consultas geográficas y previene duplicados de ubicaciones físicas.

#### 👨‍🎓 Colección `estudiantes`
```javascript
// 1. Relación 1:1 única con usuarios
db.estudiantes.createIndex({ usuarioId: 1 }, { unique: true });

// 2. Consulta principal (estudiantes por sede y estado)
db.estudiantes.createIndex({ sedeId: 1, estado: 1 });
```
**Justificación**: Garantiza integridad referencial y optimiza la consulta operativa más común.

#### 👨‍🏫 Colección `profesores`  
```javascript
// 1. Relación 1:1 única con usuarios
db.profesores.createIndex({ usuarioId: 1 }, { unique: true });

// 2. Consulta principal (profesores por sede, especialidad y estado)
db.profesores.createIndex({ sedeId: 1, especialidades: 1, estado: 1 });
```
**Justificación**: Integridad referencial y búsquedas eficientes por especialidad y ubicación.

#### 📚 Colección `cursos`
```javascript
// 1. Nombre único por sede (prevención de duplicados)
db.cursos.createIndex({ nombre: 1, sedeId: 1 }, { unique: true });

// 2. Catálogo principal (cursos por sede y estado)
db.cursos.createIndex({ sedeId: 1, estado: 1 });

// 3. Asignación profesoral (cursos por profesor)
db.cursos.createIndex({ profesorId: 1 });
```
**Justificación**: Evita cursos duplicados por sede y optimiza el catálogo académico principal.

#### 📝 Colección `inscripciones`
```javascript
// 1. Prevención de duplicados (estudiante + curso único)
db.inscripciones.createIndex({ estudianteId: 1, cursoId: 1 }, { unique: true });

// 2. Control de cupos (inscripciones por curso y estado)
db.inscripciones.createIndex({ cursoId: 1, estado: 1 });

// 3. Historial académico (inscripciones por estudiante)
db.inscripciones.createIndex({ estudianteId: 1, fechaInscripcion: -1 });
```
**Justificación**: Previene inscripciones duplicadas y optimiza consultas de cupos e historial.

#### 🎸 Colección `instrumentos`
```javascript
// 1. Código de inventario único (integridad del inventario físico)
db.instrumentos.createIndex({ codigoInventario: 1 }, { unique: true });

// 2. Consulta principal (instrumentos por sede, tipo y estado)
db.instrumentos.createIndex({ sedeId: 1, tipo: 1, estado: 1 });
```
**Justificación**: Garantiza unicidad del inventario físico y optimiza búsquedas de disponibilidad.

#### 🎺 Colección `reservas_instrumentos`
```javascript
// 1. Verificación de disponibilidad (instrumento + fecha)
db.reservas_instrumentos.createIndex({ instrumentoId: 1, fechaHoraInicio: 1 });

// 2. Historial de reservas (reservas por estudiante)
db.reservas_instrumentos.createIndex({ estudianteId: 1, fechaHoraInicio: -1 });
```
**Justificación**: Previene "double booking" y optimiza consultas de historial temporal.

### 🚀 Beneficios Técnicos

#### ⚡ Rendimiento
- **Consultas rápidas**: Índices optimizan las consultas más frecuentes del sistema
- **Escalabilidad**: Rendimiento constante independientemente del tamaño de datos
- **Ordenamiento eficiente**: Índices descendentes (-1) para historiales cronológicos

#### 🔒 Integridad de Datos
- **Índices únicos**: Previenen duplicados en identificadores críticos
- **Relaciones 1:1**: Garantizan integridad referencial entre colecciones
- **Reglas de negocio**: Evitan inconsistencias como cursos duplicados por sede

#### 📊 Casos de Uso Optimizados
- **Autenticación**: Login rápido por username, email o documento
- **Catálogos**: Consultas eficientes de cursos e instrumentos por sede
- **Historiales**: Acceso rápido a inscripciones y reservas por estudiante
- **Gestión**: Asignaciones de profesores y control de cupos en tiempo real

#### 🎯 Estrategia Minimalista
- **28 índices totales** para 8 colecciones (8 automáticos `_id` + 20 personalizados)
- **Promedio 3.5 índices por colección** incluyendo los automáticos
- **Cada índice sirve múltiples propósitos** operativos y de integridad
- **Sin redundancia**: No hay índices que se solapen en funcionalidad
- **Mantenimiento eficiente**: Índices optimizados = actualizaciones más rápidas

---

## 🎲 Estructura de los Datos de Prueba

El archivo `test_dataset.js` contiene un conjunto de datos realistas y coherentes que simula el funcionamiento de una escuela de música multi-sede. Los datos están diseñados para probar todas las funcionalidades del sistema y demostrar relaciones complejas entre colecciones.

### 📊 Resumen de Datos de Prueba

| Colección | Cantidad | Descripción |
|-----------|----------|-------------|
| **sedes** | 3 | Bogotá (activa), Medellín (activa), Cali (inactiva) |
| **usuarios** | 25 | 10 profesores + 15 estudiantes con autenticación |
| **profesores** | 10 | Personal docente con especialidades variadas |
| **estudiantes** | 15 | Alumnado con diferentes niveles musicales |
| **instrumentos** | 20 | Inventario distribuido en las 3 sedes |
| **cursos** | 15 | Programas académicos (5 por sede) |
| **inscripciones** | 30 | Matriculaciones con estados variados |
| **reservas_instrumentos** | 10 | Sistema de préstamos activo |

### 🏫 Datos por Sede

#### 🏢 Campus Music - Chapinero (Bogotá)
- **Capacidad**: 150 estudiantes
- **Estado**: Activa
- **Profesores**: 4 docentes (piano, guitarra, violín, canto)
- **Instrumentos**: 7 instrumentos (incluyendo piano de cola Steinway)
- **Cursos**: 5 programas (Piano Básico, Guitarra Intermedia, Violín Avanzado, etc.)

#### 🏢 Campus Music - El Poblado (Medellín)  
- **Capacidad**: 100 estudiantes
- **Estado**: Activa
- **Profesores**: 4 docentes (piano, guitarra/bajo, batería, canto)
- **Instrumentos**: 6 instrumentos (guitarra Fender, batería electrónica Roland)
- **Cursos**: 5 programas (Piano Intermedio, Batería de Rock, Bajo Eléctrico, etc.)

#### 🏢 Campus Music - Granada (Cali)
- **Capacidad**: 80 estudiantes  
- **Estado**: Inactiva
- **Profesores**: 2 docentes (violín, canto)
- **Instrumentos**: 7 instrumentos (varios en mantenimiento)
- **Cursos**: 5 programas (Piano Salsero, Teoría Musical Avanzada, etc.)

### 👥 Perfiles de Usuario

#### 👨‍🏫 Profesores (10 total)
- **Niveles académicos**: Técnico, profesional, especialización, maestría, doctorado
- **Especialidades**: Piano (3), guitarra (3), violín (2), canto (3), batería (1), bajo (2)
- **Experiencia**: 5-20 años de experiencia profesional
- **Estados**: 8 activos, 1 inactivo, 1 suspendido

#### 👨‍🎓 Estudiantes (15 total)
- **Niveles musicales**: 5 básico, 5 intermedio, 5 avanzado
- **Instrumentos de interés**: Distribuidos equitativamente entre todos los instrumentos
- **Estados**: 12 activos, 1 inactivo, 1 suspendido, 1 egresado
- **Distribución por sede**: 5 Bogotá, 5 Medellín, 5 Cali

### 🎸 Inventario de Instrumentos

#### Por Tipo de Instrumento
- **Guitarras**: 4 instrumentos (Yamaha C40, Fender Stratocaster, Ibanez Gio, Taylor)
- **Pianos**: 4 instrumentos (Roland FP-30, Yamaha P-125, Casio Privia, Steinway)
- **Violines**: 4 instrumentos (Stentor Student, Hoffman Allegro, Cremona SV-75, Yamaha eléctrico)
- **Baterías**: 4 instrumentos (Pearl Roadshow, Mapex Voyager, Ludwig Accent, Roland electrónica)
- **Bajos**: 4 instrumentos (Squier, Ibanez, Yamaha, Ibanez 5 cuerdas)

#### Por Estado Operativo
- **Disponibles**: 14 instrumentos (70%)
- **En mantenimiento**: 4 instrumentos (20%)
- **Fuera de servicio**: 1 instrumento (5%)
- **Reservados**: 1 instrumento (5%)

### 📚 Programas Académicos

#### Por Nivel de Dificultad
- **Básico**: 6 cursos (Piano, Guitarra, Teoría, Violín, Bajo, Canto)
- **Intermedio**: 5 cursos (Guitarra, Piano, Canto, Batería, Teoría)
- **Avanzado**: 4 cursos (Violín, Canto, Piano Salsero, Teoría Musical)

#### Por Instrumento
- **Piano**: 4 cursos (básico, intermedio, avanzado, salsero)
- **Guitarra**: 3 cursos (principiantes, intermedia, clásica)
- **Canto**: 3 cursos (moderno, avanzado, técnica vocal)
- **Violín**: 2 cursos (avanzado, introducción)
- **Teoría Musical**: 2 cursos (básico, avanzado)
- **Batería**: 1 curso (rock intermedio)
- **Bajo**: 1 curso (eléctrico básico)

### 💰 Estructura Financiera

#### Rangos de Precios por Nivel
- **Básico**: $400,000 - $550,000 COP
- **Intermedio**: $520,000 - $600,000 COP  
- **Avanzado**: $650,000 - $800,000 COP

#### Estados de Inscripción
- **Activas**: 22 inscripciones (73%)
- **Finalizadas**: 2 inscripciones (7%)
- **Pendientes**: 2 inscripciones (7%)
- **Canceladas**: 4 inscripciones (13%)

### 🎯 Sistema de Reservas

#### Distribución Temporal
- **Horarios**: 09:00 - 18:00 (horario académico)
- **Duración**: 1-3 horas por reserva
- **Fechas**: Octubre-Noviembre 2025 (datos futuros)

#### Estados de Reservas
- **Activas**: 6 reservas (60%)
- **Finalizadas**: 2 reservas (20%)
- **Canceladas**: 2 reservas (20%)

### 🔄 Relaciones de Datos

#### Integridad Referencial
- **Usuarios ↔ Profesores**: Relación 1:1 (10 pares)
- **Usuarios ↔ Estudiantes**: Relación 1:1 (15 pares)
- **Sedes → Cursos**: 1:N (3 sedes, 15 cursos)
- **Profesores → Cursos**: 1:N (10 profesores, 15 cursos)
- **Estudiantes → Inscripciones**: 1:N (15 estudiantes, 30 inscripciones)
- **Instrumentos → Reservas**: 1:N (20 instrumentos, 10 reservas)

#### Casos de Prueba Específicos
- **Múltiples inscripciones**: Estudiantes inscritos en 2 cursos cada uno
- **Estados variados**: Datos con diferentes estados para probar filtros
- **Distribución geográfica**: Datos equilibrados entre las 3 sedes
- **Especialidades cruzadas**: Profesores con múltiples especialidades
- **Costos congelados**: Precios históricos preservados en inscripciones

---

## 📈 Explicación de Cada Agregación

El archivo `aggregation.js` implementa **8 consultas de agregación** que resuelven preguntas de negocio clave usando el pipeline de MongoDB. Cada consulta está diseñada paso a paso con explicaciones detalladas.

### 🔍 Agregación 1: Inscripciones por Sede (Último Mes)

**Pregunta de negocio**: *¿Cuántos estudiantes se inscribieron por sede en el último mes?*

```javascript
db.inscripciones.aggregate([
  { $match: { fechaInscripcion: { $gte: fechaHaceUnMes } } },
  { $lookup: { from: "cursos", localField: "cursoId", foreignField: "_id", as: "curso" } },
  { $unwind: "$curso" },
  { $lookup: { from: "sedes", localField: "curso.sedeId", foreignField: "_id", as: "sede" } },
  { $unwind: "$sede" },
  { $group: { _id: "$sede.nombre", total: { $sum: 1 }, ciudad: { $first: "$sede.ciudad" } } },
  { $sort: { total: -1 } }
])
```

**Pipeline explicado**:
1. **$match**: Filtra inscripciones del último mes
2. **$lookup**: Conecta con cursos para obtener sedeId
3. **$unwind**: Descompone array de cursos
4. **$lookup**: Conecta con sedes para obtener información geográfica
5. **$unwind**: Descompone array de sedes
6. **$group**: Agrupa por sede y cuenta inscripciones
7. **$sort**: Ordena por cantidad (mayor a menor)

**Utilidad**: Análisis de demanda geográfica y tendencias de crecimiento por ubicación.

### 📊 Agregación 2: Cursos Más Demandados por Sede

**Pregunta de negocio**: *¿Cuál es el curso más popular en cada sede?*

```javascript
db.inscripciones.aggregate([
  { $lookup: { from: "cursos", localField: "cursoId", foreignField: "_id", as: "curso" } },
  { $unwind: "$curso" },
  { $lookup: { from: "sedes", localField: "curso.sedeId", foreignField: "_id", as: "sede" } },
  { $unwind: "$sede" },
  { $group: { _id: { sede: "$sede.nombre", curso: "$curso.nombre", nivel: "$curso.nivel", instrumento: "$curso.instrumento" }, inscripciones: { $sum: 1 } } },
  { $sort: { "_id.sede": 1, "inscripciones": -1 } },
  { $group: { _id: "$_id.sede", cursoMasPopular: { $first: "$_id.curso" }, nivel: { $first: "$_id.nivel" }, instrumento: { $first: "$_id.instrumento" }, totalInscripciones: { $first: "$inscripciones" } } },
  { $sort: { _id: 1 } }
])
```

**Pipeline explicado**:
1. **$lookup**: Conecta inscripciones con cursos
2. **$lookup**: Conecta cursos con sedes
3. **$group**: Cuenta inscripciones por curso y sede
4. **$sort**: Ordena por sede y popularidad
5. **$group**: Toma el curso más popular de cada sede
6. **$sort**: Ordena alfabéticamente por sede

**Utilidad**: Identificar programas de mayor demanda para planificación académica.

### 💰 Agregación 3: Ingresos Totales por Sede

**Pregunta de negocio**: *¿Cuál es el ingreso total generado por inscripciones en cada sede?*

```javascript
db.inscripciones.aggregate([
  { $lookup: { from: "cursos", localField: "cursoId", foreignField: "_id", as: "curso" } },
  { $unwind: "$curso" },
  { $lookup: { from: "sedes", localField: "curso.sedeId", foreignField: "_id", as: "sede" } },
  { $unwind: "$sede" },
  { $group: { _id: "$sede.nombre", ingresoTotal: { $sum: "$costoCongelado" }, totalInscripciones: { $sum: 1 }, ciudad: { $first: "$sede.ciudad" } } },
  { $sort: { ingresoTotal: -1 } }
])
```

**Pipeline explicado**:
1. **$lookup**: Conecta con cursos para obtener sede
2. **$lookup**: Conecta con sedes para agrupar ingresos
3. **$group**: Suma costos congelados por sede
4. **$sort**: Ordena por ingreso total (mayor a menor)

**Utilidad**: Análisis financiero para evaluar rentabilidad por ubicación.

### 👨‍🏫 Agregación 4: Profesor con Más Estudiantes

**Pregunta de negocio**: *¿Qué profesor tiene la mayor carga de estudiantes activos?*

```javascript
db.inscripciones.aggregate([
  { $match: { estado: "activa" } },
  { $lookup: { from: "cursos", localField: "cursoId", foreignField: "_id", as: "curso" } },
  { $unwind: "$curso" },
  { $lookup: { from: "profesores", localField: "curso.profesorId", foreignField: "_id", as: "profesor" } },
  { $unwind: "$profesor" },
  { $lookup: { from: "usuarios", localField: "profesor.usuarioId", foreignField: "_id", as: "usuario" } },
  { $unwind: "$usuario" },
  { $group: { _id: "$usuario.username", totalEstudiantes: { $sum: 1 }, especialidades: { $first: "$profesor.especialidades" }, email: { $first: "$usuario.email" } } },
  { $sort: { totalEstudiantes: -1 } },
  { $limit: 1 }
])
```

**Pipeline explicado**:
1. **$match**: Solo inscripciones activas
2. **$lookup**: Conecta con cursos para obtener profesorId
3. **$lookup**: Conecta con profesores para obtener perfil
4. **$lookup**: Conecta con usuarios para obtener nombre
5. **$group**: Cuenta estudiantes por profesor
6. **$sort**: Ordena por carga de trabajo
7. **$limit**: Toma solo el profesor con más estudiantes

**Utilidad**: Gestión de carga académica y distribución equitativa de trabajo.

### 🎸 Agregación 5: Instrumento Más Reservado

**Pregunta de negocio**: *¿Qué tipo de instrumento es el más reservado?*

```javascript
db.reservas_instrumentos.aggregate([
  { $lookup: { from: "instrumentos", localField: "instrumentoId", foreignField: "_id", as: "instrumento" } },
  { $unwind: "$instrumento" },
  { $group: { _id: "$instrumento.tipo", totalReservas: { $sum: 1 }, ejemploInstrumento: { $first: "$instrumento.nombre" } } },
  { $sort: { totalReservas: -1 } },
  { $limit: 1 }
])
```

**Pipeline explicado**:
1. **$lookup**: Conecta reservas con instrumentos
2. **$unwind**: Descompone array de instrumentos
3. **$group**: Cuenta reservas por tipo de instrumento
4. **$sort**: Ordena por popularidad
5. **$limit**: Toma solo el más reservado

**Utilidad**: Optimización de inventario y planificación de compras.

### 👤 Agregación 6: Historial Completo de Estudiante

**Pregunta de negocio**: *¿Cuál es el historial académico completo de un estudiante específico?*

```javascript
db.inscripciones.aggregate([
  { $match: { estudianteId: estudiante._id } },
  { $lookup: { from: "cursos", localField: "cursoId", foreignField: "_id", as: "curso" } },
  { $unwind: "$curso" },
  { $lookup: { from: "sedes", localField: "curso.sedeId", foreignField: "_id", as: "sede" } },
  { $unwind: "$sede" },
  { $lookup: { from: "profesores", localField: "curso.profesorId", foreignField: "_id", as: "profesor" } },
  { $unwind: "$profesor" },
  { $lookup: { from: "usuarios", localField: "profesor.usuarioId", foreignField: "_id", as: "usuarioProfesor" } },
  { $unwind: "$usuarioProfesor" },
  { $project: { _id: 0, fecha: "$fechaInscripcion", sede: "$sede.nombre", curso: "$curso.nombre", profesor: "$usuarioProfesor.username", nivel: "$curso.nivel", costo: "$costoCongelado", estado: "$estado" } },
  { $sort: { fecha: -1 } }
])
```

**Pipeline explicado**:
1. **$match**: Filtra por estudiante específico
2. **$lookup** (múltiples): Conecta con cursos, sedes, profesores y usuarios
3. **$project**: Selecciona campos específicos del historial
4. **$sort**: Ordena cronológicamente (más reciente primero)

**Utilidad**: Seguimiento académico personalizado y reportes de progreso estudiantil.

### 🏫 Agregación 7: Cursos Activos por Sede

**Pregunta de negocio**: *¿Qué cursos están actualmente activos en cada sede?*

```javascript
db.cursos.aggregate([
  { $match: { estado: "activo" } },
  { $lookup: { from: "sedes", localField: "sedeId", foreignField: "_id", as: "sede" } },
  { $unwind: "$sede" },
  { $group: { _id: "$sede.nombre", cursos: { $push: { nombre: "$nombre", nivel: "$nivel", instrumento: "$instrumento", cuposDisponibles: "$cupos.disponibles", cuposMaximos: "$cupos.maximo" } }, totalCursos: { $sum: 1 }, ciudad: { $first: "$sede.ciudad" } } },
  { $sort: { _id: 1 } }
])
```

**Pipeline explicado**:
1. **$match**: Solo cursos con estado activo
2. **$lookup**: Conecta con sedes para agrupar
3. **$group**: Agrupa cursos por sede con detalles
4. **$sort**: Ordena alfabéticamente por sede

**Utilidad**: Vista operativa de la oferta académica actual por ubicación.

### ⚠️ Agregación 8: Detección de Sobrecupos

**Pregunta de negocio**: *¿Hay cursos que excedieron su cupo permitido?*

```javascript
db.cursos.aggregate([
  { $match: { "cupos.disponibles": { $lt: 0 } } },
  { $lookup: { from: "sedes", localField: "sedeId", foreignField: "_id", as: "sede" } },
  { $unwind: "$sede" },
  { $project: { _id: 0, curso: "$nombre", sede: "$sede.nombre", cupoMaximo: "$cupos.maximo", cuposDisponibles: "$cupos.disponibles", sobrecupo: { $multiply: ["$cupos.disponibles", -1] }, nivel: "$nivel", instrumento: "$instrumento" } },
  { $sort: { sobrecupo: -1 } }
])
```

**Pipeline explicado**:
1. **$match**: Busca cupos disponibles negativos (sobrecupo)
2. **$lookup**: Conecta con sedes para contexto
3. **$project**: Calcula y muestra el exceso de estudiantes
4. **$sort**: Ordena por severidad del sobrecupo

**Utilidad**: Control de calidad y detección de problemas operativos.

### 🎯 Técnicas de Agregación Utilizadas

#### 🔗 **$lookup (Joins)**
- **Propósito**: Conectar colecciones relacionadas
- **Uso**: Todas las consultas usan múltiples $lookup para enriquecer datos
- **Ventaja**: Simula JOINs de SQL en MongoDB

#### 📦 **$unwind**
- **Propósito**: Convertir arrays en objetos individuales
- **Uso**: Después de cada $lookup para acceso directo a campos
- **Ventaja**: Permite trabajar con datos de referencia como objetos

#### 📊 **$group**
- **Propósito**: Agrupar documentos y realizar cálculos
- **Uso**: Contar, sumar, promediar y tomar primeros valores
- **Ventaja**: Equivalente a GROUP BY de SQL con operadores de agregación

#### 🎯 **$match**
- **Propósito**: Filtrar documentos por criterios específicos
- **Uso**: Filtros por fecha, estado, estudiante específico
- **Ventaja**: Reduce el conjunto de datos temprano en el pipeline

#### 📋 **$project**
- **Propósito**: Seleccionar y transformar campos específicos
- **Uso**: Crear campos calculados y limpiar salida
- **Ventaja**: Control total sobre la estructura de salida

#### 🔢 **$sort**
- **Propósito**: Ordenar resultados por criterios específicos
- **Uso**: Ordenamiento por popularidad, fecha, alfabético
- **Ventaja**: Resultados organizados para análisis

#### ✂️ **$limit**
- **Propósito**: Limitar número de resultados
- **Uso**: Obtener "top 1" o "más popular"
- **Ventaja**: Eficiencia en consultas de ranking

### 📊 Casos de Uso por Agregación

| Agregación | Stakeholder | Frecuencia | Propósito |
|------------|-------------|------------|-----------|
| **1. Inscripciones por sede** | Directores | Mensual | Análisis de demanda geográfica |
| **2. Cursos más demandados** | Coordinadores | Semestral | Planificación académica |
| **3. Ingresos por sede** | Finanzas | Mensual | Análisis de rentabilidad |
| **4. Carga profesoral** | RRHH | Semestral | Distribución equitativa |
| **5. Instrumentos populares** | Inventario | Trimestral | Planificación de compras |
| **6. Historial estudiante** | Académicos | A demanda | Seguimiento personalizado |
| **7. Cursos activos** | Operaciones | Diario | Vista operativa actual |
| **8. Detección sobrecupos** | Calidad | Diario | Control de problemas |

### 🚀 Beneficios del Diseño de Agregaciones

#### ✅ **Legibilidad**
- **Comentarios paso a paso**: Cada etapa del pipeline está explicada
- **Justificación clara**: Se explica el "¿Por qué?" de cada operación
- **Ejemplos concretos**: Casos de uso específicos documentados

#### 🔄 **Reutilización**
- **Patrones consistentes**: Misma estructura de $lookup → $unwind → $group
- **Modularidad**: Cada consulta es independiente y modificable
- **Escalabilidad**: Fácil agregar nuevas consultas siguiendo los patrones

#### 📊 **Eficiencia**
- **Índices optimizados**: Cada consulta aprovecha los índices existentes
- **Pipeline optimizado**: Filtros tempranos con $match
- **Resultados específicos**: $project limpia la salida innecesaria

---

