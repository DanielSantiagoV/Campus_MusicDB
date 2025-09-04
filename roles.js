// ================================================================================
// ROLES.JS - RBAC CAMPUS MUSIC DB
// Crear y asignar roles con diferentes permisos sobre la base de datos
// ================================================================================
// PASO A PASO COMPLETO PARA HACER FUNCIONAR EL RBAC
// ================================================================================

// 🚀 PASO A PASO COMPLETO - DETALLE A DETALLE:
// ============================================
//
// PASO 1: PREPARAR MONGODB
// ------------------------
// 1.1. Asegúrate de que MongoDB esté ejecutándose
// 1.2. Conecta sin autenticación primero: mongosh
//
// PASO 2: EJECUTAR ARCHIVOS EN ORDEN
// ----------------------------------
// 2.1. mongosh --file db_config.js      (Crear estructura de BD)
// 2.2. mongosh --file test_dataset.js   (Insertar datos de prueba)
// 2.3. mongosh --file roles.js          (Este archivo - crear usuarios y roles)
//
// PASO 3: HABILITAR AUTENTICACIÓN EN MONGODB
// ------------------------------------------
// 3.1. OPCIÓN A - Con flag directo:
//      mongod --auth --dbpath C:\data\db
//
// 3.2. OPCIÓN B - Modificar archivo mongod.conf:
//      Agregar estas líneas:
//      security:
//        authorization: enabled
//      Luego reiniciar MongoDB: net stop MongoDB && net start MongoDB
//
// PASO 4: PROBAR CONEXIONES CON AUTENTICACIÓN
// -------------------------------------------
// 4.1. ADMINISTRADOR (acceso total):
//      mongosh -u admin_campus -p admin123456 --authenticationDatabase CampusMusicDB
//
// 4.2. EMPLEADO (lectura + inscripciones):
//      mongosh -u empleado_bogota -p empleado123 --authenticationDatabase CampusMusicDB
//
// 4.3. ESTUDIANTE (lectura + reservas):
//      mongosh -u estudiante1 -p estudiante123 --authenticationDatabase CampusMusicDB
//
// PASO 5: PROBAR PERMISOS
// -----------------------
// 5.1. Como ADMIN - debe funcionar:
//      db.sedes.find()                    ✅
//      db.usuarios.insertOne({...})       ✅
//
// 5.2. Como EMPLEADO - debe funcionar:
//      db.estudiantes.find()              ✅
//      db.inscripciones.insertOne({...})  ✅
//      db.usuarios.insertOne({...})       ❌ Error esperado
//
// 5.3. Como ESTUDIANTE - debe funcionar:
//      db.cursos.find()                   ✅
//      db.reservas_instrumentos.insertOne({...}) ✅
//      db.inscripciones.insertOne({...})  ❌ Error esperado
//
// PASO 6: COMANDOS ÚTILES DE VERIFICACIÓN
// ---------------------------------------
// 6.1. Ver todos los usuarios: db.runCommand({ usersInfo: 1 })
// 6.2. Ver roles de usuario: db.runCommand({ usersInfo: "nombreUsuario" })
// 6.3. Ver quién está conectado: db.runCommand({ connectionStatus: 1 })
//
// ⚠️  IMPORTANTE: Si MongoDB YA tiene autenticación habilitada,
//    conecta como administrador antes de ejecutar este archivo:
//    mongosh -u admin -p password --authenticationDatabase admin
//
// ================================================================================

use('CampusMusicDB');
print("🔐 Configurando roles y usuarios para Campus Music DB...");

// ================================================================================
// 0. LIMPIEZA INICIAL - ELIMINAR ROLES Y USUARIOS EXISTENTES
// ================================================================================
print("\n🧹 LIMPIANDO ROLES Y USUARIOS EXISTENTES:");
print("=========================================");

// Eliminar usuarios existentes (si existen)
const usuariosAEliminar = [
  "admin_campus", "empleado_bogota", "empleado_medellin", "empleado_cali",
  "estudiante1", "estudiante2", "estudiante3"
];

