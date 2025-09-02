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