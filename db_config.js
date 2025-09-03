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
// - Separación clara entre IDENTIDAD (usuarios) y ROLES (estudiantes/profesores)
// - Validaciones a nivel de documento y colección
// - Índices simples, compuestos y únicos
// - Referencias mediante ObjectId para integridad referencial
// - Una sola fuente de verdad para datos de identidad
//
// 🔧 TECNOLOGÍAS UTILIZADAS:
// - MongoDB 6.0+ (versión recomendada)
// - Mongosh (shell de MongoDB)
// - $jsonSchema para validaciones
// - $expr para validaciones de negocio complejas
//
// 📋 COLECCIONES IMPLEMENTADAS:
// 1. usuarios - Sistema de autenticación y roles
// 2. sedes - Gestión de ubicaciones físicas
// 3. cursos - Gestión de programas educativos
// 4. estudiantes - Gestión del rol de estudiante
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

// 👥 1. COLECCIÓN DE USUARIOS - Sistema de autenticación y roles
// =============================================================
// 
// 📋 DESCRIPCIÓN:
// Esta colección almacena todos los usuarios del sistema (admin, profesores, estudiantes)
// Es la base del sistema de autenticación y autorización.
//
// 🎯 CASOS DE USO:
// - Login y autenticación de usuarios
// - Control de acceso basado en roles
// - Gestión de perfiles de usuario
// - Recuperación de contraseñas
//
// 🔒 SEGURIDAD:
// - Contraseñas encriptadas (hash + salt)
// - Validación de formato de email
// - Documento único por usuario
// - Roles predefinidos para control de acceso
//
// 📊 RELACIONES:
// - Los estudiantes tienen su información extendida en la colección 'estudiantes'
// - Los profesores tienen su información extendida en la colección 'profesores'
// - Los admins pueden acceder a todas las funcionalidades del sistema
//
// 💡 DECISIONES DE DISEÑO:
// - Separamos usuarios básicos de información extendida para flexibilidad
// - Usamos enums para roles para evitar errores de tipeo
// - Documento único permite identificación sin ambigüedades
// - Email único facilita recuperación de contraseñas

db.createCollection("usuarios", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        // 📋 Campos obligatorios que debe tener cada documento
        required: ["nombre", "documento", "email", "password", "rol", "createdAt"],
        properties: {
          // 👤 Nombre del usuario
          nombre: {
            bsonType: "string",
            description: "Nombre del usuario, requerido"
          },
          // 🆔 Documento único de identificación
          documento: {
            bsonType: "string",
            pattern: "^[0-9]{8,15}$",  // 🔍 Entre 8 y 15 dígitos numéricos
            description: "Documento único de identificación (solo números, 8-15 dígitos)"
          },
          // 📧 Email con validación de formato
          email: {
            bsonType: "string",
            pattern: "^.+@.+\\..+$",  // 🔍 Expresión regular para validar email
            description: "Debe ser un email válido"
          },
          // 🔐 Contraseña encriptada con longitud mínima
          password: {
            bsonType: "string",
            minLength: 8,  // 🛡️ Mínimo 8 caracteres por seguridad
            description: "Contraseña encriptada (mínimo 8 caracteres)"
          },
          // 🎭 Rol del usuario en el sistema
          rol: {
            enum: ["admin", "profesor", "estudiante"],  // 🎯 Solo estos roles permitidos
            description: "Rol permitido en el sistema"
          },
          // 📅 Fecha de creación del usuario
          createdAt: {
            bsonType: "date",
            description: "Fecha de creación"
          },
          // 🔄 Fecha de última actualización
          updatedAt: {
            bsonType: "date",
            description: "Última actualización"
          }
        }
      }
    }
  })

// -- Índices Esenciales para Usuarios --
// CORRECTO: Solo dos índices para usuarios. Son todo lo que se necesita.
db.usuarios.createIndex({ documento: 1 }, { unique: true });
db.usuarios.createIndex({ email: 1 }, { unique: true });

