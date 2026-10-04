# Project Context

## Project
Tarea 17 - Frontend E-commerce.

## Backend
Ubicación:
`tarea12/`

## Frontend
Ubicación:
`tarea17/`

## Tech Stack
- Next.js 16+
- App Router
- TypeScript
- Tailwind CSS
- Server Actions
- Laravel API REST (JWT)

## API Endpoints
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `POST /api/auth/refresh`
- `GET /api/products`
- `GET /api/products/{product}`
- `GET /api/orders`
- `POST /api/orders`
- `GET /api/orders/{order}`
- `POST /api/orders/{order}/cancel`
- `POST /api/orders/{order}/pay`

## Authentication
El backend devuelve un JWT emitido por Laravel. El frontend guarda el token en una cookie `access_token` con `HttpOnly` para evitar exposición en localStorage/sessionStorage.

## API Contract
- Los productos devuelven una estructura paginada con `data`.
- El registro y login devuelven `access_token`, `token_type`, `expires_in` y `user`.
- La creación de pedidos acepta items con `product_id` y `quantity` únicamente.
- Los precios y el cálculo del total se realizan en el backend.
- La moneda del catálogo y las nuevas órdenes es USD (`STRIPE_CURRENCY=usd`); el historial respeta el código de moneda persistido en cada orden.

## Architecture
- App Router + Server Components para las pantallas de lectura.
- Server Actions para login, registro y creación de pedidos.
- Estado local del carrito persistido en localStorage.
- Middleware para proteger `/checkout` y `/historial`.
- Después de crear la orden, el checkout abre el pago asociado en una ruta privada.

## Implemented Features
- Catálogo de 20 productos temáticos de hardware y tecnología con precios en dólares.
- Catálogo público de productos.
- Página de detalle de producto.
- Registro y login con cookies HTTP-only.
- Carrito local con total y cantidad.
- Checkout protegido con creación de pedido real hacia Laravel.
- Stripe Payment Element para pagos reales y confirmación fake de desarrollo a través de Laravel.
- Página de retorno de Stripe que sincroniza el PaymentIntent con Laravel.
- Historial de órdenes autenticado.

## Security Decisions
- No se guarda el JWT en localStorage o sessionStorage.
- Las rutas privadas se verifican con cookie y middleware.
- Los tokens se envían como Bearer desde servidor a la API.

## Performance Decisions
- Las páginas principales usan `cache: "no-store"` para reflejar cambios reales del backend.
- Solo se cargan datos cuando es necesario; el catálogo y detalles son renderizados dinámicamente.

## Cache and Revalidation
- Se evita caché agresiva en endpoints con autenticación y pedidos.
- El carrito se mantiene en cliente para mejorar la experiencia sin depender del servidor.

## Problems Found
- La API de Laravel exige JWT y no permite enviar precios desde el cliente.
- El proyecto frontend no existía y había que inicializarlo desde cero.

## Solutions
- Se construyó un frontend Next.js con integración real a la API Laravel existente.
- Se implementó un flujo de autenticación seguro mediante cookies y server actions.
- Se protegen rutas privadas y se evita el almacenamiento del token en cliente.

## Validation
- `npm run lint`: correcto.
- `npm run build`: correcto.
- `php artisan test` en `tarea12`, con `DB_CONNECTION=sqlite` y `DB_DATABASE=:memory:`: 10 pruebas aprobadas (23 assertions), sin tocar la base real.
- El entorno PHPUnit usa SQLite en memoria por defecto para impedir que pruebas `RefreshDatabase` borren o modifiquen datos de MySQL local.
- `TechnologyProductSeeder` cargado en la base local y verificado por API: 20 productos activos. Repetible y conserva el stock existente.
- Verificado `config('services.stripe.currency') === 'usd'` para nuevas órdenes.
- En la última inspección de la base local había 0 usuarios y 0 órdenes; hay que registrar una cuenta por `/register` para probar compras.
- `npm run lint` y `npm run build` correctos después del cambio a USD.
- Verificado manualmente en navegador: catálogo, detalle, producto inexistente (404), carrito, cantidades, registro (pantalla), login correcto e incorrecto, historial y protección de `/checkout` y `/historial`.
- API activa en `http://127.0.0.1:8000`; `GET /api/products` responde 200 con productos.
- Se corrigió un mismatch de hidratación al restaurar el carrito del almacenamiento local. La recarga ya no produce errores de consola.
- Se conectó el modo fake de desarrollo a `POST /api/orders/{order}/pay` con `confirm: true`.
- El modo Stripe real usa `@stripe/react-stripe-js` y `confirmPayment`, y sincroniza el pago con Laravel al volver del redirect.
- Las Server Actions validan datos de carrito y respuestas de la API antes de continuar.
- El formulario de registro envía `password_confirmation`, requerido por Laravel.
- Confirmada una compra end-to-end en MySQL/XAMPP con el driver fake: order 6 pagada por $449.99 USD, item NovaTab 11 Pro × 1; stock se redujo de 12 a 11.
- La confirmación fake del backend ya no depende del estado estático en memoria del PaymentIntent entre peticiones HTTP; el endpoint valida la orden del usuario autenticado y persiste el estado pagado.
- Validación final del flujo de código: `npm run lint`, `npm run build` y `php artisan test` pasan; el dev server Next.js reiniciado carga `.env.local`.
- `php artisan test`: 11 pruebas y 29 aserciones correctas usando SQLite en memoria.

## Pending
- Para pagos reales, configurar `STRIPE_DRIVER=stripe`, las claves secretas/webhook en Laravel y `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` en el frontend.
- La base local contiene la cuenta `cliente-prueba-20261004@example.test` y el pedido #6 de prueba, marcado como pagado por el modo fake. No contiene un cargo real de Stripe.

## Next Steps
- Probar una compra con las claves de Stripe en modo test una vez configuradas.
- Añadir validaciones visuales de formulario y UX de carga.
