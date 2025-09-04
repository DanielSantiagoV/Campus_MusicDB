// ========================================================================
// EVALUACIÓN CAMPUS MUSIC DB - MONGODB
// ARCHIVO: test_evaluacion.js
// OBJETIVO: Archivo completo con todos los posibles ejercicios del examen
// ========================================================================

use('CampusMusicDB');

// ========================================================================
// 1. CONFIGURACIÓN INICIAL Y ÍNDICES REQUERIDOS
// ========================================================================

print("🔧 Configurando índices para optimizar consultas...");

// Índices para consultas de relaciones
db.usuarios.createIndex({ "email": 1 }, { unique: true });
db.usuarios.createIndex({ "username": 1 }, { unique: true });
db.usuarios.createIndex({ "documento": 1 }, { unique: true });

// Índices para inscripciones (consultas más comunes)
db.inscripciones.createIndex({ "estudianteId": 1, "cursoId": 1 }, { unique: true });
db.inscripciones.createIndex({ "estado": 1 });
db.inscripciones.createIndex({ "fechaInscripcion": 1 });

// Índices para cursos
db.cursos.createIndex({ "sedeId": 1 });
db.cursos.createIndex({ "profesorId": 1 });
db.cursos.createIndex({ "instrumento": 1 });
db.cursos.createIndex({ "nivel": 1 });

// Índices para instrumentos
db.instrumentos.createIndex({ "sedeId": 1 });
db.instrumentos.createIndex({ "tipo": 1 });
db.instrumentos.createIndex({ "estado": 1 });

// Índices para reservas
db.reservas_instrumentos.createIndex({ "instrumentoId": 1 });
db.reservas_instrumentos.createIndex({ "estudianteId": 1 });
db.reservas_instrumentos.createIndex({ "fechaHoraInicio": 1 });
db.reservas_instrumentos.createIndex({ "estado": 1 });

print("✅ Índices configurados correctamente.");

// ========================================================================
// 2. EJERCICIOS DE CONSULTAS DE AGREGACIÓN (PROBABILIDAD: 95%)
// ========================================================================

print("\n📊 EJERCICIOS DE AGREGACIÓN - CONSULTAS BÁSICAS");

// Ejercicio 1: Estadísticas por sede
print("\n--- Ejercicio 1: Total de ingresos por sede ---");
db.inscripciones.aggregate([
  { $match: { estado: "activa" }},
  { $lookup: {
    from: "cursos",
    localField: "cursoId",
    foreignField: "_id",
    as: "curso"
  }},
  { $unwind: "$curso" },
  { $lookup: {
    from: "sedes",
    localField: "curso.sedeId",
    foreignField: "_id",
    as: "sede"
  }},
  { $group: {
    _id: "$sede.nombre",
    totalIngresos: { $sum: "$costoCongelado" },
    cantidadInscripciones: { $sum: 1 },
    promedioCosto: { $avg: "$costoCongelado" }
  }},
  { $sort: { totalIngresos: -1 }}
]);

// Ejercicio 2: Top estudiantes con más cursos
print("\n--- Ejercicio 2: Top 5 estudiantes con más cursos ---");
db.inscripciones.aggregate([
  { $group: {
    _id: "$estudianteId",
    totalCursos: { $sum: 1 },
    totalGastado: { $sum: "$costoCongelado" }
  }},
  { $sort: { totalCursos: -1 }},
  { $limit: 5 },
  { $lookup: {
    from: "estudiantes",
    localField: "_id",
    foreignField: "_id",
    as: "estudiante"
  }},
  { $unwind: "$estudiante" },
  { $project: {
    nombre: "$estudiante.nombre",
    nivel: "$estudiante.nivel",
    totalCursos: 1,
    totalGastado: 1
  }}
]);

// Ejercicio 3: Análisis de instrumentos por tipo
print("\n--- Ejercicio 3: Instrumentos más reservados por tipo ---");
db.reservas_instrumentos.aggregate([
  { $lookup: {
    from: "instrumentos",
    localField: "instrumentoId",
    foreignField: "_id",
    as: "instrumento"
  }},
  { $unwind: "$instrumento" },
  { $group: {
    _id: "$instrumento.tipo",
    totalReservas: { $sum: 1 },
    instrumentosUnicos: { $addToSet: "$instrumento.nombre" }
  }},
  { $project: {
    tipo: "$_id",
    totalReservas: 1,
    cantidadInstrumentos: { $size: "$instrumentosUnicos" }
  }},
  { $sort: { totalReservas: -1 }}
]);

// ========================================================================
// 3. EJERCICIOS DE RELACIONES EMBEBIDAS VS REFERENCIAS (PROBABILIDAD: 85%)
// ========================================================================

print("\n🔗 EJERCICIOS DE RELACIONES - DESNORMALIZACIÓN");

// Ejercicio 4: Crear vista desnormalizada de inscripciones
print("\n--- Ejercicio 4: Crear colección desnormalizada ---");
db.inscripciones_completas.deleteMany({});

db.inscripciones.aggregate([
  { $lookup: {
    from: "estudiantes",
    localField: "estudianteId",
    foreignField: "_id",
    as: "estudiante"
  }},
  { $unwind: "$estudiante" },
  { $lookup: {
    from: "cursos",
    localField: "cursoId",
    foreignField: "_id",
    as: "curso"
  }},
  { $unwind: "$curso" },
  { $lookup: {
    from: "sedes",
    localField: "curso.sedeId",
    foreignField: "_id",
    as: "sede"
  }},
  { $unwind: "$sede" },
  { $project: {
    _id: 1,
    estudiante: {
      nombre: "$estudiante.nombre",
      email: "$estudiante.email",
      nivel: "$estudiante.nivel",
      telefono: "$estudiante.telefono"
    },
    curso: {
      nombre: "$curso.nombre",
      instrumento: "$curso.instrumento",
      nivel: "$curso.nivel",
      costo: "$curso.costo"
    },
    sede: {
      nombre: "$sede.nombre",
      direccion: "$sede.direccion"
    },
    costoCongelado: 1,
    fechaInscripcion: 1,
    estado: 1
  }}
]).forEach(function(doc) {
  db.inscripciones_completas.insertOne(doc);
});

print("✅ Colección desnormalizada creada con " + db.inscripciones_completas.countDocuments() + " documentos");

// Ejercicio 5: Consulta en datos desnormalizados
print("\n--- Ejercicio 5: Consulta en datos desnormalizados ---");
db.inscripciones_completas.find({
  "estudiante.nivelMusical": "avanzado",
  "curso.instrumento": "piano",
  "sede.nombre": "Campus Music - Chapinero"
}, {
  "estudiante.nombre": 1,
  "curso.nombre": 1,
  "costoCongelado": 1
});

