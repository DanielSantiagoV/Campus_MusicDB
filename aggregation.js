// ================================================================================
// AGGREGATION.JS - CONSULTAS DE AGREGACIÓN MONGODB
// Campus Music DB - Resolución de preguntas de negocio paso a paso
// ================================================================================
// OBJETIVO: Resolver las siguientes preguntas usando agregaciones de MongoDB.
//           Cada consulta está comentada y explicada paso a paso.
// ================================================================================

use('CampusMusicDB');
print("🎵 Ejecutando consultas de agregación en Campus Music DB...\n");

// ================================================================================
// PREGUNTA 1: ¿Cuántos estudiantes se inscribieron por sede en el último mes?
// ================================================================================
print("🔍 PREGUNTA 1: ¿Cuántos estudiantes se inscribieron por sede en el último mes?");
print("===============================================================================");

// PASO A: Calcular la fecha de hace un mes
const fechaHaceUnMes = new Date();
fechaHaceUnMes.setMonth(fechaHaceUnMes.getMonth() - 1);
print(`📅 Buscando inscripciones desde: ${fechaHaceUnMes.toISOString()}`);

db.inscripciones.aggregate([
  // PASO 1: $match - Filtrar solo inscripciones del último mes
  // ¿Por qué? Solo queremos contar estudiantes que se inscribieron recientemente
  {
    $match: {
      fechaInscripcion: { $gte: fechaHaceUnMes }
    }
  },
  
  // PASO 2: $lookup - Traer información del curso
  // ¿Por qué? La inscripción tiene cursoId, pero necesitamos la sede del curso
  {
    $lookup: {
      from: "cursos",           // De la colección cursos
      localField: "cursoId",    // Campo en inscripciones
      foreignField: "_id",      // Campo en cursos
      as: "curso"              // Guardar resultado como "curso"
    }
  },
  
  // PASO 3: $unwind - Convertir array en objeto
  // ¿Por qué? $lookup devuelve un array, necesitamos acceso directo al objeto
  {
    $unwind: "$curso"
  },
  
  // PASO 4: $lookup - Traer información de la sede
  // ¿Por qué? Ahora que tenemos el curso, podemos obtener la sede
  {
    $lookup: {
      from: "sedes",
      localField: "curso.sedeId",
      foreignField: "_id",
      as: "sede"
    }
  },
  
  // PASO 5: $unwind - Convertir array de sede en objeto
  {
    $unwind: "$sede"
  },
  
  // PASO 6: $group - Agrupar por sede y contar
  // ¿Por qué? Queremos el total de inscripciones por cada sede
  {
    $group: {
      _id: "$sede.nombre",      // Agrupar por nombre de sede
      total: { $sum: 1 },       // Contar cada inscripción como 1
      ciudad: { $first: "$sede.ciudad" }  // Incluir la ciudad
    }
  },
  
  // PASO 7: $sort - Ordenar de mayor a menor
  // ¿Por qué? Para ver qué sede tuvo más inscripciones primero
  {
    $sort: { total: -1 }
  }
]).forEach(printjson);

print("\n📊 RESPUESTA: En el último mes se inscribieron estudiantes distribuidos por sede.\n");

// ================================================================================
// PREGUNTA 2: ¿Cuáles son los cursos más demandados en cada sede?
// ================================================================================
print("🔍 PREGUNTA 2: ¿Cuáles son los cursos más demandados en cada sede?");
print("===================================================================");

db.inscripciones.aggregate([
  // PASO 1: $lookup - Traer datos del curso
  // ¿Por qué? Necesitamos el nombre del curso y la sede
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
  
  // PASO 2: $lookup - Traer datos de la sede
  // ¿Por qué? Para agrupar por sede después
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
  
  // PASO 3: $group - Contar inscripciones por curso y sede
  // ¿Por qué? Para saber cuántas veces se inscribieron en cada curso
  {
    $group: {
      _id: {
        sede: "$sede.nombre",
        curso: "$curso.nombre",
        nivel: "$curso.nivel",
        instrumento: "$curso.instrumento"
      },
      inscripciones: { $sum: 1 }
    }
  },
  
  // PASO 4: $sort - Ordenar por sede y luego por inscripciones
  // ¿Por qué? Para que los cursos más populares aparezcan primero en cada sede
  {
    $sort: {
      "_id.sede": 1,           // Primero por sede (alfabético)
      "inscripciones": -1      // Luego por popularidad (mayor a menor)
    }
  },
  
  // PASO 5: $group - Tomar solo el primer curso de cada sede
  // ¿Por qué? Como ya están ordenados, el primero es el más popular
  {
    $group: {
      _id: "$_id.sede",
      cursoMasPopular: { $first: "$_id.curso" },
      nivel: { $first: "$_id.nivel" },
      instrumento: { $first: "$_id.instrumento" },
      totalInscripciones: { $first: "$inscripciones" }
    }
  },
  
  // PASO 6: $sort - Ordenar por nombre de sede
  {
    $sort: { _id: 1 }
  }
]).forEach(printjson);

