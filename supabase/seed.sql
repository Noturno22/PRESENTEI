-- ============================================================================
-- Presentei — Seed Data
-- ============================================================================
-- Este ficheiro contém dados mínimos para desenvolvimento local:
--   - Categorias de produtos (Kits, Experiências, Tecnologia, Beleza)
--   - Produtos de exemplo
-- ============================================================================

-- Categorias
insert into categories (name, icon_key, display_order) values
  ('Kits', 'gift', 1),
  ('Experiências', 'network', 2),
  ('Tecnologia', 'device', 3),
  ('Beleza', 'bottle', 4);

-- Produtos de exemplo (substituir por catálogo real antes de produção)
insert into products (category_id, name, price_kz, is_kit, image_url)
select id, 'Kit Festa na Caixa', 25000, true, null from categories where name = 'Kits'
union all
select id, 'Flores & Chocolate', 18000, false, null from categories where name = 'Experiências'
union all
select id, 'Perfume Feminino', 30000, false, null from categories where name = 'Beleza';
