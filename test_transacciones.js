// ================================================================================
// 🧪 TEST TRANSACCIONES - VERIFICACIÓN RÁPIDA
// ================================================================================
// Archivo de prueba para verificar que las transacciones funcionan correctamente
// ================================================================================

use('CampusMusicDB');
print("🧪 INICIANDO PRUEBA DE TRANSACCIONES...");

// 🔍 PASO 1: VERIFICAR CONEXIÓN Y DATOS
// =====================================
print("\n🔍 VERIFICANDO CONEXIÓN Y DATOS:");
print("=================================");

const totalEstudiantes = db.estudiantes.countDocuments();
const totalCursos = db.estudiantes.countDocuments();

print(`📊 Estudiantes: ${totalEstudiantes}`);
print(`📚 Cursos: ${totalCursos}`);

if (totalEstudiantes === 0 || totalCursos === 0) {
    print("❌ ERROR: No hay datos suficientes para probar transacciones");
    print("💡 Ejecuta primero: mongosh --file test_dataset.js");
    quit();
}

// 🔍 PASO 2: CARGAR FUNCIONES DE TRANSACCIONES
// ============================================
print("\n🔍 CARGANDO FUNCIONES DE TRANSACCIONES:");
print("=======================================");

try {
    load("transacciones.js");
    print("✅ Funciones de transacciones cargadas correctamente");
} catch (error) {
    print(`❌ Error al cargar transacciones: ${error.message}`);
    quit();
}

// 🔍 PASO 3: VERIFICAR QUE LAS FUNCIONES ESTÁN DISPONIBLES
// =======================================================
print("\n🔍 VERIFICANDO FUNCIONES DISPONIBLES:");
print("=====================================");

if (typeof inscribirEstudianteSimple === 'function') {
    print("✅ Función inscribirEstudianteSimple() disponible");
} else {
    print("❌ Función inscribirEstudianteSimple() NO disponible");
    quit();
}

// 🔄 PASO 4: EJECUTAR TRANSACCIÓN DE PRUEBA
// ========================================
print("\n🔄 EJECUTANDO TRANSACCIÓN DE PRUEBA:");
print("====================================");

try {
    // Obtener datos para la prueba
    const estudiante = db.estudiantes.findOne();
    const curso = db.cursos.findOne();
    
    if (!estudiante || !curso) {
        throw new Error("No se pudieron obtener datos para la prueba");
    }
    
    print(`👨‍🎓 Estudiante: ${estudiante.nombre} ${estudiante.apellido}`);
    print(`📚 Curso: ${curso.nombre}`);
    print(`💰 Precio: $${curso.precio || 0}`);
    
    // Ejecutar transacción
    const resultado = inscribirEstudianteSimple(
        estudiante._id,
        curso._id,
        curso.precio || 0
    );
    
    if (resultado.success) {
        print("✅ TRANSACCIÓN EXITOSA!");
        print(`   📝 ID Inscripción: ${resultado.inscripcionId}`);
        print(`   🎯 Mensaje: ${resultado.mensaje}`);
        
        // Verificar que se creó la inscripción
        const inscripcion = db.inscripciones.findOne({ _id: resultado.inscripcionId });
        if (inscripcion) {
            print("✅ Inscripción verificada en la base de datos");
        } else {
            print("❌ ERROR: Inscripción no encontrada en la base de datos");
        }
        
    } else {
        print("❌ TRANSACCIÓN FALLIDA");
        print(`   🚨 Error: ${resultado.error}`);
    }
    
} catch (error) {
    print(`❌ Error en la prueba: ${error.message}`);
}

print("\n" + "=".repeat(50));
print("🎯 PRUEBA DE TRANSACCIONES COMPLETADA");
print("=".repeat(50)); 