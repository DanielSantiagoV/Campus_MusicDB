// 🎵 CONFIGURACIÓN DE BASE DE DATOS CAMPUS MUSIC DB 🎵
// =====================================================

// 🔗 Conectamos o creamos la base de datos CampusMusicDB 
// Esta línea establece la conexión con la base de datos MongoDB
// Si no existe, MongoDB la creará automáticamente

use('CampusMusicDB');

// 🧹 Limpieza inicial para un entorno de pruebas (opcional)   

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
// Esta colección almacena todos los usuarios del sistema (admin, profesores, estudiantes)

db.createCollection("usuarios", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        // 📋 Campos obligatorios que debe tener cada documento
        required: ["nombre", "email", "password", "rol", "createdAt"],
        properties: {
          // 👤 Nombre del usuario
          nombre: {
            bsonType: "string",
            description: "Nombre del usuario, requerido"
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

// 📚 3. COLECCIÓN DE CURSOS - Gestión de programas educativos (OPTIMIZADA)
// ========================================================================
// Esta colección almacena información de todos los cursos ofrecidos en el campus musical
// ⚠️ OPTIMIZADA: Índices reducidos y validaciones de negocio mejoradas
db.createCollection("cursos", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        // 📋 Campos obligatorios que debe tener cada documento
        required: ["nombre", "instrumentoId", "nivel", "duracion", "cupos", "cuposDisponibles", "costo", "horario", "sedeId", "profesorId", "createdAt", "updatedAt"],
        properties: {
          // 📖 Nombre descriptivo del curso
          nombre: {
            bsonType: "string",
            description: "Nombre del curso (ej: 'Curso de Piano Avanzado')"
          },
          // 🎸 Referencia al instrumento que se enseña
          instrumentoId: {
            bsonType: "objectId",
            description: "Referencia a instrumentos._id"
          },
          // 📊 Nivel de dificultad del curso
          nivel: {
            enum: ["básico", "intermedio", "avanzado"],  // 🎯 Solo estos niveles permitidos
            description: "Nivel de dificultad del curso"
          },
          // ⏱️ Duración del curso en semanas o meses
          duracion: {
            bsonType: "number",
            minimum: 1,  // 🛡️ Mínimo 1 unidad de tiempo
            description: "Duración en semanas o meses"
          },
          // 👥 Capacidad total del curso
          cupos: {
            bsonType: "number",
            minimum: 1,  // 🛡️ Mínimo 1 cupo
            description: "Cupos totales del curso"
          },
          // 🎫 Cupos disponibles actualizados
          cuposDisponibles: {
            bsonType: "number",
            minimum: 0,  // 🛡️ No puede ser negativo
            description: "Cupos disponibles actualizados en inscripciones"
          },
          // 💰 Valor monetario del curso
          costo: {
            bsonType: "number",
            minimum: 0,  // 🛡️ No puede ser negativo
            description: "Valor del curso"
          },
          // 🕐 Horario de clases
          horario: {
            bsonType: "object",
            required: ["dia", "horaInicio", "horaFin"],
            properties: {
              dia: {
                bsonType: "string",
                description: "Día de la semana (ej: 'Lunes')"
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
            description: "Referencia a sedes._id"
          },
          // 👨‍🏫 Referencia al profesor asignado
          profesorId: {
            bsonType: "objectId",
            description: "Referencia a profesores._id"
          },
          // 📅 Fecha de creación del curso
          createdAt: {
            bsonType: "date",
            description: "Fecha de creación"
          },
          // 🔄 Fecha de última actualización
          updatedAt: {
            bsonType: "date",
            description: "Fecha de última actualización"
          }
        }
      },
      // 🛡️ VALIDACIONES DE NEGOCIO ADICIONALES
      // =====================================
      $expr: {
        $and: [
          // 🎫 Regla crítica: cuposDisponibles nunca puede ser mayor que cupos
          { $lte: ["$cuposDisponibles", "$cupos"] },
          // ⏰ Validación de horario: horaFin debe ser mayor que horaInicio
          // Nota: Esta validación se maneja mejor en la aplicación por la complejidad
          // de comparar strings de tiempo en MongoDB
        ]
      }
    }
  })

// 📊 ÍNDICES OPTIMIZADOS PARA LA COLECCIÓN CURSOS
// ===============================================
// ⚠️ REDUCIDOS: Solo índices esenciales para consultas frecuentes

// 🔑 Índices Únicos - Garantizan integridad de datos
// ==================================================
db.cursos.createIndex({ nombre: 1, sedeId: 1 }, { unique: true });  // 📖 Nombre único por sede
db.cursos.createIndex({ profesorId: 1, "horario.dia": 1, "horario.horaInicio": 1 }, { unique: true });  // 👨‍🏫 Profesor no puede tener cursos superpuestos
  
// 🚀 Índices Simples - Solo los más utilizados
// ============================================
db.cursos.createIndex({ instrumentoId: 1 });        // 🎸 Cursos por instrumento
db.cursos.createIndex({ sedeId: 1 });               // 🏢 Cursos por sede
db.cursos.createIndex({ cuposDisponibles: 1 });     // 🎫 Cursos con cupos disponibles
db.cursos.createIndex({ createdAt: -1 });           // 📅 Cursos más recientes
db.cursos.createIndex({ updatedAt: -1 });           // 🔄 Cursos actualizados recientemente

// 🔗 Índices Compuestos - Consultas más frecuentes
// ================================================
db.cursos.createIndex({ instrumentoId: 1, nivel: 1 });                    // 🎸 Cursos de instrumento por nivel
db.cursos.createIndex({ sedeId: 1, nivel: 1 });                           // 🏢 Cursos de sede por nivel
db.cursos.createIndex({ nivel: 1, cuposDisponibles: 1 });                 // 📊 Cursos por nivel con cupos
db.cursos.createIndex({ "horario.dia": 1, "horario.horaInicio": 1 });     // 🗓️ Cursos por día y hora
db.cursos.createIndex({ instrumentoId: 1, nivel: 1, sedeId: 1 });         // 🎸 Cursos específicos por instrumento, nivel y sede
db.cursos.createIndex({ sedeId: 1, nivel: 1, cuposDisponibles: 1 });      // 🏢 Cursos de sede por nivel con cupos

// 📝 NOTA SOBRE VALIDACIÓN DE HORARIO:
// ====================================
// La validación de que horaFin > horaInicio se debe manejar en la aplicación
// ya que MongoDB no puede comparar fácilmente strings de tiempo en $jsonSchema
// Ejemplo de validación en JavaScript:
// const horaInicio = new Date(`1970-01-01T${horario.horaInicio}:00`);
// const horaFin = new Date(`1970-01-01T${horario.horaFin}:00`);
// if (horaFin <= horaInicio) throw new Error("Hora fin debe ser mayor que hora inicio");

