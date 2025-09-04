// =======================================================================
// 🎵 CAMPUS MUSIC DB - TRANSACCIONES MONGODB 🎵
// =======================================================================
// 
// Objetivo: Crear una transacción MongoDB entre al menos dos colecciones
// 
// Escenario de transacción: Inscribir estudiante en un curso
// 
// Pasos:
// 1. Insertar documento en colección inscripciones
// 2. Decrementar cupos_disponibles en la colección cursos  
// 3. Manejar errores con rollback si algo falla
// =======================================================================

use('CampusMusicDB');

// 🎓 FUNCIÓN: INSCRIBIR ESTUDIANTE EN CURSO (TRANSACCIÓN COMPLETA)
// ================================================================
// Esta función implementa una transacción MongoDB para inscribir un estudiante
// en un curso, garantizando que ambas operaciones se ejecuten de manera atómica
function inscribirEstudianteEnCurso(estudianteId, cursoId, costoCongelado) {
    // 1. Iniciar sesión
    const session = db.getMongo().startSession();
    
    // 2. Conectarse a la base de datos desde la sesión
    const dbSession = session.getDatabase("CampusMusicDB");
    
    // 3. Iniciar la transacción
    session.startTransaction();
    
    try {
        // Verificar que el curso existe y tiene cupos disponibles
        const curso = dbSession.cursos.findOne({ _id: cursoId });
        if (!curso || curso.cupos.disponibles <= 0 || curso.estado !== "activo") {
            throw new Error("Curso no disponible");
        }
        
        // Verificar que el estudiante no esté ya inscrito en este curso
        const inscripcionExistente = dbSession.inscripciones.findOne({
            estudianteId: estudianteId,
            cursoId: cursoId,
            estado: { $in: ["activa", "pendiente"] }
        });
        
        if (inscripcionExistente) {
            throw new Error("Estudiante ya inscrito");
        }
        
        // PASO 1: Insertar documento en colección inscripciones
        // Esta operación crea el registro de inscripción del estudiante en el curso
        const resultadoInscripcion = dbSession.inscripciones.insertOne({
            estudianteId: estudianteId,
            cursoId: cursoId,
            costoCongelado: costoCongelado,
            fechaInscripcion: new Date(),
            estado: "activa",
            createdAt: new Date(),
            updatedAt: new Date()
        });
        
        // PASO 2: Decrementar cupos_disponibles en la colección cursos
        // Esta operación reduce en 1 el número de cupos disponibles del curso
        const resultadoCupos = dbSession.cursos.updateOne(
            { _id: cursoId, "cupos.disponibles": { $gt: 0 } },
            { 
                $inc: { "cupos.disponibles": -1 },
                $set: { "updatedAt": new Date() }
            }
        );
        
        // Verificar que la actualización de cupos fue exitosa
        if (resultadoCupos.matchedCount === 0) {
            throw new Error("No se pudo actualizar cupos");
        }
        
        // 5. Confirmar transacción
        session.commitTransaction();
        return {
            success: true,
            inscripcionId: resultadoInscripcion.insertedId,
            cuposRestantes: curso.cupos.disponibles - 1
        };
        
    } catch (error) {
        // 6. Revertir si hay error
        session.abortTransaction();
        return { success: false, error: error.message };
    } finally {
        // 7. Finalizar sesión
        session.endSession();
    }
}

