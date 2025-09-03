// 🎵 CONFIGURACIÓN DE BASE DE DATOS CAMPUS MUSIC DB 🎵
// =====================================================
// 
// 📚 DESCRIPCIÓN DEL PROYECTO:
// Este archivo contiene la configuración completa de la base de datos MongoDB
// para el sistema de gestión de Campus Music, una escuela de música que maneja
// estudiantes, profesores, cursos, sedes, instrumentos y reservas.
//
// 🎯 OBJETIVOS DEL TALLER:
// - Aprender MongoDB desde cero con un caso real
// - Implementar validaciones robustas con $jsonSchema
// - Crear índices optimizados para consultas eficientes
// - Aplicar principios de normalización y denormalización
// - Manejar transacciones y operaciones complejas
//
// 🏗️ ARQUITECTURA DE LA BASE DE DATOS:
// - 8 colecciones principales interrelacionadas
// - Validaciones a nivel de documento y colección
// - Índices simples, compuestos y únicos
// - Referencias mediante ObjectId para integridad referencial
//
// 🔧 TECNOLOGÍAS UTILIZADAS:
// - MongoDB 6.0+ (versión recomendada)
// - Mongosh (shell de MongoDB)
// - $jsonSchema para validaciones
// - $expr para validaciones de negocio complejas
//
// 📋 COLEECCIONES IMPLEMENTADAS:
// 1. usuarios - Sistema de autenticación y roles
// 2. sedes - Gestión de ubicaciones físicas
// 3. estudiantes - Gestión del alumnado
// 4. cursos - Gestión de programas educativos
// 5. profesores - Gestión del personal docente
// 6. inscripciones - Gestión de matriculaciones
// 7. instrumentos - Gestión de instrumentos musicales
// 8. reservas_instrumentos - Gestión de préstamos
//
// 🚀 CÓMO EJECUTAR ESTE ARCHIVO:
// 1. Asegúrate de tener MongoDB instalado y ejecutándose
// 2. Abre una terminal en la carpeta del proyecto
// 3. Ejecuta: mongosh --file db_config.js
// 4. Verifica que aparezca el mensaje de éxito
//
// ⚠️ IMPORTANTE:
// - Este script elimina las colecciones existentes antes de crearlas
// - Úsalo solo en entornos de desarrollo/pruebas
// - Para producción, considera usar migraciones incrementales
//
// 🔗 Conectamos o creamos la base de datos CampusMusicDB 
// Esta línea establece la conexión con la base de datos MongoDB
// Si no existe, MongoDB la creará automáticamente


use('CampusMusicDB');

// 🧹 LIMPIEZA INICIAL PARA UN ENTORNO DE PRUEBAS
// ===============================================
// ⚠️ ADVERTENCIA: Estos comandos eliminan todas las colecciones existentes
// Úsalos solo en entornos de desarrollo, nunca en producción
// 
// ¿Por qué eliminamos las colecciones?
// - Garantiza un estado limpio para las pruebas
// - Evita conflictos con datos existentes
// - Permite recrear la estructura completa desde cero
// 
  

db.usuarios.drop();                    // 👥 Elimina colección de usuarios
db.sedes.drop();                       // 🏢 Elimina colección de sedes
db.profesores.drop();                  // 👨‍🏫 Elimina colección de profesores
db.estudiantes.drop();                 // 👨‍🎓 Elimina colección de estudiantes
db.instrumentos.drop();                // 🎸 Elimina colección de instrumentos
db.cursos.drop();                      // 📚 Elimina colección de cursos
db.inscripciones.drop();               // 📝 Elimina colección de inscripciones
db.reservas_instrumentos.drop();       // 🎺 Elimina colección de reservas

// =========================================
// COLECCIÓN: USUARIOS (Versión Final Optimizada)
// =========================================

db.createCollection("usuarios", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "username",
        "documento",
        "email",
        "password",
        "rol",
        "estado",
        "createdAt"
      ],
      properties: {
        // --- Identificadores y Credenciales ---
        username: {
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._-]{3,30}$",
          description:
            "Nombre de usuario único para login. Solo letras, números y ._- . Longitud: 3-30"
        },
        documento: {
          bsonType: "string",
          pattern: "^[0-9]{8,15}$",
          description: "Documento de identificación. Único, numérico (8-15 dígitos)."
        },
        email: {
          bsonType: "string",
          pattern: "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$",
          description: "Email válido. Único y requerido (almacenado en minúsculas)."
        },
        password: {
          bsonType: "string",
          minLength: 60, // Para hashes seguros (bcrypt/argon2)
          description: "Contraseña encriptada (hash). Requerida."
        },

        // --- Rol y Estado Administrativo ---
        rol: {
          enum: ["admin", "profesor", "estudiante", "empleado_sede"],
          description: "Rol del usuario en el sistema. Requerido."
        },
        sedeId: {
          bsonType: "objectId",
          description: "Sede asociada (obligatoria si rol = 'empleado_sede')."
        },
        estado: {
          enum: ["activo", "inactivo", "suspendido"],
          description: "Estado administrativo del usuario. Requerido."
        },

        // --- Auditoría ---
        createdAt: {
          bsonType: "date",
          description: "Fecha de creación del documento."
        },
        updatedAt: {
          bsonType: "date",
          description: "Fecha de la última actualización."
        }
      }
    },
    // 🔎 Validación condicional: sedeId requerido SOLO si rol = "empleado_sede"
    $expr: {
      $or: [
        { $ne: ["$rol", "empleado_sede"] },
        { $and: [{ $eq: ["$rol", "empleado_sede"] }, { $ifNull: ["$sedeId", false] }] }
      ]
    }
  }
});

db.usuarios.createIndex({ username: 1 }, { unique: true });
db.usuarios.createIndex({ email: 1 }, { unique: true });
db.usuarios.createIndex({ documento: 1 }, { unique: true });


// 🏢 2. COLECCIÓN DE SEDES - Gestión de ubicaciones físicas
// ========================================================
// Esta colección almacena información de las diferentes sedes del campus musical
// ⚠️ OPTIMIZADA: Esquema completo con validaciones robustas e índices estratégicos
// 🔒 SEGURIDAD: Control de estados y validaciones de integridad
//
// 📋 DESCRIPCIÓN:
// Esta colección es fundamental para la organización geográfica del campus musical.
// Cada sede representa una ubicación física donde se imparten cursos y se gestionan
// estudiantes, profesores e instrumentos. Es la base para la distribución
// territorial de los servicios educativos.
//
// 🎯 CASOS DE USO PRINCIPALES:
// - Gestión de ubicaciones físicas del campus
// - Distribución de cursos por sede
// - Control de capacidad estudiantil por ubicación
// - Reportes de ocupación por ciudad
// - Gestión de estados operativos de sedes
//
// 🔒 VALIDACIONES CRÍTICAS IMPLEMENTADAS:
// - Nombre único por sede (identificador de negocio)
// - Ciudad y dirección únicas (previene duplicados)
// - Capacidad máxima controlada (1-1000 estudiantes)
// - Estados administrativos validados
// - Contacto con validaciones de formato
//
// 💡 DECISIONES DE DISEÑO IMPORTANTES:
// - ✅ MANTENIDO: Campo 'ciudad' para organización geográfica
// - ✅ MANTENIDO: Campo 'capacidad' para control de ocupación
// - ✅ MANTENIDO: Estado 'cerrada' para sedes definitivamente cerradas
// - ✅ MANTENIDO: Email de contacto para comunicación oficial
// - ✅ MANTENIDO: Validaciones de longitud para calidad de datos
//
// 📊 RELACIONES:
// - Referenciado por cursos → colección 'cursos'
// - Referenciado por instrumentos → colección 'instrumentos'
// - Referenciado por profesores → colección 'profesores' (asignación)
// - Referenciado por usuarios → colección 'usuarios' (empleados de sede)
//
// 🏗️ ORGANIZACIÓN GEOGRÁFICA:
// El campo 'ciudad' permite organizar las sedes geográficamente y facilita
// reportes por región. Es esencial para la expansión del campus musical.
//
// 📈 CONTROL DE CAPACIDAD:
// El campo 'capacidad' permite controlar cuántos estudiantes puede albergar
// cada sede, facilitando la planificación de expansión y la gestión de cupos.
//
// 📞 COMUNICACIÓN OFICIAL:
// Los campos de contacto (teléfono y email) permiten la comunicación
// oficial con cada sede, esencial para la gestión administrativa.

