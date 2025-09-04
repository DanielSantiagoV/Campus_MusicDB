// ========================================================================
// CONSULTAS AVANZADAS - CampusMusicDB
// Solo consultas MongoDB puras, sin lógica de programación compleja
// ========================================================================

print("🚀 Iniciando consultas avanzadas simples...");

// ========================================================================
// 1. CONSULTAS CON OPERADORES AVANZADOS
// ========================================================================

print("\n📊 1. CONSULTAS CON OPERADORES AVANZADOS");

// 1.1 Estudiantes que se inscribieron en más de un instrumento
print("\n--- 1.1 Estudiantes con múltiples instrumentos ---");
db.inscripciones.aggregate([
  {
    $lookup: {
      from: "cursos",
      localField: "cursoId",
      foreignField: "_id",
      as: "curso"
    }
  },
  {
    $unwind: "$curso"
  },
  {
    $group: {
      _id: "$estudianteId",
      instrumentos: { $addToSet: "$curso.instrumento" },
      cantidadCursos: { $sum: 1 }
    }
  },
  {
    $match: {
      $expr: { $gt: [{ $size: "$instrumentos" }, 1] }
    }
  },
  {
    $lookup: {
      from: "estudiantes",
      localField: "_id",
      foreignField: "_id",
      as: "estudiante"
    }
  },
  {
    $unwind: "$estudiante"
  },
  {
    $project: {
      nombre: "$estudiante.nombre",
      email: "$estudiante.email",
      instrumentos: 1,
      cantidadCursos: 1
    }
  }
]);

// 1.2 Cursos con más estudiantes que el promedio
print("\n--- 1.2 Cursos populares (más estudiantes que el promedio) ---");
db.inscripciones.aggregate([
  {
    $group: {
      _id: "$cursoId",
      totalEstudiantes: { $sum: 1 }
    }
  },
  {
    $lookup: {
      from: "cursos",
      localField: "_id",
      foreignField: "_id",
      as: "curso"
    }
  },
  {
    $unwind: "$curso"
  },
  {
    $group: {
      _id: null,
      cursos: { $push: "$$ROOT" },
      promedioEstudiantes: { $avg: "$totalEstudiantes" }
    }
  },
  {
    $unwind: "$cursos"
  },
  {
    $match: {
      $expr: { $gt: ["$cursos.totalEstudiantes", "$promedioEstudiantes"] }
    }
  },
  {
    $project: {
      nombreCurso: "$cursos.curso.nombre",
      instrumento: "$cursos.curso.instrumento",
      nivel: "$cursos.curso.nivel",
      totalEstudiantes: "$cursos.totalEstudiantes",
      promedioGeneral: { $round: ["$promedioEstudiantes", 2] }
    }
  },
  {
    $sort: { totalEstudiantes: -1 }
  }
]);

// 1.3 Profesores que enseñan en múltiples sedes
print("\n--- 1.3 Profesores en múltiples sedes ---");
db.cursos.aggregate([
  {
    $group: {
      _id: "$profesorId",
      sedes: { $addToSet: "$sedeId" },
      cantidadSedes: { $sum: 1 }
    }
  },
  {
    $match: {
      $expr: { $gt: [{ $size: "$sedes" }, 1] }
    }
  },
  {
    $lookup: {
      from: "profesores",
      localField: "_id",
      foreignField: "_id",
      as: "profesor"
    }
  },
  {
    $unwind: "$profesor"
  },
  {
    $project: {
      nombre: "$profesor.nombre",
      email: "$profesor.email",
      cantidadSedes: 1
    }
  }
]);

// ========================================================================
// 2. AGREGACIONES COMPLEJAS
// ========================================================================

print("\n📈 2. AGREGACIONES COMPLEJAS");

// 2.1 Análisis de ingresos por sede
print("\n--- 2.1 Ingresos totales por sede ---");
db.inscripciones.aggregate([
  {
    $match: { estado: "activa" }
  },
  {
    $lookup: {
      from: "cursos",
      localField: "cursoId",
      foreignField: "_id",
      as: "curso"
    }
  },
  {
    $unwind: "$curso"
  },
  {
    $lookup: {
      from: "sedes",
      localField: "curso.sedeId",
      foreignField: "_id",
      as: "sede"
    }
  },
  {
    $unwind: "$sede"
  },
  {
    $group: {
      _id: "$sede.nombre",
      totalIngresos: { $sum: "$costoCongelado" },
      cantidadInscripciones: { $sum: 1 },
      promedioCosto: { $avg: "$costoCongelado" }
    }
  },
  {
    $sort: { totalIngresos: -1 }
  }
]);