// ========================================================================
// 4. EJERCICIOS DE VALIDACIÓN DE ESQUEMAS (PROBABILIDAD: 75%)
// ========================================================================

print("\n✅ EJERCICIOS DE VALIDACIÓN DE ESQUEMAS");

// Ejercicio 6: Crear colección con validación
print("\n--- Ejercicio 6: Crear colección con esquema de validación ---");
db.createCollection("nuevos_cursos", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nombre", "nivel", "instrumento", "costo", "sedeId"],
      properties: {
        nombre: {
          bsonType: "string",
          minLength: 5,
          maxLength: 100,
          description: "Nombre del curso, entre 5 y 100 caracteres"
        },
        nivel: {
          enum: ["basico", "intermedio", "avanzado"],
          description: "Nivel del curso debe ser uno de los valores permitidos"
        },
        instrumento: {
          enum: ["piano", "guitarra", "violin", "canto", "teoria musical", "bajo", "bateria"],
          description: "Instrumento debe ser uno de los valores permitidos"
        },
        costo: {
          bsonType: ["int", "double"],
          minimum: 100000,
          maximum: 2000000,
          description: "Costo entre 100,000 y 2,000,000"
        },
        cupos: {
          bsonType: "object",
          required: ["maximo", "disponibles"],
          properties: {
            maximo: {
              bsonType: "int",
              minimum: 1,
              maximum: 50
            },
            disponibles: {
              bsonType: "int",
              minimum: 0
            }
          }
        }
      }
    }
  }
});

// Ejercicio 7: Validar datos existentes
print("\n--- Ejercicio 7: Verificar datos que no cumplen validación ---");
db.cursos.find({
  $nor: [
    { nivel: { $in: ["basico", "intermedio", "avanzado"] }},
    { instrumento: { $in: ["piano", "guitarra", "violin", "canto", "teoria musical", "bajo", "bateria"] }},
    { costo: { $gte: 100000, $lte: 2000000 }}
  ]
});

// ========================================================================
// 5. EJERCICIOS DE OPERACIONES DE ACTUALIZACIÓN (PROBABILIDAD: 70%)
// ========================================================================

print("\n🔄 EJERCICIOS DE ACTUALIZACIÓN");

// Ejercicio 8: Actualización masiva de cupos
print("\n--- Ejercicio 8: Actualizar cupos disponibles ---");
db.cursos.updateMany(
  { "cupos.disponibles": { $gt: 0 }},
  { $inc: { "cupos.disponibles": -1 }}
);

// Ejercicio 9: Actualización condicional
print("\n--- Ejercicio 9: Cambiar estado de instrumentos ---");
db.instrumentos.updateMany(
  { estado: "disponible" },
  { 
    $set: { 
      estado: "mantenimiento",
      fechaMantenimiento: new Date()
    }
  }
);

// Ejercicio 10: Actualización con agregación
print("\n--- Ejercicio 10: Actualizar costo promedio por sede ---");
db.cursos.aggregate([
  { $group: {
    _id: "$sedeId",
    costoPromedio: { $avg: "$costo" }
  }},
  { $lookup: {
    from: "sedes",
    localField: "_id",
    foreignField: "_id",
    as: "sede"
  }},
  { $unwind: "$sede" }
]).forEach(function(doc) {
  db.sedes.updateOne(
    { _id: doc._id },
    { $set: { costoPromedioCursos: doc.costoPromedio }}
  );
});

// ========================================================================
// 6. EJERCICIOS DE ANÁLISIS DE DATOS Y REPORTES (PROBABILIDAD: 80%)
// ========================================================================

print("\n📈 EJERCICIOS DE ANÁLISIS Y REPORTES");

// Ejercicio 11: Reporte de rendimiento por profesor
print("\n--- Ejercicio 11: Profesores más solicitados ---");
db.cursos.aggregate([
  { $group: {
    _id: "$profesorId",
    totalCursos: { $sum: 1 },
    totalCupos: { $sum: "$cupos.maximo" },
    promedioCosto: { $avg: "$costo" }
  }},
  { $lookup: {
    from: "profesores",
    localField: "_id",
    foreignField: "_id",
    as: "profesor"
  }},
  { $unwind: "$profesor" },
  { $lookup: {
    from: "usuarios",
    localField: "profesor.usuarioId",
    foreignField: "_id",
    as: "usuario"
  }},
  { $unwind: "$usuario" },
  { $project: {
    nombre: "$usuario.username",
    especialidades: "$profesor.especialidades",
    totalCursos: 1,
    totalCupos: 1,
    promedioCosto: 1
  }},
  { $sort: { totalCursos: -1 }}
]);

// Ejercicio 12: Análisis temporal de inscripciones
print("\n--- Ejercicio 12: Inscripciones por mes ---");
db.inscripciones.aggregate([
  { $match: { estado: "activa" }},
  { $group: {
    _id: {
      año: { $year: "$fechaInscripcion" },
      mes: { $month: "$fechaInscripcion" }
    },
    totalInscripciones: { $sum: 1 },
    totalIngresos: { $sum: "$costoCongelado" }
  }},
  { $sort: { "_id.año": 1, "_id.mes": 1 }}
]);

// ========================================================================
// 7. EJERCICIOS DE BÚSQUEDA Y FILTROS (PROBABILIDAD: 60%)
// ========================================================================

print("\n🔍 EJERCICIOS DE BÚSQUEDA Y FILTROS");

// Ejercicio 13: Búsqueda de texto
print("\n--- Ejercicio 13: Buscar instrumentos por nombre ---");
db.instrumentos.find({
  nombre: { $regex: /guitarra/i }
});

// Ejercicio 14: Búsqueda compleja
print("\n--- Ejercicio 14: Cursos por múltiples criterios ---");
db.cursos.find({
  $and: [
    { nivel: "intermedio" },
    { costo: { $gte: 400000, $lte: 800000 }},
    { "cupos.disponibles": { $gt: 0 }}
  ]
});

// Ejercicio 15: Búsqueda con rangos de fechas
print("\n--- Ejercicio 15: Reservas en rango de fechas ---");
db.reservas_instrumentos.find({
  fechaHoraInicio: {
    $gte: new Date("2024-03-01"),
    $lte: new Date("2024-03-31")
  },
  estado: "activa"
});

// ========================================================================
// 8. EJERCICIOS DE TRANSACCIONES (PROBABILIDAD: 50%)
// ========================================================================

print("\n💼 EJERCICIOS DE TRANSACCIONES");