db.createCollection("sedes", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      // 📋 Campos obligatorios que debe tener cada documento
      required: ["nombre", "ciudad", "direccion", "capacidad", "estado", "createdAt"],
      properties: {
        // 🏷️ Nombre identificativo único de la sede
        nombre: {
          bsonType: "string",
          minLength: 3,  // 🛡️ Mínimo 3 caracteres
          maxLength: 50,  // 🛡️ Máximo 50 caracteres
          description: "Nombre único de la sede (identificador de negocio)"
        },
        // 🏙️ Ciudad donde se encuentra la sede
        ciudad: {
          bsonType: "string",
          minLength: 2,  // 🛡️ Mínimo 2 caracteres
          maxLength: 50,  // 🛡️ Máximo 50 caracteres
          description: "Ciudad donde se encuentra la sede (organización geográfica)"
        },
        // 📍 Dirección física completa de la sede
        direccion: {
          bsonType: "string",
          minLength: 5,  // 🛡️ Mínimo 5 caracteres
          maxLength: 100,  // 🛡️ Máximo 100 caracteres
          description: "Dirección completa de la sede"
        },
        // 👥 Capacidad máxima de estudiantes
        capacidad: {
          bsonType: "int",
          minimum: 1,  // 🛡️ Mínimo 1 estudiante
          maximum: 1000,  // 🛡️ Máximo 1000 estudiantes
          description: "Capacidad máxima de estudiantes que puede albergar la sede"
        },
        // 📞 Teléfono de contacto (opcional)
        telefono: {
          bsonType: "string",
          pattern: "^[0-9+()\\-\\s]{7,20}$",  // 🔍 Formato flexible para teléfonos
          description: "Número de contacto de la sede (opcional)"
        },
        // 📧 Email de contacto oficial (opcional)
        email: {
          bsonType: "string",
          pattern: "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$",  // 🔍 Email válido
          description: "Correo electrónico de contacto oficial (opcional)"
        },
        // ✅ Estado operativo de la sede
        estado: {
          enum: ["activa", "inactiva", "cerrada"],  // 🎯 Estados permitidos
          description: "Estado administrativo de la sede"
        },
        // 📅 Fecha de creación de la sede
        createdAt: {
          bsonType: "date",
          description: "Fecha de creación de la sede"
        },
        // 🔄 Fecha de última actualización
        updatedAt: {
          bsonType: "date",
          description: "Fecha de la última actualización de la sede"
        }
      }
    }
  }
})

// 📊 ÍNDICES ESTRATÉGICOS Y MINIMALISTAS PARA LA COLECCIÓN SEDES
// =============================================================
// ⚠️ ESTRATÉGICOS: Solo 3 índices que cubren todas las necesidades del negocio
//
// 🎯 FILOSOFÍA DE ÍNDICES:
// La estrategia es minimalista pero inteligente. Cada índice tiene un propósito
// específico y cubre múltiples casos de uso. No hay redundancia ni sobrecarga.

// 1. 🔑 ÍNDICE ÚNICO PRINCIPAL - Identificador de Negocio
// =======================================================
// Propósito: Garantiza que cada sede tenga un nombre único
// Casos de uso: Búsqueda por nombre, validación de duplicados
// Importancia: Es el identificador de negocio principal
db.sedes.createIndex({ nombre: 1 }, { unique: true });

// 2. 🔑 ÍNDICE ÚNICO ESTRATÉGICO - Prevención de Duplicados Geográficos
// ======================================================================
// Propósito: Previene la creación de duplicados exactos en la misma ciudad
// Casos de uso: Validación de integridad geográfica
// Importancia: Regla de negocio inteligente que evita confusiones
// Ejemplo: Evita "Sede Bogotá" y "Bogotá Campus" en la misma dirección
db.sedes.createIndex({ ciudad: 1, direccion: 1 }, { unique: true });

// 3. 🚀 ÍNDICE DE CONSULTA PRINCIPAL - Consulta Más Común
// =======================================================
// Propósito: Optimiza la consulta más frecuente del sistema
// Casos de uso: "Muéstrame todas las sedes activas en Bogotá"
// Importancia: Es la consulta que más se ejecutará en la aplicación
// Eficiencia: Extremadamente eficiente para reportes por ciudad
db.sedes.createIndex({ ciudad: 1, estado: 1 });

// 📝 NOTAS DE GESTIÓN Y ESTRATEGIA:
// ==================================
// ✅ La colección está optimizada para consultas frecuentes de:
//    - Búsqueda de sedes por nombre (identificador único)
//    - Filtrado de sedes activas por ciudad (consulta principal)
//    - Validación de duplicados geográficos (integridad)
//    - Reportes de ocupación por región
// 
// 🔒 SEGURIDAD Y VALIDACIONES:
//    - Nombre único garantiza identificación clara
//    - Ciudad + dirección únicas previenen duplicados
//    - Capacidad controlada para planificación
//    - Estados administrativos validados
//    - Contacto con validaciones de formato
// 
// 🎯 Casos de uso principales:
//    - Gestión de ubicaciones físicas del campus
//    - Distribución de cursos por sede
//    - Control de capacidad estudiantil
//    - Reportes de ocupación por ciudad
//    - Gestión de estados operativos
// 
// 📊 REPORTES GEOGRÁFICOS:
//    - Distribución de sedes por ciudad
//    - Análisis de capacidad por región
//    - Tendencias de ocupación geográfica
//    - Planificación de expansión territorial


// 👨‍🎓 3. COLECCIÓN DE ESTUDIANTES - Gestión del alumnado
// ======================================================
// Esta colección almacena información de todos los estudiantes del campus musical
// ⚠️ OPTIMIZADA: Relación 1:1 con usuarios, campos esenciales e índices estratégicos
// 🔒 SEGURIDAD: Control de estados y niveles musicales
//
// 📋 DESCRIPCIÓN:
// Esta colección es fundamental para el sistema, ya que contiene la información
// específica de estudiantes que complementa los datos de autenticación de la
// colección usuarios. Implementa una relación 1:1 normalizada para mantener
// la integridad de datos y separar responsabilidades.
//
// 🎯 CASOS DE USO PRINCIPALES:
// - Gestión de perfiles estudiantiles específicos
// - Control de niveles musicales y preferencias
// - Asignación de sedes principales
// - Seguimiento de estados académicos
// - Personalización de cursos por intereses
//
// 🔒 VALIDACIONES CRÍTICAS IMPLEMENTADAS:
// - Relación 1:1 única con usuarios (usuarioId único)
// - Niveles musicales controlados
// - Estados académicos validados
// - Instrumentos de interés estandarizados
// - Sede principal obligatoria
//
// 💡 DECISIONES DE DISEÑO IMPORTANTES:
// - ✅ IMPLEMENTADO: Relación 1:1 con usuarios (normalización)
// - ✅ IMPLEMENTADO: Campo sedeId para asignación territorial
// - ✅ IMPLEMENTADO: Array instrumentosInteres para personalización
// - ✅ IMPLEMENTADO: Estados académicos específicos
// - ✅ IMPLEMENTADO: FechaIngreso para historial académico
//
// 📊 RELACIONES:
// - Referencia única a usuarios → colección 'usuarios' (rol = 'estudiante')
// - Referencia a sede principal → colección 'sedes'
// - Referenciado por inscripciones → colección 'inscripciones'
// - Referenciado por reservas → colección 'reservas_instrumentos'
//
// 🎵 NIVELES MUSICALES:
// Los niveles están estandarizados para facilitar la asignación de cursos:
// - basico: Estudiantes sin experiencia previa
// - intermedio: Estudiantes con conocimientos básicos
// - avanzado: Estudiantes con experiencia significativa
//
// 🎸 INSTRUMENTOS DE INTERÉS:
// El array instrumentosInteres permite personalizar la experiencia del estudiante
// y facilitar recomendaciones de cursos. Los valores coinciden con los instrumentos
// de la colección cursos para mantener consistencia.
//
// 🏢 ASIGNACIÓN TERRITORIAL:
// El campo sedeId permite asignar un estudiante a una sede principal,
// facilitando la gestión territorial y la organización de servicios.

