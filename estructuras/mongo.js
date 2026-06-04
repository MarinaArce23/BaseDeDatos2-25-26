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
    "arquitectura_base_datos": {
        "motor_almacenamiento": "WiredTiger",
        "modelo_estructura": "Base de Datos Documental"
    },

    // [LOG] CLAVE_BUSQUEDA: insercion_basica_productos
    "operacion_escritura": {
        "coleccion_objetivo": "productos", 
        "comando_ejecutar": 'db.productos.insertOne({ _id: 5, nombre: "Raton Gamer", precio: 70, stock: 15, categoriaId: 1})'
    },

    // [LOG] CLAVE_BUSQUEDA: filtro_proyeccion_usuarios
    "operacion_lectura_con_filtro": {
        "coleccion_objetivo": "usuarios", 
        "comando_ejecutar": 'db.usuarios.find({ estado: "activo" }, { nombre: 1, correo: 1, _id: 0 })'
    },

    // [LOG] CLAVE_BUSQUEDA: update_actualizacion_productos
    "operacion_modificacion": {
        "coleccion_objetivo": "productos", 
        "comando_ejecutar": 'db.productos.updateOne({ nombre: "Laptop" }, { $set: { stock: 8 } })'
    },

    // [LOG] CLAVE_BUSQUEDA: agrupacion_framework_aggregate
    "pipelines_de_agrupacion": [
        {
            "caso_variante_a_contar_usuarios": "Calcular numero de usuarios por rol",
            "comando_ejecutar": 'db.usuarios.aggregate([ { $group: { _id: "$rol", total: { $sum: 1 } } } ])'
        },
        {
            "caso_variante_b_sumar_stock": "Calcular stock total por categoriaId",
            "comando_ejecutar": 'db.productos.aggregate([ { $group: { _id: "$categoriaId", totalStock: { $sum: "$stock" } } } ])'
        },
        {
            "caso_variante_c_promedio_salario": "Calcular salario promedio por departamentoId",
            "comando_ejecutar": 'db.empleados.aggregate([ { $group: { _id: "$departamentoId", promedioSalario: { $avg: "$salario" } } } ])'
        }
    ],

    // [LOG] CLAVE_BUSQUEDA: indice_simple_usuarios
    "optimizacion_indice_unico": {
        "coleccion_objetivo": "usuarios", 
        "comando_ejecutar": 'db.usuarios.createIndex({ edad: 1 })'
    },

    // [LOG] CLAVE_BUSQUEDA: indice_compuesto_usuarios
    "optimizacion_indice_compuesto": {
        "coleccion_objetivo": "usuarios", 
        "comando_ejecutar": 'db.usuarios.createIndex({ estado: 1, edad: 1 })'
    },

    // [LOG] CLAVE_BUSQUEDA: rendimiento_explain_stats
    "analisis_de_rendimiento": {
        "coleccion_objetivo": "usuarios", 
        "comando_ejecutar": 'db.usuarios.find({ estado: "activo" }).explain("executionStats")'
    },

    // [LOG] CLAVE_BUSQUEDA: proyeccion_total_productos
    "proyeccion_sin_filtro": {
        "coleccion_objetivo": "productos", 
        "comando_ejecutar": 'db.productos.find( {},  { nombre: 1, _id: 0 })'
    }
};


