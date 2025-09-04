// ========================================================================
// COLECCIONES ADICIONALES PARA CAMPUS MUSIC DB
// ARCHIVO: colecciones_adicionales.js
// OBJETIVO: Crear colecciones adicionales con esquemas de validación y datos de prueba
// ========================================================================

use('CampusMusicDB');

// ========================================================================
// 1. COLECCIÓN "PAGOS" - Gestión de pagos de inscripciones
// ========================================================================

print("💰 Creando colección PAGOS...");

// Eliminar colección si existe
db.pagos.drop();

// Crear colección con validación
db.createCollection("pagos", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["inscripcionId", "estudianteId", "monto", "metodoPago", "fechaPago", "estado"],
      properties: {
        inscripcionId: {
          bsonType: "objectId",
          description: "Referencia a la inscripción"
        },
        estudianteId: {
          bsonType: "objectId",
          description: "Referencia al estudiante"
        },
        monto: {
          bsonType: ["int", "double"],
          minimum: 0,
          description: "Monto del pago (no puede ser negativo)"
        },
        metodoPago: {
          enum: ["efectivo", "transferencia", "tarjeta_credito", "tarjeta_debito"],
          description: "Método de pago utilizado"
        },
        fechaPago: {
          bsonType: "date",
          description: "Fecha y hora del pago"
        },
        estado: {
          enum: ["pendiente", "completado", "fallido", "reembolsado"],
          description: "Estado del pago"
        },
        referencia: {
          bsonType: "string",
          pattern: "^PAY-[0-9]{4}-[0-9]{3}$",
          description: "Referencia única del pago (formato: PAY-YYYY-NNN)"
        },
        observaciones: {
          bsonType: "string",
          maxLength: 500,
          description: "Observaciones adicionales del pago"
        },
        createdAt: {
          bsonType: "date",
          description: "Fecha de creación del registro"
        }
      }
    }
  }
});

// Crear índices para optimizar consultas
// Índice en inscripcionId: Para buscar pagos por inscripción específica
db.pagos.createIndex({ "inscripcionId": 1 });
// Índice en estudianteId: Para consultar todos los pagos de un estudiante
db.pagos.createIndex({ "estudianteId": 1 });
// Índice en fechaPago: Para consultas por rango de fechas (reportes mensuales)
db.pagos.createIndex({ "fechaPago": 1 });
// Índice en estado: Para filtrar pagos por estado (completado, pendiente, etc.)
db.pagos.createIndex({ "estado": 1 });
// Índice único en referencia: Para evitar duplicados y búsquedas rápidas por referencia
db.pagos.createIndex({ "referencia": 1 }, { unique: true });

// Insertar datos de prueba
var inscripciones = db.inscripciones.find({ estado: "activa" }).limit(15).toArray();
var estudiantes = db.estudiantes.find().limit(15).toArray();

db.pagos.insertMany([
  {
    inscripcionId: inscripciones[0]._id,
    estudianteId: estudiantes[0]._id,
    monto: 450000,
    metodoPago: "tarjeta_credito",
    fechaPago: new Date("2024-01-15T10:30:00Z"),
    estado: "completado",
    referencia: "PAY-2024-001",
    observaciones: "Pago realizado exitosamente",
    createdAt: new Date()
  },
  {
    inscripcionId: inscripciones[1]._id,
    estudianteId: estudiantes[1]._id,
    monto: 520000,
    metodoPago: "transferencia",
    fechaPago: new Date("2024-01-16T14:20:00Z"),
    estado: "completado",
    referencia: "PAY-2024-002",
    observaciones: "Transferencia bancaria confirmada",
    createdAt: new Date()
  },
  {
    inscripcionId: inscripciones[2]._id,
    estudianteId: estudiantes[2]._id,
    monto: 680000,
    metodoPago: "efectivo",
    fechaPago: new Date("2024-01-17T09:15:00Z"),
    estado: "completado",
    referencia: "PAY-2024-003",
    observaciones: "Pago en efectivo en caja",
    createdAt: new Date()
  },
  {
    inscripcionId: inscripciones[3]._id,
    estudianteId: estudiantes[3]._id,
    monto: 580000,
    metodoPago: "tarjeta_debito",
    fechaPago: new Date("2024-01-18T16:45:00Z"),
    estado: "completado",
    referencia: "PAY-2024-004",
    observaciones: "Pago con tarjeta débito",
    createdAt: new Date()
  },
  {
    inscripcionId: inscripciones[4]._id,
    estudianteId: estudiantes[4]._id,
    monto: 650000,
    metodoPago: "tarjeta_credito",
    fechaPago: new Date("2024-01-19T11:30:00Z"),
    estado: "pendiente",
    referencia: "PAY-2024-005",
    observaciones: "Pendiente de confirmación bancaria",
    createdAt: new Date()
  }
]);