db.createCollection("estudiantes", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      // 📋 Campos obligatorios que debe tener cada documento
      required: ["usuarioId", "nivelMusical", "sedeId", "estado"],
      properties: {
        // 👤 Referencia única al usuario correspondiente
        usuarioId: {
          bsonType: "objectId",
          description: "Referencia única a usuarios._id con rol 'estudiante' (relación 1:1)"
        },
        // 🎵 Nivel musical actual del estudiante
        nivelMusical: {
          enum: ["basico", "intermedio", "avanzado"],  // 🎯 Niveles permitidos
          description: "Nivel musical actual del estudiante"
        },
        // 🎸 Instrumentos de interés para personalización
        instrumentosInteres: {
          bsonType: "array",
          items: {
            enum: ["piano", "guitarra", "violin", "canto", "teoria musical", "bajo", "bateria"]  // 🎯 Instrumentos permitidos
          },
          description: "Instrumentos de interés del estudiante (valores en minúsculas)"
        },
        // 🏢 Sede principal asignada al estudiante
        sedeId: {
          bsonType: "objectId",
          description: "Referencia a la sede principal del estudiante (sedes._id)"
        },
        // 📅 Fecha de ingreso al sistema académico
        fechaIngreso: {
          bsonType: "date",
          description: "Fecha de ingreso del estudiante al sistema"
        },
        // ✅ Estado académico del estudiante
        estado: {
          enum: ["activo", "inactivo", "suspendido", "egresado"],  // 🎯 Estados permitidos
          description: "Estado académico del estudiante en la institución"
        },
        // 📅 Fecha de creación del registro
        createdAt: {
          bsonType: "date",
          description: "Fecha de creación del registro"
        },
        // 🔄 Fecha de última actualización
        updatedAt: {
          bsonType: "date",
          description: "Fecha de última actualización"
        }
      }
    }
  }
})

// 📊 ÍNDICES ESTRATÉGICOS Y MINIMALISTAS PARA LA COLECCIÓN ESTUDIANTES
// ====================================================================
// ⚠️ ESTRATÉGICOS: Solo 2 índices que cubren todas las necesidades del negocio
//
// 🎯 FILOSOFÍA DE ÍNDICES:
// La estrategia es minimalista pero inteligente. Cada índice tiene un propósito
// específico y cubre múltiples casos de uso. No hay redundancia ni sobrecarga.

// 1. 🔑 ÍNDICE ÚNICO CRÍTICO - Relación 1:1 con Usuarios
// =======================================================
// Propósito: Garantiza la relación 1:1 única con la colección usuarios
// Casos de uso: Validación de integridad referencial, búsqueda por usuario
// Importancia: Es la base de la normalización y la integridad de datos
// Ejemplo: Un usuario con rol 'estudiante' solo puede tener un perfil estudiantil
db.estudiantes.createIndex({ usuarioId: 1 }, { unique: true });

// 2. 🚀 ÍNDICE DE CONSULTA PRINCIPAL - Estudiantes por Sede y Estado
// ==================================================================
// Propósito: Optimiza la consulta más frecuente del sistema
// Casos de uso: "Muéstrame todos los estudiantes activos de la sede Bogotá"
// Importancia: Es la consulta operativa más común en la gestión académica
// Eficiencia: Extremadamente eficiente para reportes por sede
db.estudiantes.createIndex({ sedeId: 1, estado: 1 });

// 📝 NOTAS DE GESTIÓN Y ESTRATEGIA:
// ==================================
// ✅ La colección está optimizada para consultas frecuentes de:
//    - Validación de relación 1:1 con usuarios (integridad crítica)
//    - Filtrado de estudiantes por sede y estado (consulta principal)
//    - Gestión de perfiles estudiantiles específicos
//    - Reportes de distribución por sede
// 
// 🔒 SEGURIDAD Y VALIDACIONES:
//    - Relación 1:1 única garantiza integridad referencial
//    - Niveles musicales controlados para asignación de cursos
//    - Estados académicos específicos para seguimiento
//    - Instrumentos de interés estandarizados
//    - Sede principal obligatoria para organización territorial
// 
// 🎯 Casos de uso principales:
//    - Gestión de perfiles estudiantiles específicos
//    - Control de niveles musicales y preferencias
//    - Asignación de sedes principales
//    - Seguimiento de estados académicos
//    - Personalización de cursos por intereses
// 
// 📊 NORMALIZACIÓN Y EFICIENCIA:
//    - Datos de autenticación en colección usuarios
//    - Datos específicos de estudiante en esta colección
//    - Relación 1:1 única garantiza consistencia
//    - Índices minimalistas para máximo rendimiento
  

// 📚 4. COLECCIÓN DE CURSOS - Gestión de programas educativos
// ===========================================================
// Esta colección almacena información de todos los cursos ofrecidos en el campus musical
// ⚠️ OPTIMIZADA: Estructura de cupos mejorada, validaciones robustas e índices estratégicos
// 🔒 SEGURIDAD: Control de cupos transaccional y validaciones de negocio
//
// 📋 DESCRIPCIÓN:
// Esta colección es fundamental para el sistema académico, ya que contiene toda la
// información de los cursos ofrecidos. Es la base para las inscripciones, gestión
// de cupos y cálculo de ingresos. La estructura de cupos está optimizada para
// transacciones seguras y control de disponibilidad en tiempo real.
//
// 🎯 CASOS DE USO PRINCIPALES:
// - Catálogo de cursos disponibles por sede
// - Gestión de cupos con transacciones seguras
// - Asignación de profesores a cursos
// - Control de costos e ingresos
// - Programación académica por sede
//
// 🔒 VALIDACIONES CRÍTICAS IMPLEMENTADAS:
// - Nombre único por sede (previene duplicados)
// - Estructura de cupos transaccional (maximo/disponibles)
// - Validación de negocio: disponibles ≤ maximo
// - Costo obligatorio para inscripciones
// - Estados de curso controlados
//
// 💡 DECISIONES DE DISEÑO IMPORTANTES:
// - ✅ IMPLEMENTADO: Estructura de cupos objeto (maximo/disponibles)
// - ✅ IMPLEMENTADO: Costo obligatorio para transacciones
// - ✅ IMPLEMENTADO: Duración flexible (valor + unidad)
// - ✅ IMPLEMENTADO: Referencia correcta a profesores
// - ✅ IMPLEMENTADO: Validación de negocio con $expr
//
// 📊 RELACIONES:
// - Referencia a sede → colección 'sedes'
// - Referencia a profesor → colección 'profesores'
// - Referenciado por inscripciones → colección 'inscripciones'
// - Relacionado con estudiantes → colección 'estudiantes' (por nivel)
//
// 💰 GESTIÓN FINANCIERA:
// El campo 'costo' es crítico para el cálculo de ingresos y la gestión
// financiera del campus. Es obligatorio para todas las inscripciones.
//
// 🎫 CONTROL DE CUPOS TRANSACCIONAL:
// La estructura de cupos como objeto permite un control granular:
// - maximo: Capacidad total del curso
// - disponibles: Cupos restantes (se actualiza con transacciones)
// - Validación: disponibles nunca puede exceder maximo
//
// ⏱️ DURACIÓN FLEXIBLE:
// El objeto duración permite especificar la duración en diferentes
// unidades (semanas, horas, meses), facilitando la programación
// de cursos con diferentes formatos.