print("\n📊 RESPUESTA: Cada sede tiene un curso más demandado según las inscripciones.\n");

// ================================================================================
// PREGUNTA 3: ¿Cuál es el ingreso total generado por inscripciones en cada sede?
// ================================================================================
print("🔍 PREGUNTA 3: ¿Cuál es el ingreso total generado por inscripciones en cada sede?");
print("================================================================================");

db.inscripciones.aggregate([
  // PASO 1: $lookup - Traer datos del curso
  // ¿Por qué? Necesitamos la sede del curso para agrupar ingresos
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
  
  // PASO 2: $lookup - Traer datos de la sede
  // ¿Por qué? Para agrupar los ingresos por sede
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
  
  // PASO 3: $group - Sumar el costo congelado por sede
  // ¿Por qué? costoCongelado es el precio que realmente pagó el estudiante
  {
    $group: {
      _id: "$sede.nombre",
      ingresoTotal: { $sum: "$costoCongelado" },  // Sumar todos los costos
      totalInscripciones: { $sum: 1 },            // Contar inscripciones
      ciudad: { $first: "$sede.ciudad" }
    }
  },
  
  // PASO 4: $sort - Ordenar por ingreso (mayor a menor)
  // ¿Por qué? Para ver qué sede genera más ingresos
  {
    $sort: { ingresoTotal: -1 }
  }
]).forEach(printjson);

print("\n💰 RESPUESTA: Los ingresos totales por sede muestran la rentabilidad de cada campus.\n");

// ================================================================================
// PREGUNTA 4: ¿Qué profesor tiene más estudiantes asignados?
// ================================================================================
print("🔍 PREGUNTA 4: ¿Qué profesor tiene más estudiantes asignados?");
print("=============================================================");

db.inscripciones.aggregate([
  // PASO 1: $match - Solo inscripciones activas
  // ¿Por qué? Solo contamos estudiantes que están actualmente en clases
  {
    $match: {
      estado: "activa"
    }
  },
  
  // PASO 2: $lookup - Traer datos del curso
  // ¿Por qué? Necesitamos el profesorId del curso
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
  
  // PASO 3: $lookup - Traer datos del profesor
  // ¿Por qué? Necesitamos conectar con el perfil del profesor
  {
    $lookup: {
      from: "profesores",
      localField: "curso.profesorId",
      foreignField: "_id",
      as: "profesor"
    }
  },
  {
    $unwind: "$profesor"
  },
  
  // PASO 4: $lookup - Traer nombre del profesor
  // ¿Por qué? El nombre está en la colección usuarios
  {
    $lookup: {
      from: "usuarios",
      localField: "profesor.usuarioId",
      foreignField: "_id",
      as: "usuario"
    }
  },
  {
    $unwind: "$usuario"
  },
  
  // PASO 5: $group - Contar estudiantes por profesor
  // ¿Por qué? Para saber cuántos estudiantes tiene cada profesor
  {
    $group: {
      _id: "$usuario.username",
      totalEstudiantes: { $sum: 1 },
      especialidades: { $first: "$profesor.especialidades" },
      email: { $first: "$usuario.email" }
    }
  },
  
  // PASO 6: $sort - Ordenar por total de estudiantes
  // ¿Por qué? Para encontrar el profesor con MÁS estudiantes
  {
    $sort: { totalEstudiantes: -1 }
  },
  
  // PASO 7: $limit - Tomar solo el primero
  // ¿Por qué? Solo queremos el profesor con MÁS estudiantes
  {
    $limit: 1
  }
]).forEach(printjson);

