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

    // [LOG] CLAVE_BUSQUEDA: indice_simple_usuarios_optimizar
    // Enunciado: Pregunta 6 - Crear un indice sobre el campo edad (o precio/categoriaId) en usuarios / productos.
    "optimizacion_indice_unico": {
        "coleccion_objetivo": "usuarios", 
        "comando_ejecutar": 'db.usuarios.createIndex({ edad: 1 })'
    },

    // [LOG] CLAVE_BUSQUEDA: indice_compuesto_usuarios_optimizar
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
    },

    // [LOG] CLAVE_BUSQUEDA: filtro_precio_mayor_que
    // Enunciado: Consultar productos con precio superior a 50.
    "consulta_precio_mayor_que": {
        "comando_ejecutar": 'db.productos.find({ precio: { $gt: 50 } })'
    },

    // [LOG] CLAVE_BUSQUEDA: filtro_precio_menor_que
    // Enunciado: Consultar productos con precio inferior a 100.
    "consulta_precio_menor_que": {
        "comando_ejecutar": 'db.productos.find({ precio: { $lt: 100 } })'
    },

    // [LOG] CLAVE_BUSQUEDA: filtro_multiple_and
    // Enunciado: Consultar productos con precio >= 50 y stock > 0.
    "consulta_filtro_and": {
        "comando_ejecutar": 'db.productos.find({ $and: [ { precio: { $gte: 50 } }, { stock: { $gt: 0 } } ] })'
    },

    // [LOG] CLAVE_BUSQUEDA: ordenar_precio_descendente
    // Enunciado: Ordenar productos por precio descendente.
    "consulta_ordenar_descendente": {
        "comando_ejecutar": 'db.productos.find().sort({ precio: -1 })'
    },

    // [LOG] CLAVE_BUSQUEDA: ordenar_precio_ascendente
    // Enunciado: Ordenar productos por precio ascendente.
    "consulta_ordenar_ascendente": {
        "comando_ejecutar": 'db.productos.find().sort({ precio: 1 })'
    },

    // [LOG] CLAVE_BUSQUEDA: limitar_resultados
    // Enunciado: Mostrar únicamente los 3 primeros documentos.
    "consulta_limitar_resultados": {
        "comando_ejecutar": 'db.productos.find().limit(3)'
    },

    // [LOG] CLAVE_BUSQUEDA: top_tres_productos_mas_caros
    // Enunciado: Obtener los tres productos más caros.
    "consulta_top_tres": {
        "comando_ejecutar": 'db.productos.find().sort({ precio: -1 }).limit(3)'
    },

    // [LOG] CLAVE_BUSQUEDA: contar_documentos
    // Enunciado: Contar usuarios con estado activo.
    "consulta_contar_documentos": {
        "comando_ejecutar": 'db.usuarios.countDocuments({ estado: "activo" })'
    },

    // [LOG] CLAVE_BUSQUEDA: valores_unicos_distinct
    // Enunciado: Obtener valores únicos de categoriaId.
    "consulta_distinct": {
        "comando_ejecutar": 'db.productos.distinct("categoriaId")'
    },

    // [LOG] CLAVE_BUSQUEDA: buscar_un_documento
    // Enunciado: Buscar un único documento.
    "consulta_find_one": {
        "comando_ejecutar": 'db.productos.findOne({ nombre: "Laptop" })'
    },

    // [LOG] CLAVE_BUSQUEDA: actualizar_varios_documentos
    // Enunciado: Actualizar múltiples documentos.
    "consulta_update_many": {
        "comando_ejecutar": 'db.productos.updateMany({ stock: 0 }, { $set: { estado: "agotado" } })'
    },

    // [LOG] CLAVE_BUSQUEDA: eliminar_un_documento
    // Enunciado: Eliminar un único producto.
    "consulta_delete_one": {
        "comando_ejecutar": 'db.productos.deleteOne({ nombre: "Laptop" })'
    },

    // [LOG] CLAVE_BUSQUEDA: agrupacion_calcular_totales_multiplicar
    // Enunciado: Calcular ingresos totales multiplicando dos campos ($multiply) y sumándolos ($sum) por grupo.
    "agregacion_con_multiplicacion": {
        "coleccion_objetivo": "ventas",
        "comando_ejecutar": 'db.ventas.aggregate([ { $group: { _id: "$tiendaId", ingresosTotales: { $sum: { $multiply: [ "$precio", "$cantidad" ] } } } } ])'
    },
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

    // [LOG] CLAVE_BUSQUEDA: neo_caminos_longitud_variable_paths
    // Enunciado: Pregunta 2 - Obtén los nodos intermedios en paths de amistad de longitud variable.
    const consulta_nodos_intermedios_path = `
        MATCH p = (a:Persona)-[:AMIGO_DE*2..]->(b:Persona)
        UNWIND nodes(p)[1..-1] AS nodoIntermedio
        RETURN DISTINCT nodoIntermedio.nombre AS Intermedios
    `;

    // [LOG] CLAVE_BUSQUEDA: neo_filtrado_universidades_estudiantes
    // Enunciado: Pregunta 4 - Encuentra universidades con más de un estudiante.
    const consulta_universidades_mas_un_estudiante = `
        MATCH (p:Persona)-[:ESTUDIO_EN]->(u:Universidad)
        WITH u, count(p) AS total_estudiantes
        WHERE total_estudiantes > 1
        RETURN u.nombre AS Universidad, total_estudiantes
    `;

    // [LOG] CLAVE_BUSQUEDA: neo_conectividad_total_nodos
    // Enunciado: Pregunta 8 - Encuentra personas que están conectadas a todas las demás mediante algún path.
    const consulta_personas_conectadas_a_todo_el_grafo = `
        MATCH (todas:Persona)
        WITH count(todas) AS total_personas
        MATCH (p1:Persona)
        MATCH p = (p1)-[*]->(p2:Persona)
        WHERE p1 <> p2
        WITH p1, total_personas, count(DISTINCT p2) AS alcanzadas
        WHERE alcanzadas = total_personas - 1
        RETURN p1.nombre AS PersonaConectada
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
        MATCH (p:Persona)-[:TRABAJA_EN]->(e:Empresa)
        MATCH (p)-[:VIVE_EN]->(c:Ciudad) 
        RETURN p.nombre, e.nombre, c.nombre
    `;

        // [LOG] CLAVE_BUSQUEDA: neo_filtrar_personas_por_edad
    // Enunciado: Obtener personas mayores de 30 años.
    const consulta_filtrar_personas_por_edad = `
        MATCH (p:Persona) 
        WHERE p.edad > 30 
        RETURN p.nombre, p.edad
    `;

    // [LOG] CLAVE_BUSQUEDA: neo_crear_nuevo_nodo
    // Enunciado: Crear una nueva persona.
    const consulta_crear_nuevo_nodo = `
        CREATE (p:Persona {id:6, nombre:"Pedro", edad:25})
    `;

    // [LOG] CLAVE_BUSQUEDA: neo_crear_nueva_relacion
    // Enunciado: Crear una relación AMIGO_DE entre Ana y Luis.
    const consulta_crear_nueva_relacion = `
        MATCH (p1:Persona {nombre:"Ana"}), (p2:Persona {nombre:"Luis"}) 
        CREATE (p1)-[:AMIGO_DE]->(p2)
    `;

    // [LOG] CLAVE_BUSQUEDA: neo_crear_si_no_existe_nodo
    // Enunciado: Crear ciudad solo si no existe.
    const consulta_merge_nodo = `
        MERGE (c:Ciudad {nombre:"Valencia"}) 
        RETURN c
    `;

    // [LOG] CLAVE_BUSQUEDA: neo_crear_si_no_existe_relacion
    // Enunciado: Crear relación solo si no existe.
    const consulta_merge_relacion = `
        MATCH (p:Persona {nombre:"Ana"})
        MERGE (c:Ciudad {nombre:"Valencia"})
        MERGE (p)-[:VIVE_EN]->(c)
    `;

    // [LOG] CLAVE_BUSQUEDA: neo_actualizar_propiedad_nodo
    // Enunciado: Actualizar edad de Ana.
    const consulta_actualizar_propiedad_nodo = `
        MATCH (p:Persona {nombre:"Ana"}) 
        SET p.edad = 31 
        RETURN p
    `;

    // [LOG] CLAVE_BUSQUEDA: neo_eliminar_propiedad_nodo
    // Enunciado: Eliminar una propiedad de los nodos.
    const consulta_eliminar_propiedad_nodo = `
        MATCH (p:Persona) 
        REMOVE p.salario
    `;

    // [LOG] CLAVE_BUSQUEDA: neo_eliminar_relacion
    // Enunciado: Eliminar relaciones de amistad.
    const consulta_eliminar_relacion = `
        MATCH (p1:Persona)-[r:AMIGO_DE]->(p2:Persona) 
        DELETE r
    `;

    // [LOG] CLAVE_BUSQUEDA: neo_eliminar_nodo_y_relaciones
    // Enunciado: Eliminar nodo y todas sus relaciones.
    const consulta_eliminar_nodo_y_relaciones = `
        MATCH (p:Persona {nombre:"Pedro"}) 
        DETACH DELETE p
    `;

    // [LOG] CLAVE_BUSQUEDA: neo_caminos_longitud_variable
    // Enunciado: Obtener caminos de amistad entre 1 y 3 saltos.
    const consulta_caminos_longitud_variable = `
        MATCH p=(a:Persona)-[:AMIGO_DE*1..3]->(b:Persona) 
        RETURN p
    `;

    // [LOG] CLAVE_BUSQUEDA: neo_mostrar_propiedades_relacion
    // Enunciado: Mostrar propiedades de las relaciones de amistad.
    const consulta_mostrar_propiedades_relacion = `
        MATCH (p1)-[r:AMIGO_DE]->(p2) 
        RETURN p1.nombre, p2.nombre, r.intensidad, r.since
    `;

    // [LOG] CLAVE_BUSQUEDA: neo_agrupar_con_collect_dinamico
    // Enunciado: Agrupar habitantes por ciudad.
    const consulta_agrupar_con_collect = `
        MATCH (p:Persona)-[:VIVE_EN]->(c:Ciudad) 
        RETURN c.nombre, collect(p.nombre) AS habitantes
    `;

    // [LOG] CLAVE_BUSQUEDA: neo_comprobar_valores_no_nulos
    // Enunciado: Obtener personas con edad definida.
    const consulta_comprobar_valores_no_nulos = `
        MATCH (p:Persona) 
        WHERE p.edad IS NOT NULL 
        RETURN p
    `;

    // [LOG] CLAVE_BUSQUEDA: neo_path_extraer_relaciones
    // Enunciado: Obtener todos los objetos relación de un camino usando la función nativa 'relationships'.
    const consulta_extraer_relaciones_path = `
        MATCH p = (s:Servidor)-[:CONECTADO_A*3]->(d:Dispositivo)
        RETURN relationships(p) AS enlaces_auditados
    `;

    // [LOG] CLAVE_BUSQUEDA: neo_mutar_propiedades_relacion_set
    // Enunciado: Modificar o añadir una propiedad a una relación capturando su variable en el patrón.
    const consulta_modificar_propiedad_relacion = `
        MATCH (p:Persona)-[r:PARTICIPA_EN]->(pr:Proyecto {nombre: "Alfa"})
        SET r.rol = "Senior"
        RETURN r
    `;

    return true;
}