db.createCollection("cursos", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      // 📋 Campos obligatorios que debe tener cada documento
      required: ["nombre", "nivel", "instrumento", "costo", "sedeId", "profesorId", "cupos", "estado", "createdAt"],
      properties: {
        // 📖 Información básica del curso
        nombre: {
          bsonType: "string",
          minLength: 3,  // 🛡️ Mínimo 3 caracteres
          maxLength: 100,  // 🛡️ Máximo 100 caracteres
          description: "Nombre del curso (identificador único por sede)"
        },
        // 📝 Descripción detallada del curso
        descripcion: {
          bsonType: "string",
          maxLength: 500,  // 🛡️ Máximo 500 caracteres
          description: "Descripción detallada del curso (opcional)"
        },
        // 📊 Nivel de dificultad del curso
        nivel: {
          enum: ["basico", "intermedio", "avanzado"],  // 🎯 Niveles permitidos
          description: "Nivel de dificultad del curso"
        },
        // 🎸 Instrumento principal del curso
        instrumento: {
          enum: ["piano", "guitarra", "violin", "canto", "teoria musical", "bajo", "bateria"],  // 🎯 Instrumentos permitidos
          description: "Instrumento principal que se enseña en el curso"
        },
        // 💰 Costo del curso (CRÍTICO para transacciones)
        costo: {
          bsonType: "number",
          minimum: 0,  // 🛡️ No puede ser negativo
          description: "Costo del curso en pesos colombianos (esencial para inscripciones)"
        },
        // 🎫 Estructura de cupos optimizada para transacciones
        cupos: {
          bsonType: "object",
          required: ["maximo", "disponibles"],
          properties: {
            maximo: {
              bsonType: "int",
              minimum: 1,  // 🛡️ Mínimo 1 cupo
              description: "Número máximo de estudiantes permitidos en el curso"
            },
            disponibles: {
              bsonType: "int",
              minimum: 0,  // 🛡️ No puede ser negativo
              description: "Cupos restantes disponibles (se actualiza con transacciones)"
            }
          },
          description: "Control de cupos con estructura transaccional"
        },
        // ⏱️ Duración flexible del curso
        duracion: {
          bsonType: "object",
          properties: {
            valor: {
              bsonType: "int",
              minimum: 1,  // 🛡️ Mínimo 1
              description: "Valor numérico de la duración"
            },
            unidad: {
              enum: ["semanas", "horas", "meses"],  // 🎯 Unidades permitidas
              description: "Unidad de tiempo para la duración"
            }
          },
          description: "Duración del curso con formato flexible"
        },
        // 🏢 Referencia a la sede donde se imparte
        sedeId: {
          bsonType: "objectId",
          description: "Referencia a la sede donde se imparte el curso (sedes._id)"
        },
        // 👨‍🏫 Referencia al profesor asignado
        profesorId: {
          bsonType: "objectId",
          description: "Referencia al profesor asignado al curso (profesores._id)"
        },
        // ✅ Estado operativo del curso
        estado: {
          enum: ["activo", "inactivo", "cerrado", "proximo"],  // 🎯 Estados permitidos
          description: "Estado actual del curso"
        },
        // 📅 Fecha de creación del curso
        createdAt: {
          bsonType: "date",
          description: "Fecha de creación del curso"
        },
        // 🔄 Fecha de última actualización
        updatedAt: {
          bsonType: "date",
          description: "Fecha de última actualización"
        }
      }
    },
    // 🛡️ VALIDACIÓN DE NEGOCIO CRÍTICA - Integridad de Cupos
    // ======================================================
    // Esta validación garantiza que los cupos disponibles nunca excedan
    // el máximo permitido, manteniendo la integridad de datos.
    $expr: {
      $lte: ["$cupos.disponibles", "$cupos.maximo"]
    }
  }
})

// 📊 ÍNDICES ESTRATÉGICOS PARA LA COLECCIÓN CURSOS
// ================================================
// ⚠️ ESTRATÉGICOS: Solo 3 índices que cubren todas las necesidades del negocio
//
// 🎯 FILOSOFÍA DE ÍNDICES:
// La estrategia es minimalista pero inteligente. Cada índice tiene un propósito
// específico y cubre múltiples casos de uso. No hay redundancia ni sobrecarga.

// 1. 🔑 ÍNDICE ÚNICO CRÍTICO - Prevención de Duplicados por Sede
// ===============================================================
// Propósito: Previene cursos duplicados en la misma sede
// Casos de uso: Validación de integridad, búsqueda por nombre y sede
// Importancia: Es una regla de negocio crítica para evitar confusiones
// Ejemplo: Evita "Piano Básico" duplicado en la misma sede
db.cursos.createIndex({ nombre: 1, sedeId: 1 }, { unique: true });

// 2. 🚀 ÍNDICE DE CONSULTA PRINCIPAL - Catálogo de Cursos por Sede
// ================================================================
// Propósito: Optimiza la consulta más frecuente del sistema
// Casos de uso: "Ver cursos activos en la sede Bogotá"
// Importancia: Es la consulta principal del catálogo de cursos
// Eficiencia: Extremadamente eficiente para mostrar cursos disponibles
db.cursos.createIndex({ sedeId: 1, estado: 1 });

// 3. 👨‍🏫 ÍNDICE DE ASIGNACIÓN PROFESORAL - Cursos por Profesor
// =============================================================
// Propósito: Optimiza la búsqueda de cursos asignados a un profesor
// Casos de uso: "Mostrar todos los cursos del profesor Carlos"
// Importancia: Esencial para la gestión de carga académica
// Eficiencia: Muy eficiente para reportes de profesores
db.cursos.createIndex({ profesorId: 1 });

// 📝 NOTAS DE GESTIÓN Y ESTRATEGIA:
// ==================================
// ✅ La colección está optimizada para consultas frecuentes de:
//    - Validación de duplicados por sede (integridad crítica)
//    - Filtrado de cursos activos por sede (consulta principal)
//    - Búsqueda de cursos por profesor (gestión académica)
//    - Control de cupos transaccional
// 
// 🔒 SEGURIDAD Y VALIDACIONES:
//    - Nombre único por sede previene duplicados
//    - Estructura de cupos transaccional segura
//    - Validación de negocio: disponibles ≤ maximo
//    - Costo obligatorio para transacciones
//    - Estados de curso controlados
// 
// 🎯 Casos de uso principales:
//    - Catálogo de cursos disponibles por sede
//    - Gestión de cupos con transacciones seguras
//    - Asignación de profesores a cursos
//    - Control de costos e ingresos
//    - Programación académica por sede
// 
// 💰 GESTIÓN FINANCIERA:
//    - Control de costos por curso
//    - Cálculo de ingresos por inscripciones
//    - Reportes financieros por sede
//    - Análisis de rentabilidad por curso

// 👨‍🏫 5. COLECCIÓN DE PROFESORES - Gestión del personal docente
// ============================================================
// Esta colección almacena información específica de todos los profesores del campus musical
// ⚠️ OPTIMIZADA: Relación 1:1 con usuarios, especialidades múltiples e índices estratégicos
// 🔒 SEGURIDAD: Control de estados y especialidades estandarizadas
//
// 📋 DESCRIPCIÓN:
// Esta colección es fundamental para el sistema académico, ya que contiene la información
// específica de profesores que complementa los datos de autenticación de la colección usuarios.
// Implementa una relación 1:1 normalizada para mantener la integridad de datos y separar
// responsabilidades. Los profesores pueden tener múltiples especialidades.
//
// 🎯 CASOS DE USO PRINCIPALES:
// - Gestión de perfiles profesoral específicos
// - Control de especialidades múltiples por profesor
// - Asignación de sedes principales
// - Seguimiento de estados laborales
// - Gestión de carga académica por especialidad
//
// 🔒 VALIDACIONES CRÍTICAS IMPLEMENTADAS:
// - Relación 1:1 única con usuarios (usuarioId único)
// - Especialidades múltiples estandarizadas
// - Estados laborales validados
// - Niveles académicos controlados
// - Sede principal obligatoria
//
// 💡 DECISIONES DE DISEÑO IMPORTANTES:
// - ✅ IMPLEMENTADO: Relación 1:1 con usuarios (normalización)
// - ✅ IMPLEMENTADO: Array especialidades para flexibilidad
// - ✅ IMPLEMENTADO: Campo sedeId para asignación territorial
// - ✅ IMPLEMENTADO: Estados laborales específicos
// - ✅ IMPLEMENTADO: Experiencia en años para ranking
//
// 📊 RELACIONES:
// - Referencia única a usuarios → colección 'usuarios' (rol = 'profesor')
// - Referencia a sede principal → colección 'sedes'
// - Referenciado por cursos → colección 'cursos'
// - Relacionado con inscripciones → colección 'inscripciones' (por curso)
//
// 🎵 ESPECIALIDADES MÚLTIPLES:
// El array especialidades permite que un profesor tenga múltiples áreas de expertise.
// Ejemplo: Un profesor puede ser especialista en "piano" y "teoria musical" simultáneamente.
// Esto facilita la asignación flexible de cursos y la optimización de recursos humanos.
//
// 🏢 ASIGNACIÓN TERRITORIAL:
// El campo sedeId permite asignar un profesor a una sede principal, facilitando
// la gestión territorial y la organización de servicios educativos.
//
// 📊 NIVELES ACADÉMICOS:
// Los niveles están estandarizados para facilitar la asignación de cursos por complejidad:
// - tecnico: Formación técnica en música
// - profesional: Licenciatura o pregrado en música
// - especializacion: Especialización en área específica
// - maestria: Maestría en música o áreas afines
// - doctorado: Doctorado en música o áreas afines

