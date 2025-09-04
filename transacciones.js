// =======================================================================
// 🎵 CAMPUS MUSIC DB - TRANSACCIONES MONGODB 🎵
// =======================================================================
//
// 📋 DESCRIPCIÓN:
// Este archivo implementa transacciones MongoDB para garantizar la integridad
// de datos en operaciones críticas del sistema Campus Music.
//
// 🎯 ESCENARIO: INSCRIPCIÓN DE ESTUDIANTE EN UN CURSO
// ==================================================
// Esta transacción maneja la inscripción de un estudiante en un curso,
// garantizando que ambas operaciones (insertar inscripción y decrementar cupos)
// se ejecuten de manera atómica.
//
// 📊 OPERACIONES INCLUIDAS:
// 1. Insertar documento en colección 'inscripciones'
// 2. Decrementar 'cupos.disponibles' en colección 'cursos'
// 3. Manejo de errores con rollback automático
//
// 🚀 CÓMO EJECUTAR:
// 1. Asegúrate de que la base de datos CampusMusicDB esté configurada
// 2. Ejecuta desde mongosh: load("transacciones.js")
//

// 🔗 Conectar a la base de datos
use('CampusMusicDB');

// 🎓 FUNCIÓN: INSCRIBIR ESTUDIANTE EN CURSO
// =========================================
// Esta función implementa una transacción para inscribir un estudiante en un curso
// de manera segura, garantizando que no se excedan los cupos disponibles.
//
// 📝 PARÁMETROS:
// - estudianteId: ObjectId del estudiante a inscribir
// - cursoId: ObjectId del curso en el que se inscribe
// - costoCongelado: Costo del curso al momento de inscripción
//
// 🔒 GARANTÍAS:
// - Atomicidad: Todas las operaciones se ejecutan o ninguna
// - Consistencia: Los cupos nunca serán negativos
// - Integridad: No se permiten inscripciones duplicadas
function inscribirEstudianteEnCurso(estudianteId, cursoId, costoCongelado) {
    // 1️⃣ INICIAR SESIÓN
    // =================
    // Creamos una nueva sesión de MongoDB que nos permitirá
    // agrupar múltiples operaciones en una transacción atómica
    const session = db.getMongo().startSession();
    
    // 2️⃣ CONECTAR A LA BASE DE DATOS DESDE LA SESIÓN
    // ===============================================
    // Obtenemos una referencia a la base de datos a través de la sesión
    // Esto es necesario para que todas las operaciones usen la misma sesión
    const dbSession = session.getDatabase("CampusMusicDB");
    
    // 3️⃣ INICIAR LA TRANSACCIÓN
    // =========================
    // Marcamos el inicio de la transacción. A partir de este punto,
    // todas las operaciones serán parte de la misma unidad atómica
    session.startTransaction();
    
    try {
        print("🚀 Iniciando inscripción de estudiante...");
        
        // 4️⃣ VERIFICAR DISPONIBILIDAD DE CUPOS
        // ====================================
        // IMPORTANTE: Todas las operaciones de lectura y escritura deben usar 'dbSession'
        // en lugar de 'db' para que sean parte de la transacción.
        // Antes de proceder, verificamos que el curso tenga cupos disponibles
        print("🔍 Verificando disponibilidad del curso dentro de la transacción...");
        const curso = dbSession.cursos.findOne({ _id: cursoId });
        
        if (!curso) {
            throw new Error("❌ Error: El curso especificado no existe");
        }
        
        if (curso.cupos.disponibles <= 0) {
            throw new Error("❌ Error: No hay cupos disponibles en este curso");
        }
        
        if (curso.estado !== "activo") {
            throw new Error("❌ Error: El curso no está activo para inscripciones");
        }
        
        print(`📚 Curso encontrado: ${curso.nombre} (${curso.cupos.disponibles} cupos disponibles)`);
        
        // 5️⃣ VERIFICAR QUE NO EXISTA INSCRIPCIÓN PREVIA
        // ==============================================
        // Verificamos que el estudiante no esté ya inscrito en este curso
        const inscripcionExistente = dbSession.inscripciones.findOne({
            estudianteId: estudianteId,
            cursoId: cursoId,
            estado: { $in: ["activa", "pendiente"] }
        });
        
        if (inscripcionExistente) {
            throw new Error("❌ Error: El estudiante ya está inscrito en este curso");
        }
        
        // 6️⃣ OPERACIÓN 1: INSERTAR INSCRIPCIÓN
        // ====================================
        // CRÍTICO: Usamos 'dbSession' para que esta operación sea parte de la transacción.
        // Insertamos el documento de inscripción con todos los datos requeridos
        // según el esquema de validación de la colección 'inscripciones'.
        print("📝 Insertando inscripción en la transacción...");
        const resultadoInscripcion = dbSession.inscripciones.insertOne({
            estudianteId: estudianteId,
            cursoId: cursoId,
            costoCongelado: costoCongelado,
            fechaInscripcion: new Date(),
            estado: "activa",
            createdAt: new Date(),
            updatedAt: new Date()
        });
        
        print(`✅ Inscripción creada con ID: ${resultadoInscripcion.insertedId}`);
        
        // 7️⃣ OPERACIÓN 2: DECREMENTAR CUPOS DISPONIBLES
        // =============================================
        // CRÍTICO: También usamos 'dbSession' para que esta operación sea parte
        // de la misma transacción. Si esta operación falla, la inscripción
        // insertada anteriormente se revertirá automáticamente.
        // Actualizamos los cupos disponibles del curso, decrementando en 1
        print("📉 Decrementando cupos disponibles en la transacción...");
        const resultadoCupos = dbSession.cursos.updateOne(
            { 
                _id: cursoId,
                "cupos.disponibles": { $gt: 0 }  // 🛡️ Verificación adicional de seguridad
            },
            { 
                $inc: { "cupos.disponibles": -1 },  // 📉 Decrementar cupos disponibles
                $set: { "updatedAt": new Date() }   // 🔄 Actualizar timestamp
            }
        );
        
        // 8️⃣ VERIFICAR QUE LA ACTUALIZACIÓN FUE EXITOSA
        // =============================================
        // Si no se actualizó ningún documento, significa que no había cupos
        // disponibles (condición de carrera)
        if (resultadoCupos.matchedCount === 0) {
            throw new Error("❌ Error: No se pudo actualizar los cupos (posible condición de carrera)");
        }
        
        print(`✅ Cupos decrementados. Cupos restantes: ${curso.cupos.disponibles - 1}`);
        
        // 9️⃣ CONFIRMAR TRANSACCIÓN
        // ========================
        // Si llegamos hasta aquí sin errores, confirmamos todas las operaciones
        session.commitTransaction();
        print("🎉 ¡Inscripción completada exitosamente!");
        
        return {
            success: true,
            inscripcionId: resultadoInscripcion.insertedId,
            cuposRestantes: curso.cupos.disponibles - 1
        };
        
    } catch (error) {
        // 🔄 REVERTIR TRANSACCIÓN EN CASO DE ERROR
        // ========================================
        // Si ocurre cualquier error, revertimos todas las operaciones
        session.abortTransaction();
        print("❌ Error en la transacción:", error.message);
        print("🔄 Transacción revertida. No se realizaron cambios.");
        
        return {
            success: false,
            error: error.message
        };
        
    } finally {
        // 🔚 FINALIZAR SESIÓN
        // ===================
        // Siempre cerramos la sesión, sin importar si la transacción
        // fue exitosa o falló
        session.endSession();
        print("🔐 Sesión finalizada correctamente.");
    }
}

