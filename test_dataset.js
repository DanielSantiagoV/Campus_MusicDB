// =======================================================================
// TALLER CAMPUS MUSIC - FASE 2: POBLADO DE LA BASE DE DATOS (Paso a Paso)
// =======================================================================

// --- PASO 0: Conexión y Limpieza ---
use('CampusMusicDB');
print("Base de datos limpiada y lista.");

// --- PASO 1: Insertar Sedes ---
// No dependen de nada, así que son las primeras.
db.sedes.insertMany([
  { "nombre": "Campus Music - Chapinero", "ciudad": "Bogotá", "direccion": "Cra 13 #58-34", "capacidad": 150, "telefono": "3101234567", "email": "bogota@campusmusic.com", "estado": "activa", "createdAt": new Date() },
  { "nombre": "Campus Music - El Poblado", "ciudad": "Medellín", "direccion": "Cra 43A #7-50", "capacidad": 100, "telefono": "3201234567", "email": "medellin@campusmusic.com", "estado": "activa", "createdAt": new Date() },
  { "nombre": "Campus Music - Granada", "ciudad": "Cali", "direccion": "Av 9N #14-25", "capacidad": 80, "telefono": "3001234567", "email": "cali@campusmusic.com", "estado": "inactiva", "createdAt": new Date() }
]);
print("✅ PASO 1: 3 sedes insertadas.");
// ---------------------------------------------------------------------------------

// --- PASO 2: Insertar Usuarios (Profesores y Estudiantes) ---
const hashPasswordValido = "$2b$12$LQv3c1yqBwLVMQeAzQdMbOCYFhqKJhYvGqQzYvJvGqQzYvJvGqQzYvJvGqQzYv";
db.usuarios.insertMany([
  // 10 Profesores
  { "username": "profesor1", "documento": "10000000", "email": "profesor1@campusmusic.com", "password": hashPasswordValido, "rol": "profesor", "estado": "activo", "createdAt": new Date() },
  { "username": "profesor2", "documento": "10000001", "email": "profesor2@campusmusic.com", "password": hashPasswordValido, "rol": "profesor", "estado": "activo", "createdAt": new Date() },
  { "username": "profesor3", "documento": "10000002", "email": "profesor3@campusmusic.com", "password": hashPasswordValido, "rol": "profesor", "estado": "activo", "createdAt": new Date() },
  { "username": "profesor4", "documento": "10000003", "email": "profesor4@campusmusic.com", "password": hashPasswordValido, "rol": "profesor", "estado": "activo", "createdAt": new Date() },
  { "username": "profesor5", "documento": "10000004", "email": "profesor5@campusmusic.com", "password": hashPasswordValido, "rol": "profesor", "estado": "inactivo", "createdAt": new Date() },
  { "username": "profesor6", "documento": "10000005", "email": "profesor6@campusmusic.com", "password": hashPasswordValido, "rol": "profesor", "estado": "activo", "createdAt": new Date() },
  { "username": "profesor7", "documento": "10000006", "email": "profesor7@campusmusic.com", "password": hashPasswordValido, "rol": "profesor", "estado": "activo", "createdAt": new Date() },
  { "username": "profesor8", "documento": "10000007", "email": "profesor8@campusmusic.com", "password": hashPasswordValido, "rol": "profesor", "estado": "activo", "createdAt": new Date() },
  { "username": "profesor9", "documento": "10000008", "email": "profesor9@campusmusic.com", "password": hashPasswordValido, "rol": "profesor", "estado": "activo", "createdAt": new Date() },
  { "username": "profesor10", "documento": "10000009", "email": "profesor10@campusmusic.com", "password": hashPasswordValido, "rol": "profesor", "estado": "activo", "createdAt": new Date() },
  // 15 Estudiantes
  { "username": "estudiante1", "documento": "20000000", "email": "estudiante1@email.com", "password": hashPasswordValido, "rol": "estudiante", "estado": "activo", "createdAt": new Date() },
  { "username": "estudiante2", "documento": "20000001", "email": "estudiante2@email.com", "password": hashPasswordValido, "rol": "estudiante", "estado": "activo", "createdAt": new Date() },
  { "username": "estudiante3", "documento": "20000002", "email": "estudiante3@email.com", "password": hashPasswordValido, "rol": "estudiante", "estado": "activo", "createdAt": new Date() },
  { "username": "estudiante4", "documento": "20000003", "email": "estudiante4@email.com", "password": hashPasswordValido, "rol": "estudiante", "estado": "activo", "createdAt": new Date() },
  { "username": "estudiante5", "documento": "20000004", "email": "estudiante5@email.com", "password": hashPasswordValido, "rol": "estudiante", "estado": "activo", "createdAt": new Date() },
  { "username": "estudiante6", "documento": "20000005", "email": "estudiante6@email.com", "password": hashPasswordValido, "rol": "estudiante", "estado": "activo", "createdAt": new Date() },
  { "username": "estudiante7", "documento": "20000006", "email": "estudiante7@email.com", "password": hashPasswordValido, "rol": "estudiante", "estado": "inactivo", "createdAt": new Date() },
  { "username": "estudiante8", "documento": "20000007", "email": "estudiante8@email.com", "password": hashPasswordValido, "rol": "estudiante", "estado": "activo", "createdAt": new Date() },
  { "username": "estudiante9", "documento": "20000008", "email": "estudiante9@email.com", "password": hashPasswordValido, "rol": "estudiante", "estado": "activo", "createdAt": new Date() },
  { "username": "estudiante10", "documento": "20000009", "email": "estudiante10@email.com", "password": hashPasswordValido, "rol": "estudiante", "estado": "activo", "createdAt": new Date() },
  { "username": "estudiante11", "documento": "20000010", "email": "estudiante11@email.com", "password": hashPasswordValido, "rol": "estudiante", "estado": "activo", "createdAt": new Date() },
  { "username": "estudiante12", "documento": "20000011", "email": "estudiante12@email.com", "password": hashPasswordValido, "rol": "estudiante", "estado": "suspendido", "createdAt": new Date() },
  { "username": "estudiante13", "documento": "20000012", "email": "estudiante13@email.com", "password": hashPasswordValido, "rol": "estudiante", "estado": "activo", "createdAt": new Date() },
  { "username": "estudiante14", "documento": "20000013", "email": "estudiante14@email.com", "password": hashPasswordValido, "rol": "estudiante", "estado": "activo", "createdAt": new Date() },
  { "username": "estudiante15", "documento": "20000014", "email": "estudiante15@email.com", "password": hashPasswordValido, "rol": "estudiante", "estado": "activo", "createdAt": new Date() }
]);
print("✅ PASO 2: 25 usuarios insertados.");
// ---------------------------------------------------------------------------------