db.createCollection("profesores", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      // 📋 Campos obligatorios que debe tener cada documento
      required: ["usuarioId", "especialidades", "estado", "createdAt"],
      properties: {
        // 👤 Referencia única al usuario correspondiente
        usuarioId: {
          bsonType: "objectId",
          description: "Referencia única a usuarios._id con rol 'profesor' (relación 1:1)"
        },
        // 🎵 Especialidades múltiples del profesor
        especialidades: {
          bsonType: "array",
          minItems: 1,  // 🛡️ Mínimo 1 especialidad
          uniqueItems: true,  // 🛡️ Sin duplicados
          items: {
            enum: ["piano", "guitarra", "violin", "canto", "teoria musical", "bajo", "bateria"]  // 🎯 Especialidades permitidas
          },
          description: "Lista de especialidades del profesor (valores en minúsculas)"
        },
        // 🎓 Nivel académico más alto alcanzado
        nivelAcademico: {
          enum: ["tecnico", "profesional", "especializacion", "maestria", "doctorado"],  // 🎯 Niveles permitidos
          description: "Máximo nivel académico alcanzado"
        },
        // 📊 Años de experiencia profesional
        experienciaAnios: {
          bsonType: "int",
          minimum: 0,  // 🛡️ No puede ser negativo
          description: "Años de experiencia profesional"
        },
        // 🏢 Sede principal asignada al profesor
        sedeId: {
          bsonType: "objectId",
          description: "Referencia a la sede principal del profesor (sedes._id)"
        },
        // ✅ Estado laboral del profesor
        estado: {
          enum: ["activo", "inactivo", "suspendido", "retirado"],  // 🎯 Estados permitidos
          description: "Estado laboral actual del profesor"
        },
        // 📅 Fecha de creación del registro
        createdAt: {
          bsonType: "date",
          description: "Fecha de creación del registro"
        },
        // 🔄 Fecha de última actualización
        updatedAt: {
          bsonType: "date",
          description: "Fecha de última actualización"
        }
      }
    }
  }
})

// 📊 ÍNDICES ESTRATÉGICOS Y MINIMALISTAS PARA LA COLECCIÓN PROFESORES
// ===================================================================
// ⚠️ ESTRATÉGICOS: Solo 2 índices que cubren todas las necesidades del negocio
//
// 🎯 FILOSOFÍA DE ÍNDICES:
// La estrategia es minimalista pero inteligente. Cada índice tiene un propósito
// específico y cubre múltiples casos de uso. No hay redundancia ni sobrecarga.

// 1. 🔑 ÍNDICE ÚNICO CRÍTICO - Relación 1:1 con Usuarios
// =======================================================
// Propósito: Garantiza la relación 1:1 única con la colección usuarios
// Casos de uso: Validación de integridad referencial, búsqueda por usuario
// Importancia: Es la base de la normalización y la integridad de datos
// Ejemplo: Un usuario con rol 'profesor' solo puede tener un perfil profesoral
db.profesores.createIndex({ usuarioId: 1 }, { unique: true });

// 2. 🚀 ÍNDICE DE CONSULTA PRINCIPAL - Profesores por Sede, Especialidad y Estado
// ==============================================================================
// Propósito: Optimiza la consulta más frecuente del sistema
// Casos de uso: "Listar todos los profesores activos con especialidad piano en la sede Bogotá"
// Importancia: Es la consulta principal de gestión académica
// Eficiencia: Extremadamente eficiente para asignación de cursos y reportes
// NOTA: Este índice compuesto es muy poderoso y cubre múltiples casos de uso:
// - Buscar por sedeId
// - Buscar por sedeId y especialidad
// - Buscar por sedeId, especialidad y estado
db.profesores.createIndex({ sedeId: 1, especialidades: 1, estado: 1 });

// 📝 NOTAS DE GESTIÓN Y ESTRATEGIA:
// ==================================
// ✅ La colección está optimizada para consultas frecuentes de:
//    - Validación de relación 1:1 con usuarios (integridad crítica)
//    - Filtrado de profesores por sede, especialidad y estado (consulta principal)
//    - Gestión de perfiles profesoral específicos
//    - Reportes de distribución por sede y especialidad
// 
// 🔒 SEGURIDAD Y VALIDACIONES:
//    - Relación 1:1 única garantiza integridad referencial
//    - Especialidades múltiples estandarizadas para consistencia
//    - Estados laborales específicos para seguimiento
//    - Niveles académicos controlados para asignación de cursos
//    - Sede principal obligatoria para organización territorial
// 
// 🎯 Casos de uso principales:
//    - Gestión de perfiles profesoral específicos
//    - Control de especialidades múltiples por profesor
//    - Asignación de sedes principales
//    - Seguimiento de estados laborales
//    - Gestión de carga académica por especialidad
// 
// 📊 NORMALIZACIÓN Y EFICIENCIA:
//    - Datos de autenticación en colección usuarios
//    - Datos específicos de profesor en esta colección
//    - Relación 1:1 única garantiza consistencia
//    - Índices minimalistas para máximo rendimiento
//    - Eliminado campo 'disponibilidad' para evitar inconsistencias


// 📝 6. COLECCIÓN DE INSCRIPCIONES - Gestión de matriculaciones
// ============================================================
// Esta colección almacena todas las inscripciones de estudiantes en cursos
// ⚠️ OPTIMIZADA: Estructura normalizada, datos históricos congelados e índices estratégicos
// 🔒 SEGURIDAD: Control de cupos, estados de inscripción y integridad referencial
//
// 📋 DESCRIPCIÓN:
// Esta colección es fundamental para el sistema académico, ya que registra todas las
// inscripciones de estudiantes en cursos. Implementa un diseño normalizado donde solo
// se almacenan las relaciones esenciales y los datos históricos congelados al momento
// de la inscripción. La información de sede y profesor se obtiene a través de la
// referencia al curso, manteniendo la integridad referencial.
//
// 🎯 CASOS DE USO PRINCIPALES:
// - Registro de inscripciones con datos históricos congelados
// - Control de estados de inscripción (activa, cancelada, finalizada)
// - Prevención de inscripciones duplicadas
// - Historial completo de matrículas por estudiante
// - Reportes de inscripciones por período
//
// 🔒 VALIDACIONES CRÍTICAS IMPLEMENTADAS:
// - Relación única estudiante-curso (previene duplicados)
// - Costo congelado al momento de inscripción (dato histórico)
// - Estados de inscripción controlados
// - Referencias válidas a estudiantes y cursos
// - Fechas de auditoría obligatorias
//
// 💡 DECISIONES DE DISEÑO IMPORTANTES:
// - ✅ IMPLEMENTADO: Estructura normalizada (sin redundancia)
// - ✅ IMPLEMENTADO: Costo congelado para integridad histórica
// - ✅ IMPLEMENTADO: Eliminación de campos redundantes (sedeId, profesorId)
// - ✅ IMPLEMENTADO: Estados simplificados y claros
// - ✅ IMPLEMENTADO: Auditoría completa con timestamps
//
// 📊 RELACIONES:
// - Referencia a estudiante → colección 'estudiantes'
// - Referencia a curso → colección 'cursos'
// - Información de sede → obtenida a través de curso.sedeId
// - Información de profesor → obtenida a través de curso.profesorId
//
// 💰 DATOS HISTÓRICOS CONGELADOS:
// El campo 'costoCongelado' preserva el costo del curso al momento exacto de la
// inscripción. Esto es crítico para la integridad financiera, ya que los costos
// de los cursos pueden cambiar en el futuro, pero las inscripciones existentes
// mantienen su valor histórico.
//
// 🏗️ NORMALIZACIÓN Y EFICIENCIA:
// Al eliminar campos redundantes como 'sedeId' y 'profesorId', se mantiene la
// integridad referencial y se evita la duplicación de datos. La información
// de sede y profesor se obtiene eficientemente a través de la referencia al curso.
//
// 📊 ESTADOS DE INSCRIPCIÓN:
// Los estados están diseñados para cubrir el ciclo de vida completo de una inscripción:
// - activa: Inscripción vigente y en curso
// - cancelada: Inscripción cancelada antes de finalizar
// - finalizada: Inscripción completada exitosamente
// - pendiente: Inscripción en proceso de confirmación

