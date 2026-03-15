# 🍃 MongoDB Cheat Sheet: Operaciones y Optimización

Guía rápida de referencia para el manejo de colecciones, operadores avanzados y estrategias de rendimiento en MongoDB basándose en el **Parcial I**.

---

## 🛠️ CRUD: Actualizaciones de Documentos

### Reemplazo vs. Actualización Parcial
* **`replaceOne()`**: Realiza un reemplazo completo del documento. Se recomienda evitar su uso a menos que sea estrictamente necesario.
* **`updateOne()`**: Permite realizar actualizaciones parciales en campos específicos del documento.

### Operadores de Campo Principales
| Operador | Descripción | Uso Común |
| :--- | :--- | :--- |
| **`$set`** | Crea o modifica el valor de un campo. | Actualizar datos de un perfil. |
| **`$unset`** | Elimina un campo completamente del documento. | Limpieza de datos obsoletos. |
| **`$inc`** | Incrementa o decrementa valores numéricos. | Contador de visitas o créditos. |

### Operadores de Comparación
* **`$gt` / `$lt`**: Mayor que / Menor que.
* **`$gte` / `$lte`**: Mayor o igual / Menor o igual que.

---

## 📦 Manipulación de Arrays (Operadores Avanzados)
Ideales para gestionar listas de datos dinámicamente.

* **`$push`**: Agrega elementos al final de un array.
  * **`$each`**: Permite añadir múltiples elementos en una sola operación.
  * **`$slice`**: Limita el tamaño del array (ej. `$slice: -5` conserva solo los últimos 5 elementos).
* **`$pull`**: Elimina elementos específicos de un array.
* **`$` (Operador Posicional)**: Modifica únicamente el **primer elemento** que cumple con la condición del filtro dentro de un array.

[Image of MongoDB positional operator updating an element in an array]

---

## ⚠️ Seguridad en Actualizaciones Masivas

### `updateMany()`
Este comando modifica **todos** los documentos que coinciden con el filtro. 
> **Riesgo:** Puede afectar a más documentos de los previstos si el filtro no es exacto.

**Protocolo de seguridad recomendado:**
1. Ejecutar primero un **`find()`** con el filtro deseado para validar los resultados.
2. Tras confirmar la selección, proceder con el **`updateMany()`**.

### Upsert
Si el filtro no encuentra coincidencias, el parámetro `{ upsert: true }` crea un nuevo documento con los datos proporcionados. Si existe, simplemente lo actualiza.

---

## 🚀 Índices y Rendimiento

### El problema: COLLSCAN
Ocurre cuando MongoDB no tiene un índice y debe recorrer **todos** los documentos de la colección.
* **Consecuencias:** Alto consumo de CPU, latencia y elevado I/O en disco.

### La solución: IXSCAN (Índices)
Estructura auxiliar de **Árbol Balanceado** que localiza documentos sin leer toda la colección.

[Image of a B-tree index structure versus a collection scan]

### Comandos de Gestión
* **Crear índice simple:** `db.coleccion.createIndex({ campo: 1 })` (1 para ascendente, -1 para descendente).
* **Crear índice compuesto:** `db.coleccion.createIndex({ campo1: 1, campo2: -1 })`.
* **Ver índices:** `db.coleccion.getIndexes()`.
* **Índice Multikey:** Se crea automáticamente cuando el campo indexado es un array, generando una entrada por cada elemento.
* **Índice Único:** Evita duplicados en campos específicos (ej. `unique: true` para emails).

---

## 📊 Auditoría con `.explain()`
Proporciona un informe de rendimiento de la consulta.

* **`stage`**: Indica si se realizó un `COLLSCAN` o un `IXSCAN`.
* **`totalDocsExamined`**: Número total de documentos leídos.
* **`totalKeysExamined`**: Número de entradas de índice consult