// 2.2 Análisis de inscripciones por mes
print("\n--- 2.2 Inscripciones por mes ---");
db.inscripciones.aggregate([
  {
    $addFields: {
      año: { $year: "$fechaInscripcion" },
      mes: { $month: "$fechaInscripcion" }
    }
  },
  {
    $group: {
      _id: {
        año: "$año",
        mes: "$mes"
      },
      cantidadInscripciones: { $sum: 1 },
      totalIngresos: { $sum: "$costoCongelado" }
    }
  },
  {
    $sort: { "_id.año": 1, "_id.mes": 1 }
  }
]);

// 2.3 Distribución de estudiantes por nivel
print("\n--- 2.3 Estudiantes por nivel ---");
db.estudiantes.aggregate([
  {
    $group: {
      _id: "$nivel",
      cantidad: { $sum: 1 },
      estudiantes: { $push: { nombre: "$nombre", email: "$email" } }
    }
  },
  {
    $sort: { cantidad: -1 }
  }
]);

// ========================================================================
// 3. CONSULTAS CON EXPRESIONES REGULARES
// ========================================================================

print("\n🔍 3. CONSULTAS CON EXPRESIONES REGULARES");

// 3.1 Estudiantes con nombres que contengan 'a'
print("\n--- 3.1 Estudiantes con 'a' en el nombre ---");
db.estudiantes.find({
  nombre: { $regex: /a/i }
}, {
  nombre: 1,
  email: 1,
  nivel: 1
});

// 3.2 Cursos que empiecen con vocales
print("\n--- 3.2 Cursos que empiecen con vocales ---");
db.cursos.find({
  nombre: { $regex: /^[aeiou]/i }
}, {
  nombre: 1,
  instrumento: 1,
  nivel: 1,
  costo: 1
});

// 3.3 Sedes con números en la dirección
print("\n--- 3.3 Sedes con números en dirección ---");
db.sedes.find({
  direccion: { $regex: /[0-9]/ }
}, {
  nombre: 1,
  direccion: 1,
  telefono: 1
});

// ========================================================================
// 4. CONSULTAS CON OPERADORES LÓGICOS
// ========================================================================

print("\n🧮 4. CONSULTAS CON OPERADORES LÓGICOS");

// 4.1 Inscripciones activas con costo alto
print("\n--- 4.1 Inscripciones activas con costo alto ---");
db.inscripciones.aggregate([
  {
    $match: {
      $and: [
        { estado: "activa" },
        { costoCongelado: { $gte: 150 } }
      ]
    }
  },
  {
    $lookup: {
      from: "cursos",
      localField: "cursoId",
      foreignField: "_id",
      as: "curso"
    }
  },
  {
    $unwind: "$curso"
  },
  {
    $lookup: {
      from: "estudiantes",
      localField: "estudianteId",
      foreignField: "_id",
      as: "estudiante"
    }
  },
  {
    $unwind: "$estudiante"
  },
  {
    $project: {
      estudiante: "$estudiante.nombre",
      curso: "$curso.nombre",
      instrumento: "$curso.instrumento",
      costo: "$costoCongelado"
    }
  },
  {
    $sort: { costo: -1 }
  }
]);

// 4.2 Instrumentos disponibles de marcas específicas
print("\n--- 4.2 Instrumentos disponibles de marcas específicas ---");
db.instrumentos.find({
  $and: [
    { estado: "disponible" },
    { marca: { $regex: /yamaha|fender|gibson/i } }
  ]
}, {
  nombre: 1,
  marca: 1,
  modelo: 1,
  estado: 1,
  añoFabricacion: 1
});

// ========================================================================
// 5. CONSULTAS DE ANÁLISIS
// ========================================================================

print("\n📊 5. CONSULTAS DE ANÁLISIS");

// 5.1 Top 5 cursos más caros
print("\n--- 5.1 Top 5 cursos más caros ---");
db.cursos.find().sort({ costo: -1 }).limit(5);

// 5.2 Estudiantes con más inscripciones
print("\n--- 5.2 Estudiantes con más inscripciones ---");
db.inscripciones.aggregate([
  {
    $group: {
      _id: "$estudianteId",
      cantidadInscripciones: { $sum: 1 }
    }
  },
  {
    $sort: { cantidadInscripciones: -1 }
  },
  {
    $limit: 5
  },
  {
    $lookup: {
      from: "estudiantes",
      localField: "_id",
      foreignField: "_id",
      as: "estudiante"
    }
  },
  {
    $unwind: "$estudiante"
  },
  {
    $project: {
      nombre: "$estudiante.nombre",
      email: "$estudiante.email",
      cantidadInscripciones: 1
    }
  }
]);

// 5.3 Instrumentos más antiguos
print("\n--- 5.3 Instrumentos más antiguos ---");
db.instrumentos.find().sort({ añoFabricacion: 1 }).limit(5);