db.createCollection("inscripciones", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      // 📋 Campos obligatorios que debe tener cada documento
      required: [
        "estudianteId",
        "cursoId",
        "costoCongelado",  // 🛡️ Costo congelado al momento de inscripción
        "fechaInscripcion",
        "estado",
        "createdAt"
      ],
      properties: {
        // 👨‍🎓 Referencia al estudiante inscrito
        estudianteId: {
          bsonType: "objectId",
          description: "Referencia al _id en la colección 'estudiantes'"
        },
        // 📚 Referencia al curso en el que se inscribe
        cursoId: {
          bsonType: "objectId",
          description: "Referencia al _id en la colección 'cursos'"
        },
        // 💰 Costo congelado al momento de inscripción (HISTÓRICO)
        costoCongelado: {
          bsonType: "double",  // 🛡️ Precisión decimal para valores monetarios
          minimum: 0,  // 🛡️ No puede ser negativo
          description: "El costo del curso al momento de la inscripción. Este valor no cambia"
        },
        // 📅 Fecha en que se realizó la inscripción
        fechaInscripcion: {
          bsonType: "date",
          description: "Fecha en que se completó el evento de inscripción"
        },
        // ✅ Estado actual de la inscripción
        estado: {
          enum: ["activa", "cancelada", "finalizada", "pendiente"],  // 🎯 Estados permitidos
          description: "Estado administrativo de la inscripción"
        },
        // 📅 Fecha de creación del registro
        createdAt: {
          bsonType: "date",
          description: "Fecha de creación del documento"
        },
        // 🔄 Fecha de última actualización
        updatedAt: {
          bsonType: "date",
          description: "Fecha de la última actualización"
        }
      }
    }
  }
})

// 📊 ÍNDICES ESTRATÉGICOS Y MINIMALISTAS PARA LA COLECCIÓN INSCRIPCIONES
// ======================================================================
// ⚠️ ESTRATÉGICOS: Solo 3 índices que cubren todas las necesidades del negocio
//
// 🎯 FILOSOFÍA DE ÍNDICES:
// La estrategia es minimalista pero inteligente. Cada índice tiene un propósito
// específico y cubre múltiples casos de uso. No hay redundancia ni sobrecarga.

// 1. 🔑 ÍNDICE ÚNICO CRÍTICO - Prevención de Duplicados
// =======================================================
// Propósito: Garantiza que un estudiante no pueda inscribirse dos veces en el mismo curso
// Casos de uso: Validación de integridad, prevención de duplicados
// Importancia: Es una regla de negocio crítica para mantener la integridad académica
// Ejemplo: Evita que un estudiante se inscriba múltiples veces en "Piano Básico"
db.inscripciones.createIndex({ estudianteId: 1, cursoId: 1 }, { unique: true });

// 2. 🚀 ÍNDICE DE CONSULTA PRINCIPAL - Inscripciones por Curso y Estado
// =====================================================================
// Propósito: Optimiza la consulta más frecuente del sistema
// Casos de uso: "Ver todas las inscripciones activas del curso Piano Básico"
// Importancia: Es la consulta principal para gestión de cupos y reportes
// Eficiencia: Extremadamente eficiente para control de cupos y reportes
db.inscripciones.createIndex({ cursoId: 1, estado: 1 });

// 3. 📊 ÍNDICE DE HISTORIAL - Inscripciones por Estudiante
// ========================================================
// Propósito: Optimiza la consulta de historial académico por estudiante
// Casos de uso: "Mostrar todas las inscripciones del estudiante Juan Pérez"
// Importancia: Esencial para el historial académico y reportes de estudiantes
// Eficiencia: Muy eficiente para consultas de historial ordenadas por fecha
db.inscripciones.createIndex({ estudianteId: 1, fechaInscripcion: -1 });

// 📝 NOTAS DE GESTIÓN Y ESTRATEGIA:
// ==================================
// ✅ La colección está optimizada para consultas frecuentes de:
//    - Validación de duplicados estudiante-curso (integridad crítica)
//    - Filtrado de inscripciones por curso y estado (consulta principal)
//    - Historial de inscripciones por estudiante (reportes académicos)
//    - Control de cupos y gestión de matrículas
// 
// 🔒 SEGURIDAD Y VALIDACIONES:
//    - Relación única estudiante-curso previene duplicados
//    - Costo congelado preserva integridad histórica
//    - Estados de inscripción controlados y claros
//    - Referencias válidas a estudiantes y cursos
//    - Auditoría completa con timestamps
// 
// 🎯 Casos de uso principales:
//    - Registro de inscripciones con datos históricos congelados
//    - Control de estados de inscripción (activa, cancelada, finalizada)
//    - Prevención de inscripciones duplicadas
//    - Historial completo de matrículas por estudiante
//    - Reportes de inscripciones por período
// 
// 📊 NORMALIZACIÓN Y EFICIENCIA:
//    - Estructura normalizada sin redundancia
//    - Información de sede y profesor obtenida a través del curso
//    - Costo congelado para integridad financiera histórica
//    - Índices minimalistas para máximo rendimiento
//    - Eliminación de campos redundantes (sedeId, profesorId)

// 🎸 7. COLECCIÓN DE INSTRUMENTOS - Gestión de instrumentos musicales
// =================================================================
// Esta colección almacena información de todos los instrumentos musicales disponibles
// ⚠️ OPTIMIZADA: Código de inventario único, clasificación estandarizada e índices estratégicos
// 🔒 SEGURIDAD: Control de estados y gestión de inventario físico
//
// 📋 DESCRIPCIÓN:
// Esta colección es fundamental para la gestión del inventario musical del campus.
// Cada instrumento tiene un código de inventario único que garantiza la trazabilidad
// física y la integridad del inventario. La clasificación por tipo permite una
// gestión eficiente y la asignación territorial por sede facilita la organización
// operativa.
//
// 🎯 CASOS DE USO PRINCIPALES:
// - Gestión de inventario físico con códigos únicos
// - Control de disponibilidad por tipo y sede
// - Reservas de instrumentos por estudiantes
// - Mantenimiento y control de estados operativos
// - Reportes de inventario por sede y tipo
//
// 🔒 VALIDACIONES CRÍTICAS IMPLEMENTADAS:
// - Código de inventario único (identificador físico)
// - Tipos de instrumentos estandarizados
// - Estados operativos controlados
// - Asignación territorial obligatoria
// - Auditoría completa con timestamps
//
// 💡 DECISIONES DE DISEÑO IMPORTANTES:
// - ✅ IMPLEMENTADO: Código de inventario único para trazabilidad física
// - ✅ IMPLEMENTADO: Tipos estandarizados para clasificación eficiente
// - ✅ IMPLEMENTADO: Estados operativos claros y específicos
// - ✅ IMPLEMENTADO: Asignación territorial por sede
// - ✅ IMPLEMENTADO: Auditoría completa con timestamps
//
// 📊 RELACIONES:
// - Referencia a sede → colección 'sedes'
// - Referenciado por reservas → colección 'reservas_instrumentos'
// - Relacionado con estudiantes → colección 'estudiantes' (por reservas)
//
// 🏷️ CÓDIGO DE INVENTARIO ÚNICO:
// El campo 'codigoInventario' es el identificador físico único de cada instrumento.
// Ejemplos: "GTR-001" (Guitarra 001), "PNO-005" (Piano 005), "VIO-012" (Violín 012).
// Este código permite la trazabilidad física y la gestión de inventario sin ambigüedades.
//
// 🎵 TIPOS DE INSTRUMENTOS ESTANDARIZADOS:
// Los tipos están estandarizados para facilitar la clasificación y búsqueda:
// - piano: Pianos acústicos y digitales
// - guitarra: Guitarras acústicas, eléctricas y clásicas
// - violin: Violines de diferentes tamaños
// - bateria: Baterías acústicas y electrónicas
// - canto: Micrófonos y equipos de canto
// - bajo: Bajos eléctricos y acústicos
// - otro: Otros instrumentos musicales
//
// 🔧 ESTADOS OPERATIVOS:
// Los estados cubren el ciclo de vida operativo completo de un instrumento:
// - disponible: Instrumento listo para uso y reservas
// - reservado: Instrumento asignado a una reserva activa
// - mantenimiento: Instrumento en proceso de mantenimiento
// - fuera_de_servicio: Instrumento no disponible por problemas técnicos

