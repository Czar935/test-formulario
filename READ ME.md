# Formulario de direcciones

## Tecnologias usadas

- React (frontend)
- Java (backend)

## Requisitos previos

Tener instalados:

- Java 17+
- Maven
- Tomcat 10+
- Node.js 18+ y npm configurado (si no mal recuerdo, se configura una variable de entorno)
- PostgreSQL 15+ (puede ser otro gestor pero se tendria que modificar el driver para la conexion a la db)

Recomiendo usar los IDEs que use (IntelliJ y VS code) para el despliegue de la app.

## Configuracion de la base de datos

1. Crear la base de datos con el nombre `catalogos`.
2. Usar el archivo `catalogos_mx.sql` para crear y rellenar las tablas. Le agregue un script que crea una tabla adicional llamada `direccion` donde se capturan los datos del formulario.

Adjunto el script de la tabla por si se quiere usar aparte:

`CREATE TABLE direccion (  
cp VARCHAR(10) NOT NULL,  
estado VARCHAR(100) NOT NULL,  
municipio VARCHAR(100) NOT NULL,  
localidad VARCHAR(100) NOT NULL,  
colonia VARCHAR(100) NOT NULL,  
calle_numero VARCHAR(200) NOT NULL  
);`

3. El `DatabaseConnection.java` viene configurado de la siguiente forma:

`private static final String DB_URL = "jdbc:postgresql://localhost:5432/catalogos";`  
`private static final String DB_USER = "postgres";`  
`private static final String DB_PASSWORD = "Sql.p0st.935";`

(Ajustar los datos conforme a su setup local)

## Despliegue frontend

1. Abrir `frontend` en VS code.
2. Correr en terminal:

- npm install
- npm run dev

## Despliegue backend

1. Abrir `backend` en IntelliJ.
2. Compilar con: `mvn clean package`.
3. Configurar Tomcat para el proyecto.
4. Ejecutar.

## **Importante**

Por default vite levanta la app en http://localhost:5173 si fuera diferente se necesitaria cambiar el puerto en el header del archivo `CorsFilter.java`.

`response.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");`

Tambien en el archivo `vite.config.js` configure un proxy, en mi pc el puerto 8080 (donde Tomcat normalmente esta) estaba ocupado por otra app entonces configure mi Tomcat al puerto 8081:

`target: "http://localhost:8081/direccion"`

Si usas el 8080, lo colocas en este archivo en la parte de `target` o configuras Tomcat al 8081. Lo importante es que coincida para que la app funcione de forma apropiada.