// --- PASO 3: Capturar IDs y Crear Perfiles de Rol (Profesores y Estudiantes) ---
// Este es el único paso que requiere un poco de lógica para mantener la integridad.

const sedes = db.sedes.find().toArray();
const usuariosProfesores = db.usuarios.find({ rol: "profesor" }).toArray();
const usuariosEstudiantes = db.usuarios.find({ rol: "estudiante" }).toArray();

const sedeBogotaId = sedes.find(s => s.ciudad === 'Bogotá')._id;
const sedeMedellinId = sedes.find(s => s.ciudad === 'Medellín')._id;
const sedeCaliId = sedes.find(s => s.ciudad === 'Cali')._id;

db.profesores.insertMany([
  { "usuarioId": usuariosProfesores[0]._id, "especialidades": ["piano", "teoria musical"], "nivelAcademico": "maestria", "experienciaAnios": 12, "sedeId": sedeBogotaId, "estado": "activo", "createdAt": new Date() },
  { "usuarioId": usuariosProfesores[1]._id, "especialidades": ["guitarra"], "nivelAcademico": "profesional", "experienciaAnios": 8, "sedeId": sedeBogotaId, "estado": "activo", "createdAt": new Date() },
  { "usuarioId": usuariosProfesores[2]._id, "especialidades": ["violin"], "nivelAcademico": "profesional", "experienciaAnios": 15, "sedeId": sedeBogotaId, "estado": "activo", "createdAt": new Date() },
  { "usuarioId": usuariosProfesores[3]._id, "especialidades": ["canto"], "nivelAcademico": "tecnico", "experienciaAnios": 5, "sedeId": sedeBogotaId, "estado": "activo", "createdAt": new Date() },
  { "usuarioId": usuariosProfesores[4]._id, "especialidades": ["teoria musical", "piano"], "nivelAcademico": "doctorado", "experienciaAnios": 20, "sedeId": sedeMedellinId, "estado": "inactivo", "createdAt": new Date() },
  { "usuarioId": usuariosProfesores[5]._id, "especialidades": ["piano"], "nivelAcademico": "profesional", "experienciaAnios": 7, "sedeId": sedeMedellinId, "estado": "activo", "createdAt": new Date() },
  { "usuarioId": usuariosProfesores[6]._id, "especialidades": ["guitarra", "bajo"], "nivelAcademico": "profesional", "experienciaAnios": 10, "sedeId": sedeMedellinId, "estado": "activo", "createdAt": new Date() },
  { "usuarioId": usuariosProfesores[7]._id, "especialidades": ["bateria"], "nivelAcademico": "profesional", "experienciaAnios": 9, "sedeId": sedeMedellinId, "estado": "activo", "createdAt": new Date() },
  { "usuarioId": usuariosProfesores[8]._id, "especialidades": ["violin"], "nivelAcademico": "especializacion", "experienciaAnios": 11, "sedeId": sedeCaliId, "estado": "activo", "createdAt": new Date() },
  { "usuarioId": usuariosProfesores[9]._id, "especialidades": ["canto"], "nivelAcademico": "profesional", "experienciaAnios": 6, "sedeId": sedeCaliId, "estado": "suspendido", "createdAt": new Date() }
]);