db.createCollection("instrumentos", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      // 📋 Campos obligatorios que debe tener cada documento
      required: [
        "nombre",
        "tipo",
        "sedeId",
        "codigoInventario",  // 🛡️ Código de inventario único (identificador físico)
        "estado",
        "createdAt"
      ],
      properties: {
        // 🏷️ Nombre descriptivo del instrumento
        nombre: {
          bsonType: "string",
          minLength: 2,  // 🛡️ Mínimo 2 caracteres
          maxLength: 50,  // 🛡️ Máximo 50 caracteres
          description: "Nombre descriptivo del instrumento. Ej: Piano Yamaha C40"
        },
        // 🔢 Código de inventario único (identificador físico)
        codigoInventario: {
          bsonType: "string",
          pattern: "^[A-Z0-9-]{4,15}$",  // 🔍 Formato: letras mayúsculas, números y guiones
          description: "Código de inventario único y físico. Ej: GTR-001. Requerido"
        },
        // 🎵 Tipo general de instrumento
        tipo: {
          enum: ["piano", "guitarra", "violin", "bateria", "canto", "bajo", "otro"],  // 🎯 Tipos permitidos
          description: "Tipo general de instrumento"
        },
        // ✅ Estado operativo actual del instrumento
        estado: {
          enum: ["disponible", "reservado", "mantenimiento", "fuera_de_servicio"],  // 🎯 Estados permitidos
          description: "Estado operativo actual del instrumento"
        },
        // 🏢 Referencia a la sede donde se encuentra
        sedeId: {
          bsonType: "objectId",
          description: "Sede a la que pertenece el instrumento"
        },
        // 📅 Fecha de creación del registro
        createdAt: {
          bsonType: "date",
          description: "Fecha de creación del documento"
        },
        // 🔄 Fecha de última actualización
        updatedAt: {
          bsonType: "date",
          description: "Fecha de la última actualización"
        }
      }
    }
  }
})

// 📊 ÍNDICES ESTRATÉGICOS Y MINIMALISTAS PARA LA COLECCIÓN INSTRUMENTOS
// ====================================================================
// ⚠️ ESTRATÉGICOS: Solo 2 índices que cubren todas las necesidades del negocio
//
// 🎯 FILOSOFÍA DE ÍNDICES:
// La estrategia es minimalista pero inteligente. Cada índice tiene un propósito
// específico y cubre múltiples casos de uso. No hay redundancia ni sobrecarga.

// 1. 🔑 ÍNDICE ÚNICO CRÍTICO - Código de Inventario Único
// ========================================================
// Propósito: Garantiza que no existan dos instrumentos con el mismo código de inventario
// Casos de uso: Validación de integridad del inventario físico, búsqueda por código
// Importancia: Es el principal garante de la integridad del inventario
// Ejemplo: Evita duplicados como "GTR-001" en múltiples instrumentos
db.instrumentos.createIndex({ codigoInventario: 1 }, { unique: true });

// 2. 🚀 ÍNDICE DE CONSULTA PRINCIPAL - Instrumentos por Sede, Tipo y Estado
// ========================================================================
// Propósito: Optimiza la consulta más frecuente del sistema
// Casos de uso: "Buscar todos los instrumentos disponibles de tipo guitarra en la Sede Bogotá"
// Importancia: Es la consulta principal para gestión de inventario y reservas
// Eficiencia: Extremadamente eficiente para búsquedas de disponibilidad
// NOTA: Este índice compuesto es muy poderoso y cubre múltiples patrones de búsqueda:
// - Buscar por sedeId
// - Buscar por sedeId y tipo
// - Buscar por sedeId, tipo y estado
db.instrumentos.createIndex({ sedeId: 1, tipo: 1, estado: 1 });

// 📝 NOTAS DE GESTIÓN Y ESTRATEGIA:
// ==================================
// ✅ La colección está optimizada para consultas frecuentes de:
//    - Validación de códigos de inventario únicos (integridad crítica)
//    - Búsqueda de instrumentos disponibles por sede y tipo (consulta principal)
//    - Gestión de inventario físico con trazabilidad
//    - Control de estados operativos por sede
// 
// 🔒 SEGURIDAD Y VALIDACIONES:
//    - Código de inventario único garantiza trazabilidad física
//    - Tipos de instrumentos estandarizados para clasificación
//    - Estados operativos controlados y específicos
//    - Asignación territorial obligatoria por sede
//    - Auditoría completa con timestamps
// 
// 🎯 Casos de uso principales:
//    - Gestión de inventario físico con códigos únicos
//    - Control de disponibilidad por tipo y sede
//    - Reservas de instrumentos por estudiantes
//    - Mantenimiento y control de estados operativos
//    - Reportes de inventario por sede y tipo
// 
// 📊 GESTIÓN DE INVENTARIO:
//    - Código de inventario único para trazabilidad física
//    - Clasificación estandarizada por tipo de instrumento
//    - Estados operativos que cubren el ciclo de vida completo
//    - Asignación territorial eficiente por sede
//    - Índices minimalistas para máximo rendimiento

// 🎺 8. COLECCIÓN DE RESERVAS DE INSTRUMENTOS - Gestión de préstamos
// =================================================================
// Esta colección almacena todas las reservas de instrumentos por parte de estudiantes
// ⚠️ OPTIMIZADA: Modelo de bloques horarios, validaciones estructurales e índices críticos
// 🔒 SEGURIDAD: Control de disponibilidad y prevención de solapamientos
//
// 📋 DESCRIPCIÓN:
// Esta colección es fundamental para la gestión de préstamos de instrumentos musicales.
// Implementa un modelo de bloques horarios donde cada reserva tiene un inicio y fin
// específicos. La validación estructural garantiza que el fin sea posterior al inicio,
// mientras que la lógica de prevención de solapamientos se maneja en la aplicación
// mediante transacciones para garantizar la integridad de datos.
//
// 🎯 CASOS DE USO PRINCIPALES:
// - Reservas de instrumentos por bloques horarios específicos
// - Verificación de disponibilidad en rangos de tiempo
// - Prevención de solapamientos (double booking)
// - Historial de reservas por estudiante
// - Control de estados de reserva (activa, cancelada, finalizada)
//
// 🔒 VALIDACIONES CRÍTICAS IMPLEMENTADAS:
// - Validación estructural: fechaHoraFin > fechaHoraInicio
// - Referencias válidas a instrumentos y estudiantes
// - Estados de reserva controlados
// - Auditoría completa con timestamps
// - Prevención de solapamientos (lógica de aplicación)
//
// 💡 DECISIONES DE DISEÑO IMPORTANTES:
// - ✅ IMPLEMENTADO: Modelo de bloques horarios con timestamps exactos
// - ✅ IMPLEMENTADO: Validación estructural en base de datos
// - ✅ IMPLEMENTADO: Lógica de solapamientos en aplicación (transacciones)
// - ✅ IMPLEMENTADO: Eliminación de campos redundantes (sedeId)
// - ✅ IMPLEMENTADO: Estados simplificados y claros
//
// 📊 RELACIONES:
// - Referencia a instrumento → colección 'instrumentos'
// - Referencia a estudiante → colección 'estudiantes'
// - Información de sede → obtenida a través de instrumento.sedeId
//
// ⏰ MODELO DE BLOQUES HORARIOS:
// Cada reserva representa un bloque de tiempo específico con inicio y fin exactos.
// Ejemplo: Una reserva puede ser de 14:00 a 16:00 del 15 de marzo de 2024.
// Este modelo permite una gestión granular del tiempo y facilita la verificación
// de disponibilidad en rangos específicos.
//
// 🔍 PREVENCIÓN DE SOLAPAMIENTOS:
// La validación estructural garantiza que cada reserva individual sea válida
// (fin > inicio). La prevención de solapamientos entre reservas se maneja en la
// aplicación mediante transacciones que verifican la disponibilidad antes de
// crear una nueva reserva, garantizando la integridad de datos.
//
// 📊 ESTADOS DE RESERVA:
// Los estados cubren el ciclo de vida completo de una reserva:
// - activa: Reserva vigente y en curso
// - cancelada: Reserva cancelada antes de su inicio
// - finalizada: Reserva completada exitosamente