// 🔧 VERSIÓN SIMPLIFICADA SIN TRANSACCIONES (Para MongoDB Standalone)
// ===================================================================
// 📋 DESCRIPCIÓN:
// Esta versión funciona en MongoDB standalone sin necesidad de replica set.
// Aunque no usa transacciones formales, implementa rollback manual para
// mantener la integridad de datos entre las dos colecciones.
//
// 🎯 DIFERENCIAS CON TRANSACCIONES REALES:
// - No requiere replica set o sharded cluster
// - Usa rollback manual en lugar de session.abortTransaction()
// - Mantiene la misma lógica de negocio y validaciones
// - Funciona en instalaciones simples de MongoDB
//
// 🔒 GARANTÍAS DE INTEGRIDAD:
// - Validaciones previas evitan operaciones inválidas
// - Rollback manual si falla la segunda operación
// - Verificación de condiciones de carrera
// - Prevención de inscripciones duplicadas
function inscribirEstudianteSimple(estudianteId, cursoId, costoCongelado) {
    try {
        print("🚀 Iniciando inscripción de estudiante (versión simplificada)...");
        
        // 📋 PASO 1: VERIFICAR DISPONIBILIDAD DEL CURSO
        // ============================================
        // Antes de realizar cualquier operación, verificamos que el curso
        // exista, esté activo y tenga cupos disponibles
        print("🔍 Verificando disponibilidad del curso...");
        const curso = db.cursos.findOne({ _id: cursoId });
        
        // Validación 1: El curso debe existir
        if (!curso) {
            throw new Error("❌ Error: El curso especificado no existe");
        }
        
        // Validación 2: Debe tener cupos disponibles
        if (curso.cupos.disponibles <= 0) {
            throw new Error("❌ Error: No hay cupos disponibles en este curso");
        }
        
        // Validación 3: El curso debe estar activo
        if (curso.estado !== "activo") {
            throw new Error("❌ Error: El curso no está activo para inscripciones");
        }
        
        print(`✅ Curso válido: ${curso.nombre} (${curso.cupos.disponibles} cupos disponibles)`);
        
        // 📋 PASO 2: VERIFICAR INSCRIPCIÓN DUPLICADA
        // =========================================
        // Verificamos que el estudiante no esté ya inscrito en este curso
        // para evitar inscripciones duplicadas
        print("🔍 Verificando inscripciones previas...");
        const inscripcionExistente = db.inscripciones.findOne({
            estudianteId: estudianteId,
            cursoId: cursoId,
            estado: { $in: ["activa", "pendiente"] }  // Solo inscripciones vigentes
        });
        
        if (inscripcionExistente) {
            throw new Error("❌ Estudiante ya inscrito en este curso");
        }
        
        print("✅ No hay inscripciones duplicadas");
        
        // 📋 PASO 3: OPERACIÓN 1 - INSERTAR INSCRIPCIÓN
        // =============================================
        // Insertamos el documento de inscripción en la colección 'inscripciones'
        // con todos los campos requeridos según el esquema de validación
        print("📝 Insertando inscripción...");
        const resultadoInscripcion = db.inscripciones.insertOne({
            estudianteId: estudianteId,        // Referencia al estudiante
            cursoId: cursoId,                  // Referencia al curso
            costoCongelado: costoCongelado,    // Costo histórico congelado
            fechaInscripcion: new Date(),      // Fecha de la inscripción
            estado: "activa",                  // Estado inicial de la inscripción
            createdAt: new Date(),             // Auditoría: fecha de creación
            updatedAt: new Date()              // Auditoría: fecha de actualización
        });
        
        print(`✅ Inscripción creada con ID: ${resultadoInscripcion.insertedId}`);
        
        // 📋 PASO 4: OPERACIÓN 2 - DECREMENTAR CUPOS DISPONIBLES
        // ======================================================
        // Actualizamos los cupos disponibles del curso, decrementando en 1.
        // Usamos condición $gt: 0 para evitar condiciones de carrera.
        print("📉 Decrementando cupos disponibles...");
        const resultadoCupos = db.cursos.updateOne(
            { 
                _id: cursoId,                           // Identificar el curso específico
                "cupos.disponibles": { $gt: 0 }         // 🛡️ Verificación de seguridad adicional
            },
            { 
                $inc: { "cupos.disponibles": -1 },      // 📉 Decrementar cupos en 1
                $set: { "updatedAt": new Date() }       // 🔄 Actualizar timestamp de modificación
            }
        );
        
        // 📋 PASO 5: VERIFICAR ÉXITO Y ROLLBACK MANUAL SI ES NECESARIO
        // ============================================================
        // Si no se actualizó ningún documento, significa que otra operación
        // concurrente ya tomó el último cupo disponible (condición de carrera).
        // En este caso, hacemos rollback manual eliminando la inscripción.
        if (resultadoCupos.matchedCount === 0) {
            print("⚠️ Detectada condición de carrera - ejecutando rollback...");
            // ROLLBACK MANUAL: Eliminar la inscripción que acabamos de crear
            db.inscripciones.deleteOne({ _id: resultadoInscripcion.insertedId });
            throw new Error("❌ No se pudo decrementar cupos - rollback ejecutado");
        }
        
        print(`✅ Cupos decrementados exitosamente. Nuevo total: ${curso.cupos.disponibles - 1}`);
        
        // 📋 PASO 6: OPERACIÓN COMPLETADA EXITOSAMENTE
        // ============================================
        // Si llegamos hasta aquí, ambas operaciones fueron exitosas
        print("🎉 ¡Inscripción completada exitosamente!");
        return { 
            success: true, 
            inscripcionId: resultadoInscripcion.insertedId,
            mensaje: "Estudiante inscrito correctamente en el curso"
        };
        
    } catch (error) {
        // 📋 MANEJO DE ERRORES
        // ===================
        // Si ocurre cualquier error durante el proceso, lo capturamos aquí.
        // El rollback manual ya se ejecutó en el paso 5 si fue necesario.
        print("❌ Error en la inscripción:", error.message);
        return { 
            success: false, 
            error: error.message 
        };
    }
}

