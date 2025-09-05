// ========================================================================
// FUNCIÓN DE REGISTRO DE INSTRUMENTO MUSICAL
// ARCHIVO: registro_instrumento.js
// OBJETIVO: Registrar un nuevo instrumento musical con validaciones completas
// ========================================================================

use('CampusMusicDB');

// ========================================================================
// FUNCIÓN PRINCIPAL: registrarInstrumento
// ========================================================================
// Esta función recibe un objeto con los datos del instrumento y lo registra
// en la colección instrumentos con todas las validaciones necesarias
//
// PARÁMETROS:
// - instrumentoData: { nombre, tipo, precio, estado, sedeID }
//
// VALIDACIONES:
// - precio > 0
// - tipo debe estar en ["piano", "guitarra", "violin", "bateria", "bajo", "canto"]
// - estado debe estar en ["disponible", "mantenimiento", "reservado"]
// - sedeID debe existir en la colección sedes
//
// RETORNA:
// - El documento insertado (con _id) o error si falla la validación
// ========================================================================

function registrarInstrumento(instrumentoData) {
    try {
        // ========================================================================
        // PASO 1: VALIDACIÓN DE CAMPOS REQUERIDOS
        // ========================================================================
        const camposRequeridos = ['nombre', 'tipo', 'precio', 'estado', 'sedeID'];
        const camposFaltantes = camposRequeridos.filter(campo => !instrumentoData[campo]);
        
        if (camposFaltantes.length > 0) {
            throw new Error(`Campos requeridos faltantes: ${camposFaltantes.join(', ')}`);
        }
        
        // ========================================================================
        // PASO 2: VALIDACIONES DE NEGOCIO
        // ========================================================================
        
        // Validar precio > 0
        if (instrumentoData.precio <= 0) {
            throw new Error('El precio debe ser mayor a 0');
        }
        
        // Validar tipo permitido
        const tiposPermitidos = ["piano", "guitarra", "violin", "bateria", "bajo", "canto"];
        if (!tiposPermitidos.includes(instrumentoData.tipo)) {
            throw new Error(`Tipo no permitido. Tipos válidos: ${tiposPermitidos.join(', ')}`);
        }
        
        // Validar estado permitido
        const estadosPermitidos = ["disponible", "mantenimiento", "reservado"];
        if (!estadosPermitidos.includes(instrumentoData.estado)) {
            throw new Error(`Estado no permitido. Estados válidos: ${estadosPermitidos.join(', ')}`);
        }
        
        // ========================================================================
        // PASO 3: VALIDAR QUE LA SEDE EXISTA
        // ========================================================================
        const sedeExiste = db.sedes.findOne({ _id: instrumentoData.sedeID });
        if (!sedeExiste) {
            throw new Error('La sede especificada no existe');
        }
        
        // ========================================================================
        // PASO 4: GENERAR CÓDIGO DE INVENTARIO ÚNICO
        // ========================================================================
        // Generar código basado en el tipo de instrumento
        const prefijos = {
            "piano": "PNO",
            "guitarra": "GTR", 
            "violin": "VIO",
            "bateria": "BAT",
            "bajo": "BAJ",
            "canto": "CAN"
        };
        
        const prefijo = prefijos[instrumentoData.tipo];
        let contador = 1;
        let codigoInventario;
        
        // Buscar el siguiente número disponible para este tipo
        do {
            codigoInventario = `${prefijo}-${contador.toString().padStart(3, '0')}`;
            const existeCodigo = db.instrumentos.findOne({ codigoInventario: codigoInventario });
            if (!existeCodigo) break;
            contador++;
        } while (true);
        
        // ========================================================================
        // PASO 5: PREPARAR DOCUMENTO PARA INSERCIÓN
        // ========================================================================
        const documentoInstrumento = {
            nombre: instrumentoData.nombre,
            tipo: instrumentoData.tipo,
            codigoInventario: codigoInventario,
            estado: instrumentoData.estado,
            sedeId: instrumentoData.sedeID,
            precio: instrumentoData.precio,
            fecharegistro: new Date(),
            cantidadInicial: 1,
            createdAt: new Date()
        };
        
        // ========================================================================
        // PASO 6: INSERTAR EN LA COLECCIÓN
        // ========================================================================
        const resultado = db.instrumentos.insertOne(documentoInstrumento);
        
        if (resultado.insertedId) {
            // ========================================================================
            // PASO 7: RETORNAR DOCUMENTO INSERTADO
            // ========================================================================
            const documentoInsertado = db.instrumentos.findOne({ _id: resultado.insertedId });
            
            print("✅ Instrumento registrado exitosamente:");
            print(`   - ID: ${documentoInsertado._id}`);
            print(`   - Nombre: ${documentoInsertado.nombre}`);
            print(`   - Tipo: ${documentoInsertado.tipo}`);
            print(`   - Código Inventario: ${documentoInsertado.codigoInventario}`);
            print(`   - Precio: $${documentoInsertado.precio.toLocaleString()}`);
            print(`   - Estado: ${documentoInsertado.estado}`);
            print(`   - Sede: ${sedeExiste.nombre}`);
            print(`   - Fecha Registro: ${documentoInsertado.fecharegistro}`);
            print(`   - Cantidad Inicial: ${documentoInsertado.cantidadInicial}`);
            
            return documentoInsertado;
        } else {
            throw new Error('Error al insertar el instrumento en la base de datos');
        }
        
    } catch (error) {
        print(`❌ Error al registrar instrumento: ${error.message}`);
        throw error;
    }
}

