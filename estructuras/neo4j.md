curl -fdSL https://ollama.com/install.sh | sh

ollama run qwen2.5-coder:7b



### Pregunta 1 — Ordenación y Agregación 
- *Enunciado tipo:* Modifica la consulta para ordenar los resultados por número de empleados/trabajadores descendente de cada empresa.

MATCH (p:Persona)-[:TRABAJA_EN]->(e:Empresa) 
RETURN e.nombre, count(p) AS trabajadores 
ORDER BY trabajadores DESC

---
### Pregunta 2 — Limpieza de Duplicados (DISTINCT)
- *Enunciado tipo:* Modifica la siguiente consulta para devolver solo nombres únicos de personas que trabajan con otras: 

*MATCH (p:Persona)-[:TRABAJA_CON]->(o:Persona) 
RETURN p.nombre*

MATCH (p:Persona)-[:TRABAJA_CON]->(o:Persona) 
RETURN DISTINCT p.nombre

---
### Pregunta 3 — Filtrado de Agregaciones con WITH 
- *Enunciado tipo:* Modifica la consulta para devolver solo las ciudades con más de 2 personas (habitantes).

MATCH (p:Persona)-[:VIVE_EN]->(c:Ciudad) 
WITH c, count(p) AS habitantes 
WHERE habitantes > 2 RETURN c.nombre, habitantes

---
### Pregunta 4 — Conteo de Relaciones por Nodo 
- *Enunciado tipo:* Encuentra las universidades junto con el número de estudiantes (más de un estudiante).

MATCH (p:Persona)-[:ESTUDIO_EN]->(u:Universidad) 
WITH u, count(p) AS total_estudiantes 
WHERE total_estudiantes > 1 
RETURN u.nombre, total_estudiantes

---
### Pregunta 5 — Evitar Duplicados en Pares / Espejos 
- *Enunciado tipo:* Modifica la consulta para evitar duplicados en pares de personas que viven en la misma ciudad (evitar que salga Ana-Luis y luego Luis-Ana).

MATCH (p1:Persona)-[:VIVE_EN]->(c:Ciudad)<-[:VIVE_EN]-(p2:Persona) 
WHERE p1.id < p2.id 
RETURN p1.nombre, p2.nombre, c.nombre

---
### Pregunta 6 — Intersección de Patrones Múltiples
- *Enunciado tipo:* Encuentra pares de personas que viven en la misma ciudad y además trabajan juntas.


MATCH (p1:Persona)-[:VIVE_EN]->(c:Ciudad)<-[:VIVE_EN]-(p2:Persona), (p1)-[:TRABAJA_CON]-(p2) 
WHERE p1.id < p2.id 
RETURN p1.nombre, p2.nombre, c.nombre

---
### Pregunta 7 — Relaciones Opcionales (OPTIONAL MATCH)
- *Enunciado tipo:* Modifica la consulta para incluir también a aquellas personas que no participan en ningún proyecto (evitando que queden excluidas).

MATCH (p:Persona) 
OPTIONAL MATCH (p)-[:PARTICIPA_EN]->(pr:Proyecto) 
RETURN p.nombre, pr.nombre

---
### Pregunta 8 — Caminos de Longitud Variable e Intermedios 
- *Enunciado tipo:* Obtén los nodos intermedios en los caminos (paths) de amistad de longitud exacta hasta 2 saltos.


MATCH path = (a:Persona)-[:AMIGO_DE*2]->(b:Persona) 
UNWIND nodes(path) AS nodo 
WHERE nodo <> a AND nodo <> b 
RETURN DISTINCT nodo.nombre AS Intermediarios


---
### Sección Extra: Caza de Errores Rápidos (Por si acaso)
*Si te ponen una consulta rota para corregir en la terminal:*

Si ves esto: MATCH (p:Persona)-[:TRABAJA_EN]->(e)-[:VIVE_EN]->(c)

El error es: Estás diciendo que la empresa (e) vive en la ciudad. Las empresas no tienen esa relación en tu dataset.

La solución:

MATCH (p:Persona)-[:TRABAJA_EN]->(e:Empresa), (p)-[:VIVE_EN]->(c:Ciudad) RETURN p.nombre, e.nombre, c.nombre