// Ejercicio 16: Transacción de inscripción
print("\n--- Ejercicio 16: Transacción completa de inscripción ---");
function realizarInscripcion(estudianteId, cursoId, costo) {
  const session = db.getMongo().startSession();
  
  try {
    session.startTransaction();
    
    // 1. Verificar cupos disponibles
    const curso = db.cursos.findOne({ _id: cursoId }, { session });
    if (!curso || curso.cupos.disponibles <= 0) {
      throw new Error("No hay cupos disponibles");
    }
    
    // 2. Crear inscripción
    db.inscripciones.insertOne({
      estudianteId: estudianteId,
      cursoId: cursoId,
      costoCongelado: costo,
      fechaInscripcion: new Date(),
      estado: "activa",
      createdAt: new Date()
    }, { session });
    
    // 3. Actualizar cupos
    db.cursos.updateOne(
      { _id: cursoId },
      { $inc: { "cupos.disponibles": -1 }},
      { session }
    );
    
    session.commitTransaction();
    print("✅ Inscripción realizada exitosamente");
    
  } catch (error) {
    session.abortTransaction();
    print("❌ Error en inscripción: " + error.message);
  } finally {
    session.endSession();
  }
}

// ========================================================================
// 9. EJERCICIOS DE OPTIMIZACIÓN E ÍNDICES (PROBABILIDAD: 60%)
// ========================================================================

print("\n⚡ EJERCICIOS DE OPTIMIZACIÓN");

// Ejercicio 17: Analizar rendimiento de consultas
print("\n--- Ejercicio 17: Análisis de rendimiento ---");
db.inscripciones.find({ estudianteId: db.estudiantes.findOne()._id }).explain("executionStats");

// Ejercicio 18: Crear índices compuestos
print("\n--- Ejercicio 18: Índices compuestos ---");
db.inscripciones.createIndex({ 
  "estado": 1, 
  "fechaInscripcion": -1 
});

db.cursos.createIndex({ 
  "sedeId": 1, 
  "instrumento": 1, 
  "nivel": 1 
});

// ========================================================================
// 10. EJERCICIOS DE EXPORTACIÓN E IMPORTACIÓN (PROBABILIDAD: 30%)
// ========================================================================

print("\n📤 EJERCICIOS DE EXPORTACIÓN E IMPORTACIÓN");

// Ejercicio 19: Exportar estadísticas
print("\n--- Ejercicio 19: Exportar reporte de estadísticas ---");
const estadisticas = db.inscripciones.aggregate([
  { $group: {
    _id: null,
    totalInscripciones: { $sum: 1 },
    totalIngresos: { $sum: "$costoCongelado" },
    promedioCosto: { $avg: "$costoCongelado" }
  }}
]).toArray();

print("📊 Estadísticas generales:");
print(JSON.stringify(estadisticas, null, 2));

// Ejercicio 20: Crear backup de datos importantes
print("\n--- Ejercicio 20: Backup de datos críticos ---");
db.backup_estudiantes.deleteMany({});
db.estudiantes.find().forEach(function(estudiante) {
  db.backup_estudiantes.insertOne(estudiante);
});

print("✅ Backup de " + db.backup_estudiantes.countDocuments() + " estudiantes creado");

// ========================================================================
// 11. EJERCICIOS AVANZADOS (PROBABILIDAD: 40%)
// ========================================================================

print("\n🚀 EJERCICIOS AVANZADOS");

// Ejercicio 21: Consulta con múltiples lookups anidados
print("\n--- Ejercicio 21: Información completa de reservas ---");
db.reservas_instrumentos.aggregate([
  { $lookup: {
    from: "instrumentos",
    localField: "instrumentoId",
    foreignField: "_id",
    as: "instrumento"
  }},
  { $unwind: "$instrumento" },
  { $lookup: {
    from: "sedes",
    localField: "instrumento.sedeId",
    foreignField: "_id",
    as: "sede"
  }},
  { $unwind: "$sede" },
  { $lookup: {
    from: "estudiantes",
    localField: "estudianteId",
    foreignField: "_id",
    as: "estudiante"
  }},
  { $unwind: "$estudiante" },
  { $lookup: {
    from: "usuarios",
    localField: "estudiante.usuarioId",
    foreignField: "_id",
    as: "usuario"
  }},
  { $unwind: "$usuario" },
  { $project: {
    instrumento: "$instrumento.nombre",
    sede: "$sede.nombre",
    estudiante: "$usuario.username",
    fechaInicio: "$fechaHoraInicio",
    fechaFin: "$fechaHoraFin",
    estado: 1
  }}
]);

// Ejercicio 22: Análisis de tendencias
print("\n--- Ejercicio 22: Análisis de tendencias por instrumento ---");
db.inscripciones.aggregate([
  { $lookup: {
    from: "cursos",
    localField: "cursoId",
    foreignField: "_id",
    as: "curso"
  }},
  { $unwind: "$curso" },
  { $group: {
    _id: {
      instrumento: "$curso.instrumento",
      mes: { $month: "$fechaInscripcion" }
    },
    inscripciones: { $sum: 1 }
  }},
  { $sort: { "_id.instrumento": 1, "_id.mes": 1 }}
]);

// ========================================================================
// 12. EJERCICIOS AVANZADOS CON EXPRESIONES REGULARES (PROBABILIDAD: 70%)
// ========================================================================

print("\n🔍 EJERCICIOS AVANZADOS CON EXPRESIONES REGULARES");

// Ejercicio 23: Búsqueda de emails válidos
print("\n--- Ejercicio 23: Buscar usuarios con emails válidos ---");
db.usuarios.find({
  email: { 
    $regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ 
  }
}, {
  username: 1,
  email: 1
});

// Ejercicio 24: Buscar nombres que empiecen con vocales
print("\n--- Ejercicio 24: Nombres que empiecen con vocales ---");
db.usuarios.find({
  username: { 
    $regex: /^[aeiouAEIOU]/ 
  }
}, {
  username: 1,
  email: 1
});

// Ejercicio 25: Buscar instrumentos con nombres compuestos
print("\n--- Ejercicio 25: Instrumentos con nombres de dos palabras ---");
db.instrumentos.find({
  nombre: { 
    $regex: /^[A-Za-z]+\s+[A-Za-z]+$/ 
  }
}, {
  nombre: 1,
  tipo: 1
});

// Ejercicio 26: Buscar direcciones que contengan números
print("\n--- Ejercicio 26: Sedes con direcciones que contengan números ---");
db.sedes.find({
  direccion: { 
    $regex: /\d+/ 
  }
}, {
  nombre: 1,
  direccion: 1
});

// Ejercicio 27: Buscar nombres con caracteres especiales
print("\n--- Ejercicio 27: Nombres con caracteres especiales ---");
db.usuarios.find({
  username: { 
    $regex: /[^a-zA-Z0-9]/ 
  }
}, {
  username: 1,
  email: 1
});