// ========================================================================
// FUNCIONES DE PRUEBA Y TESTING
// ========================================================================

// Función para probar el registro con datos válidos
function probarRegistroValido() {
    print("\n🧪 PROBANDO REGISTRO CON DATOS VÁLIDOS...");
    
    // Obtener una sede existente para la prueba
    const sede = db.sedes.findOne({ estado: "activa" });
    if (!sede) {
        print("❌ No hay sedes activas para realizar la prueba");
        return;
    }
    
    const instrumentoPrueba = {
        nombre: "Guitarra Fender Stratocaster",
        tipo: "guitarra",
        precio: 2500000,
        estado: "disponible",
        sedeID: sede._id
    };
    
    try {
        const resultado = registrarInstrumento(instrumentoPrueba);
        print("✅ Prueba exitosa - Instrumento registrado correctamente");
        return resultado;
    } catch (error) {
        print(`❌ Prueba fallida: ${error.message}`);
        return null;
    }
}

// Función para probar validaciones con datos inválidos
function probarValidaciones() {
    print("\n🧪 PROBANDO VALIDACIONES CON DATOS INVÁLIDOS...");
    
    const sede = db.sedes.findOne({ estado: "activa" });
    if (!sede) {
        print("❌ No hay sedes activas para realizar las pruebas");
        return;
    }
    
    // Prueba 1: Precio inválido
    print("\n--- Prueba 1: Precio inválido (precio <= 0) ---");
    try {
        registrarInstrumento({
            nombre: "Piano Test",
            tipo: "piano",
            precio: 0,
            estado: "disponible",
            sedeID: sede._id
        });
        print("❌ ERROR: Debería haber fallado con precio 0");
    } catch (error) {
        print(`✅ Validación correcta: ${error.message}`);
    }
    
    // Prueba 2: Tipo inválido
    print("\n--- Prueba 2: Tipo inválido ---");
    try {
        registrarInstrumento({
            nombre: "Instrumento Test",
            tipo: "trompeta",
            precio: 100000,
            estado: "disponible",
            sedeID: sede._id
        });
        print("❌ ERROR: Debería haber fallado con tipo inválido");
    } catch (error) {
        print(`✅ Validación correcta: ${error.message}`);
    }
    
    // Prueba 3: Estado inválido
    print("\n--- Prueba 3: Estado inválido ---");
    try {
        registrarInstrumento({
            nombre: "Violín Test",
            tipo: "violin",
            precio: 1500000,
            estado: "roto",
            sedeID: sede._id
        });
        print("❌ ERROR: Debería haber fallado con estado inválido");
    } catch (error) {
        print(`✅ Validación correcta: ${error.message}`);
    }
    
    // Prueba 4: Sede inexistente
    print("\n--- Prueba 4: Sede inexistente ---");
    try {
        registrarInstrumento({
            nombre: "Batería Test",
            tipo: "bateria",
            precio: 3000000,
            estado: "disponible",
            sedeID: new ObjectId("507f1f77bcf86cd799439011") // ID que no existe
        });
        print("❌ ERROR: Debería haber fallado con sede inexistente");
    } catch (error) {
        print(`✅ Validación correcta: ${error.message}`);
    }
    
    // Prueba 5: Campos faltantes
    print("\n--- Prueba 5: Campos faltantes ---");
    try {
        registrarInstrumento({
            nombre: "Instrumento Test",
            // tipo faltante
            precio: 100000,
            estado: "disponible",
            sedeID: sede._id
        });
        print("❌ ERROR: Debería haber fallado con campos faltantes");
    } catch (error) {
        print(`✅ Validación correcta: ${error.message}`);
    }
}