print("✅ Colección PAGOS creada con " + db.pagos.countDocuments() + " documentos");

// ========================================================================
// 2. COLECCIÓN "HORARIOS" - Gestión de horarios de clases
// ========================================================================

print("\n🕐 Creando colección HORARIOS...");

// Eliminar colección si existe
db.horarios.drop();

// Crear colección con validación
db.createCollection("horarios", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["cursoId", "profesorId", "diaSemana", "horaInicio", "horaFin", "sala"],
      properties: {
        cursoId: {
          bsonType: "objectId",
          description: "Referencia al curso"
        },
        profesorId: {
          bsonType: "objectId",
          description: "Referencia al profesor"
        },
        diaSemana: {
          enum: ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado"],
          description: "Día de la semana"
        },
        horaInicio: {
          bsonType: "string",
          pattern: "^([01]?[0-9]|2[0-3]):[0-5][0-9]$",
          description: "Hora de inicio (formato HH:MM)"
        },
        horaFin: {
          bsonType: "string",
          pattern: "^([01]?[0-9]|2[0-3]):[0-5][0-9]$",
          description: "Hora de fin (formato HH:MM)"
        },
        sala: {
          bsonType: "string",
          minLength: 2,
          maxLength: 20,
          description: "Sala o aula donde se dicta la clase"
        },
        capacidad: {
          bsonType: "int",
          minimum: 1,
          maximum: 50,
          description: "Capacidad máxima de la sala"
        },
        estado: {
          enum: ["activo", "inactivo", "suspendido"],
          description: "Estado del horario"
        },
        createdAt: {
          bsonType: "date",
          description: "Fecha de creación del horario"
        }
      }
    }
  }
});

// Crear índices para optimizar consultas de horarios
// Índice en cursoId: Para buscar horarios de un curso específico
db.horarios.createIndex({ "cursoId": 1 });
// Índice en profesorId: Para consultar horarios de un profesor
db.horarios.createIndex({ "profesorId": 1 });
// Índice en diaSemana: Para filtrar horarios por día de la semana
db.horarios.createIndex({ "diaSemana": 1 });
// Índice en sala: Para verificar disponibilidad de salas y evitar conflictos
db.horarios.createIndex({ "sala": 1 });

// Insertar datos de prueba
var cursos = db.cursos.find().limit(10).toArray();
var profesores = db.profesores.find().limit(10).toArray();

db.horarios.insertMany([
  {
    cursoId: cursos[0]._id,
    profesorId: profesores[0]._id,
    diaSemana: "lunes",
    horaInicio: "14:00",
    horaFin: "16:00",
    sala: "Sala A",
    capacidad: 12,
    estado: "activo",
    createdAt: new Date()
  },
  {
    cursoId: cursos[1]._id,
    profesorId: profesores[1]._id,
    diaSemana: "martes",
    horaInicio: "15:00",
    horaFin: "17:00",
    sala: "Sala B",
    capacidad: 10,
    estado: "activo",
    createdAt: new Date()
  },
  {
    cursoId: cursos[2]._id,
    profesorId: profesores[2]._id,
    diaSemana: "miercoles",
    horaInicio: "16:00",
    horaFin: "18:00",
    sala: "Sala C",
    capacidad: 8,
    estado: "activo",
    createdAt: new Date()
  },
  {
    cursoId: cursos[3]._id,
    profesorId: profesores[3]._id,
    diaSemana: "jueves",
    horaInicio: "17:00",
    horaFin: "19:00",
    sala: "Sala A",
    capacidad: 12,
    estado: "activo",
    createdAt: new Date()
  },
  {
    cursoId: cursos[4]._id,
    profesorId: profesores[4]._id,
    diaSemana: "viernes",
    horaInicio: "18:00",
    horaFin: "20:00",
    sala: "Sala B",
    capacidad: 10,
    estado: "activo",
    createdAt: new Date()
  },
  {
    cursoId: cursos[5]._id,
    profesorId: profesores[0]._id,
    diaSemana: "sabado",
    horaInicio: "09:00",
    horaFin: "11:00",
    sala: "Sala C",
    capacidad: 8,
    estado: "activo",
    createdAt: new Date()
  }
]);

