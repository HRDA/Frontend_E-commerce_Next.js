# Tarea 17 - Frontend e-commerce con Laravel API

Frontend de e-commerce construido con Next.js 16 + App Router para consumir la API REST desarrollada en `tarea12`.

## Requisitos

- Node.js 20+
- Laravel API ejecutándose y accesible desde el navegador/servidor Next.js
- MySQL configurado para la API

## Configuración

Copia `.env.example` a `.env.local` y ajusta la URL base de la API:

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api
NEXT_PUBLIC_STRIPE_MODE=fake
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

`NEXT_PUBLIC_API_BASE_URL` apunta al prefijo `/api` de Laravel. Para Stripe real, establece `NEXT_PUBLIC_STRIPE_MODE=stripe` y la clave publicable correspondiente. Nunca pongas claves secretas de Stripe en el frontend.

El catálogo y los precios se presentan en dólares estadounidenses (USD). Laravel también debe tener `STRIPE_CURRENCY=usd` para crear órdenes y PaymentIntents con la misma moneda.

Si la base de datos no tiene usuarios, crea una cuenta desde `/register` antes de acceder al checkout. Para cargar el catálogo temático de hardware, desde el proyecto de la API ejecuta:

```bash
php artisan db:seed --class=TechnologyProductSeeder
```

Este seeder es repetible y no borra productos, pedidos ni usuarios; al repetirlo actualiza los detalles y precios del catálogo temático, conservando el stock disponible existente.

## Instalación y ejecución

En una terminal, inicia Laravel desde el directorio de la API:

```bash
php artisan serve --host=127.0.0.1 --port=8000
```

En otra terminal, desde este directorio:

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). Si la API usa otro host o puerto, actualiza `NEXT_PUBLIC_API_BASE_URL` y reinicia Next.js.

## Rutas implementadas

| Ruta | Acceso | Descripción |
| --- | --- | --- |
| `/` | Público | Catálogo de productos |
| `/products/[id]` | Público | Detalle del producto |
| `/login` | Público | Inicio de sesión |
| `/register` | Público | Registro |
| `/checkout` | Autenticado | Carrito y creación del pedido |
| `/checkout/payment/[id]` | Autenticado | Pago del pedido |
| `/checkout/confirmation` | Autenticado | Resultado/confirmación de la compra |
| `/historial` | Autenticado | Historial de pedidos |

La sesión JWT se conserva en una cookie `HttpOnly`. El cliente no envía precios al crear una orden; Laravel calcula el total desde los productos y cantidades recibidos.

### Endpoints de Laravel documentados en Swagger y consumidos por el frontend

- `POST /api/auth/register` y `POST /api/auth/login`: registro e inicio de sesión.
- `GET /api/products` y `GET /api/products/{product}`: catálogo y detalle.
- `GET /api/orders`, `POST /api/orders` y `GET /api/orders/{order}`: historial y ciclo de vida de la orden.
- `POST /api/orders/{order}/pay`: confirmación del pago.

## Pagos de prueba y Stripe

Para probar localmente, deja `STRIPE_DRIVER=fake` en Laravel y `NEXT_PUBLIC_STRIPE_MODE=fake` en `.env.local`. El checkout usa el endpoint de confirmación de Laravel con el driver fake; **no se realiza ningún cargo real**.

Para Stripe real:

1. Configura en Laravel `STRIPE_DRIVER=stripe`, `STRIPE_SECRET` y `STRIPE_WEBHOOK_SECRET`.
2. Configura en el frontend `NEXT_PUBLIC_STRIPE_MODE=stripe` y `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` con la clave publicable.
3. Reinicia ambos servidores para que carguen las variables.

La API de Laravel debe estar levantada y conectada a la base de datos en ambos modos.

## Evidencias de funcionamiento

Las capturas del flujo de compra y de la documentación Swagger están en [`capturas/`](./capturas/):

