// =======================================================================
// TALLER CAMPUS MUSIC - FASE 2: POBLADO DE LA BASE DE DATOS (Versión de Inserción Directa)
// ARCHIVO: test_dataset.js
// OBJETIVO: Poblar el sistema con datos de prueba coherentes usando solo 'insertMany'.
//           Todos los IDs y relaciones han sido pre-generados.
// =======================================================================

// 1. Conexión y Limpieza
// ---------------------------------
use('CampusMusicDB');

db.reservas_instrumentos.deleteMany({});
db.inscripciones.deleteMany({});
db.instrumentos.deleteMany({});
db.cursos.deleteMany({});
db.estudiantes.deleteMany({});
db.profesores.deleteMany({});
db.usuarios.deleteMany({});
db.sedes.deleteMany({});
print("Colecciones limpiadas, listo para el poblado de datos...");


// =============================
// == INICIO DE INSERCIÓN DE DATOS ==
// =============================

// 🏢 3 Sedes
db.sedes.insertMany([
  { "_id": ObjectId("655f8bd8a032d3989e2e6b21"), "nombre": "Campus Music - Chapinero", "ciudad": "Bogotá", "direccion": "Cra 13 #58-34", "capacidad": 150, "telefono": "3101234567", "email": "bogota@campusmusic.com", "estado": "activa", "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b22"), "nombre": "Campus Music - El Poblado", "ciudad": "Medellín", "direccion": "Cra 43A #7-50", "capacidad": 100, "telefono": "3201234567", "email": "medellin@campusmusic.com", "estado": "activa", "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b23"), "nombre": "Campus Music - Granada", "ciudad": "Cali", "direccion": "Av 9N #14-25", "capacidad": 80, "telefono": "3001234567", "email": "cali@campusmusic.com", "estado": "inactiva", "createdAt": new Date() }
]);
print("✅ 3 sedes insertadas.");

// 👥 25 Usuarios (10 Profesores y 15 Estudiantes)
db.usuarios.insertMany([
  // --- Usuarios Profesores (10) ---
  { "_id": ObjectId("655f8bd8a032d3989e2e6b24"), "username": "profesor1", "documento": "10000000", "email": "profesor1@campusmusic.com", "password": "hash_password", "rol": "profesor", "estado": "activo", "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b25"), "username": "profesor2", "documento": "10000001", "email": "profesor2@campusmusic.com", "password": "hash_password", "rol": "profesor", "estado": "activo", "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b26"), "username": "profesor3", "documento": "10000002", "email": "profesor3@campusmusic.com", "password": "hash_password", "rol": "profesor", "estado": "activo", "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b27"), "username": "profesor4", "documento": "10000003", "email": "profesor4@campusmusic.com", "password": "hash_password", "rol": "profesor", "estado": "activo", "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b28"), "username": "profesor5", "documento": "10000004", "email": "profesor5@campusmusic.com", "password": "hash_password", "rol": "profesor", "estado": "inactivo", "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b29"), "username": "profesor6", "documento": "10000005", "email": "profesor6@campusmusic.com", "password": "hash_password", "rol": "profesor", "estado": "activo", "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b2a"), "username": "profesor7", "documento": "10000006", "email": "profesor7@campusmusic.com", "password": "hash_password", "rol": "profesor", "estado": "activo", "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b2b"), "username": "profesor8", "documento": "10000007", "email": "profesor8@campusmusic.com", "password": "hash_password", "rol": "profesor", "estado": "activo", "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b2c"), "username": "profesor9", "documento": "10000008", "email": "profesor9@campusmusic.com", "password": "hash_password", "rol": "profesor", "estado": "activo", "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b2d"), "username": "profesor10", "documento": "10000009", "email": "profesor10@campusmusic.com", "password": "hash_password", "rol": "profesor", "estado": "activo", "createdAt": new Date() },
  // --- Usuarios Estudiantes (15) ---
  { "_id": ObjectId("655f8bd8a032d3989e2e6b2e"), "username": "estudiante1", "documento": "20000000", "email": "estudiante1@email.com", "password": "hash_password", "rol": "estudiante", "estado": "activo", "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b2f"), "username": "estudiante2", "documento": "20000001", "email": "estudiante2@email.com", "password": "hash_password", "rol": "estudiante", "estado": "activo", "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b30"), "username": "estudiante3", "documento": "20000002", "email": "estudiante3@email.com", "password": "hash_password", "rol": "estudiante", "estado": "activo", "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b31"), "username": "estudiante4", "documento": "20000003", "email": "estudiante4@email.com", "password": "hash_password", "rol": "estudiante", "estado": "activo", "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b32"), "username": "estudiante5", "documento": "20000004", "email": "estudiante5@email.com", "password": "hash_password", "rol": "estudiante", "estado": "activo", "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b33"), "username": "estudiante6", "documento": "20000005", "email": "estudiante6@email.com", "password": "hash_password", "rol": "estudiante", "estado": "activo", "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b34"), "username": "estudiante7", "documento": "20000006", "email": "estudiante7@email.com", "password": "hash_password", "rol": "estudiante", "estado": "inactivo", "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b35"), "username": "estudiante8", "documento": "20000007", "email": "estudiante8@email.com", "password": "hash_password", "rol": "estudiante", "estado": "activo", "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b36"), "username": "estudiante9", "documento": "20000008", "email": "estudiante9@email.com", "password": "hash_password", "rol": "estudiante", "estado": "activo", "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b37"), "username": "estudiante10", "documento": "20000009", "email": "estudiante10@email.com", "password": "hash_password", "rol": "estudiante", "estado": "activo", "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b38"), "username": "estudiante11", "documento": "20000010", "email": "estudiante11@email.com", "password": "hash_password", "rol": "estudiante", "estado": "activo", "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b39"), "username": "estudiante12", "documento": "20000011", "email": "estudiante12@email.com", "password": "hash_password", "rol": "estudiante", "estado": "suspendido", "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b3a"), "username": "estudiante13", "documento": "20000012", "email": "estudiante13@email.com", "password": "hash_password", "rol": "estudiante", "estado": "activo", "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b3b"), "username": "estudiante14", "documento": "20000013", "email": "estudiante14@email.com", "password": "hash_password", "rol": "estudiante", "estado": "activo", "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b3c"), "username": "estudiante15", "documento": "20000014", "email": "estudiante15@email.com", "password": "hash_password", "rol": "estudiante", "estado": "activo", "createdAt": new Date() }
]);
print("✅ 25 usuarios (10 profesores, 15 estudiantes) insertados.");