usuariosAEliminar.forEach(function(username) {
  try {
    db.dropUser(username);
    print(`🗑️  Usuario '${username}' eliminado`);
  } catch (e) {
    print(`ℹ️  Usuario '${username}' no existía`);
  }
});

// Eliminar roles existentes (si existen)
const rolesAEliminar = ["administrador", "empleado_sede", "estudiante"];

rolesAEliminar.forEach(function(roleName) {
  try {
    db.dropRole(roleName);
    print(`🗑️  Rol '${roleName}' eliminado`);
  } catch (e) {
    print(`ℹ️  Rol '${roleName}' no existía`);
  }
});

print("✅ Limpieza completada - listo para crear roles y usuarios frescos");

// ================================================================================
// 1. CREAR ROLES PERSONALIZADOS CON db.createRole()
// ================================================================================

// --- ROL: ADMINISTRADOR ---
print("\n👑 Creando rol: ADMINISTRADOR");
db.createRole({
  role: "administrador",
  privileges: [
    {
      resource: { db: "CampusMusicDB", collection: "" },
      actions: [
        "find", "insert", "update", "remove",           // Lectura y escritura total
        "createCollection", "dropCollection",           // Puede crear colecciones
        "createIndex", "dropIndex"                      // Puede manejar índices
      ]
    }
  ],
  roles: []
});
print("✅ Rol 'administrador' creado - Lectura y escritura total");

// --- ROL: EMPLEADO DE SEDE ---
print("\n👔 Creando rol: EMPLEADO DE SEDE");
db.createRole({
  role: "empleado_sede",
  privileges: [
    // Lectura de estudiantes, profesores y cursos
    {
      resource: { db: "CampusMusicDB", collection: "estudiantes" },
      actions: ["find"]
    },
    {
      resource: { db: "CampusMusicDB", collection: "profesores" },
      actions: ["find"]
    },
    {
      resource: { db: "CampusMusicDB", collection: "cursos" },
      actions: ["find"]
    },
    {
      resource: { db: "CampusMusicDB", collection: "sedes" },
      actions: ["find"]
    },
    {
      resource: { db: "CampusMusicDB", collection: "instrumentos" },
      actions: ["find"]
    },
    // Puede registrar inscripciones y reservas
    {
      resource: { db: "CampusMusicDB", collection: "inscripciones" },
      actions: ["find", "insert", "update"]
    },
    {
      resource: { db: "CampusMusicDB", collection: "reservas_instrumentos" },
      actions: ["find", "insert", "update"]
    }
  ],
  roles: []
});
print("✅ Rol 'empleado_sede' creado - Lectura + inscripciones/reservas");

// --- ROL: ESTUDIANTE ---
print("\n👨‍🎓 Creando rol: ESTUDIANTE");
db.createRole({
  role: "estudiante",
  privileges: [
    // Consulta de cursos disponibles
    {
      resource: { db: "CampusMusicDB", collection: "cursos" },
      actions: ["find"]
    },
    // Lectura de sedes y profesores (para información de cursos)
    {
      resource: { db: "CampusMusicDB", collection: "sedes" },
      actions: ["find"]
    },
    {
      resource: { db: "CampusMusicDB", collection: "profesores" },
      actions: ["find"]
    },
    {
      resource: { db: "CampusMusicDB", collection: "instrumentos" },
      actions: ["find"]
    },
    // Consulta de su historial de inscripciones
    {
      resource: { db: "CampusMusicDB", collection: "inscripciones" },
      actions: ["find"]
    },
    // Puede reservar instrumentos
    {
      resource: { db: "CampusMusicDB", collection: "reservas_instrumentos" },
      actions: ["find", "insert"]
    }
  ],
  roles: []
});
print("✅ Rol 'estudiante' creado - Lectura + reservas");

// ================================================================================
// 2. CREAR USUARIOS CON db.createUser() - SINTAXIS DEL TALLER
// ================================================================================
print("\n👥 Creando usuarios con sintaxis del taller:");

