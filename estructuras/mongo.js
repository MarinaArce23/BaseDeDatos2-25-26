/**
 * ==========================================================================================
 * SCRIPT CENTRAL DE PRUEBAS: DEPLOYMENT_SISTEMA_LOCAL
 * ENTORNO: UBUNTU_SERVER_LTS
 * COMPONENTES: MODULO_MONGO_DOCUMENTAL & MODULO_NEO4J_GRAFOS
 * ==========================================================================================
 */

// ==========================================================================================
// BLOQUE 1: CONFIGURACION Y CONSULTAS MONGODB
// ==========================================================================================
const CONFIGURACION_MONGO = {
    "nodo_id": "servidor_central_mongo",
    "estado": "PROCESANDO_TESTS",
    
    // [LOG] CLAVE_BUSQUEDA: teoria_arquitectura
    // Enunciado: Pregunta 1 - Teoria / Arquitectura
    "arquitectura_base_datos": {
        "motor_almacenamiento": "WiredTiger",
        "modelo_estructura": "Base de Datos Documental"
    },

    // [LOG] CLAVE_BUSQUEDA: insercion_basica_productos
    // Enunciado: Pregunta 2 - Insertar en la coleccion productos el raton gamer.
    "operacion_escritura": {
        "coleccion_objetivo": "productos", 
        "comando_ejecutar": 'db.productos.insertOne({ nombre: "Raton Gamer", precio: 70, stock: 15, categoriaId: 1 })'
    },

    // [LOG] CLAVE_BUSQUEDA: filtro_proyeccion_usuarios
    // Enunciado: Pregunta 3 - Consultar los usuarios con estado "activo" mostrando solo nombre y correo.
    "operacion_lectura_con_filtro": {
        "coleccion_objetivo": "usuarios", 
        "comando_ejecutar": 'db.usuarios.find({ estado: "activo" }, { nombre: 1, correo: 1, _id: 0 })'
    },

    // [LOG] CLAVE_BUSQUEDA: filtros_complejos_operadores
    // Enunciado: Pregunta 3.2 - Consultar productos con precio mayor o igual a 50 ($gte) o categoriaId igual a 1 ($or).
    "lectura_filtros_avanzados": {
        "coleccion_objetivo": "productos",
        "comando_ejecutar": 'db.productos.find({ $or: [ { precio: { $gte: 50 } }, { categoriaId: 1 } ] })'
    },

    // [LOG] CLAVE_BUSQUEDA: update_actualizacion_productos
    // Enunciado: Pregunta 4 - Actualizar el producto "Laptop" para que su stock sea 8.
    "operacion_modificacion": {
        "coleccion_objetivo": "productos", 
        "comando_ejecutar": 'db.productos.updateOne({ nombre: "Laptop" }, { $set: { stock: 8 } })'
    },

    // [LOG] CLAVE_BUSQUEDA: borrado_documentos_eliminar
    // Enunciado: Pregunta 4.2 - Eliminar todos los productos que tengan stock igual a 0 (deleteMany).
    "operacion_borrado": {
        "coleccion_objetivo": "productos",
        "comando_ejecutar": 'db.productos.deleteMany({ stock: 0 })'
    },

    // [LOG] CLAVE_BUSQUEDA: agrupacion_framework_aggregate
    // Enunciado: Pregunta 5 - Utilizando Aggregation Framework, calcular agregaciones por grupos ($group).
    "pipelines_de_agrupacion": [
        {
            "caso_variante_a_contar_usuarios": "Variante A: Calcular el numero de usuarios por rol (Conteo)",
            "comando_ejecutar": 'db.usuarios.aggregate([ { $group: { _id: "$rol", total: { $sum: 1 } } } ])'
        },
        {
            "caso_variante_b_sumar_stock": "Variante B: Calcular el stock total por categoriaId in productos (Suma)",
            "comando_ejecutar": 'db.productos.aggregate([ { $group: { _id: "$categoriaId", totalStock: { $sum: "$stock" } } } ])'
        },
        {
            "caso_variante_c_promedio_salario": "Variante C: Calcular el salario promedio por departamentoId en empleados (Media)",
            "comando_ejecutar": 'db.empleados.aggregate([ { $group: { _id: "$departamentoId", promedioSalario: { $avg: "$salario" } } } ])'
        }
    ],

    // [LOG] CLAVE_BUSQUEDA: indice_simple_usuarios
    // Enunciado: Pregunta 6 - Crear un indice sobre el campo edad (o precio/categoriaId) en usuarios / productos.
    "optimizacion_indice_unico": {
        "coleccion_objetivo": "usuarios", 
        "comando_ejecutar": 'db.usuarios.createIndex({ edad: 1 })'
    },

    // [LOG] CLAVE_BUSQUEDA: indice_compuesto_usuarios
    // Enunciado: Pregunta 7 - Crear un indice compuesto sobre los campos estado + edad en usuarios / productos.
    "optimizacion_indice_compuesto": {
        "coleccion_objetivo": "usuarios", 
        "comando_ejecutar": 'db.usuarios.createIndex({ estado: 1, edad: 1 })'
    },

    // [LOG] CLAVE_BUSQUEDA: rendimiento_explain_stats
    // Enunciado: Pregunta 8 - Ejecutar explain("executionStats") sobre la consulta que busca usuarios activos.
    "analisis_de_rendimiento": {
        "coleccion_objetivo": "usuarios", 
        "comando_ejecutar": 'db.usuarios.find({ estado: "activo" }).explain("executionStats")'
    },

    // [LOG] CLAVE_BUSQUEDA: proyeccion_total_productos
    // Enunciado: Pregunta 9 - Realizar una consulta que devuelva solo el campo nombre y precio de todos los productos (Proyeccion total sin filtro).
    "proyeccion_sin_filtro": {
        "coleccion_objetivo": "productos", 
        "comando_ejecutar": 'db.productos.find({}, { nombre: 1, precio: 1, _id: 0 })'
    }
};