// Ejercicio 28: Validar formato de teléfono colombiano
print("\n--- Ejercicio 28: Teléfonos con formato colombiano ---");
db.sedes.find({
  telefono: { 
    $regex: /^(\+57|57)?[1-9][0-9]{9}$/ 
  }
}, {
  nombre: 1,
  telefono: 1
});

// ========================================================================
// 13. EJERCICIOS CON OPERADORES DE AGREGACIÓN AVANZADOS (PROBABILIDAD: 80%)
// ========================================================================

print("\n⚙️ EJERCICIOS CON OPERADORES DE AGREGACIÓN AVANZADOS");

// Ejercicio 29: Usar $facet para múltiples agregaciones
print("\n--- Ejercicio 29: Múltiples estadísticas en una consulta ---");
db.inscripciones.aggregate([
  { $facet: {
    "estadisticasGenerales": [
      { $group: {
        _id: null,
        totalInscripciones: { $sum: 1 },
        totalIngresos: { $sum: "$costoCongelado" },
        promedioCosto: { $avg: "$costoCongelado" }
      }}
    ],
    "porEstado": [
      { $group: {
        _id: "$estado",
        cantidad: { $sum: 1 }
      }}
    ],
    "ultimasInscripciones": [
      { $sort: { fechaInscripcion: -1 }},
      { $limit: 5 }
    ]
  }}
]);

// Ejercicio 30: Usar $bucket para agrupar por rangos
print("\n--- Ejercicio 30: Agrupar cursos por rangos de costo ---");
db.cursos.aggregate([
  { $bucket: {
    groupBy: "$costo",
    boundaries: [0, 300000, 600000, 900000, 1200000, 1500000],
    default: "Más de 1,500,000",
    output: {
      "cursos": { $push: "$nombre" },
      "cantidad": { $sum: 1 },
      "promedioCosto": { $avg: "$costo" }
    }
  }}
]);

// Ejercicio 31: Usar $addFields y $cond
print("\n--- Ejercicio 31: Agregar campos calculados ---");
db.inscripciones.aggregate([
  { $lookup: {
    from: "cursos",
    localField: "cursoId",
    foreignField: "_id",
    as: "curso"
  }},
  { $unwind: "$curso" },
  { $addFields: {
    categoriaCosto: {
      $cond: {
        if: { $gte: ["$costoCongelado", 800000] },
        then: "Alto",
        else: {
          $cond: {
            if: { $gte: ["$costoCongelado", 400000] },
            then: "Medio",
            else: "Bajo"
          }
        }
      }
    },
    descuentoAplicado: {
      $multiply: ["$costoCongelado", 0.1]
    }
  }},
  { $project: {
    estudianteId: 1,
    curso: "$curso.nombre",
    costoOriginal: "$costoCongelado",
    categoriaCosto: 1,
    descuentoAplicado: 1,
    costoFinal: { $subtract: ["$costoCongelado", "$descuentoAplicado"] }
  }}
]);

// Ejercicio 32: Usar $arrayToObject y $objectToArray
print("\n--- Ejercicio 32: Convertir arrays a objetos ---");
db.profesores.aggregate([
  { $addFields: {
    especialidadesObj: {
      $arrayToObject: {
        $map: {
          input: "$especialidades",
          as: "esp",
          in: {
            k: "$$esp",
            v: true
          }
        }
      }
    }
  }},
  { $project: {
    nombre: 1,
    especialidades: 1,
    especialidadesObj: 1
  }}
]);

// Ejercicio 33: Usar $reduce para cálculos complejos
print("\n--- Ejercicio 33: Calcular estadísticas con $reduce ---");
db.cursos.aggregate([
  { $group: {
    _id: "$sedeId",
    cursos: { $push: "$$ROOT" },
    totalCupos: { $sum: "$cupos.maximo" }
  }},
  { $addFields: {
    estadisticasCupos: {
      $reduce: {
        input: "$cursos",
        initialValue: { min: Number.MAX_VALUE, max: 0, total: 0 },
        in: {
          min: { $min: ["$$value.min", "$$this.cupos.maximo"] },
          max: { $max: ["$$value.max", "$$this.cupos.maximo"] },
          total: { $add: ["$$value.total", "$$this.cupos.maximo"] }
        }
      }
    }
  }},
  { $project: {
    sedeId: 1,
    totalCupos: 1,
    estadisticasCupos: 1
  }}
]);

// ========================================================================
// 14. EJERCICIOS CON CONSULTAS GEOESPACIALES (PROBABILIDAD: 40%)
// ========================================================================

print("\n🌍 EJERCICIOS CON CONSULTAS GEOESPACIALES");

// Ejercicio 34: Crear índice geoespacial
print("\n--- Ejercicio 34: Crear índice geoespacial ---");
db.sedes.createIndex({ "ubicacion": "2dsphere" });

// Ejercicio 35: Buscar sedes cercanas a un punto
print("\n--- Ejercicio 35: Sedes cercanas a Bogotá ---");
db.sedes.find({
  ubicacion: {
    $near: {
      $geometry: {
        type: "Point",
        coordinates: [-74.0721, 4.7110] // Coordenadas de Bogotá
      },
      $maxDistance: 10000 // 10km
    }
  }
}, {
  nombre: 1,
  direccion: 1,
  ubicacion: 1
});

// Ejercicio 36: Buscar sedes dentro de un polígono
print("\n--- Ejercicio 36: Sedes dentro de un área ---");
db.sedes.find({
  ubicacion: {
    $geoWithin: {
      $geometry: {
        type: "Polygon",
        coordinates: [[
          [-74.1, 4.6],
          [-74.0, 4.6],
          [-74.0, 4.7],
          [-74.1, 4.7],
          [-74.1, 4.6]
        ]]
      }
    }
  }
});

// ========================================================================
// 15. EJERCICIOS CON CONSULTAS DE TEXTO (PROBABILIDAD: 50%)
// ========================================================================

print("\n📝 EJERCICIOS CON CONSULTAS DE TEXTO");

// Ejercicio 37: Crear índice de texto
print("\n--- Ejercicio 37: Crear índice de texto ---");
db.cursos.createIndex({ 
  nombre: "text", 
  descripcion: "text" 
});

// Ejercicio 38: Búsqueda de texto
print("\n--- Ejercicio 38: Buscar cursos por texto ---");
db.cursos.find({
  $text: { 
    $search: "piano música" 
  }
}, {
  score: { $meta: "textScore" },
  nombre: 1,
  instrumento: 1
}).sort({ score: { $meta: "textScore" }});

// ========================================================================
// 16. EJERCICIOS CON CONSULTAS DE ARRAYS (PROBABILIDAD: 75%)
// ========================================================================