// --- USUARIO ADMINISTRADOR ---
print("\n👑 Creando usuario ADMINISTRADOR:");
db.createUser({
  user: "admin_campus",                    // Nombre de usuario que se está creando
  pwd: "admin123456",                     // Contraseña asociada al usuario
  roles: [                                // Lista de roles asignados al usuario
    { role: "administrador", db: "CampusMusicDB" }
  ]
});
print("✅ Usuario 'admin_campus' creado con rol administrador");

// --- USUARIOS EMPLEADOS DE SEDE ---
print("\n👔 Creando usuarios EMPLEADOS DE SEDE:");

// Empleado Bogotá (Sede Chapinero)
db.createUser({
  user: "empleado_bogota",                // Nombre de usuario que se está creando
  pwd: "empleado123",                     // Contraseña asociada al usuario
  roles: [                                // Lista de roles asignados al usuario
    { role: "empleado_sede", db: "CampusMusicDB" }
  ]
});
print("✅ Usuario 'empleado_bogota' creado para Campus Music - Chapinero");

// Empleado Medellín (Sede El Poblado)
db.createUser({
  user: "empleado_medellin",              // Nombre de usuario que se está creando
  pwd: "empleado123",                     // Contraseña asociada al usuario
  roles: [                                // Lista de roles asignados al usuario
    { role: "empleado_sede", db: "CampusMusicDB" }
  ]
});
print("✅ Usuario 'empleado_medellin' creado para Campus Music - El Poblado");

// Empleado Cali (Sede Granada)
db.createUser({
  user: "empleado_cali",                  // Nombre de usuario que se está creando
  pwd: "empleado123",                     // Contraseña asociada al usuario
  roles: [                                // Lista de roles asignados al usuario
    { role: "empleado_sede", db: "CampusMusicDB" }
  ]
});
print("✅ Usuario 'empleado_cali' creado para Campus Music - Granada");

// --- USUARIOS ESTUDIANTES ---
print("\n👨‍🎓 Creando usuarios ESTUDIANTES:");

// Estudiante 1
db.createUser({
  user: "estudiante1",                    // Nombre de usuario que se está creando
  pwd: "estudiante123",                   // Contraseña asociada al usuario
  roles: [                                // Lista de roles asignados al usuario
    { role: "estudiante", db: "CampusMusicDB" }
  ]
});
print("✅ Usuario 'estudiante1' creado");

// Estudiante 2
db.createUser({
  user: "estudiante2",                    // Nombre de usuario que se está creando
  pwd: "estudiante123",                   // Contraseña asociada al usuario
  roles: [                                // Lista de roles asignados al usuario
    { role: "estudiante", db: "CampusMusicDB" }
  ]
});
print("✅ Usuario 'estudiante2' creado");

// Estudiante 3
db.createUser({
  user: "estudiante3",                    // Nombre de usuario que se está creando
  pwd: "estudiante123",                   // Contraseña asociada al usuario
  roles: [                                // Lista de roles asignados al usuario
    { role: "estudiante", db: "CampusMusicDB" }
  ]
});
print("✅ Usuario 'estudiante3' creado");

// ================================================================================
// 3. USAR db.grantRolesToUser() PARA ASIGNAR ROLES ADICIONALES
// ================================================================================
print("\n🔗 Usando db.grantRolesToUser() para asignar roles:");

// Otorgar rol adicional al administrador
db.grantRolesToUser("admin_campus", [
  { role: "dbAdmin", db: "CampusMusicDB" }    // Rol adicional para administrar BD
]);
print("✅ Rol 'dbAdmin' otorgado a admin_campus con grantRolesToUser()");

// Otorgar rol de lectura a empleado (ejemplo de uso de grantRolesToUser)
db.grantRolesToUser("empleado_bogota", [
  { role: "read", db: "CampusMusicDB" }       // Rol básico de MongoDB
]);
print("✅ Rol 'read' otorgado a empleado_bogota con grantRolesToUser()");

// ================================================================================
// 4. VERIFICAR USUARIOS Y ROLES CREADOS
// ================================================================================
print("\n📋 VERIFICANDO USUARIOS CREADOS:");
print("===============================");