// 👨‍🏫 10 Profesores (Perfiles de Rol)
db.profesores.insertMany([
  { "_id": ObjectId("655f8bd8a032d3989e2e6b3d"), "usuarioId": ObjectId("655f8bd8a032d3989e2e6b24"), "especialidades": ["piano", "teoria musical"], "nivelAcademico": "maestria", "experienciaAnios": 12, "sedeId": ObjectId("655f8bd8a032d3989e2e6b21"), "estado": "activo", "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b3e"), "usuarioId": ObjectId("655f8bd8a032d3989e2e6b25"), "especialidades": ["guitarra"], "nivelAcademico": "profesional", "experienciaAnios": 8, "sedeId": ObjectId("655f8bd8a032d3989e2e6b21"), "estado": "activo", "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b3f"), "usuarioId": ObjectId("655f8bd8a032d3989e2e6b26"), "especialidades": ["violin"], "nivelAcademico": "profesional", "experienciaAnios": 15, "sedeId": ObjectId("655f8bd8a032d3989e2e6b21"), "estado": "activo", "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b40"), "usuarioId": ObjectId("655f8bd8a032d3989e2e6b27"), "especialidades": ["canto"], "nivelAcademico": "tecnico", "experienciaAnios": 5, "sedeId": ObjectId("655f8bd8a032d3989e2e6b21"), "estado": "activo", "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b41"), "usuarioId": ObjectId("655f8bd8a032d3989e2e6b28"), "especialidades": ["teoria musical"], "nivelAcademico": "doctorado", "experienciaAnios": 20, "sedeId": ObjectId("655f8bd8a032d3989e2e6b22"), "estado": "inactivo", "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b42"), "usuarioId": ObjectId("655f8bd8a032d3989e2e6b29"), "especialidades": ["piano"], "nivelAcademico": "profesional", "experienciaAnios": 7, "sedeId": ObjectId("655f8bd8a032d3989e2e6b22"), "estado": "activo", "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b43"), "usuarioId": ObjectId("655f8bd8a032d3989e2e6b2a"), "especialidades": ["guitarra", "bajo"], "nivelAcademico": "profesional", "experienciaAnios": 10, "sedeId": ObjectId("655f8bd8a032d3989e2e6b22"), "estado": "activo", "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b44"), "usuarioId": ObjectId("655f8bd8a032d3989e2e6b2b"), "especialidades": ["bateria"], "nivelAcademico": "profesional", "experienciaAnios": 9, "sedeId": ObjectId("655f8bd8a032d3989e2e6b22"), "estado": "activo", "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b45"), "usuarioId": ObjectId("655f8bd8a032d3989e2e6b2c"), "especialidades": ["violin"], "nivelAcademico": "especializacion", "experienciaAnios": 11, "sedeId": ObjectId("655f8bd8a032d3989e2e6b23"), "estado": "activo", "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b46"), "usuarioId": ObjectId("655f8bd8a032d3989e2e6b2d"), "especialidades": ["canto"], "nivelAcademico": "profesional", "experienciaAnios": 6, "sedeId": ObjectId("655f8bd8a032d3989e2e6b23"), "estado": "suspendido", "createdAt": new Date() }
]);
print("✅ 10 perfiles de rol 'profesor' insertados.");

