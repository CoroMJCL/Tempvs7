# Tempvs7 — Portafolio Profesional

Stack: React 18 + Vite + Supabase + Vercel

## Instalación rápida

```bash
npm install
npm run dev
```

## Configurar Supabase

1. Ir a [supabase.com](https://supabase.com) → New Project
2. SQL Editor → pegar y ejecutar `supabase_schema.sql`
3. Settings → API → copiar URL y anon key
4. Editar `.env.local` con esas credenciales

## Deploy en Vercel

1. Subir este proyecto a GitHub
2. Ir a [vercel.com](https://vercel.com) → Import Git Repository
3. Agregar variables de entorno:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy → ¡listo!

## Panel Admin

- Ícono ⚙ en el navbar o texto "admin" en el footer
- También: Ctrl + Shift + A
- Contraseña: `tempvs7` ← **cámbiala antes de publicar**

## Estructura

```
src/
  App.jsx          ← toda la UI
  supabase.js      ← helpers de base de datos
  main.jsx         ← entry point
public/
  imagen3.jpg      ← imagen del hero
supabase_schema.sql ← ejecutar en Supabase
```