// 📋 EJEMPLO DE USO: INSCRIBIR UN ESTUDIANTE
// ==========================================
// Para probar la función, necesitamos obtener IDs reales de la base de datos

print("\n" + "=".repeat(70));
print("🎯 EJEMPLO DE INSCRIPCIÓN DE ESTUDIANTE");
print("=".repeat(70));

try {
    // Obtener un estudiante activo
    const estudiante = db.estudiantes.findOne({ estado: "activo" });
    if (!estudiante) {
        throw new Error("No se encontró ningún estudiante activo");
    }
    
    // Obtener un curso con cupos disponibles
    const curso = db.cursos.findOne({ 
        estado: "activo", 
        "cupos.disponibles": { $gt: 0 }
    });
    if (!curso) {
        throw new Error("No se encontró ningún curso con cupos disponibles");
    }
    
    print(`👨‍🎓 Estudiante seleccionado: ID ${estudiante._id}`);
    print(`📚 Curso seleccionado: ${curso.nombre} (${curso.cupos.disponibles} cupos disponibles)`);
    print(`💰 Costo: $${curso.costo.toLocaleString()}`);
    
    // Ejecutar la transacción (versión simplificada para MongoDB standalone)
    print("\n🔄 Ejecutando inscripción...");
    const resultado = inscribirEstudianteSimple(
        estudiante._id,
        curso._id,
        curso.costo
    );
    
    if (resultado.success) {
        print(`\n✅ RESULTADO EXITOSO:`);
        print(`   📝 ID de inscripción: ${resultado.inscripcionId}`);
        print(`   📊 Cupos restantes: ${resultado.cuposRestantes}`);
    } else {
        print(`\n❌ RESULTADO FALLIDO:`);
        print(`   🚨 Error: ${resultado.error}`);
    }
    
} catch (error) {
    print(`❌ Error en el ejemplo: ${error.message}`);
}

