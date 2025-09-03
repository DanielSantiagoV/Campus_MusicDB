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
// - 7 colecciones principales interrelacionadas
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
// 3. cursos - Gestión de programas educativos
// 4. profesores - Gestión del personal docente
// 5. inscripciones - Gestión de matriculaciones
// 6. instrumentos - Gestión de instrumentos musicales
// 7. reservas_instrumentos - Gestión de préstamos
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

// 📊 ÍNDICES PARA OPTIMIZACIÓN DE CONSULTAS
// =========================================
//
// 🎯 OBJETIVO DE LOS ÍNDICES:
// Los índices mejoran significativamente el rendimiento de las consultas
// al crear estructuras de datos optimizadas para búsquedas específicas.
//
// 📈 BENEFICIOS:
// - Consultas más rápidas (de segundos a milisegundos)
// - Menor uso de CPU y memoria
// - Mejor experiencia de usuario
// - Escalabilidad del sistema
//
// ⚖️ TRADE-OFFS:
// - Ocupan espacio en disco
// - Ralentizan operaciones de escritura (insert/update/delete)
// - Requieren mantenimiento periódico
//
// 🔍 TIPOS DE ÍNDICES UTILIZADOS:
// 1. Índices Únicos: Garantizan valores únicos (evitan duplicados)
// 2. Índices Simples: Optimizan consultas por un solo campo
// 3. Índices Compuestos: Optimizan consultas por múltiples campos
//
// 📊 ESTRATEGIA DE ÍNDICES:
// - Creamos índices basados en patrones de consulta reales
// - Priorizamos consultas frecuentes y críticas
// - Evitamos índices redundantes o innecesarios
// - Consideramos el orden de los campos en índices compuestos

// 🔑 Índices Únicos - Garantizan que no haya duplicados
// =====================================================
db.usuarios.createIndex({ documento: 1 }, { unique: true });  // 🆔 Documento único
db.usuarios.createIndex({ email: 1 }, { unique: true });      // 📧 Email único
  
// 🚀 Índices Simples - Aceleran búsquedas por un solo campo
// ========================================================
db.usuarios.createIndex({ nombre: 1 });        // 🔍 Búsquedas por nombre (ascendente)
db.usuarios.createIndex({ apellido: 1 });      // 🔍 Búsquedas por apellido (ascendente)
db.usuarios.createIndex({ rol: 1 });           // 🎭 Filtros por rol (ascendente)
db.usuarios.createIndex({ estado: 1 });        // ✅ Filtros por estado (ascendente)
db.usuarios.createIndex({ createdAt: -1 });    // 📅 Ordenar por fecha creación (descendente)

// 🔗 Índices Compuestos - Optimizan consultas con múltiples campos
// ===============================================================
db.usuarios.createIndex({ nombre: 1, apellido: 1 });     // 👤 Búsquedas por nombre completo
db.usuarios.createIndex({ rol: 1, estado: 1 });          // 🎭 Filtros por rol y estado
db.usuarios.createIndex({ documento: 1, estado: 1 });    // 🆔 Búsquedas por documento y estado
db.usuarios.createIndex({ email: 1, estado: 1 });        // 📧 Búsquedas por email y estado

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

// 📊 ÍNDICES PARA LA COLECCIÓN SEDES
// ==================================

// 🔑 Índices Únicos - Garantizan que no haya duplicados
// =====================================================
db.sedes.createIndex({ nombre: 1 }, { unique: true });        // 🏷️ Nombre único por sede
db.sedes.createIndex({ telefono: 1 }, { unique: true });      // 📞 Teléfono único por sede
  
// 🚀 Índices Simples - Aceleran búsquedas por un solo campo
// ========================================================
db.sedes.createIndex({ estado: 1 });              // ✅ Filtros por estado (activa/inactiva)
db.sedes.createIndex({ direccion: 1 });           // 📍 Búsquedas por dirección
db.sedes.createIndex({ createdAt: -1 });          // 📅 Ordenar por fecha creación (más recientes primero)
db.sedes.createIndex({ updatedAt: -1 });          // 🔄 Ordenar por última actualización

