### Pregunta 1 - Teoría / Arquitectura
Base de Datos Documental

---
### Pregunta 2 - Inserción Básica
Colección objetivo: productos
- *Enunciado tipo:* Insertar en la colección productos el ratón gamer.

db.productos.insertOne({ _id: 5, nombre: "Raton Gamer", precio: 70, stock: 15, categoriaId: 1})

---
### Pregunta 3 - Consulta con Filtro y Proyección
Colección objetivo: usuarios
- *Enunciado tipo:* Consultar los usuarios con estado "activo" mostrando solo nombre y correo.

db.usuarios.find({ estado: "activo" }, { nombre: 1, correo: 1, _id: 0 })

---
### Pregunta 4 - Actualización / Update
Colección objetivo: productos
- *Enunciado tipo:* Actualizar el producto "Laptop" para que su stock sea 8.

db.productos.updateOne({ nombre: "Laptop" }, { $set: { stock: 8 } })

---
### Pregunta 5 - Aggregation Framework
Colección objetivo: ventas
- *Enunciado tipo:* Utilizando Aggregation Framework, calcular el monto total recaudado por cada categoria.

***Variante A (Contar cuántos documentos hay):*** Calcular el número de usuarios por rol:

db.usuarios.aggregate([ { $group: { _id: "$rol", total: { $sum: 1 } } } ])

***Variante B (Sumar un valor acumulado):*** Calcular el stock total por categoriaId en productos:

db.productos.aggregate([ { $group: { _id: "$categoriaId", totalStock: { $sum: "$stock" } } } ])

***Variante C (Calcular un promedio):*** Calcular el salario promedio por departamentoId en empleados:

db.empleados.aggregate([ { $group: { _id: "$departamentoId", promedioSalario: { $avg: "$salario" } } } ])

---
### Pregunta 6 - Crear Índice Simple
Colección objetivo: usuarios / productos
- *Enunciado tipo:* Crear un índice sobre el campo edad (o precio/categoriaId).

db.usuarios.createIndex({ edad: 1 })

---
### Pregunta 7 - Crear Índice Compuesto
Colección objetivo: usuarios / productos
- *Enunciado tipo:* Crear un índice compuesto sobre los campos estado + edad.

db.usuarios.createIndex({ estado: 1, edad: 1 })

---
### Pregunta 8 - Análisis de Rendimiento / Explain
Colección objetivo: usuarios
- *Enunciado tipo:* Ejecutar explain("executionStats") sobre la consulta que busca usuarios activos.

db.usuarios.find({ estado: "activo" }).explain("executionStats")

---
### Pregunta 9 - Proyección Total (Sin Filtro)
Colección objetivo: productos
- *Enunciado tipo:* Realizar una consulta que devuelva solo el campo nombre de todos los productos.

db.productos.find( {},  { nombre: 1, _id: 0 })