db.estudiantes.insertMany([
  { "usuarioId": usuariosEstudiantes[0]._id, "nivelMusical": "basico", "instrumentosInteres": ["piano"], "sedeId": sedeBogotaId, "estado": "activo", "createdAt": new Date() },
  { "usuarioId": usuariosEstudiantes[1]._id, "nivelMusical": "intermedio", "instrumentosInteres": ["guitarra"], "sedeId": sedeBogotaId, "estado": "activo", "createdAt": new Date() },
  { "usuarioId": usuariosEstudiantes[2]._id, "nivelMusical": "avanzado", "instrumentosInteres": ["violin"], "sedeId": sedeBogotaId, "estado": "activo", "createdAt": new Date() },
  { "usuarioId": usuariosEstudiantes[3]._id, "nivelMusical": "basico", "instrumentosInteres": ["canto"], "sedeId": sedeBogotaId, "estado": "activo", "createdAt": new Date() },
  { "usuarioId": usuariosEstudiantes[4]._id, "nivelMusical": "intermedio", "instrumentosInteres": ["teoria musical"], "sedeId": sedeBogotaId, "estado": "activo", "createdAt": new Date() },
  { "usuarioId": usuariosEstudiantes[5]._id, "nivelMusical": "avanzado", "instrumentosInteres": ["piano", "teoria musical"], "sedeId": sedeMedellinId, "estado": "activo", "createdAt": new Date() },
  { "usuarioId": usuariosEstudiantes[6]._id, "nivelMusical": "basico", "instrumentosInteres": ["guitarra"], "sedeId": sedeMedellinId, "estado": "inactivo", "createdAt": new Date() },
  { "usuarioId": usuariosEstudiantes[7]._id, "nivelMusical": "intermedio", "instrumentosInteres": ["bateria"], "sedeId": sedeMedellinId, "estado": "activo", "createdAt": new Date() },
  { "usuarioId": usuariosEstudiantes[8]._id, "nivelMusical": "avanzado", "instrumentosInteres": ["bajo", "guitarra"], "sedeId": sedeMedellinId, "estado": "activo", "createdAt": new Date() },
  { "usuarioId": usuariosEstudiantes[9]._id, "nivelMusical": "basico", "instrumentosInteres": ["canto"], "sedeId": sedeMedellinId, "estado": "activo", "createdAt": new Date() },
  { "usuarioId": usuariosEstudiantes[10]._id, "nivelMusical": "intermedio", "instrumentosInteres": ["piano"], "sedeId": sedeCaliId, "estado": "activo", "createdAt": new Date() },
  { "usuarioId": usuariosEstudiantes[11]._id, "nivelMusical": "avanzado", "instrumentosInteres": ["guitarra"], "sedeId": sedeCaliId, "estado": "suspendido", "createdAt": new Date() },
  { "usuarioId": usuariosEstudiantes[12]._id, "nivelMusical": "basico", "instrumentosInteres": ["violin"], "sedeId": sedeCaliId, "estado": "activo", "createdAt": new Date() },
  { "usuarioId": usuariosEstudiantes[13]._id, "nivelMusical": "intermedio", "instrumentosInteres": ["teoria musical"], "sedeId": sedeCaliId, "estado": "egresado", "createdAt": new Date() },
  { "usuarioId": usuariosEstudiantes[14]._id, "nivelMusical": "avanzado", "instrumentosInteres": ["canto"], "sedeId": sedeCaliId, "estado": "activo", "createdAt": new Date() }
]);
print("✅ PASO 3: 10 perfiles de profesor y 15 de estudiante insertados.");
// ---------------------------------------------------------------------------------