// 👨‍🎓 15 Estudiantes (Perfiles de Rol)
db.estudiantes.insertMany([
  { "_id": ObjectId("655f8bd8a032d3989e2e6b47"), "usuarioId": ObjectId("655f8bd8a032d3989e2e6b2e"), "nivelMusical": "basico", "instrumentosInteres": ["piano"], "sedeId": ObjectId("655f8bd8a032d3989e2e6b21"), "estado": "activo", "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b48"), "usuarioId": ObjectId("655f8bd8a032d3989e2e6b2f"), "nivelMusical": "intermedio", "instrumentosInteres": ["guitarra"], "sedeId": ObjectId("655f8bd8a032d3989e2e6b21"), "estado": "activo", "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b49"), "usuarioId": ObjectId("655f8bd8a032d3989e2e6b30"), "nivelMusical": "avanzado", "instrumentosInteres": ["violin"], "sedeId": ObjectId("655f8bd8a032d3989e2e6b21"), "estado": "activo", "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b4a"), "usuarioId": ObjectId("655f8bd8a032d3989e2e6b31"), "nivelMusical": "basico", "instrumentosInteres": ["canto"], "sedeId": ObjectId("655f8bd8a032d3989e2e6b21"), "estado": "activo", "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b4b"), "usuarioId": ObjectId("655f8bd8a032d3989e2e6b32"), "nivelMusical": "intermedio", "instrumentosInteres": ["teoria musical"], "sedeId": ObjectId("655f8bd8a032d3989e2e6b21"), "estado": "activo", "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b4c"), "usuarioId": ObjectId("655f8bd8a032d3989e2e6b33"), "nivelMusical": "avanzado", "instrumentosInteres": ["piano"], "sedeId": ObjectId("655f8bd8a032d3989e2e6b22"), "estado": "activo", "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b4d"), "usuarioId": ObjectId("655f8bd8a032d3989e2e6b34"), "nivelMusical": "basico", "instrumentosInteres": ["guitarra"], "sedeId": ObjectId("655f8bd8a032d3989e2e6b22"), "estado": "inactivo", "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b4e"), "usuarioId": ObjectId("655f8bd8a032d3989e2e6b35"), "nivelMusical": "intermedio", "instrumentosInteres": ["bateria"], "sedeId": ObjectId("655f8bd8a032d3989e2e6b22"), "estado": "activo", "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b4f"), "usuarioId": ObjectId("655f8bd8a032d3989e2e6b36"), "nivelMusical": "avanzado", "instrumentosInteres": ["bajo", "guitarra"], "sedeId": ObjectId("655f8bd8a032d3989e2e6b22"), "estado": "activo", "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b50"), "usuarioId": ObjectId("655f8bd8a032d3989e2e6b37"), "nivelMusical": "basico", "instrumentosInteres": ["canto"], "sedeId": ObjectId("655f8bd8a032d3989e2e6b22"), "estado": "activo", "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b51"), "usuarioId": ObjectId("655f8bd8a032d3989e2e6b38"), "nivelMusical": "intermedio", "instrumentosInteres": ["piano"], "sedeId": ObjectId("655f8bd8a032d3989e2e6b23"), "estado": "activo", "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b52"), "usuarioId": ObjectId("655f8bd8a032d3989e2e6b39"), "nivelMusical": "avanzado", "instrumentosInteres": ["guitarra"], "sedeId": ObjectId("655f8bd8a032d3989e2e6b23"), "estado": "suspendido", "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b53"), "usuarioId": ObjectId("655f8bd8a032d3989e2e6b3a"), "nivelMusical": "basico", "instrumentosInteres": ["violin"], "sedeId": ObjectId("655f8bd8a032d3989e2e6b23"), "estado": "activo", "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b54"), "usuarioId": ObjectId("655f8bd8a032d3989e2e6b3b"), "nivelMusical": "intermedio", "instrumentosInteres": ["teoria musical"], "sedeId": ObjectId("655f8bd8a032d3989e2e6b23"), "estado": "egresado", "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b55"), "usuarioId": ObjectId("655f8bd8a032d3989e2e6b3c"), "nivelMusical": "avanzado", "instrumentosInteres": ["canto"], "sedeId": ObjectId("655f8bd8a032d3989e2e6b23"), "estado": "activo", "createdAt": new Date() }
]);
print("✅ 15 perfiles de rol 'estudiante' insertados.");

