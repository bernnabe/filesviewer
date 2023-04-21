## API de Manejo de Archivos
Esta API implementa la lógica para obtener datos de archivos y su contenido a través de una API externa utilizando HystrixJS para implementar patrones de circuit breaker. La API utiliza Axios para realizar peticiones HTTP y HystrixJS para implementar la lógica de circuit breaker.

## Instalación
Para utilizar esta API, se deben seguir los siguientes pasos:

Clonar el repositorio desde GitHub: git clone https://github.com/bernnabe/filesviewer.git
Navegar a la carpeta del proyecto: cd filesviewer/challenge-api
Instalar las dependencias: npm install

## Configuración del Circuit Breaker
El circuito breaker se configura utilizando el objeto commandConfig, que contiene los siguientes parámetros:

circuitBreakerRequestVolumeThreshold: Número mínimo de solicitudes en un intervalo de tiempo para activar el circuito breaker (por defecto: 5).
circuitBreakerSleepWindowInMilliseconds: Tiempo en milisegundos para que el circuito breaker permanezca en estado abierto antes de intentar nuevas solicitudes (por defecto: 5000 ms).
circuitBreakerErrorThresholdPercentage: Porcentaje mínimo de errores en las solicitudes para activar el circuito breaker (por defecto: 50%).
circuitBreakerForceClosed: Indicador para forzar el circuito breaker en estado cerrado, ignorando las condiciones de activación (por defecto: falso).
circuitBreakerTimeoutInMilliseconds: Tiempo en milisegundos para establecer el tiempo de espera máximo de una solicitud antes de que se considere como fallida (por defecto: 1000 ms).
statisticalWindowNumberOfBuckets: Número de intervalos de tiempo para mantener estadísticas de circuit breaker (por defecto: 10).
statisticalWindowLengthInMilliseconds: Longitud en milisegundos de cada intervalo de tiempo para mantener estadísticas de circuit breaker (por defecto: 1000 ms).
percentileWindowNumberOfBuckets: Número de intervalos de tiempo para calcular percentiles de circuit breaker (por defecto: 6).
percentileWindowLengthInMilliseconds: Longitud en milisegundos de cada intervalo de tiempo para calcular percentiles de circuit breaker (por defecto: 5000 ms).

Estos parámetros se utilizan para configurar los comandos de HystrixJS que se utilizan en la API para implementar el circuito breaker.

## Endpoints
GET /files
Este endpoint obtiene la lista de archivos disponibles. Utiliza el circuito breaker configurado con el nombre de comando fetchFiles.

GET /files/:fileName?
Este endpoint obtiene los datos de un archivo y su contenido en formato normalizado en JSON. El parámetro fileName es opcional y permite especificar el nombre de un archivo en particular. Si no se proporciona, se obtendrán los datos de todos los archivos disponibles. Utiliza el circuito breaker configurado con el nombre de comando getFilesData.

## Uso
Iniciar el servidor: node app.js
Realizar solicitudes a los endpoints utilizando un cliente HTTP o un navegador web.
Los comandos de HystrixJS se encargarán de manejar los errores y la lógica del circuito breaker automáticamente, protegiendo la aplicación de posibles fallos en la API externa.