print("✅ Colección HORARIOS creada con " + db.horarios.countDocuments() + " documentos");

// ========================================================================
// 3. COLECCIÓN "ASISTENCIAS" - Control de asistencia a clases
// ========================================================================

print("\n📋 Creando colección ASISTENCIAS...");

// Eliminar colección si existe
db.asistencias.drop();

// Crear colección con validación
db.createCollection("asistencias", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["estudianteId", "cursoId", "horarioId", "fecha", "estado"],
      properties: {
        estudianteId: {
          bsonType: "objectId",
          description: "Referencia al estudiante"
        },
        cursoId: {
          bsonType: "objectId",
          description: "Referencia al curso"
        },
        horarioId: {
          bsonType: "objectId",
          description: "Referencia al horario"
        },
        fecha: {
          bsonType: "date",
          description: "Fecha de la clase"
        },
        estado: {
          enum: ["presente", "ausente", "justificado", "tardanza"],
          description: "Estado de asistencia del estudiante"
        },
        observaciones: {
          bsonType: "string",
          maxLength: 300,
          description: "Observaciones sobre la asistencia"
        },
        registradoPor: {
          bsonType: "objectId",
          description: "Profesor que registró la asistencia"
        },
        createdAt: {
          bsonType: "date",
          description: "Fecha de creación del registro"
        }
      }
    }
  }
});

// Crear índices para optimizar consultas de asistencia
// Índice compuesto en estudianteId+cursoId+fecha: Para consultas específicas de asistencia
db.asistencias.createIndex({ "estudianteId": 1, "cursoId": 1, "fecha": 1 });
// Índice en horarioId: Para buscar asistencias de un horario específico
db.asistencias.createIndex({ "horarioId": 1 });
// Índice en fecha: Para reportes de asistencia por fecha
db.asistencias.createIndex({ "fecha": 1 });
// Índice en estado: Para filtrar por tipo de asistencia (presente, ausente, etc.)
db.asistencias.createIndex({ "estado": 1 });

// Insertar datos de prueba
var horarios = db.horarios.find().limit(6).toArray();

db.asistencias.insertMany([
  {
    estudianteId: estudiantes[0]._id,
    cursoId: cursos[0]._id,
    horarioId: horarios[0]._id,
    fecha: new Date("2024-01-15"),
    estado: "presente",
    observaciones: "Excelente participación en clase",
    registradoPor: profesores[0]._id,
    createdAt: new Date()
  },
  {
    estudianteId: estudiantes[1]._id,
    cursoId: cursos[1]._id,
    horarioId: horarios[1]._id,
    fecha: new Date("2024-01-16"),
    estado: "tardanza",
    observaciones: "Llegó 15 minutos tarde",
    registradoPor: profesores[1]._id,
    createdAt: new Date()
  },
  {
    estudianteId: estudiantes[2]._id,
    cursoId: cursos[2]._id,
    horarioId: horarios[2]._id,
    fecha: new Date("2024-01-17"),
    estado: "ausente",
    observaciones: "No se presentó a clase",
    registradoPor: profesores[2]._id,
    createdAt: new Date()
  },
  {
    estudianteId: estudiantes[3]._id,
    cursoId: cursos[3]._id,
    horarioId: horarios[3]._id,
    fecha: new Date("2024-01-18"),
    estado: "justificado",
    observaciones: "Presentó excusa médica",
    registradoPor: profesores[3]._id,
    createdAt: new Date()
  },
  {
    estudianteId: estudiantes[4]._id,
    cursoId: cursos[4]._id,
    horarioId: horarios[4]._id,
    fecha: new Date("2024-01-19"),
    estado: "presente",
    observaciones: "Muy buen progreso en técnica",
    registradoPor: profesores[4]._id,
    createdAt: new Date()
  }
]);

print("✅ Colección ASISTENCIAS creada con " + db.asistencias.countDocuments() + " documentos");

// ========================================================================
// 4. COLECCIÓN "EVALUACIONES" - Calificaciones y evaluaciones
// ========================================================================

print("\n📊 Creando colección EVALUACIONES...");

// Eliminar colección si existe
db.evaluaciones.drop();

