# 🎯 GUÍA PARA PROBAR TRANSACCIONES MONGODB

## 📋 REQUISITOS PREVIOS

1. **MongoDB corriendo** ✅
2. **Base de datos creada** ✅
3. **Datos de prueba insertados** ✅

## 🚀 PASO A PASO PARA PROBAR

### PASO 1: Verificar que MongoDB está corriendo
```cmd
mongosh
```

### PASO 2: Crear la base de datos (si no existe)
```cmd
mongosh --file db_config.js
```

### PASO 3: Insertar datos de prueba
```cmd
mongosh --file test_dataset.js
```

### PASO 4: Ejecutar transacciones
```cmd
mongosh --file transacciones.js
```

### PASO 5: Probar transacciones (opcional)
```cmd
mongosh --file test_transacciones.js
```

## 🎯 QUÉ DEBERÍAS VER

### ✅ RESULTADO EXITOSO:
```
🎯 EJEMPLO DE INSCRIPCIÓN DE ESTUDIANTE
======================================================================
🔍 VERIFICANDO DATOS EN LA BASE DE DATOS:
===========================================
📊 Total estudiantes: 5
📚 Total cursos: 8

🔍 VERIFICANDO ESTRUCTURA DE DATOS:
=====================================
✅ Estudiante encontrado: Juan Pérez
   ID: ObjectId("...")
   Estado: activo
✅ Curso encontrado: Guitarra Básica
   ID: ObjectId("...")
   Estado: activo
   Cupos disponibles: 15

🔄 EJECUTANDO TRANSACCIÓN DE INSCRIPCIÓN:
=========================================
🚀 Iniciando inscripción de estudiante (versión simplificada)...
🔍 Verificando disponibilidad del curso...
✅ Curso válido: Guitarra Básica (15 cupos disponibles)
🔍 Verificando inscripciones previas...
✅ No hay inscripciones duplicadas
📝 Insertando inscripción...
✅ Inscripción creada con ID: ObjectId("...")
📉 Decrementando cupos disponibles...
✅ Cupos decrementados exitosamente. Nuevo total: 14
🎉 ¡Inscripción completada exitosamente!

✅ RESULTADO EXITOSO:
   📝 ID de inscripción: ObjectId("...")
   💰 Costo congelado: $250,000
   🎯 Mensaje: Estudiante inscrito correctamente en el curso

🔍 VERIFICANDO RESULTADO DE LA TRANSACCIÓN:
===========================================
✅ Inscripción creada correctamente en la base de datos
✅ Cupos actualizados: 14 disponibles
```

### ❌ SI NO FUNCIONA:
```
❌ ERROR: No hay estudiantes en la base de datos
💡 SOLUCIÓN: Ejecuta primero: mongosh --file test_dataset.js
```

## 🔧 SOLUCIÓN DE PROBLEMAS

### Problema: "No hay datos en la base de datos"
**Solución:**
```cmd
mongosh --file test_dataset.js
```

### Problema: "MongoDB no está corriendo"
**Solución:**
```cmd
net start MongoDB
```

### Problema: "Error al cargar transacciones"
**Solución:**
Verifica que el archivo `transacciones.js` está en el directorio actual

## 🎯 VERIFICACIÓN FINAL

Después de ejecutar las transacciones, verifica:

1. **Inscripción creada:**
```javascript
db.inscripciones.find().count()
```

2. **Cupos decrementados:**
```javascript
db.cursos.find({}, {nombre: 1, "cupos.disponibles": 1})
```

3. **Transacción exitosa:**
```javascript
db.inscripciones.findOne().estudianteId
```

## 🎵 ¡LISTO!

Si ves el mensaje "🎉 ¡Inscripción completada exitosamente!" significa que las transacciones están funcionando correctamente. 