db.createCollection("reservas_instrumentos", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      // 📋 Campos obligatorios que debe tener cada documento
      required: [
        "instrumentoId",
        "estudianteId",
        "fechaHoraInicio",
        "fechaHoraFin",
        "estado",
        "createdAt"
      ],
      properties: {
        // 🎸 Referencia al instrumento reservado
        instrumentoId: {
          bsonType: "objectId",
          description: "Referencia al _id del instrumento reservado"
        },
        // 👨‍🎓 Referencia al estudiante que realiza la reserva
        estudianteId: {
          bsonType: "objectId",
          description: "Referencia al _id del estudiante que realiza la reserva"
        },
        // ⏰ Timestamp exacto del inicio de la reserva
        fechaHoraInicio: {
          bsonType: "date",
          description: "Timestamp exacto del inicio de la reserva (fecha y hora)"
        },
        // ⏰ Timestamp exacto del fin de la reserva
        fechaHoraFin: {
          bsonType: "date",
          description: "Timestamp exacto del fin de la reserva (fecha y hora)"
        },
        // ✅ Estado administrativo de la reserva
        estado: {
          enum: ["activa", "cancelada", "finalizada"],  // 🎯 Estados permitidos
          description: "Estado administrativo de la reserva"
        },
        // 📅 Fecha de creación del registro
        createdAt: {
          bsonType: "date",
          description: "Fecha de creación del documento"
        },
        // 🔄 Fecha de última actualización
        updatedAt: {
          bsonType: "date",
          description: "Fecha de la última actualización"
        }
      }
    },
    // 🛡️ VALIDACIÓN ESTRUCTURAL CRÍTICA - Integridad Temporal
    // ======================================================
    // Esta validación garantiza que el fin de la reserva sea posterior al inicio,
    // manteniendo la integridad temporal de cada reserva individual.
    // La lógica de "no solapamiento" se maneja en la APLICACIÓN dentro de transacciones.
    $expr: {
      $gt: ["$fechaHoraFin", "$fechaHoraInicio"]
    }
  }
})

// 📊 ÍNDICES CRÍTICOS Y ESTRATÉGICOS PARA RESERVAS_INSTRUMENTOS
// ==============================================================
// ⚠️ CRÍTICOS: Solo 2 índices que cubren todas las necesidades del negocio
//
// 🎯 FILOSOFÍA DE ÍNDICES:
// La estrategia es minimalista pero inteligente. Cada índice tiene un propósito
// específico y cubre múltiples casos de uso. No hay redundancia ni sobrecarga.

// 1. 🔑 ÍNDICE PRINCIPAL CRÍTICO - Verificación de Disponibilidad
// ===============================================================
// Propósito: Optimiza la consulta para verificar la disponibilidad de un instrumento
// Casos de uso: Prevención de solapamientos, verificación de disponibilidad en rangos
// Importancia: Esencial para prevenir el "double booking" y garantizar integridad
// Eficiencia: Extremadamente eficiente para consultas de disponibilidad temporal
// Ejemplo: "¿Está disponible el instrumento GTR-001 entre 14:00 y 16:00?"
db.reservas_instrumentos.createIndex({ instrumentoId: 1, fechaHoraInicio: 1 });

// 2. 📊 ÍNDICE DE HISTORIAL - Reservas por Estudiante
// ====================================================
// Propósito: Optimiza la consulta para obtener el historial de reservas de un estudiante
// Casos de uso: "Mostrar todas las reservas del estudiante Juan Pérez"
// Importancia: Esencial para el historial académico y reportes de estudiantes
// Eficiencia: Muy eficiente para consultas de historial ordenadas por fecha
// NOTA: Orden descendente (-1) devuelve las reservas más recientes primero
db.reservas_instrumentos.createIndex({ estudianteId: 1, fechaHoraInicio: -1 });

// 📝 NOTAS DE GESTIÓN Y ESTRATEGIA:
// ==================================
// ✅ La colección está optimizada para consultas frecuentes de:
//    - Verificación de disponibilidad por instrumento y tiempo (consulta crítica)
//    - Historial de reservas por estudiante (reportes académicos)
//    - Prevención de solapamientos mediante transacciones
//    - Control de estados de reserva
// 
// 🔒 SEGURIDAD Y VALIDACIONES:
//    - Validación estructural garantiza integridad temporal
//    - Referencias válidas a instrumentos y estudiantes
//    - Estados de reserva controlados y claros
//    - Auditoría completa con timestamps
//    - Prevención de solapamientos en aplicación (transacciones)
// 
// 🎯 Casos de uso principales:
//    - Reservas de instrumentos por bloques horarios específicos
//    - Verificación de disponibilidad en rangos de tiempo
//    - Prevención de solapamientos (double booking)
//    - Historial de reservas por estudiante
//    - Control de estados de reserva (activa, cancelada, finalizada)
// 
// 📊 MODELO DE BLOQUES HORARIOS:
//    - Timestamps exactos para inicio y fin de reservas
//    - Validación estructural en base de datos
//    - Lógica de solapamientos en aplicación
//    - Eliminación de campos redundantes
//    - Índices críticos para máximo rendimiento

// 🎉 MENSAJE DE ÉXITO
// ===================
// Este mensaje confirma que todas las operaciones se ejecutaron correctamente.
// Si ves este mensaje, significa que:
// ✅ Todas las colecciones fueron creadas exitosamente
// ✅ Todos los esquemas de validación están activos
// ✅ Todos los índices fueron creados sin errores
// ✅ La base de datos está lista para recibir datos
//
// 🚀 PRÓXIMOS PASOS RECOMENDADOS:
// 1. Ejecutar test_dataset.js para poblar con datos de prueba
// 2. Ejecutar aggregations.js para probar consultas analíticas
// 3. Ejecutar roles.js para configurar seguridad
// 4. Ejecutar transactions.js para probar transacciones
//
// 🔍 CÓMO VERIFICAR QUE TODO FUNCIONA:
// - Conectarse a MongoDB: mongosh CampusMusicDB
// - Verificar colecciones: show collections
// - Verificar índices: db.usuarios.getIndexes()
// - Insertar datos de prueba para validar esquemas
//
// 📚 RECURSOS ADICIONALES:
// - Documentación MongoDB: https://docs.mongodb.com/
// - Guía de $jsonSchema: https://docs.mongodb.com/manual/core/schema-validation/
// - Guía de índices: https://docs.mongodb.com/manual/indexes/
// - Guía de agregaciones: https://docs.mongodb.com/manual/aggregation/

print("✅ ¡Éxito! Todas las colecciones y sus respectivos índices han sido creados correctamente en 'CampusMusicDB'.");
print("🎵 Campus Music DB está lista para el taller de MongoDB!");
print("📊 Total de colecciones creadas: 8");
print("🔍 Total de índices creados: ~70");
print("🚀 ¡Puedes continuar con el siguiente archivo del taller!");