// 🎸 20 Instrumentos
db.instrumentos.insertMany([
  // Nota: Los 10 primeros se insertan como 'disponible' para poder ser reservados
  { "_id": ObjectId("655f8bd8a032d3989e2e6b56"), "nombre": "Guitarra Yamaha C40", "codigoInventario": "GTR-001", "tipo": "guitarra", "estado": "disponible", "sedeId": ObjectId("655f8bd8a032d3989e2e6b21"), "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b57"), "nombre": "Piano Roland FP-30", "codigoInventario": "PNO-001", "tipo": "piano", "estado": "disponible", "sedeId": ObjectId("655f8bd8a032d3989e2e6b21"), "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b58"), "nombre": "Violín Stentor Student II", "codigoInventario": "VIO-001", "tipo": "violin", "estado": "disponible", "sedeId": ObjectId("655f8bd8a032d3989e2e6b21"), "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b59"), "nombre": "Batería Pearl Roadshow", "codigoInventario": "BAT-001", "tipo": "bateria", "estado": "disponible", "sedeId": ObjectId("655f8bd8a032d3989e2e6b21"), "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b5a"), "nombre": "Bajo Eléctrico Squier", "codigoInventario": "BAJ-001", "tipo": "bajo", "estado": "disponible", "sedeId": ObjectId("655f8bd8a032d3989e2e6b21"), "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b5b"), "nombre": "Guitarra Fender Stratocaster", "codigoInventario": "GTR-002", "tipo": "guitarra", "estado": "disponible", "sedeId": ObjectId("655f8bd8a032d3989e2e6b22"), "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b5c"), "nombre": "Piano Yamaha P-125", "codigoInventario": "PNO-002", "tipo": "piano", "estado": "disponible", "sedeId": ObjectId("655f8bd8a032d3989e2e6b22"), "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b5d"), "nombre": "Violín Hoffman Allegro", "codigoInventario": "VIO-002", "tipo": "violin", "estado": "disponible", "sedeId": ObjectId("655f8bd8a032d3989e2e6b22"), "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b5e"), "nombre": "Batería Mapex Voyager", "codigoInventario": "BAT-002", "tipo": "bateria", "estado": "disponible", "sedeId": ObjectId("655f8bd8a032d3989e2e6b22"), "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b5f"), "nombre": "Bajo Eléctrico Ibanez", "codigoInventario": "BAJ-002", "tipo": "bajo", "estado": "disponible", "sedeId": ObjectId("655f8bd8a032d3989e2e6b22"), "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b60"), "nombre": "Guitarra Ibanez Gio", "codigoInventario": "GTR-003", "tipo": "guitarra", "estado": "mantenimiento", "sedeId": ObjectId("655f8bd8a032d3989e2e6b23"), "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b61"), "nombre": "Piano Casio Privia PX-S1000", "codigoInventario": "PNO-003", "tipo": "piano", "estado": "mantenimiento", "sedeId": ObjectId("655f8bd8a032d3989e2e6b23"), "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b62"), "nombre": "Violín Cremona SV-75", "codigoInventario": "VIO-003", "tipo": "violin", "estado": "mantenimiento", "sedeId": ObjectId("655f8bd8a032d3989e2e6b23"), "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b63"), "nombre": "Batería Ludwig Accent", "codigoInventario": "BAT-003", "tipo": "bateria", "estado": "fuera_de_servicio", "sedeId": ObjectId("655f8bd8a032d3989e2e6b23"), "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b64"), "nombre": "Bajo Yamaha", "codigoInventario": "BAJ-003", "tipo": "bajo", "estado": "disponible", "sedeId": ObjectId("655f8bd8a032d3989e2e6b23"), "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b65"), "nombre": "Guitarra Acústica Taylor", "codigoInventario": "GTR-004", "tipo": "guitarra", "estado": "disponible", "sedeId": ObjectId("655f8bd8a032d3989e2e6b21"), "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b66"), "nombre": "Piano de Cola Steinway", "codigoInventario": "PNO-004", "tipo": "piano", "estado": "disponible", "sedeId": ObjectId("655f8bd8a032d3989e2e6b21"), "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b67"), "nombre": "Violín Eléctrico Yamaha", "codigoInventario": "VIO-004", "tipo": "violin", "estado": "mantenimiento", "sedeId": ObjectId("655f8bd8a032d3989e2e6b22"), "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b68"), "nombre": "Batería Electrónica Roland", "codigoInventario": "BAT-004", "tipo": "bateria", "estado": "disponible", "sedeId": ObjectId("655f8bd8a032d3989e2e6b22"), "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b69"), "nombre": "Bajo de 5 Cuerdas Ibanez", "codigoInventario": "BAJ-004", "tipo": "bajo", "estado": "disponible", "sedeId": ObjectId("655f8bd8a032d3989e2e6b23"), "createdAt": new Date() }
]);
print("✅ 20 instrumentos insertados.");