// ========================================================================
// FUNCIÓN DE DEMOSTRACIÓN COMPLETA
// ========================================================================
function demostrarRegistroInstrumento() {
    print("\n" + "=".repeat(80));
    print("🎵 DEMOSTRACIÓN DE REGISTRO DE INSTRUMENTO MUSICAL");
    print("=".repeat(80));
    
    // Mostrar sedes disponibles
    print("\n📋 SEDES DISPONIBLES:");
    const sedes = db.sedes.find({ estado: "activa" }).toArray();
    sedes.forEach((sede, index) => {
        print(`   ${index + 1}. ${sede.nombre} (${sede.ciudad}) - ID: ${sede._id}`);
    });
    
    // Mostrar instrumentos existentes
    print("\n🎸 INSTRUMENTOS EXISTENTES:");
    const instrumentosExistentes = db.instrumentos.find().limit(5).toArray();
    instrumentosExistentes.forEach((instrumento, index) => {
        print(`   ${index + 1}. ${instrumento.nombre} (${instrumento.tipo}) - ${instrumento.codigoInventario}`);
    });
    
    // Ejecutar pruebas
    probarValidaciones();
    probarRegistroValido();
    
    print("\n" + "=".repeat(80));
    print("🎯 RESUMEN DE LA FUNCIÓN:");
    print("=".repeat(80));
    print("✅ La función registrarInstrumento() valida todos los campos requeridos");
    print("✅ Valida reglas de negocio (precio > 0, tipos y estados permitidos)");
    print("✅ Verifica que la sede exista en la base de datos");
    print("✅ Genera código de inventario único automáticamente");
    print("✅ Inserta el instrumento con fecharegistro y cantidadInicial");
    print("✅ Retorna el documento insertado para testing");
    print("✅ Maneja errores de forma robusta con mensajes descriptivos");
    
    print("\n🚀 ¡Función lista para usar en producción!");
}

// ========================================================================
// INSTRUCCIONES DE USO
// ========================================================================
print("\n" + "=".repeat(80));
print("📖 INSTRUCCIONES DE USO");
print("=".repeat(80));
print("1. Para registrar un instrumento:");
print("   const resultado = registrarInstrumento({");
print("     nombre: 'Guitarra Yamaha C40',");
print("     tipo: 'guitarra',");
print("     precio: 1500000,");
print("     estado: 'disponible',");
print("     sedeID: ObjectId('...')");
print("   });");
print("");
print("2. Para ejecutar todas las pruebas:");
print("   demostrarRegistroInstrumento();");
print("");
print("3. Para probar solo validaciones:");
print("   probarValidaciones();");
print("");
print("4. Para probar registro válido:");
print("   probarRegistroValido();");
print("=".repeat(80));

// Ejecutar demostración automáticamente
demostrarRegistroInstrumento();