print("\n👨‍🏫 RESPUESTA: El profesor con más estudiantes activos asignados.\n");

// ================================================================================
// PREGUNTA 5: ¿Qué instrumento es el más reservado?
// ================================================================================
print("🔍 PREGUNTA 5: ¿Qué instrumento es el más reservado?");
print("===================================================");

db.reservas_instrumentos.aggregate([
  // PASO 1: $lookup - Traer datos del instrumento
  // ¿Por qué? Necesitamos el tipo de instrumento para agrupar
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
  
  // PASO 2: $group - Contar reservas por tipo de instrumento
  // ¿Por qué? Para saber cuántas veces se reserva cada tipo
  {
    $group: {
      _id: "$instrumento.tipo",
      totalReservas: { $sum: 1 },
      ejemploInstrumento: { $first: "$instrumento.nombre" }
    }
  },
  
  // PASO 3: $sort - Ordenar por total de reservas
  // ¿Por qué? Para encontrar el MÁS reservado
  {
    $sort: { totalReservas: -1 }
  },
  
  // PASO 4: $limit - Tomar solo el primero
  // ¿Por qué? Solo queremos el instrumento MÁS reservado
  {
    $limit: 1
  }
]).forEach(printjson);

print("\n🎸 RESPUESTA: El tipo de instrumento con mayor número de reservas.\n");

// ================================================================================
// PREGUNTA 6: Mostrar el historial de cursos de un estudiante 
//             (fecha, sede, curso, profesor, nivel, costo)
// ================================================================================
print("🔍 PREGUNTA 6: Historial completo de cursos del estudiante1");
print("===========================================================");
print("📋 Formato: fecha, sede, curso, profesor, nivel, costo");

// PASO PREVIO: Buscar el estudiante específico
const usuario = db.usuarios.findOne({ username: "estudiante1" });
const estudiante = db.estudiantes.findOne({ usuarioId: usuario._id });

if (estudiante) {
  print(`👤 Estudiante encontrado: ${usuario.username} (${usuario.email})`);
  
  db.inscripciones.aggregate([
    // PASO 1: $match - Solo inscripciones de este estudiante
    // ¿Por qué? Queremos el historial específico de UN estudiante
    {
      $match: {
        estudianteId: estudiante._id
      }
    },
    
    // PASO 2: $lookup - Traer datos del curso
    // ¿Por qué? Necesitamos nombre, nivel y profesor del curso
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
    
    // PASO 3: $lookup - Traer datos de la sede
    // ¿Por qué? Necesitamos saber en qué sede tomó cada curso
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
    
    // PASO 4: $lookup - Traer datos del profesor
    // ¿Por qué? Necesitamos el perfil del profesor
    {
      $lookup: {
        from: "profesores",
        localField: "curso.profesorId",
        foreignField: "_id",
        as: "profesor"
      }
    },
    {
      $unwind: "$profesor"
    },
    
    // PASO 5: $lookup - Traer nombre del profesor
    // ¿Por qué? El nombre está en la colección usuarios
    {
      $lookup: {
        from: "usuarios",
        localField: "profesor.usuarioId",
        foreignField: "_id",
        as: "usuarioProfesor"
      }
    },
    {
      $unwind: "$usuarioProfesor"
    },
    
    // PASO 6: $project - Seleccionar solo los campos solicitados
    // ¿Por qué? Para mostrar exactamente: fecha, sede, curso, profesor, nivel, costo
    {
      $project: {
        _id: 0,                           // No mostrar el _id
        fecha: "$fechaInscripcion",       // ✅ Fecha
        sede: "$sede.nombre",             // ✅ Sede
        curso: "$curso.nombre",           // ✅ Curso
        profesor: "$usuarioProfesor.username", // ✅ Profesor
        nivel: "$curso.nivel",            // ✅ Nivel
        costo: "$costoCongelado",         // ✅ Costo
        estado: "$estado"                 // Extra: estado de la inscripción
      }
    },
    
    // PASO 7: $sort - Ordenar por fecha (más reciente primero)
    // ¿Por qué? Para ver el historial cronológico
    {
      $sort: { fecha: -1 }
    }
  ]).forEach(printjson);
} else {
  print("❌ No se encontró el estudiante1");
}

