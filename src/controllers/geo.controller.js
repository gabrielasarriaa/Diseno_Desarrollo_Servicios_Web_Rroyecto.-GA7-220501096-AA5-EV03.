/**
 * =============================================================================
 *  geo.controller.js — Servicio de Georreferenciación
 * =============================================================================
 *  Traza al campo "Ruta / Dirección" de la clase OrdenTrabajo (Diagrama de
 *  Clases, GA4-220501095-AA2-EV04) y a la Evidencia GA7-220501096-AA5-EV01
 *  (Diseño y desarrollo de servicios web), que originalmente cubrió
 *  registro/login. Este archivo agrega un SEGUNDO servicio web al mismo
 *  proyecto: la geocodificación de direcciones para ubicar en un mapa las
 *  órdenes de trabajo (útil para el técnico asignado y el seguimiento en
 *  campo).
 *
 *  Se utiliza Nominatim (motor de búsqueda de OpenStreetMap), un servicio
 *  público y gratuito que NO requiere API key. Nominatim exige que cada
 *  aplicación envíe un encabezado "User-Agent" identificándose — por eso
 *  se define USER_AGENT más abajo, con el nombre real del proyecto.
 * =============================================================================
 */

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
const USER_AGENT = 'CoVigilant-GEA-SolucionesIT/1.0 (proyecto academico SENA ADSO)';

/**
 * GET /api/geocodificar?direccion=Calle+10+%2312-45,+Bogota
 * Convierte una direccion de texto en coordenadas (latitud/longitud).
 *
 * Query esperado: ?direccion=<texto de la direccion>
 *
 * Respuestas:
 *  - 200 OK -> { exito: true, resultado: { lat, lon, direccionEncontrada } }
 *  - 400 Bad Request -> falta el parametro "direccion"
 *  - 404 Not Found -> Nominatim no encontro coincidencias para esa direccion
 *  - 502 Bad Gateway -> error de comunicacion con el servicio externo
 */
async function geocodificar(req, res) {
  const { direccion } = req.query;

  // 1. Validacion del parametro obligatorio
  if (!direccion || !direccion.trim()) {
    return res.status(400).json({
      exito: false,
      mensaje: 'Debe indicar el parametro "direccion" a geocodificar.'
    });
  }

  try {
    // 2. Se arma la URL de consulta a Nominatim. "limit=1" pide solo el
    //    resultado mas relevante; "format=json" pide la respuesta en JSON.
    const url = `${NOMINATIM_URL}?format=json&limit=1&q=${encodeURIComponent(direccion)}`;

    // 3. Se llama al servicio externo. El User-Agent es obligatorio segun
    //    la politica de uso de Nominatim; sin el, la peticion es rechazada.
    const respuestaExterna = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT }
    });

    if (!respuestaExterna.ok) {
      throw new Error(`Nominatim respondio con estado ${respuestaExterna.status}`);
    }

    const resultados = await respuestaExterna.json();

    // 4. Si no hay coincidencias, se informa con 404 en vez de un array vacio
    if (!resultados || resultados.length === 0) {
      return res.status(404).json({
        exito: false,
        mensaje: 'No se encontraron coordenadas para esa direccion.'
      });
    }

    const primerResultado = resultados[0];

    return res.status(200).json({
      exito: true,
      resultado: {
        lat: parseFloat(primerResultado.lat),
        lon: parseFloat(primerResultado.lon),
        direccionEncontrada: primerResultado.display_name
      }
    });
  } catch (error) {
    // 5. Error de red o del servicio externo: no se cae el servidor,
    //    se responde con un mensaje claro.
    console.error('Error al consultar el servicio de geocodificacion:', error.message);
    return res.status(502).json({
      exito: false,
      mensaje: 'No se pudo consultar el servicio de georreferenciacion en este momento.'
    });
  }
}

module.exports = {
  geocodificar
};
