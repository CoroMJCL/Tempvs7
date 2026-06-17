-- ═══════════════════════════════════════════════════════════════
--  TEMPVS7 — ESQUEMA SUPABASE
--  Ejecuta esto en el SQL Editor de tu proyecto Supabase
-- ═══════════════════════════════════════════════════════════════

-- 1. PROYECTOS
CREATE TABLE IF NOT EXISTS projects (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  title       text        NOT NULL,
  description text,
  url         text,
  img1        text,
  img2        text,
  img3        text,
  tags        text[]      DEFAULT '{}',
  sort_order  integer     DEFAULT 0,
  active      boolean     DEFAULT true,
  created_at  timestamptz DEFAULT now()
);

-- 2. CLIENTES (carrusel)
CREATE TABLE IF NOT EXISTS clients (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  name        text        NOT NULL,
  sort_order  integer     DEFAULT 0,
  active      boolean     DEFAULT true,
  created_at  timestamptz DEFAULT now()
);

-- 3. MENSAJES DE CONTACTO
CREATE TABLE IF NOT EXISTS contacts (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  name        text        NOT NULL,
  email       text        NOT NULL,
  phone       text,
  service     text,
  message     text        NOT NULL,
  read        boolean     DEFAULT false,
  created_at  timestamptz DEFAULT now()
);

-- 4. CONFIGURACIÓN (redes sociales, etc.)
CREATE TABLE IF NOT EXISTS settings (
  key         text        PRIMARY KEY,
  value       jsonb       NOT NULL,
  updated_at  timestamptz DEFAULT now()
);

-- ── DATOS INICIALES ──────────────────────────────────────────────
INSERT INTO projects (title, description, url, img1, tags, sort_order) VALUES
  ('Portal Coro Misioneros de Jesús',
   'Plataforma digital integral para gestión coral: asistencia, finanzas, cancionero con transpositor de acordes, comunicados y control de acceso por roles.',
   'https://portal-coro-mj.vercel.app',
   'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=600',
   ARRAY['React','Supabase','PWA','Vercel'], 1),
  ('PropManager',
   'SaaS para corredores de propiedades en Chile. Gestión de inventario, contratos, arrendatarios y finanzas con modelo de precios escalonado en UF.',
   'https://prop-manager-rust.vercel.app',
   'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600',
   ARRAY['React','Node.js','Supabase','SaaS'], 2),
  ('Modernización Core Bancario — Itaú',
   'Migración de 12 consultas COBOL/AS400 a microservicios AWS con arquitectura de dominio, Aurora PostgreSQL e Ingress Controller.',
   null,
   'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600',
   ARRAY['AWS','Node.js','PostgreSQL','Microservicios'], 3)
ON CONFLICT DO NOTHING;

INSERT INTO clients (name, sort_order) VALUES
  ('Itaú Chile', 1), ('Coro MJ', 2), ('PropManager', 3),
  ('FinTech CL', 4), ('Pymes Digitales', 5), ('StartupCL', 6),
  ('Banca Digital', 7), ('Inmobiliarias CL', 8)
ON CONFLICT DO NOTHING;

INSERT INTO settings (key, value) VALUES
  ('social', '{"linkedin":"https://www.linkedin.com/in/maximohoingti","instagram":"https://www.instagram.com/maximo.ho07/"}')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();

-- ── ROW LEVEL SECURITY ────────────────────────────────────────────
ALTER TABLE projects  ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients   ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts  ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings  ENABLE ROW LEVEL SECURITY;

-- Lectura pública (proyectos activos, clientes activos, config)
CREATE POLICY "public_read_projects"  ON projects  FOR SELECT USING (active = true);
CREATE POLICY "public_read_clients"   ON clients   FOR SELECT USING (active = true);
CREATE POLICY "public_read_settings"  ON settings  FOR SELECT USING (true);

-- Formulario de contacto: inserción pública sin autenticación
CREATE POLICY "public_insert_contacts" ON contacts FOR INSERT WITH CHECK (true);

-- Solo autenticados pueden administrar contenido
CREATE POLICY "auth_all_projects"  ON projects  FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all_clients"   ON clients   FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all_settings"  ON settings  FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_read_contacts" ON contacts  FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_update_contacts" ON contacts FOR UPDATE TO authenticated USING (true);

-- ── ÍNDICES ───────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_projects_order  ON projects (sort_order) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_clients_order   ON clients  (sort_order) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_contacts_date   ON contacts (created_at DESC);