print("\n📚 RESPUESTA: Historial completo con fecha, sede, curso, profesor, nivel y costo.\n");

// ================================================================================
// PREGUNTA 7: Listar los cursos actualmente en ejecución en cada sede
// ================================================================================
print("🔍 PREGUNTA 7: Listar los cursos actualmente en ejecución en cada sede");
print("======================================================================");

db.cursos.aggregate([
  // PASO 1: $match - Solo cursos con estado "activo"
  // ¿Por qué? "En ejecución" significa que están activos actualmente
  {
    $match: {
      estado: "activo"
    }
  },
  
  // PASO 2: $lookup - Traer datos de la sede
  // ¿Por qué? Para agrupar los cursos por sede
  {
    $lookup: {
      from: "sedes",
      localField: "sedeId",
      foreignField: "_id",
      as: "sede"
    }
  },
  {
    $unwind: "$sede"
  },
  
  // PASO 3: $group - Agrupar cursos por sede
  // ¿Por qué? Queremos una lista de cursos activos por cada sede
  {
    $group: {
      _id: "$sede.nombre",
      ciudad: { $first: "$sede.ciudad" },
      cursosActivos: { 
        $push: {                        // $push crea un array con cada curso
          nombre: "$nombre",
          nivel: "$nivel",
          instrumento: "$instrumento",
          cuposDisponibles: "$cupos.disponibles"
        }
      },
      totalCursos: { $sum: 1 }
    }
  },
  
  // PASO 4: $sort - Ordenar por nombre de sede
  // ¿Por qué? Para mostrar las sedes en orden alfabético
  {
    $sort: { _id: 1 }
  }
]).forEach(printjson);

print("\n⚡ RESPUESTA: Lista de cursos activos organizados por sede.\n");

// ================================================================================
// PREGUNTA 8: Detectar cursos que excedieron el cupo permitido en algún momento
// ================================================================================
print("🔍 PREGUNTA 8: Detectar cursos que excedieron el cupo permitido");
print("==============================================================");

db.cursos.aggregate([
  // PASO 1: $match - Buscar cursos con cupos disponibles negativos
  // ¿Por qué? Si cupos.disponibles < 0, significa que hay sobrecupo
  // Ejemplo: máximo=10, disponibles=-2 → hay 12 estudiantes (sobrecupo de 2)
  {
    $match: {
      "cupos.disponibles": { $lt: 0 }
    }
  },
  
  // PASO 2: $lookup - Traer datos de la sede
  // ¿Por qué? Para saber en qué sede ocurrió el sobrecupo
  {
    $lookup: {
      from: "sedes",
      localField: "sedeId",
      foreignField: "_id",
      as: "sede"
    }
  },
  {
    $unwind: "$sede"
  },
  
  // PASO 3: $project - Mostrar información del sobrecupo
  // ¿Por qué? Para calcular y mostrar claramente el exceso
  {
    $project: {
      _id: 0,
      curso: "$nombre",
      sede: "$sede.nombre",
      cupoMaximo: "$cupos.maximo",
      cuposDisponibles: "$cupos.disponibles",    // Será negativo
      sobrecupo: { $multiply: ["$cupos.disponibles", -1] },  // Convertir a positivo
      nivel: "$nivel",
      instrumento: "$instrumento"
    }
  },
  
  // PASO 4: $sort - Ordenar por sobrecupo (mayor problema primero)
  {
    $sort: { sobrecupo: -1 }
  }
]).forEach(printjson);

print("\n⚠️  RESPUESTA: Cursos con sobrecupo (si existen). Si está vacío = no hay sobrecupos.\n");

// ================================================================================
// 🎯 RESUMEN FINAL
// ================================================================================
print("🎯 RESUMEN DE CONSULTAS EJECUTADAS:");
print("===================================");
print("1. ✅ Estudiantes por sede (último mes)");
print("2. ✅ Cursos más demandados por sede");
print("3. ✅ Ingreso total por sede");
print("4. ✅ Profesor con más estudiantes");
print("5. ✅ Instrumento más reservado");
print("6. ✅ Historial completo de estudiante");
print("7. ✅ Cursos activos por sede");
print("8. ✅ Detección de sobrecupos");
print("\n🎵 ¡Todas las consultas de agregación completadas exitosamente!");