const usuariosCreados = ["admin_campus", "empleado_bogota", "empleado_medellin", "empleado_cali", "estudiante1", "estudiante2", "estudiante3"];

usuariosCreados.forEach(function(username) {
  const userInfo = db.runCommand({ usersInfo: username });
  if (userInfo.users.length > 0) {
    print(`👤 Usuario: ${username}`);
    userInfo.users[0].roles.forEach(function(role) {
      print(`   🔹 Rol: ${role.role} (DB: ${role.db})`);
    });
  }
});

// ================================================================================
// 5. COMANDOS DE CONEXIÓN
// ================================================================================
print("\n🔌 COMANDOS PARA CONECTARSE:");
print("============================");

print("\n// ADMINISTRADOR (acceso total):");
print("mongosh -u admin_campus -p admin123456 --authenticationDatabase CampusMusicDB");

print("\n// EMPLEADO DE SEDE:");
print("mongosh -u empleado_bogota -p empleado123 --authenticationDatabase CampusMusicDB");
print("mongosh -u empleado_medellin -p empleado123 --authenticationDatabase CampusMusicDB");
print("mongosh -u empleado_cali -p empleado123 --authenticationDatabase CampusMusicDB");

print("\n// ESTUDIANTES:");
print("mongosh -u estudiante1 -p estudiante123 --authenticationDatabase CampusMusicDB");
print("mongosh -u estudiante2 -p estudiante123 --authenticationDatabase CampusMusicDB");
print("mongosh -u estudiante3 -p estudiante123 --authenticationDatabase CampusMusicDB");

// ================================================================================
// 6. HABILITAR AUTENTICACIÓN EN MONGODB
// ================================================================================
print("\n🔒 PARA HABILITAR AUTENTICACIÓN:");
print("================================");

print("\n// Opción 1: con flag directo");
print("mongod --auth --dbpath [Ruta de almacenamiento de los datos]");

print("\n// Opción 2: modificando el archivo mongod.conf:");
print("security:");
print("  authorization: enabled");
print("// Y luego reiniciar MongoDB");

// ================================================================================
// 7. RESUMEN DE ROLES CREADOS
// ================================================================================
print("\n🎯 RESUMEN DE ROLES Y PERMISOS:");
print("===============================");

print("\n👑 ADMINISTRADOR:");
print("  ✅ Lectura y escritura total");
print("  ✅ Puede crear usuarios, sedes, cursos, instrumentos");
print("  ✅ Usuario: admin_campus");

print("\n👔 EMPLEADO DE SEDE:");
print("  ✅ Lectura de estudiantes, profesores y cursos en su sede");
print("  ✅ Puede registrar inscripciones y reservas");
print("  ❌ No puede ver información de otras sedes");
print("  ✅ Usuarios: empleado_bogota, empleado_medellin, empleado_cali");

print("\n👨‍🎓 ESTUDIANTE:");
print("  ✅ Lectura de su propia información");
print("  ✅ Consulta de cursos disponibles");
print("  ✅ Consulta de su historial de inscripciones");
print("  ✅ Puede reservar instrumentos");
print("  ✅ Usuarios: estudiante1, estudiante2, estudiante3");

// ================================================================================
// 8. GUÍA DETALLADA DE PRUEBAS PASO A PASO
// ================================================================================
print("\n🧪 GUÍA DETALLADA DE PRUEBAS:");
print("=============================");

print("\n📋 SECUENCIA COMPLETA DE EJECUCIÓN:");
print("-----------------------------------");
print("1️⃣  mongosh --file db_config.js");
print("2️⃣  mongosh --file test_dataset.js");
print("3️⃣  mongosh --file roles.js");
print("4️⃣  Habilitar autenticación en MongoDB");
print("5️⃣  Probar conexiones con usuarios");