print("\n📋 EJERCICIOS CON CONSULTAS DE ARRAYS");

// Ejercicio 39: Buscar profesores con múltiples especialidades
print("\n--- Ejercicio 39: Profesores con múltiples especialidades ---");
db.profesores.find({
  especialidades: { 
    $size: { $gt: 2 } 
  }
}, {
  nombre: 1,
  especialidades: 1
});

// Ejercicio 40: Buscar profesores que enseñen piano Y guitarra
print("\n--- Ejercicio 40: Profesores que enseñen piano y guitarra ---");
db.profesores.find({
  especialidades: { 
    $all: ["piano", "guitarra"] 
  }
}, {
  nombre: 1,
  especialidades: 1
});

// Ejercicio 41: Buscar profesores que NO enseñen canto
print("\n--- Ejercicio 41: Profesores que NO enseñen canto ---");
db.profesores.find({
  especialidades: { 
    $nin: ["canto"] 
  }
}, {
  nombre: 1,
  especialidades: 1
});

// Ejercicio 42: Agregar nueva especialidad a profesores
print("\n--- Ejercicio 42: Agregar especialidad a profesores ---");
db.profesores.updateMany(
  { especialidades: { $exists: true }},
  { $addToSet: { especialidades: "teoría musical" }}
);

// Ejercicio 43: Remover especialidad específica
print("\n--- Ejercicio 43: Remover especialidad específica ---");
db.profesores.updateMany(
  { especialidades: "bateria" },
  { $pull: { especialidades: "bateria" }}
);

// ========================================================================
// 17. EJERCICIOS CON CONSULTAS DE FECHAS AVANZADAS (PROBABILIDAD: 70%)
// ========================================================================

print("\n📅 EJERCICIOS CON CONSULTAS DE FECHAS AVANZADAS");

// Ejercicio 44: Inscripciones de los últimos 30 días
print("\n--- Ejercicio 44: Inscripciones de los últimos 30 días ---");
db.inscripciones.find({
  fechaInscripcion: {
    $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  }
}, {
  estudianteId: 1,
  fechaInscripcion: 1,
  costoCongelado: 1
});

// Ejercicio 45: Inscripciones por día de la semana
print("\n--- Ejercicio 45: Inscripciones por día de la semana ---");
db.inscripciones.aggregate([
  { $addFields: {
    diaSemana: { $dayOfWeek: "$fechaInscripcion" }
  }},
  { $group: {
    _id: "$diaSemana",
    cantidad: { $sum: 1 },
    totalIngresos: { $sum: "$costoCongelado" }
  }},
  { $sort: { _id: 1 }}
]);

// Ejercicio 46: Inscripciones por trimestre
print("\n--- Ejercicio 46: Inscripciones por trimestre ---");
db.inscripciones.aggregate([
  { $addFields: {
    año: { $year: "$fechaInscripcion" },
    trimestre: { $ceil: { $divide: [{ $month: "$fechaInscripcion" }, 3] }}
  }},
  { $group: {
    _id: { año: "$año", trimestre: "$trimestre" },
    cantidad: { $sum: 1 },
    totalIngresos: { $sum: "$costoCongelado" }
  }},
  { $sort: { "_id.año": 1, "_id.trimestre": 1 }}
]);

// Ejercicio 47: Duración de reservas de instrumentos
print("\n--- Ejercicio 47: Duración promedio de reservas ---");
db.reservas_instrumentos.aggregate([
  { $addFields: {
    duracionHoras: {
      $divide: [
        { $subtract: ["$fechaHoraFin", "$fechaHoraInicio"] },
        1000 * 60 * 60
      ]
    }
  }},
  { $group: {
    _id: null,
    duracionPromedio: { $avg: "$duracionHoras" },
    duracionMinima: { $min: "$duracionHoras" },
    duracionMaxima: { $max: "$duracionHoras" }
  }}
]);

// ========================================================================
// 18. EJERCICIOS CON CONSULTAS DE OBJETOS EMBEBIDOS (PROBABILIDAD: 80%)
// ========================================================================

print("\n📦 EJERCICIOS CON CONSULTAS DE OBJETOS EMBEBIDOS");

// Ejercicio 48: Buscar cursos con cupos específicos
print("\n--- Ejercicio 48: Cursos con cupos disponibles mayor a 5 ---");
db.cursos.find({
  "cupos.disponibles": { $gt: 5 }
}, {
  nombre: 1,
  "cupos.maximo": 1,
  "cupos.disponibles": 1
});

// Ejercicio 49: Actualizar cupos disponibles
print("\n--- Ejercicio 49: Actualizar cupos disponibles ---");
db.cursos.updateMany(
  { "cupos.disponibles": { $gt: 0 }},
  { $inc: { "cupos.disponibles": -1 }}
);

// Ejercicio 50: Buscar cursos con cupos completos
print("\n--- Ejercicio 50: Cursos con cupos completos ---");
db.cursos.find({
  $expr: { 
    $eq: ["$cupos.disponibles", 0] 
  }
}, {
  nombre: 1,
  "cupos.maximo": 1,
  "cupos.disponibles": 1
});

// Ejercicio 51: Buscar cursos con cupos disponibles menor al 20%
print("\n--- Ejercicio 51: Cursos con pocos cupos disponibles ---");
db.cursos.find({
  $expr: {
    $lt: [
      { $divide: ["$cupos.disponibles", "$cupos.maximo"] },
      0.2
    ]
  }
}, {
  nombre: 1,
  "cupos.maximo": 1,
  "cupos.disponibles": 1,
  porcentajeDisponible: {
    $multiply: [
      { $divide: ["$cupos.disponibles", "$cupos.maximo"] },
      100
    ]
  }
});

// ========================================================================
// 19. EJERCICIOS CON CONSULTAS DE EXISTENCIA Y TIPOS (PROBABILIDAD: 60%)
// ========================================================================

print("\n🔍 EJERCICIOS CON CONSULTAS DE EXISTENCIA Y TIPOS");

// Ejercicio 52: Buscar documentos con campos específicos
print("\n--- Ejercicio 52: Estudiantes con teléfono ---");
db.estudiantes.find({
  telefono: { $exists: true, $ne: null }
}, {
  nombre: 1,
  telefono: 1
});

// Ejercicio 53: Buscar documentos sin campos específicos
print("\n--- Ejercicio 53: Estudiantes sin teléfono ---");
db.estudiantes.find({
  telefono: { $exists: false }
}, {
  nombre: 1,
  email: 1
});

// Ejercicio 54: Validar tipos de datos
print("\n--- Ejercicio 54: Cursos con costo como número ---");
db.cursos.find({
  costo: { $type: "number" }
}, {
  nombre: 1,
  costo: 1
});