// 📚 15 Cursos (5 por sede)
// Nota: cuposDisponibles se pre-calcula asumiendo 2 inscripciones por curso (30 inscripciones / 15 cursos)
db.cursos.insertMany([
  { "_id": ObjectId("655f8bd8a032d3989e2e6b6a"), "nombre": "Piano Básico", "nivel": "basico", "instrumento": "piano", "costo": 500000, "cupos": { "maximo": 10, "disponibles": 8 }, "duracion": { "valor": 16, "unidad": "semanas" }, "sedeId": ObjectId("655f8bd8a032d3989e2e6b21"), "profesorId": ObjectId("655f8bd8a032d3989e2e6b3d"), "estado": "activo", "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b6b"), "nombre": "Guitarra Intermedia", "nivel": "intermedio", "instrumento": "guitarra", "costo": 550000, "cupos": { "maximo": 8, "disponibles": 6 }, "duracion": { "valor": 16, "unidad": "semanas" }, "sedeId": ObjectId("655f8bd8a032d3989e2e6b21"), "profesorId": ObjectId("655f8bd8a032d3989e2e6b3e"), "estado": "activo", "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b6c"), "nombre": "Violín Avanzado", "nivel": "avanzado", "instrumento": "violin", "costo": 700000, "cupos": { "maximo": 5, "disponibles": 3 }, "duracion": { "valor": 20, "unidad": "semanas" }, "sedeId": ObjectId("655f8bd8a032d3989e2e6b21"), "profesorId": ObjectId("655f8bd8a032d3989e2e6b3f"), "estado": "activo", "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b6d"), "nombre": "Teoría Musical I", "nivel": "basico", "instrumento": "teoria musical", "costo": 400000, "cupos": { "maximo": 15, "disponibles": 13 }, "duracion": { "valor": 12, "unidad": "semanas" }, "sedeId": ObjectId("655f8bd8a032d3989e2e6b21"), "profesorId": ObjectId("655f8bd8a032d3989e2e6b41"), "estado": "proximo", "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b6e"), "nombre": "Canto Moderno", "nivel": "intermedio", "instrumento": "canto", "costo": 520000, "cupos": { "maximo": 12, "disponibles": 10 }, "duracion": { "valor": 16, "unidad": "semanas" }, "sedeId": ObjectId("655f8bd8a032d3989e2e6b21"), "profesorId": ObjectId("655f8bd8a032d3989e2e6b40"), "estado": "activo", "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b6f"), "nombre": "Piano Intermedio", "nivel": "intermedio", "instrumento": "piano", "costo": 580000, "cupos": { "maximo": 8, "disponibles": 6 }, "duracion": { "valor": 16, "unidad": "semanas" }, "sedeId": ObjectId("655f8bd8a032d3989e2e6b22"), "profesorId": ObjectId("655f8bd8a032d3989e2e6b42"), "estado": "activo", "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b70"), "nombre": "Guitarra para Principiantes", "nivel": "basico", "instrumento": "guitarra", "costo": 500000, "cupos": { "maximo": 10, "disponibles": 8 }, "duracion": { "valor": 12, "unidad": "semanas" }, "sedeId": ObjectId("655f8bd8a032d3989e2e6b22"), "profesorId": ObjectId("655f8bd8a032d3989e2e6b43"), "estado": "proximo", "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b71"), "nombre": "Batería de Rock", "nivel": "intermedio", "instrumento": "bateria", "costo": 600000, "cupos": { "maximo": 6, "disponibles": 4 }, "duracion": { "valor": 16, "unidad": "semanas" }, "sedeId": ObjectId("655f8bd8a032d3989e2e6b22"), "profesorId": ObjectId("655f8bd8a032d3989e2e6b44"), "estado": "activo", "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b72"), "nombre": "Bajo Eléctrico I", "nivel": "basico", "instrumento": "bajo", "costo": 530000, "cupos": { "maximo": 7, "disponibles": 5 }, "duracion": { "valor": 12, "unidad": "semanas" }, "sedeId": ObjectId("655f8bd8a032d3989e2e6b22"), "profesorId": ObjectId("655f8bd8a032d3989e2e6b43"), "estado": "activo", "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b73"), "nombre": "Canto Avanzado", "nivel": "avanzado", "instrumento": "canto", "costo": 650000, "cupos": { "maximo": 7, "disponibles": 5 }, "duracion": { "valor": 20, "unidad": "semanas" }, "sedeId": ObjectId("655f8bd8a032d3989e2e6b22"), "profesorId": ObjectId("655f8bd8a032d3989e2e6b46"), "estado": "proximo", "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b74"), "nombre": "Piano Salsero", "nivel": "avanzado", "instrumento": "piano", "costo": 720000, "cupos": { "maximo": 5, "disponibles": 3 }, "duracion": { "valor": 18, "unidad": "semanas" }, "sedeId": ObjectId("655f8bd8a032d3989e2e6b23"), "profesorId": ObjectId("655f8bd8a032d3989e2e6b3d"), "estado": "activo", "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b75"), "nombre": "Guitarra Clásica", "nivel": "basico", "instrumento": "guitarra", "costo": 530000, "cupos": { "maximo": 6, "disponibles": 4 }, "duracion": { "valor": 14, "unidad": "semanas" }, "sedeId": ObjectId("655f8bd8a032d3989e2e6b23"), "profesorId": ObjectId("655f8bd8a032d3989e2e6b3e"), "estado": "cerrado", "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b76"), "nombre": "Introducción al Violín", "nivel": "basico", "instrumento": "violin", "costo": 550000, "cupos": { "maximo": 8, "disponibles": 6 }, "duracion": { "valor": 12, "unidad": "semanas" }, "sedeId": ObjectId("655f8bd8a032d3989e2e6b23"), "profesorId": ObjectId("655f8bd8a032d3989e2e6b45"), "estado": "activo", "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b77"), "nombre": "Teoría Musical Avanzada", "nivel": "avanzado", "instrumento": "teoria musical", "costo": 800000, "cupos": { "maximo": 10, "disponibles": 8 }, "duracion": { "valor": 24, "unidad": "semanas" }, "sedeId": ObjectId("655f8bd8a032d3989e2e6b23"), "profesorId": ObjectId("655f8bd8a032d3989e2e6b41"), "estado": "proximo", "createdAt": new Date() },
  { "_id": ObjectId("655f8bd8a032d3989e2e6b78"), "nombre": "Técnica Vocal", "nivel": "basico", "instrumento": "canto", "costo": 500000, "cupos": { "maximo": 12, "disponibles": 10 }, "duracion": { "valor": 16, "unidad": "semanas" }, "sedeId": ObjectId("655f8bd8a032d3989e2e6b23"), "profesorId": ObjectId("655f8bd8a032d3989e2e6b40"), "estado": "activo", "createdAt": new Date() }
]);
print("✅ 15 cursos (5 por sede) insertados.");