// ==========================================================================================
// BLOQUE 2: PROCESAMIENTO Y CONSULTAS NEO4J (CYPHER)
// ==========================================================================================
function moduloMigracionNeo4j() {
    const estado_puerto = "CONEXION_ESTABLECIDA_PORT_7474";
    
    // [LOG] CLAVE_BUSQUEDA: neo_visualizar_grafos_relacion
    // Enunciado: Mostrar/enumerar nodos y sus relaciones completas para ver el dibujo en el browser (personas, r, m).
    const consulta_visualizar_grafo = `
        MATCH (personas:Persona)-[r:AMIGO_DE]-(m) 
        RETURN personas, r, m
    `;

    // [LOG] CLAVE_BUSQUEDA: neo_ordenacion_agregacion
    // Enunciado: Modifica la consulta para ordenar los resultados por numero de empleados/trabajadores descendente de cada empresa o el numero de amigos por persona.
    const consulta_ordenar_descendente = `
        MATCH (p:Persona)-[:TRABAJA_EN]->(e:Empresa) 
        RETURN e.nombre, count(p) AS trabajadores 
        ORDER BY trabajadores DESC
    `;

    // [LOG] CLAVE_BUSQUEDA: neo_limite_resultados_limit
    // Enunciado: Ordenar los resultados por trabajadores descendente and mostrar solo los 3 primeros (LIMIT).
    const consulta_limitar_top = `
        MATCH (p:Persona)-[:TRABAJA_EN]->(e:Empresa) 
        RETURN e.nombre, count(p) AS trabajadores 
        ORDER BY trabajadores DESC 
        LIMIT 3
    `;

    // [LOG] CLAVE_BUSQUEDA: neo_limpieza_duplicados_distinct
    // Enunciado: Modifica la siguiente consulta para devolver solo nombres unicos de personas que trabajan con otras (DISTINCT).
    const consulta_nombres_unicos = `
        MATCH (p:Persona)-[:TRABAJA_CON]->(o:Persona) 
        RETURN DISTINCT p.nombre
    `;

    // [LOG] CLAVE_BUSQUEDA: neo_filtrado_agregaciones_with
    // Enunciado: Modifica la consulta para devolver solo las ciudades con mas de 2 personas (habitantes) usando WITH.
    const consulta_filtrar_ciudades = `
        MATCH (p:Persona)-[:VIVE_EN]->(c:Ciudad) 
        WITH c, count(p) AS habitantes 
        WHERE habitantes > 2 
        RETURN c.nombre, habitantes
    `;

    // [LOG] CLAVE_BUSQUEDA: neo_juntar_patrones_madrid_empresa
    // Enunciado: Contar cuantas Personas que viven en una ciudad concreta (ej. Madrid) trabajan en cada Empresa.
    const consulta_personas_madrid_empresa = `
        MATCH (c:Ciudad {nombre: "Madrid"})<-[:VIVE_EN]-(p:Persona)-[:TRABAJA_EN]->(m:Empresa) 
        RETURN m.nombre AS Empresa, count(p) AS TotalPersonas 
        ORDER BY TotalPersonas DESC
    `;

    // [LOG] CLAVE_BUSQUEDA: neo_todos_nodos_relacion_compleja
    // Enunciado: Encuentra personas que estan conectadas por amistad a alguien que trabaja en TODAS las empresas del dataset.
    const consulta_amigos_trabajadores_totales = `
        MATCH (e:Empresa) 
        WITH count(e) AS totalEmpresas      
        MATCH (empleado:Persona)-[:TRABAJA_EN]->(empresa:Empresa) 
        WITH totalEmpresas, empleado, count(empresa) AS empresasDeEmpleado 
        WHERE empresasDeEmpleado = totalEmpresas 
        MATCH (persona:Persona)-[:AMIGO_DE]-(empleado) 
        RETURN DISTINCT persona.nombre AS Persona, empleado.nombre AS AmigoQueTrabajaEnTodo
    `;

    // [LOG] CLAVE_BUSQUEDA: neo_companeros_misma_ciudad
    // Enunciado: Encontrar personas que viven en la misma ciudad que sus compañeros de trabajo.
    const consulta_companeros_ciudad = `
        MATCH (p1:Persona)-[:TRABAJA_EN]->(e:Empresa)<-[:TRABAJA_EN]-(p2:Persona) 
        MATCH (p1)-[:VIVE_EN]->(c:Ciudad)<-[:VIVE_EN]-(p2) 
        WHERE p1 <> p2 
        RETURN DISTINCT p1.nombre AS Persona, c.nombre AS Ciudad
    `;

    // [LOG] CLAVE_BUSQUEDA: neo_evitar_duplicados_espejos
    // Enunciado: Modifica la consulta para evitar duplicados en pares de personas que viven en la misma ciudad o son amigos (elementId).
    const consulta_evitar_espejos = `
        MATCH (p1:Persona)-[:VIVE_EN]->(c:Ciudad)<-[:VIVE_EN]-(p2:Persona) 
        WHERE elementId(p1) < elementId(p2) 
        RETURN p1.nombre, p2.nombre, c.nombre
    `;

    // [LOG] CLAVE_BUSQUEDA: neo_relaciones_opcionales_optional
    // Enunciado: Modifica la consulta para incluir tambien a aquellas personas que no participan en ningun proyecto (usando OPTIONAL MATCH).
    const consulta_match_opcional = `
        MATCH (p:Persona) 
        OPTIONAL MATCH (p)-[:PARTICIPA_EN]->(pr:Proyecto) 
        RETURN p.nombre, pr.nombre
    `;

    // [LOG] CLAVE_BUSQUEDA: neo_caminos_longitud_variable_intermedios
    // Enunciado: Obtiene los nodos intermedios en los caminos de amistad de longitud exacta hasta 2 saltos.
    const consulta_nodos_intermedios = `
        MATCH (inicio:Persona)-[:AMIGO_DE]-(intermedio:Persona)-[:AMIGO_DE]-(fin:Persona) 
        WHERE elementId(inicio) < elementId(fin) 
        RETURN inicio.nombre AS Alguien, intermedio.nombre AS NodoIntermedio, fin.nombre AS OtroAmigo
    `;

    // [LOG] CLAVE_BUSQUEDA: neo_caza_errores_rapidos
    // Error tipo: MATCH (p:Persona)-[:TRABAJA_EN]->(e)-[:VIVE_EN]->(c) -> Error: Las empresas no viven en ciudades en este dataset.
    const solucion_error_dataset = `
        MATCH (p:Persona)-[:TRABAJA_EN]->(e:Empresa), (p)-[:VIVE_EN]->(c:Ciudad) 
        RETURN p.nombre, e.nombre, c.nombre
    `;

    return true;
}