// Ejercicio 55: Buscar documentos con arrays no vacíos
print("\n--- Ejercicio 55: Profesores con especialidades ---");
db.profesores.find({
  especialidades: { 
    $exists: true, 
    $ne: [], 
    $type: "array" 
  }
}, {
  nombre: 1,
  especialidades: 1
});

// ========================================================================
// 20. EJERCICIOS CON CONSULTAS DE COMPARACIÓN AVANZADA (PROBABILIDAD: 65%)
// ========================================================================

print("\n⚖️ EJERCICIOS CON CONSULTAS DE COMPARACIÓN AVANZADA");

// Ejercicio 56: Cursos con costo mayor al promedio
print("\n--- Ejercicio 56: Cursos con costo mayor al promedio ---");
db.cursos.aggregate([
  { $group: {
    _id: null,
    costoPromedio: { $avg: "$costo" }
  }},
  { $lookup: {
    from: "cursos",
    pipeline: [],
    as: "cursos"
  }},
  { $unwind: "$cursos" },
  { $match: {
    $expr: { $gt: ["$cursos.costo", "$costoPromedio"] }
  }},
  { $project: {
    nombre: "$cursos.nombre",
    costo: "$cursos.costo",
    costoPromedio: 1
  }}
]);

// Ejercicio 57: Estudiantes con más inscripciones que el promedio
print("\n--- Ejercicio 57: Estudiantes con más inscripciones que el promedio ---");
db.inscripciones.aggregate([
  { $group: {
    _id: "$estudianteId",
    totalInscripciones: { $sum: 1 }
  }},
  { $group: {
    _id: null,
    promedioInscripciones: { $avg: "$totalInscripciones" },
    estudiantes: { $push: "$$ROOT" }
  }},
  { $unwind: "$estudiantes" },
  { $match: {
    $expr: { $gt: ["$estudiantes.totalInscripciones", "$promedioInscripciones"] }
  }},
  { $project: {
    estudianteId: "$estudiantes._id",
    totalInscripciones: "$estudiantes.totalInscripciones",
    promedioInscripciones: 1
  }}
]);

// ========================================================================
// 21. EJERCICIOS CON CONSULTAS DE AGRUPACIÓN COMPLEJA (PROBABILIDAD: 70%)
// ========================================================================

print("\n📊 EJERCICIOS CON CONSULTAS DE AGRUPACIÓN COMPLEJA");

// Ejercicio 58: Estadísticas por sede e instrumento
print("\n--- Ejercicio 58: Estadísticas por sede e instrumento ---");
db.cursos.aggregate([
  { $lookup: {
    from: "sedes",
    localField: "sedeId",
    foreignField: "_id",
    as: "sede"
  }},
  { $unwind: "$sede" },
  { $group: {
    _id: {
      sede: "$sede.nombre",
      instrumento: "$instrumento"
    },
    cantidadCursos: { $sum: 1 },
    totalCupos: { $sum: "$cupos.maximo" },
    cuposDisponibles: { $sum: "$cupos.disponibles" },
    costoPromedio: { $avg: "$costo" },
    costoMinimo: { $min: "$costo" },
    costoMaximo: { $max: "$costo" }
  }},
  { $addFields: {
    porcentajeOcupacion: {
      $multiply: [
        { $divide: [
          { $subtract: ["$totalCupos", "$cuposDisponibles"] },
          "$totalCupos"
        ]},
        100
      ]
    }
  }},
  { $sort: { "_id.sede": 1, "_id.instrumento": 1 }}
]);

// Ejercicio 59: Análisis de tendencias temporales
print("\n--- Ejercicio 59: Análisis de tendencias por mes ---");
db.inscripciones.aggregate([
  { $addFields: {
    año: { $year: "$fechaInscripcion" },
    mes: { $month: "$fechaInscripcion" }
  }},
  { $lookup: {
    from: "cursos",
    localField: "cursoId",
    foreignField: "_id",
    as: "curso"
  }},
  { $unwind: "$curso" },
  { $group: {
    _id: {
      año: "$año",
      mes: "$mes",
      instrumento: "$curso.instrumento"
    },
    inscripciones: { $sum: 1 },
    ingresos: { $sum: "$costoCongelado" }
  }},
  { $sort: { "_id.año": 1, "_id.mes": 1, "_id.instrumento": 1 }},
  { $group: {
    _id: { año: "$_id.año", mes: "$_id.mes" },
    instrumentos: { $push: "$$ROOT" },
    totalInscripciones: { $sum: "$inscripciones" },
    totalIngresos: { $sum: "$ingresos" }
  }},
  { $sort: { "_id.año": 1, "_id.mes": 1 }}
]);

// ========================================================================
// 22. EJERCICIOS CON CONSULTAS DE OPTIMIZACIÓN AVANZADA (PROBABILIDAD: 55%)
// ========================================================================

print("\n⚡ EJERCICIOS CON CONSULTAS DE OPTIMIZACIÓN AVANZADA");

// Ejercicio 60: Crear índices compuestos optimizados
print("\n--- Ejercicio 60: Índices compuestos para consultas frecuentes ---");
db.inscripciones.createIndex({ 
  "estado": 1, 
  "fechaInscripcion": -1, 
  "estudianteId": 1 
});

db.cursos.createIndex({ 
  "sedeId": 1, 
  "instrumento": 1, 
  "nivel": 1, 
  "cupos.disponibles": 1 
});

db.reservas_instrumentos.createIndex({ 
  "estado": 1, 
  "fechaHoraInicio": 1, 
  "instrumentoId": 1 
});

// Ejercicio 61: Analizar rendimiento de consultas
print("\n--- Ejercicio 61: Análisis de rendimiento ---");
db.inscripciones.find({
  estado: "activa",
  fechaInscripcion: { $gte: new Date("2024-01-01") }
}).explain("executionStats");

// Ejercicio 62: Optimizar consulta con hint
print("\n--- Ejercicio 62: Forzar uso de índice específico ---");
db.cursos.find({
  sedeId: db.sedes.findOne()._id,
  instrumento: "piano"
}).hint({ "sedeId": 1, "instrumento": 1, "nivel": 1 });

// ========================================================================
// 23. EJERCICIOS CON CONSULTAS DE TRANSACCIONES AVANZADAS (PROBABILIDAD: 45%)
// ========================================================================

print("\n💼 EJERCICIOS CON TRANSACCIONES AVANZADAS");