// Crear colección con validación
db.createCollection("evaluaciones", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["estudianteId", "cursoId", "tipo", "calificacion"],
      properties: {
        estudianteId: {
          bsonType: "objectId",
          description: "Referencia al estudiante"
        },
        cursoId: {
          bsonType: "objectId",
          description: "Referencia al curso"
        },
        tipo: {
          enum: ["quiz", "parcial", "final", "proyecto"],
          description: "Tipo de evaluación"
        },
        calificacion: {
          bsonType: ["int", "double"],
          minimum: 0,
          maximum: 5,
          description: "Calificación de 0 a 5"
        },
        fechaEvaluacion: {
          bsonType: "date",
          description: "Fecha de la evaluación"
        },
        comentarios: {
          bsonType: "string",
          maxLength: 500,
          description: "Comentarios del evaluador"
        },
        evaluadoPor: {
          bsonType: "objectId",
          description: "Profesor que realizó la evaluación"
        },
        createdAt: {
          bsonType: "date",
          description: "Fecha de creación del registro"
        }
      }
    }
  }
});

// Crear índices para optimizar consultas de evaluaciones
// Índice compuesto en estudianteId+cursoId: Para consultar evaluaciones de un estudiante en un curso
db.evaluaciones.createIndex({ "estudianteId": 1, "cursoId": 1 });
// Índice en tipo: Para filtrar evaluaciones por tipo (quiz, parcial, final, proyecto)
db.evaluaciones.createIndex({ "tipo": 1 });
// Índice en fechaEvaluacion: Para reportes de evaluaciones por fecha
db.evaluaciones.createIndex({ "fechaEvaluacion": 1 });

// Insertar datos de prueba
db.evaluaciones.insertMany([
  {
    estudianteId: estudiantes[0]._id,
    cursoId: cursos[0]._id,
    tipo: "quiz",
    calificacion: 4.5,
    fechaEvaluacion: new Date("2024-01-20"),
    comentarios: "Excelente dominio de la teoría musical básica",
    evaluadoPor: profesores[0]._id,
    createdAt: new Date()
  },
  {
    estudianteId: estudiantes[1]._id,
    cursoId: cursos[1]._id,
    tipo: "parcial",
    calificacion: 4.0,
    fechaEvaluacion: new Date("2024-01-25"),
    comentarios: "Buen progreso en técnica de guitarra, necesita practicar más",
    evaluadoPor: profesores[1]._id,
    createdAt: new Date()
  },
  {
    estudianteId: estudiantes[2]._id,
    cursoId: cursos[2]._id,
    tipo: "proyecto",
    calificacion: 4.8,
    fechaEvaluacion: new Date("2024-01-30"),
    comentarios: "Proyecto sobresaliente, interpretación muy expresiva",
    evaluadoPor: profesores[2]._id,
    createdAt: new Date()
  },
  {
    estudianteId: estudiantes[3]._id,
    cursoId: cursos[3]._id,
    tipo: "final",
    calificacion: 3.5,
    fechaEvaluacion: new Date("2024-02-05"),
    comentarios: "Aprobado con buenas bases, necesita refuerzo en ritmo",
    evaluadoPor: profesores[3]._id,
    createdAt: new Date()
  },
  {
    estudianteId: estudiantes[4]._id,
    cursoId: cursos[4]._id,
    tipo: "quiz",
    calificacion: 5.0,
    fechaEvaluacion: new Date("2024-02-10"),
    comentarios: "Calificación perfecta, dominio excepcional del instrumento",
    evaluadoPor: profesores[4]._id,
    createdAt: new Date()
  }
]);

print("✅ Colección EVALUACIONES creada con " + db.evaluaciones.countDocuments() + " documentos");

// ========================================================================
// 5. COLECCIÓN "MATERIALES" - Recursos educativos
// ========================================================================

print("\n📚 Creando colección MATERIALES...");

// Eliminar colección si existe
db.materiales.drop();

