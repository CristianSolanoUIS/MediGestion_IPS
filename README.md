# MediGestión IPS – Frontend

Frontend de MediGestión IPS modernizado con [Vite](https://vitejs.dev/), React 19 y TypeScript.

## Requisitos
- Node.js 18 LTS o superior
- npm 9+

## Scripts disponibles
- `npm run dev`: levanta el servidor de desarrollo en `http://localhost:5173` (usa `--host` si necesitas exponerlo).
- `npm run build`: chequea tipos y genera la carpeta `dist/` lista para producción.
- `npm run preview`: sirve el build generado para validarlo localmente.
- `npm test`: ejecuta Vitest en modo watch.
- `npm run test:run`: ejecuta Vitest una sola vez (útil para CI).

## Variables de entorno
Coloca configuraciones en un archivo `.env` en la raíz. Para apuntar al backend expón, por ejemplo:

```
VITE_API_BASE_URL=http://localhost:4000
```

Dentro del código puedes leerla con `import.meta.env.VITE_API_BASE_URL`.

## Integración con APIs
- `src/config/env.ts` expone la URL base leída desde las variables de entorno.
- `src/services/httpClient.ts` centraliza las peticiones `fetch` (maneja headers, parseo de JSON y errores HTTP) y adjunta el token Bearer cuando está disponible.
- `src/services/authService.ts` contiene las llamadas específicas de autenticación (`/auth/login`, `/auth/profile`).
- `src/services/authStorage.ts` encapsula la persistencia de token, usuario, roles y rol seleccionado en `localStorage`.
- Tras autenticarse, `src/Login.tsx` guarda token/perfil y redirige según roles; si hay varias opciones, envía al selector `src/pages/RoleSelection.tsx` para persistir la elección y continuar.

## Estructura
- `src/` contiene componentes, páginas y estilos.
- `public/` mantiene assets estáticos (manifiesto, iconos, etc.).
- `index.html` en la raíz es la plantilla principal que carga `src/index.tsx`.
- Puedes importar desde cualquier ruta usando `@/` como alias de `src/`.
- Pantallas destacadas: `src/Login.tsx` integra la autenticación contra el backend y `src/pages/RoleSelection.tsx` se muestra post-login para elegir la vista según el rol asignado.

## Próximos pasos sugeridos
- Centralizar las llamadas HTTP en `src/services/` utilizando `fetch` o `axios`.
- Agregar manejo de estado/autenticación antes de integrar el backend.
- Configurar rutas protegidas y roles si aplica.

## Testing
Vitest está configurado con `jsdom` y `@testing-library`. Coloca los archivos de prueba junto a los componentes con sufijo `.test.tsx` o `.test.ts`.