// --- PASO 4: Insertar Instrumentos ---
db.instrumentos.insertMany([
  { "nombre": "Guitarra Yamaha C40", "codigoInventario": "GTR-001", "tipo": "guitarra", "estado": "disponible", "sedeId": sedeBogotaId, "createdAt": new Date() },
  { "nombre": "Piano Roland FP-30", "codigoInventario": "PNO-001", "tipo": "piano", "estado": "disponible", "sedeId": sedeBogotaId, "createdAt": new Date() },
  { "nombre": "Violín Stentor Student II", "codigoInventario": "VIO-001", "tipo": "violin", "estado": "disponible", "sedeId": sedeBogotaId, "createdAt": new Date() },
  { "nombre": "Batería Pearl Roadshow", "codigoInventario": "BAT-001", "tipo": "bateria", "estado": "disponible", "sedeId": sedeBogotaId, "createdAt": new Date() },
  { "nombre": "Bajo Eléctrico Squier", "codigoInventario": "BAJ-001", "tipo": "bajo", "estado": "disponible", "sedeId": sedeBogotaId, "createdAt": new Date() },
  { "nombre": "Guitarra Fender Stratocaster", "codigoInventario": "GTR-002", "tipo": "guitarra", "estado": "disponible", "sedeId": sedeMedellinId, "createdAt": new Date() },
  { "nombre": "Piano Yamaha P-125", "codigoInventario": "PNO-002", "tipo": "piano", "estado": "disponible", "sedeId": sedeMedellinId, "createdAt": new Date() },
  { "nombre": "Violín Hoffman Allegro", "codigoInventario": "VIO-002", "tipo": "violin", "estado": "disponible", "sedeId": sedeMedellinId, "createdAt": new Date() },
  { "nombre": "Batería Mapex Voyager", "codigoInventario": "BAT-002", "tipo": "bateria", "estado": "disponible", "sedeId": sedeMedellinId, "createdAt": new Date() },
  { "nombre": "Bajo Eléctrico Ibanez", "codigoInventario": "BAJ-002", "tipo": "bajo", "estado": "disponible", "sedeId": sedeMedellinId, "createdAt": new Date() },
  { "nombre": "Guitarra Ibanez Gio", "codigoInventario": "GTR-003", "tipo": "guitarra", "estado": "mantenimiento", "sedeId": sedeCaliId, "createdAt": new Date() },
  { "nombre": "Piano Casio Privia PX-S1000", "codigoInventario": "PNO-003", "tipo": "piano", "estado": "mantenimiento", "sedeId": sedeCaliId, "createdAt": new Date() },
  { "nombre": "Violín Cremona SV-75", "codigoInventario": "VIO-003", "tipo": "violin", "estado": "mantenimiento", "sedeId": sedeCaliId, "createdAt": new Date() },
  { "nombre": "Batería Ludwig Accent", "codigoInventario": "BAT-003", "tipo": "bateria", "estado": "fuera_de_servicio", "sedeId": sedeCaliId, "createdAt": new Date() },
  { "nombre": "Bajo Yamaha", "codigoInventario": "BAJ-003", "tipo": "bajo", "estado": "disponible", "sedeId": sedeCaliId, "createdAt": new Date() },
  { "nombre": "Guitarra Acústica Taylor", "codigoInventario": "GTR-004", "tipo": "guitarra", "estado": "disponible", "sedeId": sedeBogotaId, "createdAt": new Date() },
  { "nombre": "Piano de Cola Steinway", "codigoInventario": "PNO-004", "tipo": "piano", "estado": "disponible", "sedeId": sedeBogotaId, "createdAt": new Date() },
  { "nombre": "Violín Eléctrico Yamaha", "codigoInventario": "VIO-004", "tipo": "violin", "estado": "mantenimiento", "sedeId": sedeMedellinId, "createdAt": new Date() },
  { "nombre": "Batería Electrónica Roland", "codigoInventario": "BAT-004", "tipo": "bateria", "estado": "disponible", "sedeId": sedeMedellinId, "createdAt": new Date() },
  { "nombre": "Bajo de 5 Cuerdas Ibanez", "codigoInventario": "BAJ-004", "tipo": "bajo", "estado": "disponible", "sedeId": sedeCaliId, "createdAt": new Date() }
]);
print("✅ PASO 4: 20 instrumentos insertados.");
// ---------------------------------------------------------------------------------