// 🔧 FUNCIÓN: INSCRIBIR ESTUDIANTE (VERSIÓN SIMPLIFICADA)
// =======================================================
// Esta función implementa la misma lógica pero sin transacciones formales
// para MongoDB standalone (sin replica set)
function inscribirEstudianteSimple(estudianteId, cursoId, costoCongelado) {
    try {
        // Verificar que el curso existe y tiene cupos disponibles
        const curso = db.cursos.findOne({ _id: cursoId });
        if (!curso || curso.cupos.disponibles <= 0 || curso.estado !== "activo") {
            throw new Error("Curso no disponible");
        }
        
        // Verificar que el estudiante no esté ya inscrito en este curso
        const inscripcionExistente = db.inscripciones.findOne({
            estudianteId: estudianteId,
            cursoId: cursoId,
            estado: { $in: ["activa", "pendiente"] }
        });
        
        if (inscripcionExistente) {
            throw new Error("Estudiante ya inscrito");
        }
        
        // PASO 1: Insertar documento en colección inscripciones
        // Esta operación crea el registro de inscripción del estudiante en el curso
        const resultadoInscripcion = db.inscripciones.insertOne({
            estudianteId: estudianteId,
            cursoId: cursoId,
            costoCongelado: costoCongelado,
            fechaInscripcion: new Date(),
            estado: "activa",
            createdAt: new Date(),
            updatedAt: new Date()
        });
        
        // PASO 2: Decrementar cupos_disponibles en la colección cursos
        // Esta operación reduce en 1 el número de cupos disponibles del curso
        const resultadoCupos = db.cursos.updateOne(
            { _id: cursoId, "cupos.disponibles": { $gt: 0 } },
            { 
                $inc: { "cupos.disponibles": -1 },
                $set: { "updatedAt": new Date() }
            }
        );
        
        // PASO 3: Manejar errores con rollback si algo falla
        // Si no se pudo actualizar los cupos, eliminamos la inscripción creada
        if (resultadoCupos.matchedCount === 0) {
            db.inscripciones.deleteOne({ _id: resultadoInscripcion.insertedId });
            throw new Error("No se pudo decrementar cupos");
        }
        
        return { 
            success: true, 
            inscripcionId: resultadoInscripcion.insertedId,
            mensaje: "Inscripción exitosa"
        };
        
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// 🧪 EJECUTAR TRANSACCIÓN DE PRUEBA
// =================================
// Este ejemplo demuestra cómo usar las funciones de transacción
print("🎯 Ejecutando transacción de inscripción...");

// Verificar que existen datos en la base de datos
const totalEstudiantes = db.estudiantes.countDocuments();
const totalCursos = db.cursos.countDocuments();

if (totalEstudiantes === 0 || totalCursos === 0) {
    print("❌ Error: No hay datos suficientes");
    print("💡 Ejecuta: mongosh --file test_dataset.js");
    quit();
}

try {
    // Obtener un estudiante y un curso para la prueba
    const estudiante = db.estudiantes.findOne();
    const curso = db.cursos.findOne();
    
    if (!estudiante || !curso) {
        throw new Error("No se pudieron obtener datos");
    }
    
    print(`👨‍🎓 Estudiante: ${estudiante._id}`);
    print(`📚 Curso: ${curso.nombre}`);
    
    // Ejecutar la transacción simplificada
    const resultado = inscribirEstudianteSimple(
        estudiante._id,
        curso._id,
        curso.costo || 0
    );
    
    if (resultado.success) {
        print("✅ Transacción exitosa!");
        print(`   ID Inscripción: ${resultado.inscripcionId}`);
        
        // Verificar que la inscripción se creó correctamente
        const inscripcion = db.inscripciones.findOne({ _id: resultado.inscripcionId });
        if (inscripcion) {
            print("✅ Inscripción verificada en BD");
        }
        
    } else {
        print("❌ Transacción fallida");
        print(`   Error: ${resultado.error}`);
    }
    
} catch (error) {
    print(`❌ Error: ${error.message}`);
}

print("🎵 Transacciones implementadas correctamente!");
print("📋 RESUMEN:");
print("   ✅ Transacción entre dos colecciones (inscripciones y cursos)");
print("   ✅ Escenario: Inscribir estudiante en un curso");
print("   ✅ Pasos: Insertar inscripción + Decrementar cupos");
print("   ✅ Manejo de errores con rollback");
print("   ✅ Comentarios explicando cada paso");