// 📝 30 Inscripciones
// Cada estudiante se inscribe en 2 cursos
db.inscripciones.insertMany([
  // Estudiantes del 1 al 15, en los cursos del 1 al 15 (primera vuelta)
  { "estudianteId": ObjectId("655f8bd8a032d3989e2e6b47"), "cursoId": ObjectId("655f8bd8a032d3989e2e6b6a"), "costoCongelado": 500000, "fechaInscripcion": new Date(), "estado": "activa", "createdAt": new Date() },
  { "estudianteId": ObjectId("655f8bd8a032d3989e2e6b48"), "cursoId": ObjectId("655f8bd8a032d3989e2e6b6b"), "costoCongelado": 550000, "fechaInscripcion": new Date(), "estado": "activa", "createdAt": new Date() },
  { "estudianteId": ObjectId("655f8bd8a032d3989e2e6b49"), "cursoId": ObjectId("655f8bd8a032d3989e2e6b6c"), "costoCongelado": 700000, "fechaInscripcion": new Date(), "estado": "activa", "createdAt": new Date() },
  { "estudianteId": ObjectId("655f8bd8a032d3989e2e6b4a"), "cursoId": ObjectId("655f8bd8a032d3989e2e6b6d"), "costoCongelado": 400000, "fechaInscripcion": new Date(), "estado": "pendiente", "createdAt": new Date() },
  { "estudianteId": ObjectId("655f8bd8a032d3989e2e6b4b"), "cursoId": ObjectId("655f8bd8a032d3989e2e6b6e"), "costoCongelado": 520000, "fechaInscripcion": new Date(), "estado": "activa", "createdAt": new Date() },
  { "estudianteId": ObjectId("655f8bd8a032d3989e2e6b4c"), "cursoId": ObjectId("655f8bd8a032d3989e2e6b6f"), "costoCongelado": 580000, "fechaInscripcion": new Date(), "estado": "activa", "createdAt": new Date() },
  { "estudianteId": ObjectId("655f8bd8a032d3989e2e6b4d"), "cursoId": ObjectId("655f8bd8a032d3989e2e6b70"), "costoCongelado": 500000, "fechaInscripcion": new Date(), "estado": "activa", "createdAt": new Date() },
  { "estudianteId": ObjectId("655f8bd8a032d3989e2e6b4e"), "cursoId": ObjectId("655f8bd8a032d3989e2e6b71"), "costoCongelado": 600000, "fechaInscripcion": new Date(), "estado": "cancelada", "createdAt": new Date() },
  { "estudianteId": ObjectId("655f8bd8a032d3989e2e6b4f"), "cursoId": ObjectId("655f8bd8a032d3989e2e6b72"), "costoCongelado": 530000, "fechaInscripcion": new Date(), "estado": "activa", "createdAt": new Date() },
  { "estudianteId": ObjectId("655f8bd8a032d3989e2e6b50"), "cursoId": ObjectId("655f8bd8a032d3989e2e6b73"), "costoCongelado": 650000, "fechaInscripcion": new Date(), "estado": "activa", "createdAt": new Date() },
  { "estudianteId": ObjectId("655f8bd8a032d3989e2e6b51"), "cursoId": ObjectId("655f8bd8a032d3989e2e6b74"), "costoCongelado": 720000, "fechaInscripcion": new Date(), "estado": "activa", "createdAt": new Date() },
  { "estudianteId": ObjectId("655f8bd8a032d3989e2e6b52"), "cursoId": ObjectId("655f8bd8a032d3989e2e6b75"), "costoCongelado": 530000, "fechaInscripcion": new Date(), "estado": "activa", "createdAt": new Date() },
  { "estudianteId": ObjectId("655f8bd8a032d3989e2e6b53"), "cursoId": ObjectId("655f8bd8a032d3989e2e6b76"), "costoCongelado": 550000, "fechaInscripcion": new Date(), "estado": "finalizada", "createdAt": new Date() },
  { "estudianteId": ObjectId("655f8bd8a032d3989e2e6b54"), "cursoId": ObjectId("655f8bd8a032d3989e2e6b77"), "costoCongelado": 800000, "fechaInscripcion": new Date(), "estado": "activa", "createdAt": new Date() },
  { "estudianteId": ObjectId("655f8bd8a032d3989e2e6b55"), "cursoId": ObjectId("655f8bd8a032d3989e2e6b78"), "costoCongelado": 500000, "fechaInscripcion": new Date(), "estado": "activa", "createdAt": new Date() },
  // Estudiantes del 1 al 15, en los cursos del 15 al 1 (segunda vuelta, a la inversa)
  { "estudianteId": ObjectId("655f8bd8a032d3989e2e6b47"), "cursoId": ObjectId("655f8bd8a032d3989e2e6b78"), "costoCongelado": 500000, "fechaInscripcion": new Date(), "estado": "activa", "createdAt": new Date() },
  { "estudianteId": ObjectId("655f8bd8a032d3989e2e6b48"), "cursoId": ObjectId("655f8bd8a032d3989e2e6b77"), "costoCongelado": 800000, "fechaInscripcion": new Date(), "estado": "activa", "createdAt": new Date() },
  { "estudianteId": ObjectId("655f8bd8a032d3989e2e6b49"), "cursoId": ObjectId("655f8bd8a032d3989e2e6b76"), "costoCongelado": 550000, "fechaInscripcion": new Date(), "estado": "finalizada", "createdAt": new Date() },
  { "estudianteId": ObjectId("655f8bd8a032d3989e2e6b4a"), "cursoId": ObjectId("655f8bd8a032d3989e2e6b75"), "costoCongelado": 530000, "fechaInscripcion": new Date(), "estado": "activa", "createdAt": new Date() },
  { "estudianteId": ObjectId("655f8bd8a032d3989e2e6b4b"), "cursoId": ObjectId("655f8bd8a032d3989e2e6b74"), "costoCongelado": 720000, "fechaInscripcion": new Date(), "estado": "activa", "createdAt": new Date() },
  { "estudianteId": ObjectId("655f8bd8a032d3989e2e6b4c"), "cursoId": ObjectId("655f8bd8a032d3989e2e6b73"), "costoCongelado": 650000, "fechaInscripcion": new Date(), "estado": "activa", "createdAt": new Date() },
  { "estudianteId": ObjectId("655f8bd8a032d3989e2e6b4d"), "cursoId": ObjectId("655f8bd8a032d3989e2e6b72"), "costoCongelado": 530000, "fechaInscripcion": new Date(), "estado": "activa", "createdAt": new Date() },
  { "estudianteId": ObjectId("655f8bd8a032d3989e2e6b4e"), "cursoId": ObjectId("655f8bd8a032d3989e2e6b71"), "costoCongelado": 600000, "fechaInscripcion": new Date(), "estado": "activa", "createdAt": new Date() },
  { "estudianteId": ObjectId("655f8bd8a032d3989e2e6b4f"), "cursoId": ObjectId("655f8bd8a032d3989e2e6b70"), "costoCongelado": 500000, "fechaInscripcion": new Date(), "estado": "pendiente", "createdAt": new Date() },
  { "estudianteId": ObjectId("655f8bd8a032d3989e2e6b50"), "cursoId": ObjectId("655f8bd8a032d3989e2e6b6f"), "costoCongelado": 580000, "fechaInscripcion": new Date(), "estado": "activa", "createdAt": new Date() },
  { "estudianteId": ObjectId("655f8bd8a032d3989e2e6b51"), "cursoId": ObjectId("655f8bd8a032d3989e2e6b6e"), "costoCongelado": 520000, "fechaInscripcion": new Date(), "estado": "activa", "createdAt": new Date() },
  { "estudianteId": ObjectId("655f8bd8a032d3989e2e6b52"), "cursoId": ObjectId("655f8bd8a032d3989e2e6b6d"), "costoCongelado": 400000, "fechaInscripcion": new Date(), "estado": "activa", "createdAt": new Date() },
  { "estudianteId": ObjectId("655f8bd8a032d3989e2e6b53"), "cursoId": ObjectId("655f8bd8a032d3989e2e6b6c"), "costoCongelado": 700000, "estado": "cancelada", "createdAt": new Date() },
  { "estudianteId": ObjectId("655f8bd8a032d3989e2e6b54"), "cursoId": ObjectId("655f8bd8a032d3989e2e6b6b"), "costoCongelado": 550000, "estado": "activa", "createdAt": new Date() },
  { "estudianteId": ObjectId("655f8bd8a032d3989e2e6b55"), "cursoId": ObjectId("655f8bd8a032d3989e2e6b6a"), "costoCongelado": 500000, "estado": "activa", "createdAt": new Date() }
]);
print("✅ 30 inscripciones insertadas.");