// --- PASO 5: Insertar Cursos ---
// Necesitamos los IDs de los profesores que acabamos de insertar.
const profesores = db.profesores.find().toArray();
db.cursos.insertMany([
  { "nombre": "Piano Básico", "nivel": "basico", "instrumento": "piano", "costo": 500000, "cupos": { "maximo": 10, "disponibles": 8 }, "duracion": { "valor": 16, "unidad": "semanas" }, "sedeId": sedeBogotaId, "profesorId": profesores[0]._id, "estado": "activo", "createdAt": new Date() },
  { "nombre": "Guitarra Intermedia", "nivel": "intermedio", "instrumento": "guitarra", "costo": 550000, "cupos": { "maximo": 8, "disponibles": 6 }, "duracion": { "valor": 16, "unidad": "semanas" }, "sedeId": sedeBogotaId, "profesorId": profesores[1]._id, "estado": "activo", "createdAt": new Date() },
  { "nombre": "Violín Avanzado", "nivel": "avanzado", "instrumento": "violin", "costo": 700000, "cupos": { "maximo": 5, "disponibles": 3 }, "duracion": { "valor": 20, "unidad": "semanas" }, "sedeId": sedeBogotaId, "profesorId": profesores[2]._id, "estado": "activo", "createdAt": new Date() },
  { "nombre": "Teoría Musical I", "nivel": "basico", "instrumento": "teoria musical", "costo": 400000, "cupos": { "maximo": 15, "disponibles": 13 }, "duracion": { "valor": 12, "unidad": "semanas" }, "sedeId": sedeBogotaId, "profesorId": profesores[4]._id, "estado": "proximo", "createdAt": new Date() },
  { "nombre": "Canto Moderno", "nivel": "intermedio", "instrumento": "canto", "costo": 520000, "cupos": { "maximo": 12, "disponibles": 10 }, "duracion": { "valor": 16, "unidad": "semanas" }, "sedeId": sedeBogotaId, "profesorId": profesores[3]._id, "estado": "activo", "createdAt": new Date() },
  { "nombre": "Piano Intermedio", "nivel": "intermedio", "instrumento": "piano", "costo": 580000, "cupos": { "maximo": 8, "disponibles": 6 }, "duracion": { "valor": 16, "unidad": "semanas" }, "sedeId": sedeMedellinId, "profesorId": profesores[5]._id, "estado": "activo", "createdAt": new Date() },
  { "nombre": "Guitarra para Principiantes", "nivel": "basico", "instrumento": "guitarra", "costo": 500000, "cupos": { "maximo": 10, "disponibles": 8 }, "duracion": { "valor": 12, "unidad": "semanas" }, "sedeId": sedeMedellinId, "profesorId": profesores[6]._id, "estado": "proximo", "createdAt": new Date() },
  { "nombre": "Batería de Rock", "nivel": "intermedio", "instrumento": "bateria", "costo": 600000, "cupos": { "maximo": 6, "disponibles": 4 }, "duracion": { "valor": 16, "unidad": "semanas" }, "sedeId": sedeMedellinId, "profesorId": profesores[7]._id, "estado": "activo", "createdAt": new Date() },
  { "nombre": "Bajo Eléctrico I", "nivel": "basico", "instrumento": "bajo", "costo": 530000, "cupos": { "maximo": 7, "disponibles": 5 }, "duracion": { "valor": 12, "unidad": "semanas" }, "sedeId": sedeMedellinId, "profesorId": profesores[6]._id, "estado": "activo", "createdAt": new Date() },
  { "nombre": "Canto Avanzado", "nivel": "avanzado", "instrumento": "canto", "costo": 650000, "cupos": { "maximo": 7, "disponibles": 5 }, "duracion": { "valor": 20, "unidad": "semanas" }, "sedeId": sedeMedellinId, "profesorId": profesores[9]._id, "estado": "proximo", "createdAt": new Date() },
  { "nombre": "Piano Salsero", "nivel": "avanzado", "instrumento": "piano", "costo": 720000, "cupos": { "maximo": 5, "disponibles": 3 }, "duracion": { "valor": 18, "unidad": "semanas" }, "sedeId": sedeCaliId, "profesorId": profesores[0]._id, "estado": "activo", "createdAt": new Date() },
  { "nombre": "Guitarra Clásica", "nivel": "basico", "instrumento": "guitarra", "costo": 530000, "cupos": { "maximo": 6, "disponibles": 4 }, "duracion": { "valor": 14, "unidad": "semanas" }, "sedeId": sedeCaliId, "profesorId": profesores[1]._id, "estado": "cerrado", "createdAt": new Date() },
  { "nombre": "Introducción al Violín", "nivel": "basico", "instrumento": "violin", "costo": 550000, "cupos": { "maximo": 8, "disponibles": 6 }, "duracion": { "valor": 12, "unidad": "semanas" }, "sedeId": sedeCaliId, "profesorId": profesores[8]._id, "estado": "activo", "createdAt": new Date() },
  { "nombre": "Teoría Musical Avanzada", "nivel": "avanzado", "instrumento": "teoria musical", "costo": 800000, "cupos": { "maximo": 10, "disponibles": 8 }, "duracion": { "valor": 24, "unidad": "semanas" }, "sedeId": sedeCaliId, "profesorId": profesores[4]._id, "estado": "proximo", "createdAt": new Date() },
  { "nombre": "Técnica Vocal", "nivel": "basico", "instrumento": "canto", "costo": 500000, "cupos": { "maximo": 12, "disponibles": 10 }, "duracion": { "valor": 16, "unidad": "semanas" }, "sedeId": sedeCaliId, "profesorId": profesores[3]._id, "estado": "activo", "createdAt": new Date() }
]);
print("✅ PASO 5: 15 cursos (5 por sede) insertados.");
// ---------------------------------------------------------------------------------

