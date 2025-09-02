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