// 🎺 10 Reservas de Instrumentos
db.reservas_instrumentos.insertMany([
  { "instrumentoId": ObjectId("655f8bd8a032d3989e2e6b56"), "estudianteId": ObjectId("655f8bd8a032d3989e2e6b47"), "fechaHoraInicio": new Date("2025-10-27T10:00:00Z"), "fechaHoraFin": new Date("2025-10-27T12:00:00Z"), "estado": "activa", "createdAt": new Date() },
  { "instrumentoId": ObjectId("655f8bd8a032d3989e2e6b57"), "estudianteId": ObjectId("655f8bd8a032d3989e2e6b48"), "fechaHoraInicio": new Date("2025-10-27T12:00:00Z"), "fechaHoraFin": new Date("2025-10-27T14:00:00Z"), "estado": "activa", "createdAt": new Date() },
  { "instrumentoId": ObjectId("655f8bd8a032d3989e2e6b58"), "estudianteId": ObjectId("655f8bd8a032d3989e2e6b49"), "fechaHoraInicio": new Date("2025-10-27T14:00:00Z"), "fechaHoraFin": new Date("2025-10-27T16:00:00Z"), "estado": "finalizada", "createdAt": new Date() },
  { "instrumentoId": ObjectId("655f8bd8a032d3989e2e6b59"), "estudianteId": ObjectId("655f8bd8a032d3989e2e6b4a"), "fechaHoraInicio": new Date("2025-10-28T10:00:00Z"), "fechaHoraFin": new Date("2025-10-28T11:00:00Z"), "estado": "activa", "createdAt": new Date() },
  { "instrumentoId": ObjectId("655f8bd8a032d3989e2e6b5a"), "estudianteId": ObjectId("655f8bd8a032d3989e2e6b4b"), "fechaHoraInicio": new Date("2025-10-28T11:00:00Z"), "fechaHoraFin": new Date("2025-10-28T12:00:00Z"), "estado": "cancelada", "createdAt": new Date() },
  { "instrumentoId": ObjectId("655f8bd8a032d3989e2e6b5b"), "estudianteId": ObjectId("655f8bd8a032d3989e2e6b4c"), "fechaHoraInicio": new Date("2025-10-29T15:00:00Z"), "fechaHoraFin": new Date("2025-10-29T17:00:00Z"), "estado": "activa", "createdAt": new Date() },
  { "instrumentoId": ObjectId("655f8bd8a032d3989e2e6b5c"), "estudianteId": ObjectId("655f8bd8a032d3989e2e6b4d"), "fechaHoraInicio": new Date("2025-10-30T09:00:00Z"), "fechaHoraFin": new Date("2025-10-30T11:00:00Z"), "estado": "activa", "createdAt": new Date() },
  { "instrumentoId": ObjectId("655f8bd8a032d3989e2e6b5d"), "estudianteId": ObjectId("655f8bd8a032d3989e2e6b4e"), "fechaHoraInicio": new Date("2025-11-01T10:00:00Z"), "fechaHoraFin": new Date("2025-11-01T13:00:00Z"), "estado": "finalizada", "createdAt": new Date() },
  { "instrumentoId": ObjectId("655f8bd8a032d3989e2e6b5e"), "estudianteId": ObjectId("655f8bd8a032d3989e2e6b4f"), "fechaHoraInicio": new Date("2025-11-02T14:00:00Z"), "fechaHoraFin": new Date("2025-11-02T16:00:00Z"), "estado": "activa", "createdAt": new Date() },
  { "instrumentoId": ObjectId("655f8bd8a032d3989e2e6b5f"), "estudianteId": ObjectId("655f8bd8a032d3989e2e6b50"), "fechaHoraInicio": new Date("2025-11-03T16:00:00Z"), "fechaHoraFin": new Date("2025-11-03T18:00:00Z"), "estado": "activa", "createdAt": new Date() }
]);

// Actualización del estado de los 10 instrumentos reservados
db.instrumentos.updateMany(
   { "_id": { "$in": [
       ObjectId("655f8bd8a032d3989e2e6b56"), ObjectId("655f8bd8a032d3989e2e6b57"), 
       ObjectId("655f8bd8a032d3989e2e6b58"), ObjectId("655f8bd8a032d3989e2e6b59"), 
       ObjectId("655f8bd8a032d3989e2e6b5a"), ObjectId("655f8bd8a032d3989e2e6b5b"), 
       ObjectId("655f8bd8a032d3989e2e6b5c"), ObjectId("655f8bd8a032d3989e2e6b5d"), 
       ObjectId("655f8bd8a032d3989e2e6b5e"), ObjectId("655f8bd8a032d3989e2e6b5f")
   ]}},
   { "$set": { "estado": "reservado" } }
);

print("✅ 10 reservas de instrumentos insertadas y estados actualizados.");
print("🚀 ¡Poblado completado! La base de datos está lista para ser consultada.");