// ========================================================================
// 6. CONSULTAS DE ESTADÍSTICAS
// ========================================================================

print("\n📈 6. CONSULTAS DE ESTADÍSTICAS");

// 6.1 Estadísticas generales de inscripciones
print("\n--- 6.1 Estadísticas de inscripciones ---");
db.inscripciones.aggregate([
  {
    $group: {
      _id: null,
      totalInscripciones: { $sum: 1 },
      totalIngresos: { $sum: "$costoCongelado" },
      promedioCosto: { $avg: "$costoCongelado" },
      costoMinimo: { $min: "$costoCongelado" },
      costoMaximo: { $max: "$costoCongelado" }
    }
  }
]);

// 6.2 Distribución por estado de inscripciones
print("\n--- 6.2 Distribución por estado ---");
db.inscripciones.aggregate([
  {
    $group: {
      _id: "$estado",
      cantidad: { $sum: 1 }
    }
  },
  {
    $sort: { cantidad: -1 }
  }
]);

// 6.3 Promedio de costo por instrumento
print("\n--- 6.3 Promedio de costo por instrumento ---");
db.cursos.aggregate([
  {
    $group: {
      _id: "$instrumento",
      promedioCosto: { $avg: "$costo" },
      cantidadCursos: { $sum: 1 }
    }
  },
  {
    $sort: { promedioCosto: -1 }
  }
]);

// ========================================================================
// 7. CONSULTAS DE BÚSQUEDA
// ========================================================================

print("\n🔎 7. CONSULTAS DE BÚSQUEDA");

// 7.1 Buscar estudiantes por nivel
print("\n--- 7.1 Estudiantes intermedios ---");
db.estudiantes.find(
  { nivel: "intermedio" },
  { nombre: 1, email: 1, telefono: 1 }
);

// 7.2 Buscar cursos por instrumento
print("\n--- 7.2 Cursos de piano ---");
db.cursos.find(
  { instrumento: "piano" },
  { nombre: 1, nivel: 1, costo: 1 }
);

// 7.3 Buscar instrumentos disponibles
print("\n--- 7.3 Instrumentos disponibles ---");
db.instrumentos.find(
  { estado: "disponible" },
  { nombre: 1, marca: 1, modelo: 1 }
);

// ========================================================================
// 8. CONSULTAS DE RELACIONES
// ========================================================================

print("\n🔗 8. CONSULTAS DE RELACIONES");

// 8.1 Inscripciones con información completa
print("\n--- 8.1 Inscripciones con información completa ---");
db.inscripciones.aggregate([
  {
    $lookup: {
      from: "estudiantes",
      localField: "estudianteId",
      foreignField: "_id",
      as: "estudiante"
    }
  },
  {
    $unwind: "$estudiante"
  },
  {
    $lookup: {
      from: "cursos",
      localField: "cursoId",
      foreignField: "_id",
      as: "curso"
    }
  },
  {
    $unwind: "$curso"
  },
  {
    $project: {
      estudiante: "$estudiante.nombre",
      curso: "$curso.nombre",
      instrumento: "$curso.instrumento",
      costo: "$costoCongelado",
      estado: 1,
      fechaInscripcion: 1
    }
  },
  {
    $limit: 10
  }
]);

// 8.2 Reservas con información de instrumento
print("\n--- 8.2 Reservas con información de instrumento ---");
db.reservas_instrumentos.aggregate([
  {
    $lookup: {
      from: "instrumentos",
      localField: "instrumentoId",
      foreignField: "_id",
      as: "instrumento"
    }
  },
  {
    $unwind: "$instrumento"
  },
  {
    $lookup: {
      from: "estudiantes",
      localField: "estudianteId",
      foreignField: "_id",
      as: "estudiante"
    }
  },
  {
    $unwind: "$estudiante"
  },
  {
    $project: {
      estudiante: "$estudiante.nombre",
      instrumento: "$instrumento.nombre",
      marca: "$instrumento.marca",
      fechaInicio: "$fechaHoraInicio",
      fechaFin: "$fechaHoraFin",
      estado: 1
    }
  }
]);

// ========================================================================
// RESUMEN
// ========================================================================

print("\n" + "=".repeat(60));
print("✅ CONSULTAS AVANZADAS COMPLETADAS");
print("=".repeat(60));
print("📊 Operadores avanzados: $addToSet, $size, $expr");
print("📈 Agregaciones complejas: $lookup, $group, $match");
print("🔍 Expresiones regulares: $regex");
print("🧮 Operadores lógicos: $and, $or, $gte, $lte");
print("📊 Análisis y estadísticas");
print("🔎 Búsquedas específicas");
print("🔗 Consultas de relaciones");
print("=".repeat(60)); 