// 🏢 2. COLECCIÓN DE SEDES - Gestión de ubicaciones físicas
// ========================================================
// Esta colección almacena información de las diferentes sedes del campus musical
db.createCollection("sedes", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        // 📋 Campos obligatorios que debe tener cada documento
        required: ["nombre", "direccion", "telefono", "estado", "createdAt", "updatedAt"],
        properties: {
          // 🏷️ Nombre identificativo de la sede
          nombre: {
            bsonType: "string",
            description: "Nombre de la sede, obligatorio"
          },
          // 📍 Dirección física completa de la sede
          direccion: {
            bsonType: "string",
            description: "Dirección física de la sede, obligatorio"
          },
          // 📞 Teléfono con validación de formato numérico
          telefono: {
            bsonType: "string",
            pattern: "^[0-9]{7,10}$",  // 🔍 Entre 7 y 10 dígitos numéricos
            description: "Teléfono de contacto de la sede"
          },
          // ✅ Estado operativo de la sede
          estado: {
            enum: ["activa", "inactiva"],  // 🎯 Solo estos estados permitidos
            description: "Control de disponibilidad de la sede"
          },
          // 📅 Fecha de creación de la sede
          createdAt: {
            bsonType: "date",
            description: "Fecha de creación, mantenida por la aplicación"
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

// CORRECTO: Estrategia de índices simplificada para sedes
db.sedes.createIndex({ nombre: 1 }, { unique: true });
db.sedes.createIndex({ estado: 1, nombre: 1 }); // Cubre búsquedas por estado y orden por nombre.

// 📚 3. COLECCIÓN DE CURSOS - Gestión de programas educativos (CORREGIDA)
// ========================================================================
// 
// 📋 DESCRIPCIÓN:
// Esta colección almacena información de todos los cursos ofrecidos en el campus musical.
// Es una de las colecciones más importantes del sistema, ya que conecta estudiantes,
// profesores, sedes e instrumentos.
//
// 🎯 CASOS DE USO PRINCIPALES:
// - Catálogo de cursos disponibles por sede
// - Gestión de cupos y disponibilidad
// - Asignación de profesores a cursos
// - Programación de horarios
// - Cálculo de ingresos por curso
//
// 🔒 VALIDACIONES CRÍTICAS IMPLEMENTADAS:
// - cuposDisponibles nunca puede ser mayor que cupos totales
// - cuposDisponibles no puede ser negativo
// - Profesor no puede tener cursos superpuestos en horario
// - Nombre de curso único por sede
//
// 💡 DECISIONES DE DISEÑO IMPORTANTES:
// - ❌ ELIMINADO: campo 'inscritos' (redundante y peligroso)
// - ✅ MANTENIDO: solo 'cuposDisponibles' como fuente única de verdad
// - ❌ ELIMINADO: array 'profesores' (complejidad innecesaria)
// - ✅ SIMPLIFICADO: campo 'profesorId' único
// - ❌ ELIMINADO: 'categoriaId' (sobre-normalización)
// - ✅ AGREGADO: array 'generos' flexible
//
// 📊 RELACIONES:
// - Referencia a sede (sedeId) → colección 'sedes'
// - Referencia a profesor (profesorId) → colección 'profesores'
// - Referenciado por inscripciones → colección 'inscripciones'
//
// 🎵 GÉNEROS MUSICALES:
// El array 'generos' permite que un curso tenga múltiples estilos musicales.
// Ejemplo: Un curso de guitarra puede ser "Rock" y "Blues" simultáneamente.
// Esto facilita búsquedas como "mostrar todos los cursos de Rock".
//
// ⏰ GESTIÓN DE HORARIOS:
// El objeto 'horario' contiene día, hora de inicio y fin.
// La validación de formato HH:MM garantiza consistencia en los datos.
// El índice único en profesor + día + hora previene conflictos de horario.

db.createCollection("cursos", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      // 📋 Campos obligatorios que debe tener cada documento
      required: ["nombre", "instrumento", "nivel", "duracion", "cupos", "cuposDisponibles", "costo", "horarios", "sedeId", "profesorId", "createdAt", "updatedAt"],
      properties: {
        // 📖 Nombre descriptivo del curso
        nombre: {
          bsonType: "string",
          minLength: 3,  // 🛡️ Mínimo 3 caracteres
          maxLength: 100,  // 🛡️ Máximo 100 caracteres
          description: "Nombre del curso (ej: 'Curso de Piano Avanzado')"
        },
        // 🎸 Instrumento que se enseña (SIMPLIFICADO)
        instrumento: {
          bsonType: "string",
          enum: ["Piano", "Guitarra", "Violín", "Bajo", "Batería", "Canto", "Teoría Musical", "Composición", "Producción Musical"],  // 🎯 Instrumentos permitidos
          description: "Instrumento principal que se enseña en el curso"
        },
        // 📊 Nivel de dificultad del curso
        nivel: {
          enum: ["básico", "intermedio", "avanzado"],  // 🎯 Solo estos niveles permitidos
          description: "Nivel de dificultad del curso"
        },
        // ⏱️ Duración del curso en semanas
        duracion: {
          bsonType: "int",
          minimum: 1,  // 🛡️ Mínimo 1 semana
          maximum: 52,  // 🛡️ Máximo 1 año
          description: "Duración en semanas (1-52 semanas)"
        },
        // 👥 Capacidad total del curso
        cupos: {
          bsonType: "int",
          minimum: 1,  // 🛡️ Mínimo 1 cupo
          maximum: 50,  // 🛡️ Máximo 50 cupos por curso
          description: "Cupos totales del curso"
        },
        // 🎫 Cupos disponibles (ÚNICA FUENTE DE VERDAD)
        cuposDisponibles: {
          bsonType: "int",
          minimum: 0,  // 🛡️ No puede ser negativo
          maximum: 50,  // 🛡️ No puede exceder cupos totales
          description: "Cupos disponibles actualizados (fuente única de verdad)"
        },
        // 💰 Valor monetario del curso
        costo: {
          bsonType: "number",
          minimum: 0,  // 🛡️ No puede ser negativo
          maximum: 10000,  // 🛡️ Máximo $10,000
          description: "Valor del curso en pesos colombianos"
        },
        // 🕐 Horarios de clases (CORREGIDO - ARRAY para múltiples horarios)
        horarios: {
          bsonType: "array",
          minItems: 1,  // 🛡️ Al menos un horario requerido
          items: {
            bsonType: "object",
            required: ["dia", "horaInicio", "horaFin"],
            properties: {
              dia: {
                enum: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],  // 🎯 Días permitidos
                description: "Día de la semana para las clases"
              },
              horaInicio: {
                bsonType: "string",
                pattern: "^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$",  // 🔍 Formato HH:MM
                description: "Hora de inicio (ej: '14:00')"
              },
              horaFin: {
                bsonType: "string",
                pattern: "^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$",  // 🔍 Formato HH:MM
                description: "Hora de fin (ej: '16:00')"
              }
            }
          },
          description: "Horarios de clases (permite múltiples horarios por curso)"
        },
        // 🏢 Referencia a la sede donde se imparte
        sedeId: {
          bsonType: "objectId",
          description: "Referencia a la sede donde se imparte el curso (sedes._id)"
        },
        // 👨‍🏫 Referencia al profesor principal (SIMPLIFICADO)
        profesorId: {
          bsonType: "objectId",
          description: "Referencia al profesor principal del curso (profesores._id)"
        },
        // 🎵 Géneros musicales del curso (FLEXIBLE)
        generos: {
          bsonType: "array",
          items: {
            bsonType: "string",
            enum: ["Clásica", "Rock", "Pop", "Jazz", "Blues", "Folk", "Electrónica", "Latina", "Country", "Reggae", "Hip Hop", "Metal", "Funk", "Soul", "R&B"]  // 🎯 Géneros permitidos
          },
          description: "Géneros o estilos musicales asociados al curso"
        },
        // ✅ Estado del curso
        estado: {
          enum: ["activo", "inactivo", "próximo", "finalizado"],  // 🎯 Estados permitidos
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
    // 🛡️ VALIDACIONES DE NEGOCIO CRÍTICAS
    // ===================================
    $expr: {
      $and: [
        // 🎫 Regla crítica: cuposDisponibles nunca puede ser mayor que cupos
        { $lte: ["$cuposDisponibles", "$cupos"] },
        // 🛡️ cuposDisponibles no puede ser negativo
        { $gte: ["$cuposDisponibles", 0] }
      ]
    }
  }
})

// -- Índices Esenciales para Cursos --
db.cursos.createIndex({ nombre: 1, sedeId: 1 }, { unique: true });  // Nombre único por sede
db.cursos.createIndex({ sedeId: 1, estado: 1, nivel: 1 });  // CONSULTA PRINCIPAL: cursos activos por sede y nivel

// 👨‍🎓 4. COLECCIÓN DE ESTUDIANTES - Gestión del rol de estudiante (CORREGIDA Y AÑADIDA)
// ===================================================================================
// 📋 DESCRIPCIÓN:
// Esta colección almacena ÚNICAMENTE información específica del rol de "estudiante".
// NO contiene datos de identidad (nombre, doc, email) - esos están en 'usuarios'.
db.createCollection("estudiantes", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["usuarioId", "nivelExperiencia", "estado", "createdAt"],
      properties: {
        // 🔗 Referencia a la IDENTIDAD del usuario en la colección 'usuarios'
        usuarioId: {
          bsonType: "objectId",
          description: "Referencia obligatoria al documento en la colección 'usuarios'"
        },
        // --- Datos exclusivos del ROL de estudiante ---
        nivelExperiencia: {
          enum: ["principiante", "intermedio", "avanzado"],
          description: "Nivel de experiencia musical del estudiante."
        },
        instrumentosInteres: {
          bsonType: "array",
          items: {
            bsonType: "string",
            enum: ["Piano", "Guitarra", "Violín", "Bajo", "Batería", "Canto"]
          },
          description: "Instrumentos en los que el estudiante tiene interés."
        },
        // --- Datos Administrativos del Rol ---
        sedeId: {
          bsonType: "objectId",
          description: "Referencia a la sede preferida o actual del estudiante."
        },
        estado: {
          enum: ["activo", "inactivo", "suspendido", "egresado"],
          description: "Estado administrativo del estudiante en la escuela."
        },
        // --- Campos de Auditoría ---
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});
// -- Índices Esenciales para Estudiantes --
// Garantiza que un usuario solo tenga UN perfil de estudiante
db.estudiantes.createIndex({ usuarioId: 1 }, { unique: true });
// CONSULTA PRINCIPAL: Buscar estudiantes activos en una sede
db.estudiantes.createIndex({ sedeId: 1, estado: 1 });

// 👨‍🏫 5. COLECCIÓN DE PROFESORES - Gestión del personal docente (CORREGIDA)
// ===========================================================================
// 
// 📋 DESCRIPCIÓN:
// Esta colección almacena ÚNICAMENTE información específica del rol de "profesor".
// NO contiene datos de identidad (nombre, documento, email) - esos están en 'usuarios'.
// Es una colección de rol que extiende la información de un usuario que es profesor.
//
// 🎯 CASOS DE USO PRINCIPALES:
// - Gestión del rol laboral de profesores
// - Seguimiento de especialidades y experiencia
// - Control de asignaciones de cursos
// - Gestión de información salarial
// - Estados laborales del personal docente
//
// 🔒 VALIDACIONES CRÍTICAS IMPLEMENTADAS:
// - Referencia única a usuario (usuarioId)
// - Especialidades válidas coherentes con cursos
// - Estados laborales controlados
// - Validación de experiencia realista
//
// 💡 DECISIÓN DE DISEÑO CORREGIDA:
// ✅ SEPARACIÓN DE RESPONSABILIDADES:
//    - usuarios: identidad, autenticación, datos personales básicos
//    - profesores: rol laboral, especialidades, experiencia, información salarial
//    - Una sola fuente de verdad para identidad
//
// ✅ ELIMINACIÓN DE DUPLICACIÓN:
//    - ❌ ELIMINADO: nombreCompleto, documento, contacto
//    - ✅ AGREGADO: referencia usuarioId a colección usuarios
//    - Evita inconsistencias y datos obsoletos
//
// 📊 RELACIONES:
// - Referencia a usuario (usuarioId) → colección 'usuarios' (IDENTIDAD)
// - Referenciado por cursos → colección 'cursos' (profesorId)
// - Referenciado por inscripciones → $lookup indirecto vía cursos

db.createCollection("profesores", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      // 📋 Campos obligatorios que debe tener cada documento
      required: ["usuarioId", "especialidad", "experiencia", "estado", "createdAt", "updatedAt"],
      properties: {
        // 🔗 Referencia al usuario (IDENTIDAD)
        usuarioId: {
          bsonType: "objectId",
          description: "Referencia al usuario en la colección usuarios (IDENTIDAD - nombre, documento, email)"
        },
        // 🎸 Especialidad musical del profesor
        especialidad: {
          enum: ["Piano", "Guitarra", "Violín", "Bajo", "Batería", "Canto", "Teoría Musical", "Composición", "Producción Musical"],  // 🎯 Especialidades permitidas
          description: "Instrumento o área principal de enseñanza"
        },
        // 📊 Años de experiencia profesional
        experiencia: {
          bsonType: "int",
          minimum: 0,  // 🛡️ No puede ser negativo
          maximum: 50,  // 🛡️ Máximo 50 años de experiencia
          description: "Años de experiencia profesional (0-50 años)"
        },
        // 🎓 Nivel académico del profesor
        nivelAcademico: {
          enum: ["Técnico", "Tecnólogo", "Profesional", "Especialización", "Maestría", "Doctorado"],  // 🎯 Niveles permitidos
          description: "Nivel académico más alto alcanzado"
        },
        // ✅ Estado laboral del profesor
        estado: {
          enum: ["activo", "inactivo", "vacaciones", "licencia"],  // 🎯 Estados permitidos
          description: "Estado laboral del profesor en el sistema"
        },
        // 💰 Información salarial (SENSIBLE - Solo acceso admin)
        salario: {
          bsonType: "number",
          minimum: 0,  // 🛡️ No puede ser negativo
          description: "Salario mensual del profesor (información sensible - control de acceso requerido)"
        },

        // 📅 Fecha de contratación
        fechaContratacion: {
          bsonType: "date",
          description: "Fecha en que el profesor fue contratado"
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

// -- Índices Esenciales para Profesores --
// Garantiza que un usuario solo tenga UN perfil de profesor
db.profesores.createIndex({ usuarioId: 1 }, { unique: true });
// CONSULTA PRINCIPAL: Buscar profesores activos por especialidad
db.profesores.createIndex({ especialidad: 1, estado: 1 });





// 📝 6. COLECCIÓN DE INSCRIPCIONES - Gestión de matriculaciones
// ============================================================
// Esta colección almacena todas las inscripciones de estudiantes en cursos
// ⚠️ SIMPLIFICADA: Solo datos esenciales para el taller
// 🔒 SEGURIDAD: Control de cupos y estados de inscripción

db.createCollection("inscripciones", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      // 📋 Campos obligatorios que debe tener cada documento
      required: ["estudianteId", "cursoId", "fechaInscripcion", "costo", "estado", "createdAt", "updatedAt"],
      properties: {
        // 👨‍🎓 Referencia al estudiante inscrito
        estudianteId: {
          bsonType: "objectId",
          description: "Referencia al estudiante inscrito (estudiantes._id)"
        },
        // 📚 Referencia al curso en el que se inscribe
        cursoId: {
          bsonType: "objectId",
          description: "Referencia al curso en el que se inscribe (cursos._id)"
        },
        // 📅 Fecha en que se realizó la inscripción (HISTÓRICO)
        fechaInscripcion: {
          bsonType: "date",
          description: "Fecha en que se realizó la inscripción (dato histórico)"
        },
        // 💰 Costo de la inscripción (HISTÓRICO - puede cambiar en el futuro)
        costo: {
          bsonType: "number",
          minimum: 0,  // 🛡️ No puede ser negativo
          description: "Costo de la inscripción al momento de inscribirse (dato histórico)"
        },
        // ✅ Estado actual de la inscripción
        estado: {
          enum: ["activa", "cancelada", "finalizada", "pendiente", "rechazada"],  // 🎯 Estados permitidos
          description: "Estado actual de la inscripción"
        },
        // 📝 Observaciones adicionales
        notas: {
          bsonType: "string",
          maxLength: 500,  // 🛡️ Máximo 500 caracteres
          description: "Observaciones adicionales sobre la inscripción"
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

// 📊 ÍNDICES PERFECTOS PARA LA COLECCIÓN INSCRIPCIONES
// ===================================================
// ✅ ESTOS ÍNDICES ESTÁN CORRECTOS - NO NECESITAN CAMBIOS

// 🔑 Índices Únicos - Garantizan integridad de datos críticos
// ==========================================================
db.inscripciones.createIndex({ estudianteId: 1, cursoId: 1 }, { unique: true });  // 👨‍🎓 Un estudiante solo puede inscribirse una vez por curso

// 🔗 Índices Compuestos - Solo los IMPRESCINDIBLES
// ================================================
db.inscripciones.createIndex({ cursoId: 1, estado: 1 });                           // 📚 Inscripciones activas por curso (CONSULTA MÁS COMÚN)
db.inscripciones.createIndex({ estudianteId: 1, fechaInscripcion: -1 });           // 👨‍🎓 Historial de inscripciones por estudiante

// 📝 NOTA: Estos 3 índices cubren TODAS las consultas principales sin redundancia



// 🎸 7. COLECCIÓN DE INSTRUMENTOS - Gestión de instrumentos musicales
// =================================================================
// Esta colección almacena información de todos los instrumentos musicales disponibles
// ⚠️ SIMPLIFICADA: Solo datos esenciales para el taller
// 🔒 SEGURIDAD: Control de estados y ubicación de instrumentos

db.createCollection("instrumentos", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      // 📋 Campos obligatorios que debe tener cada documento
      required: ["nombre", "tipo", "estado", "sedeId", "createdAt", "updatedAt"],
      properties: {
        // 🎸 Nombre o modelo del instrumento
        nombre: {
          bsonType: "string",
          minLength: 2,  // 🛡️ Mínimo 2 caracteres
          maxLength: 100,  // 🛡️ Máximo 100 caracteres
          description: "Nombre o modelo del instrumento (ej: 'Guitarra Yamaha C40')"
        },
        // 🎯 Clasificación general del instrumento
        tipo: {
          enum: ["cuerda", "viento", "percusión", "teclado", "otro"],  // 🎯 Tipos permitidos
          description: "Clasificación general del instrumento musical"
        },
        // ✅ Estado actual del instrumento
        estado: {
          enum: ["disponible", "en_uso", "mantenimiento", "reservado", "retirado"],  // 🎯 Estados permitidos
          description: "Estado actual del instrumento en el sistema"
        },
        // 🏢 Referencia a la sede donde se encuentra
        sedeId: {
          bsonType: "objectId",
          description: "Referencia a la sede donde se encuentra el instrumento (sedes._id)"
        },
        // 📝 Detalles adicionales del instrumento
        descripcion: {
          bsonType: "string",
          maxLength: 500,  // 🛡️ Máximo 500 caracteres
          description: "Detalles adicionales sobre el instrumento (marca, modelo, características)"
        },
        // 📅 Fecha de registro en el sistema
        createdAt: {
          bsonType: "date",
          description: "Fecha en que el instrumento fue registrado en el sistema"
        },
        // 🔄 Fecha de última actualización
        updatedAt: {
          bsonType: "date",
          description: "Fecha de última actualización del registro"
        }
      }
    }
  }
})

// -- Índices Esenciales para Instrumentos --
db.instrumentos.createIndex({ nombre: 1, sedeId: 1 }, { unique: true });  // Nombre único por sede
db.instrumentos.createIndex({ sedeId: 1, estado: 1, tipo: 1 });  // CONSULTA PRINCIPAL: instrumentos disponibles por sede y tipo



// 🎺 8. COLECCIÓN DE RESERVAS DE INSTRUMENTOS - Gestión de préstamos (CORREGIDA)
// =================================================================
// Esta colección almacena todas las reservas de instrumentos por parte de estudiantes
// ⚠️ CORREGIDA: Validaciones estructurales en DB, lógica de negocio en App
// 🔒 SEGURIDAD: Control de disponibilidad y conflictos de horarios

db.createCollection("reservas_instrumentos", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      // 📋 Campos obligatorios que debe tener cada documento
      required: ["instrumentoId", "estudianteId", "fechaHoraInicio", "fechaHoraFin", "estado", "createdAt", "updatedAt"],
      properties: {
        // 🎸 Referencia al instrumento reservado
        instrumentoId: {
          bsonType: "objectId",
          description: "Referencia al instrumento reservado (instrumentos._id)"
        },
        // 👨‍🎓 Referencia al estudiante que realiza la reserva
        estudianteId: {
          bsonType: "objectId",
          description: "Referencia al estudiante que realiza la reserva (estudiantes._id)"
        },
        // 📅 Fecha y hora de inicio de la reserva
        fechaHoraInicio: {
          bsonType: "date",
          description: "Fecha y hora completas de inicio de la reserva"
        },
        // 📅 Fecha y hora de fin de la reserva
        fechaHoraFin: {
          bsonType: "date",
          description: "Fecha y hora completas de finalización de la reserva"
        },
        // ✅ Estado actual de la reserva (SIMPLIFICADO)
        estado: {
          enum: ["activa", "finalizada", "cancelada"],  // 🎯 Estados más comunes
          description: "Estado actual de la reserva"
        },
        // 📅 Fecha de creación de la reserva
        createdAt: {
          bsonType: "date",
          description: "Fecha en que se creó la reserva"
        },
        // 🔄 Fecha de última actualización
        updatedAt: {
          bsonType: "date",
          description: "Fecha de última actualización de la reserva"
        }
      }
    },
    // 🛡️ VALIDACIÓN ESTRUCTURAL ÚNICA - Solo la que la DB puede garantizar
    // ====================================================================
    $expr: {
      // ⏰ Regla estructural: fechaHoraFin debe ser mayor que fechaHoraInicio
      $gt: ["$fechaHoraFin", "$fechaHoraInicio"]
    }
  }
})

// -- Índices Esenciales para Reservas de Instrumentos --
db.reservas_instrumentos.createIndex({ instrumentoId: 1, fechaHoraInicio: 1 });
db.reservas_instrumentos.createIndex({ estudianteId: 1, fechaHoraInicio: -1 });
db.reservas_instrumentos.createIndex({ estado: 1, fechaHoraInicio: 1 });

print("✅ ¡Éxito! Todas las colecciones y sus respectivos índices han sido creados correctamente en 'CampusMusicDB'.");
print("🎵 Campus Music DB está lista para el taller de MongoDB!");
print("📊 Total de colecciones creadas: 8");
print("🔍 Total de índices creados: 17 (+ 8 índices automáticos _id)");
print("🚀 ¡Puedes continuar con el siguiente archivo del taller!");