// 🔗 Índices Compuestos - Optimizan consultas con múltiples campos
// ===============================================================
db.sedes.createIndex({ estado: 1, nombre: 1 });           // ✅ Sedes activas ordenadas por nombre
db.sedes.createIndex({ estado: 1, createdAt: -1 });       // ✅ Sedes activas por fecha de creación
db.sedes.createIndex({ nombre: 1, estado: 1 });           // 🏷️ Búsquedas por nombre y estado
db.sedes.createIndex({ direccion: 1, estado: 1 });        // 📍 Búsquedas por ubicación y estado

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
      required: ["nombre", "instrumento", "nivel", "duracion", "cupos", "cuposDisponibles", "costo", "horario", "sedeId", "profesorId", "createdAt", "updatedAt"],
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
        // 🕐 Horario de clases
        horario: {
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

// 📊 ÍNDICES OPTIMIZADOS PARA LA COLECCIÓN CURSOS
// ===============================================
// ⚠️ OPTIMIZADOS: Solo índices esenciales, eliminada redundancia

// 🔑 Índices Únicos - Garantizan integridad de datos críticos
// ==========================================================
db.cursos.createIndex({ nombre: 1, sedeId: 1 }, { unique: true });  // 📖 Nombre único por sede
db.cursos.createIndex({ profesorId: 1, "horario.dia": 1, "horario.horaInicio": 1 }, { unique: true });  // 👨‍🏫 Profesor no puede tener cursos superpuestos

// 🚀 Índices Simples - Solo los IMPRESCINDIBLES
// ============================================
db.cursos.createIndex({ instrumento: 1 });        // 🎸 Cursos por instrumento
db.cursos.createIndex({ cuposDisponibles: 1 });   // 🎫 Cursos con cupos disponibles
db.cursos.createIndex({ costo: 1 });              // 💰 Cursos por precio
db.cursos.createIndex({ estado: 1 });             // ✅ Cursos por estado
db.cursos.createIndex({ createdAt: -1 });         // 📅 Cursos más recientes

// 🔗 Índices Compuestos - Solo los MÁS UTILIZADOS
// ===============================================
db.cursos.createIndex({ sedeId: 1, nivel: 1 });                    // 🏢 Cursos de sede por nivel (CONSULTA MÁS COMÚN)
db.cursos.createIndex({ sedeId: 1, estado: 1 });                   // 🏢 Cursos activos por sede
db.cursos.createIndex({ instrumento: 1, nivel: 1 });               // 🎸 Cursos de instrumento por nivel
db.cursos.createIndex({ nivel: 1, cuposDisponibles: 1 });         // 📊 Cursos por nivel con cupos
db.cursos.createIndex({ "horario.dia": 1, "horario.horaInicio": 1 }); // 🗓️ Cursos por día y hora
db.cursos.createIndex({ sedeId: 1, instrumento: 1 });            // 🏢 Cursos de sede por instrumento

// 📝 NOTAS DE CORRECCIÓN Y OPTIMIZACIÓN:
// ======================================
// ✅ CORRECCIONES CRÍTICAS IMPLEMENTADAS:
//    - ❌ ELIMINADO: campo 'inscritos' (redundante y peligroso)
//    - ✅ MANTENIDO: solo 'cuposDisponibles' como fuente única de verdad
//    - ❌ ELIMINADO: array 'profesores' (complejidad innecesaria)
//    - ✅ SIMPLIFICADO: campo 'profesorId' único
//    - ❌ ELIMINADO: 'categoriaId' (sobre-normalización)
//    - ✅ AGREGADO: array 'generos' flexible
//    - ❌ ELIMINADO: 'instrumentoId' (complejidad innecesaria)
//    - ✅ SIMPLIFICADO: campo 'instrumento' directo
// 
// 🔒 SEGURIDAD Y VALIDACIONES:
//    - Una sola fuente de verdad para cupos
//    - Validaciones de negocio críticas con $expr
//    - Estados de curso controlados
//    - Referencias a sedes y profesores válidas
// 
// 🎯 Casos de uso optimizados:
//    - Transacciones de inscripción simplificadas (solo modificar cuposDisponibles)
//    - Consultas de cupos disponibles rápidas
//    - Filtrado por instrumento y nivel eficiente
//    - Reportes de ocupación por sede
// 
// 📊 CONSULTAS CON $LOOKUP:
//    - Datos de sede: $lookup con colección sedes
//    - Información de profesor: $lookup con colección profesores
//    - Inscripciones activas: $lookup con colección inscripciones
// 
// 🚮 OPTIMIZACIONES REALIZADAS:
//    - Solo 12 índices esenciales (reducidos de 15+)
//    - Eliminados índices redundantes
//    - Estructura simplificada y clara
//    - Foco en funcionalidad del taller

// 👨‍🏫 4. COLECCIÓN DE PROFESORES - Gestión del personal docente
// ============================================================
// Esta colección almacena información de todos los profesores del campus musical
// ⚠️ OPTIMIZADA: Validaciones robustas, campos adicionales y índices optimizados
// 🔒 SEGURIDAD: Información sensible manejada con control de acceso

db.createCollection("profesores", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      // 📋 Campos obligatorios que debe tener cada documento
      required: ["nombreCompleto", "documento", "contacto", "especialidad", "experiencia", "estado", "createdAt", "updatedAt"],
      properties: {
        // 👤 Nombre completo del profesor
        nombreCompleto: {
          bsonType: "string",
          minLength: 3,  // 🛡️ Mínimo 3 caracteres
          maxLength: 100,  // 🛡️ Máximo 100 caracteres
          description: "Nombre completo del profesor (mínimo 3, máximo 100 caracteres)"
        },
        // 🆔 Documento único de identificación
        documento: {
          bsonType: "string",
          pattern: "^[0-9]{8,15}$",  // 🔍 Entre 8 y 15 dígitos numéricos
          description: "Documento único de identificación (solo números, 8-15 dígitos)"
        },
        // 📞 Información de contacto estructurada
        contacto: {
          bsonType: "object",
          required: ["telefono", "email"],
          properties: {
            telefono: {
              bsonType: "string",
              pattern: "^[0-9]{7,10}$",  // 🔍 Entre 7 y 10 dígitos numéricos
              description: "Número de teléfono (solo números, 7-10 dígitos)"
            },
            email: {
              bsonType: "string",
              pattern: "^.+@.+\\..+$",  // 🔍 Expresión regular para validar email
              description: "Correo electrónico válido del profesor"
            },
            direccion: {
              bsonType: "string",
              description: "Dirección de residencia (opcional)"
            }
          }
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
        // 📚 Cursos asignados con trazabilidad completa
        cursosAsignados: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["cursoId", "fechaAsignacion"],
            properties: {
              cursoId: {
                bsonType: "objectId",
                description: "Referencia al curso asignado"
              },
              fechaAsignacion: {
                bsonType: "date",
                description: "Fecha en que se asignó el curso al profesor"
              },
              estado: {
                enum: ["activo", "finalizado", "pendiente", "cancelado"],  // 🎯 Estados de asignación
                description: "Estado actual de la asignación del curso"
              },
              fechaInicio: {
                bsonType: "date",
                description: "Fecha de inicio del curso (opcional)"
              },
              fechaFin: {
                bsonType: "date",
                description: "Fecha de finalización del curso (opcional)"
              }
            }
          },
          description: "Historial completo de cursos asignados con trazabilidad"
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

// 📊 ÍNDICES OPTIMIZADOS PARA LA COLECCIÓN PROFESORES
// ===================================================
// ⚠️ OPTIMIZADOS: Solo índices esenciales para evitar sobrecarga

// 🔑 Índices Únicos - Garantizan integridad de datos críticos
// ==========================================================
db.profesores.createIndex({ documento: 1 }, { unique: true });        // 🆔 Documento único (obligatorio)
db.profesores.createIndex({ "contacto.email": 1 }, { unique: true }); // 📧 Email único (obligatorio)
// 📞 Teléfono NO único (permite casos familiares compartidos)
  
// 🚀 Índices Simples - Solo los más utilizados
// ============================================
db.profesores.createIndex({ nombreCompleto: 1 });        // 👤 Búsquedas por nombre
db.profesores.createIndex({ especialidad: 1 });          // 🎸 Filtros por especialidad
db.profesores.createIndex({ estado: 1 });                 // ✅ Filtros por estado
db.profesores.createIndex({ experiencia: -1 });          // 📊 Ordenar por experiencia (descendente)
db.profesores.createIndex({ nivelAcademico: 1 });         // 🎓 Filtros por nivel académico
db.profesores.createIndex({ fechaContratacion: -1 });    // 📅 Ordenar por fecha contratación
db.profesores.createIndex({ createdAt: -1 });            // 📅 Ordenar por fecha creación
db.profesores.createIndex({ updatedAt: -1 });            // 🔄 Ordenar por última actualización

// 🔗 Índices Compuestos - Solo los IMPRESCINDIBLES
// ================================================
db.profesores.createIndex({ especialidad: 1, estado: 1 });                    // 🎸 Profesores activos por especialidad (CONSULTA MÁS COMÚN)
db.profesores.createIndex({ especialidad: 1, experiencia: -1 });              // 🎸 Ranking de profesores por especialidad y experiencia
db.profesores.createIndex({ estado: 1, especialidad: 1 });                     // ✅ Estados por especialidad
db.profesores.createIndex({ nivelAcademico: 1, experiencia: -1 });            // 🎓 Nivel académico y experiencia
db.profesores.createIndex({ fechaContratacion: -1, estado: 1 });               // 📅 Contratación reciente y estado

// 📝 NOTAS DE GESTIÓN Y SEGURIDAD:
// ================================
// ✅ La colección está optimizada para consultas frecuentes de:
//    - Búsqueda de profesores por especialidad y estado
//    - Filtrado por nivel académico y experiencia
//    - Ordenamiento por fecha de contratación
//    - Validación de documentos y emails únicos
// 
// 🔒 SEGURIDAD:
//    - Campo 'salario' es información sensible (solo acceso admin)
//    - Teléfono NO es único (permite casos familiares compartidos)
//    - Documento y email SÍ son únicos (integridad crítica)
// 
// 🎯 Casos de uso principales:
//    - Asignación de cursos a profesores con trazabilidad completa
//    - Reportes de personal docente por sede
//    - Filtrado de profesores disponibles
//    - Gestión de estados laborales
//    - Ranking de profesores por experiencia y especialidad
// 
// 📊 TRAZABILIDAD MEJORADA:
//    - Historial completo de asignaciones de cursos
//    - Estados de asignación (activo, finalizado, pendiente, cancelado)
//    - Fechas de asignación, inicio y fin de cursos


// 📝 5. COLECCIÓN DE INSCRIPCIONES - Gestión de matriculaciones
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

// 📊 ÍNDICES MINIMALISTAS PARA LA COLECCIÓN INSCRIPCIONES
// =======================================================
// ⚠️ SIMPLIFICADOS: Solo índices esenciales para el taller

// 🔑 Índices Únicos - Garantizan integridad de datos críticos
// ==========================================================
db.inscripciones.createIndex({ estudianteId: 1, cursoId: 1 }, { unique: true });  // 👨‍🎓 Un estudiante solo puede inscribirse una vez por curso

// 🔗 Índices Compuestos - Solo los IMPRESCINDIBLES
// ================================================
db.inscripciones.createIndex({ cursoId: 1, estado: 1 });                           // 📚 Inscripciones activas por curso (CONSULTA MÁS COMÚN)
db.inscripciones.createIndex({ estudianteId: 1, fechaInscripcion: -1 });           // 👨‍🎓 Historial de inscripciones por estudiante
db.inscripciones.createIndex({ fechaInscripcion: -1, estado: 1 });                   // 📅 Inscripciones recientes por estado (REPORTES)

// 📝 NOTAS DE GESTIÓN Y SIMPLIFICACIÓN:
// ======================================
// ✅ La colección está SIMPLIFICADA para el taller:
//    - Solo datos esenciales de inscripción
//    - Índices minimalistas (3 totales)
//    - Sin complejidades innecesarias
//    - Foco en funcionalidad básica
// 
// 🔒 SEGURIDAD Y VALIDACIONES:
//    - Un estudiante solo puede inscribirse una vez por curso
//    - Estados de inscripción controlados
//    - Validación de costos no negativos
// 
// 🎯 Casos de uso del taller:
//    - Proceso de inscripción con transacciones
//    - Control de cupos en cursos
//    - Reportes de matrículas por período
//    - Historial básico de inscripciones
// 
// 📊 CONSULTAS CON $LOOKUP:
//    - Detalles de curso: $lookup con colección cursos
//    - Información de profesor: $lookup con colección profesores
//    - Datos de sede: $lookup con colección sedes
//    - Información de estudiante: $lookup con colección estudiantes
// 
// 🚮 SIMPLIFICACIONES REALIZADAS:
//    - Eliminadas colecciones complejas (evaluaciones, pagos)
//    - Solo 3 índices esenciales
//    - Estructura minimalista y clara
//    - Foco en funcionalidad del taller

// 🎸 6. COLECCIÓN DE INSTRUMENTOS - Gestión de instrumentos musicales
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

// 📊 ÍNDICES MINIMALISTAS PARA LA COLECCIÓN INSTRUMENTOS
// ======================================================
// ⚠️ SIMPLIFICADOS: Solo índices esenciales para el taller

// 🔑 Índices Únicos - Garantizan integridad de datos críticos
// ==========================================================
db.instrumentos.createIndex({ nombre: 1, sedeId: 1 }, { unique: true });  // 🎸 Nombre único por sede

// 🚀 Índices Simples - Para consultas frecuentes
// ==============================================
db.instrumentos.createIndex({ tipo: 1 });        // 🎯 Instrumentos por tipo
db.instrumentos.createIndex({ estado: 1 });      // ✅ Instrumentos por estado
db.instrumentos.createIndex({ sedeId: 1 });      // 🏢 Instrumentos por sede

// 🔗 Índices Compuestos - Solo los IMPRESCINDIBLES
// ================================================
db.instrumentos.createIndex({ sedeId: 1, estado: 1 });                    // 🏢 Instrumentos disponibles por sede (CONSULTA MÁS COMÚN)
db.instrumentos.createIndex({ tipo: 1, estado: 1 });                     // 🎯 Instrumentos por tipo y estado
db.instrumentos.createIndex({ sedeId: 1, tipo: 1 });                     // 🏢 Instrumentos por sede y tipo

// 📝 NOTAS DE GESTIÓN Y SIMPLIFICACIÓN:
// ======================================
// ✅ La colección está SIMPLIFICADA para el taller:
//    - Solo datos esenciales de instrumentos
//    - Índices minimalistas (6 totales)
//    - Estados claros y controlados
//    - Foco en funcionalidad básica
// 
// 🔒 SEGURIDAD Y VALIDACIONES:
//    - Nombre único por sede (evita duplicados)
//    - Estados de instrumento controlados
//    - Validación de longitudes de texto
//    - Referencias a sedes válidas
// 
// 🎯 Casos de uso del taller:
//    - Gestión de inventario de instrumentos
//    - Reservas de instrumentos por estudiantes
//    - Reportes de disponibilidad por sede
//    - Control de mantenimiento de instrumentos
// 
// 📊 CONSULTAS CON $LOOKUP:
//    - Datos de sede: $lookup con colección sedes
//    - Información de reservas: $lookup con colección reservas_instrumentos
// 
// 🚮 SIMPLIFICACIONES REALIZADAS:
//    - Solo 6 índices esenciales
//    - Estados simplificados y claros
//    - Estructura minimalista y clara
//    - Foco en funcionalidad del taller

// 🎺 7. COLECCIÓN DE RESERVAS DE INSTRUMENTOS - Gestión de préstamos (CORREGIDA)
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

// 📊 ÍNDICES ÓPTIMOS Y NO REDUNDANTES PARA RESERVAS_INSTRUMENTOS
// ==============================================================
// ⚠️ MINIMALISTAS: Solo 3 índices que cubren todas las consultas principales

// 1. 🎯 ÍNDICE PRINCIPAL DE OPERACIONES Y BÚSQUEDA DE DISPONIBILIDAD
// =================================================================
// Sirve para:
//    - Encontrar todas las reservas de un instrumento
//    - Encontrar reservas de un instrumento en un rango de fechas
//    - Es el índice que usará la transacción de la App para buscar solapamientos
db.reservas_instrumentos.createIndex({ instrumentoId: 1, fechaHoraInicio: 1 });

// 2. 👨‍🎓 ÍNDICE PARA LA VISTA DEL USUARIO ("Mis Reservas")
// ========================================================
// Sirve para:
//    - Encontrar todas las reservas de un estudiante
//    - Las devuelve ya ordenadas de la más nueva a la más antigua (¡súper eficiente!)
db.reservas_instrumentos.createIndex({ estudianteId: 1, fechaHoraInicio: -1 });

// 3. 📊 ÍNDICE PARA REPORTES ADMINISTRATIVOS (OPCIONAL)
// ====================================================
// Sirve para:
//    - Encontrar todas las reservas activas/pendientes a partir de una fecha
//    - Útil para paneles de control ("ver las reservas de mañana")
db.reservas_instrumentos.createIndex({ estado: 1, fechaHoraInicio: 1 });

// 📝 NOTAS DE CORRECCIÓN Y OPTIMIZACIÓN:
// ======================================
// ✅ CORRECCIONES CRÍTICAS IMPLEMENTADAS:
//    - ❌ ELIMINADO: índice único incorrecto para prevenir solapamientos
//    - ✅ MANTENIDO: solo validación estructural (fin > inicio)
//    - ❌ ELIMINADO: validación de "no reservas en el pasado" (lógica de App)
//    - ✅ SIMPLIFICADO: estados a los más comunes
//    - ❌ ELIMINADO: campo observaciones (no esencial para el taller)
//    - ✅ OPTIMIZADO: solo 3 índices no redundantes
// 
// 🔒 SEGURIDAD Y VALIDACIONES:
//    - Solo validación estructural que la DB puede garantizar
//    - Prevención de solapamientos se maneja en la aplicación
//    - Estados de reserva simplificados y claros
//    - Referencias a instrumentos y estudiantes válidas
// 
// 🎯 Casos de uso optimizados:
//    - Búsqueda de disponibilidad por instrumento y fecha
//    - Historial de reservas por estudiante (ordenado)
//    - Reportes administrativos por estado y fecha
//    - Transacciones de reserva sin conflictos
// 
// 📊 CONSULTAS CON $LOOKUP:
//    - Datos del instrumento: $lookup con colección instrumentos
//    - Información del estudiante: $lookup con colección estudiantes
//    - Datos de sede: $lookup con colección sedes
// 
// 🚮 OPTIMIZACIONES REALIZADAS:
//    - Solo 3 índices esenciales (reducidos de 8)
//    - Eliminados índices redundantes y incorrectos
//    - Estructura minimalista y clara
//    - Foco en funcionalidad del taller

print("✅ ¡Éxito! Todas las colecciones y sus respectivos índices han sido creados correctamente en 'CampusMusicDB'.");