// Ejercicio 63: Transacción de transferencia de cupos
print("\n--- Ejercicio 63: Transacción de transferencia de cupos ---");
function transferirCupos(cursoOrigenId, cursoDestinoId, cantidad) {
  const session = db.getMongo().startSession();
  
  try {
    session.startTransaction();
    
    // Verificar cupos disponibles en origen
    const cursoOrigen = db.cursos.findOne({ _id: cursoOrigenId }, { session });
    if (!cursoOrigen || cursoOrigen.cupos.disponibles < cantidad) {
      throw new Error("Cupos insuficientes en curso origen");
    }
    
    // Verificar espacio en destino
    const cursoDestino = db.cursos.findOne({ _id: cursoDestinoId }, { session });
    if (!cursoDestino) {
      throw new Error("Curso destino no existe");
    }
    
    // Transferir cupos
    db.cursos.updateOne(
      { _id: cursoOrigenId },
      { $inc: { "cupos.disponibles": -cantidad }},
      { session }
    );
    
    db.cursos.updateOne(
      { _id: cursoDestinoId },
      { $inc: { "cupos.disponibles": cantidad }},
      { session }
    );
    
    session.commitTransaction();
    print("✅ Transferencia de cupos realizada exitosamente");
    
  } catch (error) {
    session.abortTransaction();
    print("❌ Error en transferencia: " + error.message);
  } finally {
    session.endSession();
  }
}

// Ejercicio 64: Transacción de cancelación de inscripción
print("\n--- Ejercicio 64: Transacción de cancelación ---");
function cancelarInscripcion(inscripcionId) {
  const session = db.getMongo().startSession();
  
  try {
    session.startTransaction();
    
    // Obtener inscripción
    const inscripcion = db.inscripciones.findOne({ _id: inscripcionId }, { session });
    if (!inscripcion) {
      throw new Error("Inscripción no encontrada");
    }
    
    if (inscripcion.estado !== "activa") {
      throw new Error("Inscripción ya no está activa");
    }
    
    // Actualizar estado de inscripción
    db.inscripciones.updateOne(
      { _id: inscripcionId },
      { $set: { estado: "cancelada", fechaCancelacion: new Date() }},
      { session }
    );
    
    // Liberar cupo
    db.cursos.updateOne(
      { _id: inscripcion.cursoId },
      { $inc: { "cupos.disponibles": 1 }},
      { session }
    );
    
    session.commitTransaction();
    print("✅ Cancelación realizada exitosamente");
    
  } catch (error) {
    session.abortTransaction();
    print("❌ Error en cancelación: " + error.message);
  } finally {
    session.endSession();
  }
}

// ========================================================================
// 24. EJERCICIOS CON CONSULTAS DE VALIDACIÓN AVANZADA (PROBABILIDAD: 60%)
// ========================================================================

print("\n✅ EJERCICIOS CON VALIDACIÓN AVANZADA");

// Ejercicio 65: Validación con expresiones regulares
print("\n--- Ejercicio 65: Validación con regex ---");
db.createCollection("usuarios_validados", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["username", "email", "documento"],
      properties: {
        username: {
          bsonType: "string",
          pattern: "^[a-zA-Z0-9_]{3,20}$",
          description: "Username debe tener 3-20 caracteres alfanuméricos"
        },
        email: {
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
          description: "Email debe tener formato válido"
        },
        documento: {
          bsonType: "string",
          pattern: "^[0-9]{8,12}$",
          description: "Documento debe tener 8-12 dígitos"
        },
        telefono: {
          bsonType: "string",
          pattern: "^(\+57|57)?[1-9][0-9]{9}$",
          description: "Teléfono debe tener formato colombiano"
        }
      }
    }
  }
});

// Ejercicio 66: Validación de rangos y valores
print("\n--- Ejercicio 66: Validación de rangos ---");
db.createCollection("cursos_validados", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nombre", "costo", "cupos"],
      properties: {
        nombre: {
          bsonType: "string",
          minLength: 5,
          maxLength: 100
        },
        costo: {
          bsonType: "number",
          minimum: 100000,
          maximum: 2000000
        },
        cupos: {
          bsonType: "object",
          required: ["maximo", "disponibles"],
          properties: {
            maximo: {
              bsonType: "int",
              minimum: 1,
              maximum: 50
            },
            disponibles: {
              bsonType: "int",
              minimum: 0
            }
          },
          additionalProperties: false
        }
      }
    }
  }
});

// ========================================================================
// 25. EJERCICIOS CON CONSULTAS DE REPORTES COMPLEJOS (PROBABILIDAD: 75%)
// ========================================================================

print("\n📈 EJERCICIOS CON REPORTES COMPLEJOS");

// Ejercicio 67: Reporte de rendimiento por sede
print("\n--- Ejercicio 67: Reporte completo por sede ---");
db.inscripciones.aggregate([
  { $match: { estado: "activa" }},
  { $lookup: {
    from: "cursos",
    localField: "cursoId",
    foreignField: "_id",
    as: "curso"
  }},
  { $unwind: "$curso" },
  { $lookup: {
    from: "sedes",
    localField: "curso.sedeId",
    foreignField: "_id",
    as: "sede"
  }},
  { $unwind: "$sede" },
  { $group: {
    _id: "$sede.nombre",
    totalInscripciones: { $sum: 1 },
    totalIngresos: { $sum: "$costoCongelado" },
    promedioCosto: { $avg: "$costoCongelado" },
    cursosUnicos: { $addToSet: "$curso.nombre" },
    instrumentosUnicos: { $addToSet: "$curso.instrumento" }
  }},
  { $addFields: {
    cantidadCursos: { $size: "$cursosUnicos" },
    cantidadInstrumentos: { $size: "$instrumentosUnicos" },
    ingresosPromedioPorInscripcion: { $divide: ["$totalIngresos", "$totalInscripciones"] }
  }},
  { $project: {
    sede: "$_id",
    totalInscripciones: 1,
    totalIngresos: 1,
    promedioCosto: 1,
    cantidadCursos: 1,
    cantidadInstrumentos: 1,
    ingresosPromedioPorInscripcion: 1
  }},
  { $sort: { totalIngresos: -1 }}
]);

// Ejercicio 68: Reporte de estudiantes por nivel
print("\n--- Ejercicio 68: Análisis de estudiantes por nivel ---");
db.estudiantes.aggregate([
  { $lookup: {
    from: "inscripciones",
    localField: "_id",
    foreignField: "estudianteId",
    as: "inscripciones"
  }},
  { $addFields: {
    totalInscripciones: { $size: "$inscripciones" },
    totalGastado: {
      $sum: "$inscripciones.costoCongelado"
    }
  }},
  { $group: {
    _id: "$nivel",
    cantidadEstudiantes: { $sum: 1 },
    promedioInscripciones: { $avg: "$totalInscripciones" },
    promedioGastado: { $avg: "$totalGastado" },
    totalIngresos: { $sum: "$totalGastado" },
    estudiantes: { $push: "$$ROOT" }
  }},
  { $addFields: {
    estudiantesActivos: {
      $size: {
        $filter: {
          input: "$estudiantes",
          cond: { $gt: ["$$this.totalInscripciones", 0] }
        }
      }
    }
  }},
  { $project: {
    nivel: "$_id",
    cantidadEstudiantes: 1,
    estudiantesActivos: 1,
    promedioInscripciones: 1,
    promedioGastado: 1,
    totalIngresos: 1
  }},
  { $sort: { nivel: 1 }}
]);