print("\n" + "=".repeat(70));
print("🎓 FIN DEL SCRIPT DE TRANSACCIONES");
print("=".repeat(70));

// 📋 RESUMEN DE LO QUE SE EJECUTÓ:
// ===============================
// 
// ✅ FUNCIONES IMPLEMENTADAS:
// 1. inscribirEstudianteEnCurso() - Versión completa con transacciones MongoDB
// 2. inscribirEstudianteSimple() - Versión simplificada para MongoDB standalone
//
// ✅ OPERACIONES REALIZADAS:
// 1. Validación de disponibilidad del curso
// 2. Verificación de inscripciones duplicadas  
// 3. Inserción de documento en colección 'inscripciones'
// 4. Decremento de cupos en colección 'cursos'
// 5. Manejo de errores con rollback (automático o manual)
//
// ✅ CARACTERÍSTICAS DE SEGURIDAD:
// - Prevención de inscripciones duplicadas
// - Control de cupos disponibles
// - Manejo de condiciones de carrera
// - Rollback en caso de errores
// - Validaciones de estado del curso
//
// 🚀 PARA USAR EN PRODUCCIÓN:
// - Configura MongoDB en replica set para usar transacciones reales
// - Usa inscribirEstudianteEnCurso() para máxima integridad
// - Para desarrollo/pruebas, inscribirEstudianteSimple() es suficiente
//
// 📝 PARA PROBAR MÁS INSCRIPCIONES:
// - Ejecuta: load("transacciones.js")
// - O llama directamente: inscribirEstudianteSimple(estudianteId, cursoId, costo)
//
print("📚 Documentación completa agregada al script de transacciones.");
