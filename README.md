# CoVigilant — Proyecto Integrado (Front-end + Servicio de Autenticación)

Este proyecto une dos evidencias en un solo sistema ejecutable:

- **GA7-220501096-AA4-EV03** — Front-end del sitio CoVigilant (módulo de
  Órdenes de Trabajo), servido ahora desde la carpeta `public/`.
- **GA7-220501096-AA5-EV01** — Servicio web (API) de registro e inicio de
  sesión, en `src/`.

El formulario de login del sitio ya **no simula** el acceso comprobando el
dominio del correo: ahora llama de verdad al servicio `POST /api/login`.

## Estructura

```
covigilant-fullstack/
├── server.js              # Un solo servidor Express: sirve el sitio Y la API
├── package.json
├── public/                 # FRONT-END (antes GABRIELA_SARRIA_AA4_EV03)
│   ├── index.html
│   ├── style.css
│   ├── script.js           # handleLogin() ahora llama a /api/login
│   └── img/
└── src/                     # BACKEND (antes covigilant-auth-api)
    ├── routes/auth.routes.js
    ├── controllers/auth.controller.js
    ├── models/usuario.model.js
    └── data/usuarios.json   # "base de datos" en archivo, con 1 usuario demo
```

## Cómo ejecutar

```bash
npm install
npm start
```

Abre `http://localhost:3000` en el navegador: verás el sitio de CoVigilant.
Al ir a la pantalla de Login, usa la cuenta de prueba ya registrada:

- **Usuario:** `covigilant@soy.sena.edu.co`
- **Contraseña:** `123456789`

Si el usuario o la contraseña no coinciden con lo guardado en
`src/data/usuarios.json`, el formulario mostrará el mensaje de error que
devuelve el servicio (`"Error en la autenticacion: ..."`).

## Cómo registrar un nuevo usuario

Por ahora el sitio no tiene un formulario visual de registro (esa evidencia
solo pedía el servicio web, no la interfaz). Para crear más usuarios de
prueba, usa curl o Postman:

```bash
curl -X POST http://localhost:3000/api/registro \
  -H "Content-Type: application/json" \
  -d "{\"usuario\":\"nuevo@correo.com\",\"contrasena\":\"clave123\"}"
```

## Qué cambió respecto a las versiones anteriores

| Antes | Ahora |
|---|---|
| `handleLogin()` solo verificaba el dominio del correo (`@sena.edu.co`) | `handleLogin()` hace `fetch('/api/login', ...)` contra el servicio real |
| Sin backend | Backend Node/Express con registro y login, contraseñas cifradas con bcrypt |
| Dos proyectos separados | Un solo servidor sirve el sitio (`public/`) y la API (`/api`) |
