# Proyecto Barber Shop

Proyecto de sistema de reservación de citas que incluye un panel de administración para crear, actualizar y eliminar servicios y entradas de blog.

## Levantar el servidor en NEST

Necesitas las siguientes variables de entorno:

```
DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_DATABASE=
VERIFY_TOKEN_FOR_CREATE_ADMIN=
CLOUDFLARE_ACCESS_ID=
CLOUDFLARE_ACCESS_SECRET_KEY=
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_R2_BUCKET_NAME=
CLOUDFLARE_IMAGE_BASE_URL=

JWT_SECRET=
FRONTEND_URL=

STRIPE_SECRET_API_KEY=
STRIPE_WEBHOOK_SECRET_KEY=
```

Luego tienes que instalar los modulos y correr el script con el manejador de paquetes que gustes

```
pnpm install
pnpm run start:dev
```

## Levantar el Frontend en Sveltekit

Necesitas las siguientes variables de entorno:

```
PUBLIC_API_URL=
```

Luego tienes que instalar los modulos y correr el script con el manejador de paquetes que gustes

```
pnpm install
pnpm dev
```