print("\n🔒 HABILITAR AUTENTICACIÓN:");
print("---------------------------");
print("// Windows - Parar MongoDB:");
print("net stop MongoDB");
print("");
print("// Editar C:\\Program Files\\MongoDB\\Server\\7.0\\bin\\mongod.cfg:");
print("security:");
print("  authorization: enabled");
print("");
print("// Windows - Iniciar MongoDB:");
print("net start MongoDB");

print("\n🧪 PRUEBAS ESPECÍFICAS POR ROL:");
print("===============================");

print("\n👑 PROBAR ADMINISTRADOR:");
print("// Conectar:");
print("mongosh -u admin_campus -p admin123456 --authenticationDatabase CampusMusicDB");
print("");
print("// Pruebas que DEBEN funcionar:");
print("db.sedes.find().count()                           // ✅ Ver sedes");
print("db.cursos.find({estado: 'activo'}).count()        // ✅ Ver cursos");
print("db.usuarios.insertOne({username: 'test', documento: '99999999', email: 'test@test.com', password: 'hash', rol: 'admin', estado: 'activo', createdAt: new Date()})  // ✅ Crear usuario");
print("db.sedes.insertOne({nombre: 'Test Sede', ciudad: 'Test', direccion: 'Test 123', capacidad: 50, telefono: '3001234567', email: 'test@test.com', estado: 'activa', createdAt: new Date()})  // ✅ Crear sede");

print("\n👔 PROBAR EMPLEADO:");
print("// Conectar:");
print("mongosh -u empleado_bogota -p empleado123 --authenticationDatabase CampusMusicDB");
print("");
print("// Pruebas que DEBEN funcionar:");
print("db.estudiantes.find().count()                     // ✅ Ver estudiantes");
print("db.cursos.find().count()                          // ✅ Ver cursos");
print("db.inscripciones.find().count()                   // ✅ Ver inscripciones");
print("");
print("// Pruebas que DEBEN fallar:");
print("db.usuarios.insertOne({...})                      // ❌ Error: not authorized");
print("db.sedes.insertOne({...})                         // ❌ Error: not authorized");

print("\n👨‍🎓 PROBAR ESTUDIANTE:");
print("// Conectar:");
print("mongosh -u estudiante1 -p estudiante123 --authenticationDatabase CampusMusicDB");
print("");
print("// Pruebas que DEBEN funcionar:");
print("db.cursos.find({estado: 'activo'})                // ✅ Ver cursos disponibles");
print("db.sedes.find()                                   // ✅ Ver sedes");
print("db.inscripciones.find().count()                   // ✅ Ver inscripciones");
print("");
print("// Pruebas que DEBEN fallar:");
print("db.usuarios.find()                                // ❌ Error: not authorized");
print("db.estudiantes.insertOne({...})                   // ❌ Error: not authorized");

print("\n🔍 COMANDOS DE VERIFICACIÓN:");
print("----------------------------");
print("// Ver todos los roles creados:");
print("db.runCommand({ rolesInfo: 1, showPrivileges: false })");
print("");
print("// Ver todos los usuarios:");
print("db.runCommand({ usersInfo: 1 })");
print("");
print("// Ver roles de un usuario específico:");
print("db.runCommand({ usersInfo: 'admin_campus' })");
print("");
print("// Ver quién está conectado actualmente:");
print("db.runCommand({ connectionStatus: 1 })");

print("\n⚠️  SOLUCIÓN DE PROBLEMAS:");
print("-------------------------");
print("// Si MongoDB ya tiene autenticación, conecta como admin primero:");
print("mongosh -u admin -p password --authenticationDatabase admin");
print("");
print("// Si olvidas la contraseña de admin, reinicia MongoDB sin --auth:");
print("mongod --dbpath C:\\data\\db  (sin --auth)");
print("");
print("// Para eliminar todos los usuarios y empezar de nuevo:");
print("db.runCommand({ usersInfo: 1 }).users.forEach(u => db.dropUser(u.user))");

print("\n✅ RBAC configurado con sintaxis del taller!");
print("🔒 Usuarios creados con db.createUser()");
print("🎯 Roles asignados con db.grantRolesToUser()");
print("🎵 ¡Campus Music DB con control de acceso básico!");