// ========================================================================
// 26. EJERCICIOS CON COLECCIONES ADICIONALES (PROBABILIDAD: 85%)
// ========================================================================

print("\n📚 EJERCICIOS CON COLECCIONES ADICIONALES");

// Ejercicio 69: Análisis de pagos por método
print("\n--- Ejercicio 69: Análisis de pagos por método ---");
db.pagos.aggregate([
  { $match: { estado: "completado" }},
  { $group: {
    _id: "$metodoPago",
    totalPagos: { $sum: 1 },
    montoTotal: { $sum: "$monto" },
    montoPromedio: { $avg: "$monto" }
  }},
  { $sort: { montoTotal: -1 }}
]);

// Ejercicio 70: Horarios por día de la semana
print("\n--- Ejercicio 70: Horarios por día de la semana ---");
db.horarios.aggregate([
  { $group: {
    _id: "$diaSemana",
    cantidadHorarios: { $sum: 1 },
    salasUtilizadas: { $addToSet: "$sala" }
  }},
  { $addFields: {
    cantidadSalas: { $size: "$salasUtilizadas" }
  }},
  { $sort: { _id: 1 }}
]);

// Ejercicio 71: Asistencia por estudiante
print("\n--- Ejercicio 71: Asistencia por estudiante ---");
db.asistencias.aggregate([
  { $group: {
    _id: "$estudianteId",
    totalClases: { $sum: 1 },
    presentes: { $sum: { $cond: [{ $eq: ["$estado", "presente"] }, 1, 0] }},
    ausentes: { $sum: { $cond: [{ $eq: ["$estado", "ausente"] }, 1, 0] }},
    tardanzas: { $sum: { $cond: [{ $eq: ["$estado", "tardanza"] }, 1, 0] }}
  }},
  { $addFields: {
    porcentajeAsistencia: {
      $multiply: [
        { $divide: ["$presentes", "$totalClases"] },
        100
      ]
    }
  }},
  { $sort: { porcentajeAsistencia: -1 }}
]);

// Ejercicio 72: Evaluaciones por tipo
print("\n--- Ejercicio 72: Evaluaciones por tipo ---");
db.evaluaciones.aggregate([
  { $group: {
    _id: "$tipo",
    cantidadEvaluaciones: { $sum: 1 },
    promedioCalificacion: { $avg: "$calificacion" },
    calificacionMaxima: { $max: "$calificacion" },
    calificacionMinima: { $min: "$calificacion" }
  }},
  { $sort: { promedioCalificacion: -1 }}
]);

// Ejercicio 73: Materiales por tipo
print("\n--- Ejercicio 73: Materiales por tipo ---");
db.materiales.aggregate([
  { $group: {
    _id: "$tipo",
    cantidadMateriales: { $sum: 1 },
    materiales: { $push: "$nombre" }
  }},
  { $addFields: {
    cantidadMateriales: 1,
    materiales: 1
  }},
  { $sort: { cantidadMateriales: -1 }}
]);

// ========================================================================

print("\n" + "=".repeat(80));
print("📋 RESUMEN DE EJERCICIOS COMPLETADOS - VERSIÓN AMPLIADA Y CORREGIDA");
print("=".repeat(80));

const resumenAmpliado = {
  totalEjercicios: 73,
  categorias: {
    "Agregación Básica": 3,
    "Relaciones": 2,
    "Validación": 4,
    "Actualización": 3,
    "Análisis": 2,
    "Búsqueda Básica": 3,
    "Transacciones": 3,
    "Optimización": 4,
    "Exportación": 2,
    "Avanzados": 2,
    "Expresiones Regulares": 6,
    "Agregación Avanzada": 5,
    "Geoespaciales": 3,
    "Texto": 2,
    "Arrays": 5,
    "Fechas Avanzadas": 4,
    "Objetos Embebidos": 4,
    "Existencia y Tipos": 4,
    "Comparación Avanzada": 2,
    "Agrupación Compleja": 2,
    "Reportes Complejos": 2,
    "Colecciones Adicionales": 5
  },
  coleccionesUtilizadas: [
    "usuarios", "estudiantes", "profesores", "cursos", "sedes",
    "inscripciones", "instrumentos", "reservas_instrumentos",
    "inscripciones_completas", "nuevos_cursos", "backup_estudiantes",
    "usuarios_validados", "cursos_validados", "pagos", "horarios",
    "asistencias", "evaluaciones", "materiales"
  ],
  operadoresPrincipales: [
    "$lookup", "$group", "$sort", "$match", "$project",
    "$unwind", "$sum", "$avg", "$limit", "$addToSet",
    "$facet", "$bucket", "$addFields", "$cond", "$arrayToObject",
    "$objectToArray", "$reduce", "$geoWithin", "$near", "$text",
    "$size", "$all", "$nin", "$addToSet", "$pull", "$dayOfWeek",
    "$year", "$month", "$ceil", "$divide", "$subtract", "$multiply",
    "$min", "$max", "$exists", "$type", "$expr", "$gt", "$lt",
    "$gte", "$lte", "$eq", "$regex", "$in", "$and", "$or", "$nor"
  ]
};

print("✅ Total de ejercicios: " + resumenAmpliado.totalEjercicios);
print("📊 Categorías cubiertas: " + Object.keys(resumenAmpliado.categorias).length);
print("🗄️ Colecciones utilizadas: " + resumenAmpliado.coleccionesUtilizadas.length);
print("🔧 Operadores principales: " + resumenAmpliado.operadoresPrincipales.length);

print("\n🎯 EJERCICIOS MÁS PROBABLES EN EL EXAMEN (VERSIÓN AMPLIADA):");
print("1. Consulta de agregación con $lookup (95%)");
print("2. Expresiones regulares complejas (70%)");
print("3. Validación de esquemas (75%)");
print("4. Relaciones embebidas vs referencias (85%)");
print("5. Operaciones de actualización (70%)");
print("6. Consultas de arrays (75%)");
print("7. Análisis de fechas avanzadas (70%)");
print("8. Consultas de objetos embebidos (80%)");
print("9. Reportes complejos (75%)");
print("10. Transacciones (45%)");

print("\n🚀 ¡Archivo de evaluación ampliado y corregido completado! Listo para el examen más exigente."); 