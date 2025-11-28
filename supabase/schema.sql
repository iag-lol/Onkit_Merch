-- Tablas base
create table if not exists segmentos (
  id uuid primary key default gen_random_uuid(),
  nombre text unique not null
);

insert into segmentos (nombre) values
  ('empresa'), ('colegio'), ('sport'), ('evento'), ('otro')
on conflict do nothing;

create table if not exists categorias (
  id uuid primary key default gen_random_uuid(),
  nombre text unique not null
);

create table if not exists productos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  descripcion text,
  categoria_id uuid references categorias(id),
  precio_base_sin_iva numeric not null,
  stock integer default 0,
  permite_muestra boolean default false,
  activo boolean default true,
  imagen text,
  created_at timestamptz default now()
);

create table if not exists productos_segmentos (
  producto_id uuid references productos(id) on delete cascade,
  segmento_id uuid references segmentos(id) on delete cascade,
  primary key (producto_id, segmento_id)
);

create table if not exists reglas_descuento (
  id uuid primary key default gen_random_uuid(),
  producto_id uuid references productos(id) on delete cascade,
  cantidad_desde integer not null,
  porcentaje_descuento numeric not null
);

create table if not exists inventario_movimientos (
  id uuid primary key default gen_random_uuid(),
  producto_id uuid references productos(id),
  tipo text check (tipo in ('entrada','salida','ajuste')),
  cantidad integer not null,
  motivo text,
  created_at timestamptz default now()
);

create table if not exists cotizaciones (
  id uuid primary key default gen_random_uuid(),
  cliente text not null,
  email text not null,
  telefono text,
  tipo_cliente text references segmentos(nombre),
  empresa text not null,
  notas text,
  monto_neto numeric not null,
  iva numeric not null,
  total numeric not null,
  estado text default 'pendiente',
  created_at timestamptz default now()
);

create table if not exists cotizacion_items (
  id uuid primary key default gen_random_uuid(),
  cotizacion_id uuid references cotizaciones(id) on delete cascade,
  producto_id uuid references productos(id),
  nombre text not null,
  cantidad integer not null,
  precio_unitario numeric not null
);

create table if not exists ventas (
  id uuid primary key default gen_random_uuid(),
  cotizacion_id uuid references cotizaciones(id),
  monto_neto numeric not null,
  iva numeric not null,
  total numeric not null,
  tipo_cliente text references segmentos(nombre),
  created_at timestamptz default now()
);

create table if not exists venta_items (
  id uuid primary key default gen_random_uuid(),
  venta_id uuid references ventas(id) on delete cascade,
  producto_id uuid references productos(id),
  nombre text not null,
  cantidad integer not null,
  precio_unitario numeric not null
);

create table if not exists resenas (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  tipo_cliente text references segmentos(nombre),
  comentario text,
  rating integer check (rating between 1 and 5),
  estado text default 'pendiente',
  created_at timestamptz default now()
);

create table if not exists visitas (
  id uuid primary key default gen_random_uuid(),
  ip text,
  user_agent text,
  path text,
  device text,
  created_at timestamptz default now()
);

create table if not exists configuracion (
  id int primary key default 1,
  nombre_legal text,
  rut text,
  giro text,
  direccion text,
  correo text,
  telefono text,
  iva numeric default 19,
  minimo_unidades integer default 10
);

-- Índices sugeridos
create index if not exists idx_cotizaciones_fecha on cotizaciones (created_at);
create index if not exists idx_ventas_fecha on ventas (created_at);
create index if not exists idx_visitas_path on visitas (path);