| Evidencia | Captura |
| --- | --- |
| Catálogo de hardware y tecnología | [01-catalogo.png](./capturas/01-catalogo.png) |
| Detalle de producto | [02-detalle-producto.png](./capturas/02-detalle-producto.png) |
| Inicio de sesión | [03-inicio-sesion.png](./capturas/03-inicio-sesion.png) |
| Registro | [04-registro.png](./capturas/04-registro.png) |
| Carrito y checkout | [05-carrito-checkout.png](./capturas/05-carrito-checkout.png) |
| Pago confirmado | [06-pago-confirmado.png](./capturas/06-pago-confirmado.png) |
| Historial de pedidos | [07-historial-orden.png](./capturas/07-historial-orden.png) |
| Swagger: resumen de endpoints | [08-swagger-resumen.png](./capturas/08-swagger-resumen.png) |
| Swagger: órdenes y pagos | [09-swagger-ordenes-pagos.png](./capturas/09-swagger-ordenes-pagos.png) |
| Swagger: contrato de creación de orden | [10-swagger-crear-orden-contrato.png](./capturas/10-swagger-crear-orden-contrato.png) |
| Swagger: endpoints de productos | [11-swagger-endpoints-productos.png](./capturas/11-swagger-endpoints-productos.png) |
| Swagger: endpoints de autenticación | [12-swagger-autenticacion.png](./capturas/12-swagger-autenticacion.png) |

El reporte de rendimiento Lighthouse generado contra la ejecución local está disponible en [HTML](./capturas/lighthouse/reporte.report.html) y [JSON](./capturas/lighthouse/reporte.report.json). Los resultados corresponden a un entorno de desarrollo local; pueden variar según el equipo, el navegador y el estado de la API.

Resultados de la ejecución local (Lighthouse 12.8.2, página `/`):

| Categoría | Puntuación |
| --- | ---: |
| Rendimiento | 63/100 |
| Accesibilidad | 100/100 |
| Buenas prácticas | 100/100 |
| SEO | 100/100 |

Métricas principales: FCP 0.8 s, LCP 6.3 s, Speed Index 3.2 s, TBT 530 ms y CLS 0. El rendimiento se reporta tal como fue medido, sin ocultar las métricas que pueden mejorarse.

## Validaciones realizadas

- `npm run lint`
- `npm run build`
- Pruebas automatizadas de Laravel (`php artisan test`)
- Prueba manual del flujo completo: registro/inicio de sesión, catálogo, checkout, pago fake e historial
## Requisitos

- Node.js 20+
- Laravel API ejecutándose en `http://127.0.0.1:8000`

## Variables de entorno

Copia `.env.example` a `.env.local` si quieres cambiar la URL base de la API:

```bash
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api
```

El catálogo y los precios se presentan en dólares estadounidenses (USD). Laravel también debe tener `STRIPE_CURRENCY=usd` para crear órdenes y PaymentIntents con la misma moneda.

Si la base de datos no tiene usuarios, crea una cuenta desde `/register` antes de acceder al checkout.

Para cargar el catálogo temático de hardware una sola vez, desde `tarea12` ejecuta:

```bash
php artisan db:seed --class=TechnologyProductSeeder
```

Este seeder es repetible y no borra productos, pedidos ni usuarios; al repetirlo actualiza los detalles y precios de los productos del catálogo temático, conservando el stock disponible existente.

## Ejecutar en desarrollo

```bash
npm install
npm run dev
```

## Funcionalidades implementadas

- Catálogo de productos
- Detalle de producto
- Registro e inicio de sesión
- Persistencia del token JWT en cookie `HttpOnly`
- Carrito local con suma y cantidades
- Checkout protegido con creación de orden y pago mediante Stripe Payment Element
- Simulación de confirmación de pago cuando Laravel usa `STRIPE_DRIVER=fake` en desarrollo
- Historial de pedidos autenticado

## Configuración de pagos

El backend de Laravel crea la orden y su PaymentIntent; el frontend no manda precios ni claves privadas.

Para probar localmente, deja `STRIPE_DRIVER=fake` en Laravel y `NEXT_PUBLIC_STRIPE_MODE=fake` en `.env.local`. El checkout mostrará una confirmación de pago de prueba que llama al endpoint real de sincronización de Laravel.

Para usar Stripe real:

1. Configura en Laravel `STRIPE_DRIVER=stripe`, `STRIPE_SECRET` y `STRIPE_WEBHOOK_SECRET`.
2. Configura en el frontend `NEXT_PUBLIC_STRIPE_MODE=stripe` y `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` con la clave publicable de Stripe.
3. Reinicia ambos servidores para cargar las variables.

Nunca configures `STRIPE_SECRET` en el frontend. La API de Laravel debe estar levantada y conectada a la base de datos.