// Crear colección con validación
db.createCollection("materiales", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nombre", "tipo", "cursoId"],
      properties: {
        nombre: {
          bsonType: "string",
          minLength: 3,
          maxLength: 100,
          description: "Nombre del material"
        },
        tipo: {
          enum: ["libro", "partitura", "video", "audio", "ejercicio"],
          description: "Tipo de material educativo"
        },
        cursoId: {
          bsonType: "objectId",
          description: "Referencia al curso"
        },
        descripcion: {
          bsonType: "string",
          maxLength: 500,
          description: "Descripción del material"
        },
        url: {
          bsonType: "string",
          pattern: "^https?://.*",
          description: "URL del material (si es digital)"
        },
        estado: {
          enum: ["disponible", "mantenimiento", "obsoleto"],
          description: "Estado del material"
        },
        createdAt: {
          bsonType: "date",
          description: "Fecha de creación del material"
        }
      }
    }
  }
});

// Crear índices para optimizar consultas de materiales
// Índice en cursoId: Para buscar materiales de un curso específico
db.materiales.createIndex({ "cursoId": 1 });
// Índice en tipo: Para filtrar materiales por tipo (libro, partitura, video, etc.)
db.materiales.createIndex({ "tipo": 1 });
// Índice en estado: Para filtrar por estado del material (disponible, mantenimiento, obsoleto)
db.materiales.createIndex({ "estado": 1 });

// Insertar datos de prueba
db.materiales.insertMany([
  {
    nombre: "Método Suzuki Volumen 1",
    tipo: "libro",
    cursoId: cursos[2]._id,
    descripcion: "Método básico para violín, incluye CD con acompañamientos",
    url: "https://campusmusic.edu.co/materiales/suzuki-vol1.pdf",
    estado: "disponible",
    createdAt: new Date()
  },
  {
    nombre: "Partituras - Concierto en Re Mayor",
    tipo: "partitura",
    cursoId: cursos[2]._id,
    descripcion: "Partitura completa del concierto para violín",
    url: "https://campusmusic.edu.co/partituras/concierto-re-mayor.pdf",
    estado: "disponible",
    createdAt: new Date()
  },
  {
    nombre: "Video Tutorial - Técnica de Guitarra",
    tipo: "video",
    cursoId: cursos[1]._id,
    descripcion: "Video explicativo de técnicas avanzadas de guitarra",
    url: "https://campusmusic.edu.co/videos/tecnica-guitarra.mp4",
    estado: "disponible",
    createdAt: new Date()
  },
  {
    nombre: "Ejercicios de Respiración",
    tipo: "ejercicio",
    cursoId: cursos[3]._id,
    descripcion: "Serie de ejercicios para mejorar la respiración en canto",
    url: "https://campusmusic.edu.co/ejercicios/respiracion.pdf",
    estado: "disponible",
    createdAt: new Date()
  },
  {
    nombre: "Audio - Escalas Mayores",
    tipo: "audio",
    cursoId: cursos[0]._id,
    descripcion: "Archivo de audio con todas las escalas mayores en piano",
    url: "https://campusmusic.edu.co/audio/escalas-mayores.mp3",
    estado: "disponible",
    createdAt: new Date()
  }
]);

print("✅ Colección MATERIALES creada con " + db.materiales.countDocuments() + " documentos");

// ========================================================================
// RESUMEN FINAL
// ========================================================================

print("\n" + "=".repeat(80));
print("📋 RESUMEN DE COLECCIONES ADICIONALES CREADAS");
print("=".repeat(80));

const resumenColecciones = {
  pagos: db.pagos.countDocuments(),
  horarios: db.horarios.countDocuments(),
  asistencias: db.asistencias.countDocuments(),
  evaluaciones: db.evaluaciones.countDocuments(),
  materiales: db.materiales.countDocuments()
};

print("💰 PAGOS: " + resumenColecciones.pagos + " documentos");
print("🕐 HORARIOS: " + resumenColecciones.horarios + " documentos");
print("📋 ASISTENCIAS: " + resumenColecciones.asistencias + " documentos");
print("📊 EVALUACIONES: " + resumenColecciones.evaluaciones + " documentos");
print("📚 MATERIALES: " + resumenColecciones.materiales + " documentos");

print("\n🎯 COLECCIONES MÁS PROBABLES EN EL EXAMEN:");
print("1. PAGOS (90%) - Completa el flujo financiero");
print("2. HORARIOS (85%) - Gestión de clases");
print("3. ASISTENCIAS (80%) - Control académico");
print("4. EVALUACIONES (75%) - Calificaciones");
print("5. MATERIALES (70%) - Recursos educativos");

print("\n🚀 ¡Colecciones adicionales creadas exitosamente!");
print("💡 Ahora puedes practicar consultas con estas nuevas colecciones."); 