// --- PASO 6: Insertar Inscripciones ---
const estudiantes = db.estudiantes.find().toArray();
const cursos = db.cursos.find().toArray();
db.inscripciones.insertMany([
  // Cada estudiante se inscribe en 2 cursos
  { "estudianteId": estudiantes[0]._id, "cursoId": cursos[0]._id, "costoCongelado": 500000, "fechaInscripcion": new Date(), "estado": "activa", "createdAt": new Date() },
  { "estudianteId": estudiantes[1]._id, "cursoId": cursos[1]._id, "costoCongelado": 550000, "fechaInscripcion": new Date(), "estado": "activa", "createdAt": new Date() },
  { "estudianteId": estudiantes[2]._id, "cursoId": cursos[2]._id, "costoCongelado": 700000, "fechaInscripcion": new Date(), "estado": "activa", "createdAt": new Date() },
  { "estudianteId": estudiantes[3]._id, "cursoId": cursos[3]._id, "costoCongelado": 400000, "fechaInscripcion": new Date(), "estado": "pendiente", "createdAt": new Date() },
  { "estudianteId": estudiantes[4]._id, "cursoId": cursos[4]._id, "costoCongelado": 520000, "fechaInscripcion": new Date(), "estado": "activa", "createdAt": new Date() },
  { "estudianteId": estudiantes[5]._id, "cursoId": cursos[5]._id, "costoCongelado": 580000, "fechaInscripcion": new Date(), "estado": "activa", "createdAt": new Date() },
  { "estudianteId": estudiantes[6]._id, "cursoId": cursos[6]._id, "costoCongelado": 500000, "fechaInscripcion": new Date(), "estado": "activa", "createdAt": new Date() },
  { "estudianteId": estudiantes[7]._id, "cursoId": cursos[7]._id, "costoCongelado": 600000, "fechaInscripcion": new Date(), "estado": "cancelada", "createdAt": new Date() },
  { "estudianteId": estudiantes[8]._id, "cursoId": cursos[8]._id, "costoCongelado": 530000, "fechaInscripcion": new Date(), "estado": "activa", "createdAt": new Date() },
  { "estudianteId": estudiantes[9]._id, "cursoId": cursos[9]._id, "costoCongelado": 650000, "fechaInscripcion": new Date(), "estado": "activa", "createdAt": new Date() },
  { "estudianteId": estudiantes[10]._id, "cursoId": cursos[10]._id, "costoCongelado": 720000, "fechaInscripcion": new Date(), "estado": "activa", "createdAt": new Date() },
  { "estudianteId": estudiantes[11]._id, "cursoId": cursos[11]._id, "costoCongelado": 530000, "fechaInscripcion": new Date(), "estado": "activa", "createdAt": new Date() },
  { "estudianteId": estudiantes[12]._id, "cursoId": cursos[12]._id, "costoCongelado": 550000, "fechaInscripcion": new Date(), "estado": "finalizada", "createdAt": new Date() },
  { "estudianteId": estudiantes[13]._id, "cursoId": cursos[13]._id, "costoCongelado": 800000, "fechaInscripcion": new Date(), "estado": "activa", "createdAt": new Date() },
  { "estudianteId": estudiantes[14]._id, "cursoId": cursos[14]._id, "costoCongelado": 500000, "fechaInscripcion": new Date(), "estado": "activa", "createdAt": new Date() },
  // Segunda vuelta
  { "estudianteId": estudiantes[0]._id, "cursoId": cursos[14]._id, "costoCongelado": 500000, "fechaInscripcion": new Date(), "estado": "activa", "createdAt": new Date() },
  { "estudianteId": estudiantes[1]._id, "cursoId": cursos[13]._id, "costoCongelado": 800000, "fechaInscripcion": new Date(), "estado": "activa", "createdAt": new Date() },
  { "estudianteId": estudiantes[2]._id, "cursoId": cursos[12]._id, "costoCongelado": 550000, "fechaInscripcion": new Date(), "estado": "finalizada", "createdAt": new Date() },
  { "estudianteId": estudiantes[3]._id, "cursoId": cursos[11]._id, "costoCongelado": 530000, "fechaInscripcion": new Date(), "estado": "activa", "createdAt": new Date() },
  { "estudianteId": estudiantes[4]._id, "cursoId": cursos[10]._id, "costoCongelado": 720000, "fechaInscripcion": new Date(), "estado": "activa", "createdAt": new Date() },
  { "estudianteId": estudiantes[5]._id, "cursoId": cursos[9]._id, "costoCongelado": 650000, "fechaInscripcion": new Date(), "estado": "activa", "createdAt": new Date() },
  { "estudianteId": estudiantes[6]._id, "cursoId": cursos[8]._id, "costoCongelado": 530000, "fechaInscripcion": new Date(), "estado": "activa", "createdAt": new Date() },
  { "estudianteId": estudiantes[7]._id, "cursoId": cursos[7]._id, "costoCongelado": 600000, "fechaInscripcion": new Date(), "estado": "activa", "createdAt": new Date() },
  { "estudianteId": estudiantes[8]._id, "cursoId": cursos[6]._id, "costoCongelado": 500000, "fechaInscripcion": new Date(), "estado": "pendiente", "createdAt": new Date() },
  { "estudianteId": estudiantes[9]._id, "cursoId": cursos[5]._id, "costoCongelado": 580000, "fechaInscripcion": new Date(), "estado": "activa", "createdAt": new Date() },
  { "estudianteId": estudiantes[10]._id, "cursoId": cursos[4]._id, "costoCongelado": 520000, "fechaInscripcion": new Date(), "estado": "activa", "createdAt": new Date() },
  { "estudianteId": estudiantes[11]._id, "cursoId": cursos[3]._id, "costoCongelado": 400000, "fechaInscripcion": new Date(), "estado": "activa", "createdAt": new Date() },
  { "estudianteId": estudiantes[12]._id, "cursoId": cursos[2]._id, "costoCongelado": 700000, "fechaInscripcion": new Date(), "estado": "cancelada", "createdAt": new Date() },
  { "estudianteId": estudiantes[13]._id, "cursoId": cursos[1]._id, "costoCongelado": 550000, "fechaInscripcion": new Date(), "estado": "activa", "createdAt": new Date() },
  { "estudianteId": estudiantes[14]._id, "cursoId": cursos[0]._id, "costoCongelado": 500000, "fechaInscripcion": new Date(), "estado": "activa", "createdAt": new Date() }
]);
print("✅ PASO 6: 30 inscripciones insertadas.");
// ---------------------------------------------------------------------------------