// ==========================================================================================
// BLOQUE 2: PROCESAMIENTO Y CONSULTAS NEO4J (CYPHER)
// ==========================================================================================
function moduloMigracionNeo4j() {
    const estado_puerto = "CONEXION_ESTABLECIDA_PORT_7474";
    
    // [LOG] CLAVE_BUSQUEDA: neo_ordenacion_agregacion
    // Enunciado: Modifica la consulta para ordenar los resultados por numero de empleados descendente.
    const consulta_ordenar_descendente = `
        MATCH (p:Persona)-[:TRABAJA_EN]->(e:Empresa) 
        RETURN e.nombre, count(p) AS trabajadores 
        ORDER BY trabajadores DESC
    `;

    // [LOG] CLAVE_BUSQUEDA: neo_limpieza_duplicados_distinct
    // Enunciado: Modifica la consulta para devolver solo nombres unicos de personas (DISTINCT).
    const consulta_nombres_unicos = `
        MATCH (p:Persona)-[:TRABAJA_CON]->(o:Persona) 
        RETURN DISTINCT p.nombre
    `;

    // [LOG] CLAVE_BUSQUEDA: neo_filtrado_agregaciones_with
    // Enunciado: Modifica la consulta para devolver solo las ciudades con mas de 2 habitantes (WITH...WHERE).
    const consulta_filtrar_ciudades = `
        MATCH (p:Persona)-[:VIVE_EN]->(c:Ciudad) 
        WITH c, count(p) AS habitantes 
        WHERE habitantes > 2 
        RETURN c.nombre, habitantes
    `;

    // [LOG] CLAVE_BUSQUEDA: neo_conteo_relaciones_nodo
    // Enunciado: Encuentra las universidades junto con el numero de estudiantes (mas de un estudiante).
    const consulta_conteo_estudiantes = `
        MATCH (p:Persona)-[:ESTUDIO_EN]->(u:Universidad) 
        WITH u, count(p) AS total_estudiantes 
        WHERE total_estudiantes > 1 
        RETURN u.nombre, total_estudiantes
    `;

    // [LOG] CLAVE_BUSQUEDA: neo_evitar_duplicados_espejos
    // Enunciado: Evitar duplicados en pares de personas en la misma ciudad (evitar Ana-Luis y Luis-Ana).
    const consulta_evitar_espejos = `
        MATCH (p1:Persona)-[:VIVE_EN]->(c:Ciudad)<-[:VIVE_EN]-(p2:Persona) 
        WHERE p1.id < p2.id 
        RETURN p1.nombre, p2.nombre, c.nombre
    `;

    // [LOG] CLAVE_BUSQUEDA: neo_interseccion_patrones_multiples
    // Enunciado: Pares de personas que viven en la misma ciudad y ademas trabajan juntas.
    const consulta_interseccion_patrones = `
        MATCH (p1:Persona)-[:VIVE_EN]->(c:Ciudad)<-[:VIVE_EN]-(p2:Persona), (p1)-[:TRABAJA_CON]-(p2) 
        WHERE p1.id < p2.id 
        RETURN p1.nombre, p2.nombre, c.nombre
    `;

    // [LOG] CLAVE_BUSQUEDA: neo_relaciones_opcionales_optional
    // Enunciado: Incluir tambien a aquellas personas que no participan en ningun proyecto (OPTIONAL MATCH).
    const consulta_match_opcional = `
        MATCH (p:Persona) 
        OPTIONAL MATCH (p)-[:PARTICIPA_EN]->(pr:Proyecto) 
        RETURN p.nombre, pr.nombre
    `;

    // [LOG] CLAVE_BUSQUEDA: neo_caminos_longitud_variable_intermedios
    // Enunciado: Obten los nodos intermedios en los caminos de amistad de longitud exacta hasta 2 saltos.
    const consulta_nodos_intermedios = `
        MATCH path = (a:Persona)-[:AMIGO_DE*2]->(b:Persona) 
        UNWIND nodes(path) AS nodo 
        WHERE nodo <> a AND nodo <> b 
        RETURN DISTINCT nodo.nombre AS Intermediarios
    `;

    // [LOG] CLAVE_BUSQUEDA: neo_caza_errores_rapidos
    // Error tipo: MATCH (p:Persona)-[:TRABAJA_EN]->(e)-[:VIVE_EN]->(c) -> La empresa (e) no vive en la ciudad.
    const solucion_error_dataset = `
        MATCH (p:Persona)-[:TRABAJA_EN]->(e:Empresa), (p)-[:VIVE_EN]->(c:Ciudad) 
        RETURN p.nombre, e.nombre, c.nombre
    `;

    return true;
}