// --- PASO 7: Insertar Reservas de Instrumentos y Actualizar Estado ---
const instrumentosDisponibles = db.instrumentos.find({ estado: "disponible" }).limit(10).toArray();
const reservasData = [
  { "instrumentoId": instrumentosDisponibles[0]._id, "estudianteId": estudiantes[0]._id, "fechaHoraInicio": new Date("2025-10-27T10:00:00Z"), "fechaHoraFin": new Date("2025-10-27T12:00:00Z"), "estado": "activa", "createdAt": new Date() },
  { "instrumentoId": instrumentosDisponibles[1]._id, "estudianteId": estudiantes[1]._id, "fechaHoraInicio": new Date("2025-10-27T12:00:00Z"), "fechaHoraFin": new Date("2025-10-27T14:00:00Z"), "estado": "activa", "createdAt": new Date() },
  { "instrumentoId": instrumentosDisponibles[2]._id, "estudianteId": estudiantes[2]._id, "fechaHoraInicio": new Date("2025-10-27T14:00:00Z"), "fechaHoraFin": new Date("2025-10-27T16:00:00Z"), "estado": "finalizada", "createdAt": new Date() },
  { "instrumentoId": instrumentosDisponibles[3]._id, "estudianteId": estudiantes[3]._id, "fechaHoraInicio": new Date("2025-10-28T10:00:00Z"), "fechaHoraFin": new Date("2025-10-28T11:00:00Z"), "estado": "activa", "createdAt": new Date() },
  { "instrumentoId": instrumentosDisponibles[4]._id, "estudianteId": estudiantes[4]._id, "fechaHoraInicio": new Date("2025-10-28T11:00:00Z"), "fechaHoraFin": new Date("2025-10-28T12:00:00Z"), "estado": "cancelada", "createdAt": new Date() },
  { "instrumentoId": instrumentosDisponibles[5]._id, "estudianteId": estudiantes[5]._id, "fechaHoraInicio": new Date("2025-10-29T15:00:00Z"), "fechaHoraFin": new Date("2025-10-29T17:00:00Z"), "estado": "activa", "createdAt": new Date() },
  { "instrumentoId": instrumentosDisponibles[6]._id, "estudianteId": estudiantes[6]._id, "fechaHoraInicio": new Date("2025-10-30T09:00:00Z"), "fechaHoraFin": new Date("2025-10-30T11:00:00Z"), "estado": "activa", "createdAt": new Date() },
  { "instrumentoId": instrumentosDisponibles[7]._id, "estudianteId": estudiantes[7]._id, "fechaHoraInicio": new Date("2025-11-01T10:00:00Z"), "fechaHoraFin": new Date("2025-11-01T13:00:00Z"), "estado": "finalizada", "createdAt": new Date() },
  { "instrumentoId": instrumentosDisponibles[8]._id, "estudianteId": estudiantes[8]._id, "fechaHoraInicio": new Date("2025-11-02T14:00:00Z"), "fechaHoraFin": new Date("2025-11-02T16:00:00Z"), "estado": "activa", "createdAt": new Date() },
  { "instrumentoId": instrumentosDisponibles[9]._id, "estudianteId": estudiantes[9]._id, "fechaHoraInicio": new Date("2025-11-03T16:00:00Z"), "fechaHoraFin": new Date("2025-11-03T18:00:00Z"), "estado": "activa", "createdAt": new Date() }
];
db.reservas_instrumentos.insertMany(reservasData);
print("✅ PASO 7: 10 reservas de instrumentos insertadas.");

// Actualización final de estados
const idsInstrumentosReservados = reservasData
    .filter(reserva => reserva.estado === "activa")
    .map(reserva => reserva.instrumentoId);
db.instrumentos.updateMany(
   { "_id": { "$in": idsInstrumentosReservados }},
   { "$set": { "estado": "reservado" } }
);
print("✅ PASO 7.1: Estados de instrumentos con reservas 'activas' actualizados.");

// ---------------------------------------------------------------------------------
print("🚀 ¡Poblado completado! La base de datos está lista para ser consultada.");