-- Reset categories table
TRUNCATE TABLE categories RESTART IDENTITY CASCADE;

-- Insert parent categories
INSERT INTO categories (id, name, parent_id, status, deleted, description, slug, cat_image) VALUES (1, 'Thời Trang', NULL, 'active', FALSE, 'Category Thời Trang', 'thoi-trang', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500');
INSERT INTO categories (id, name, parent_id, status, deleted, description, slug, cat_image) VALUES (2, 'Điện Tử', NULL, 'active', FALSE, 'Category Điện Tử', 'dien-tu', 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500');
INSERT INTO categories (id, name, parent_id, status, deleted, description, slug, cat_image) VALUES (3, 'Nghệ Thuật & Trang Sức', NULL, 'active', FALSE, 'Category Nghệ Thuật & Trang Sức', 'nghe-thuat-trang-suc', 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500');

-- Insert child subcategories
INSERT INTO categories (id, name, parent_id, status, deleted, description, slug, cat_image) VALUES (4, 'Thời Trang Nam', 1, 'active', FALSE, 'Thời Trang Nam under Thời Trang', 'thoi-trang-nam', 'https://file.hstatic.net/1000284478/file/phong-cach-thoi-trang-nam-2024-b_26df758c91ef4fc78b185be0ff9f4cb0.jpg');
INSERT INTO categories (id, name, parent_id, status, deleted, description, slug, cat_image) VALUES (5, 'Thời Trang Nữ', 1, 'active', FALSE, 'Thời Trang Nữ under Thời Trang', 'thoi-trang-nu', 'https://uvi.vn/wp-content/uploads/2022/03/Chan-vay-xoe-duoi-ca.jpg');
INSERT INTO categories (id, name, parent_id, status, deleted, description, slug, cat_image) VALUES (6, 'Giày Dép', 1, 'active', FALSE, 'Giày Dép under Thời Trang', 'giay-dep', 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500');
INSERT INTO categories (id, name, parent_id, status, deleted, description, slug, cat_image) VALUES (7, 'Điện Thoại & Máy Tính Bảng', 2, 'active', FALSE, 'Điện Thoại & Máy Tính Bảng under Điện Tử', 'dien-thoai-may-tinh-bang', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500');
INSERT INTO categories (id, name, parent_id, status, deleted, description, slug, cat_image) VALUES (8, 'Laptop & PC', 2, 'active', FALSE, 'Laptop & PC under Điện Tử', 'laptop-pc', 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500');
INSERT INTO categories (id, name, parent_id, status, deleted, description, slug, cat_image) VALUES (9, 'Phụ Kiện Số', 2, 'active', FALSE, 'Phụ Kiện Số under Điện Tử', 'phu-kien-so', 'https://storage.googleapis.com/48877118-7272-4a4d-b302-0465d8aa4548/f646d3c1-f6c3-4227-92ba-bd451d0401ea/8a9fa536-61df-4faa-9217-0033791bf9a5.jpg');
INSERT INTO categories (id, name, parent_id, status, deleted, description, slug, cat_image) VALUES (10, 'Máy Ảnh & Quay Phim', 2, 'active', FALSE, 'Máy Ảnh & Quay Phim under Điện Tử', 'may-anh-quay-phim', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500');
INSERT INTO categories (id, name, parent_id, status, deleted, description, slug, cat_image) VALUES (11, 'Tranh Ảnh', 3, 'active', FALSE, 'Tranh Ảnh under Nghệ Thuật & Trang Sức', 'tranh-anh', 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500');
INSERT INTO categories (id, name, parent_id, status, deleted, description, slug, cat_image) VALUES (12, 'Tượng & Điêu Khắc', 3, 'active', FALSE, 'Tượng & Điêu Khắc under Nghệ Thuật & Trang Sức', 'tuong-dieu-khac', 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=500');
INSERT INTO categories (id, name, parent_id, status, deleted, description, slug, cat_image) VALUES (13, 'Trang Sức', 3, 'active', FALSE, 'Trang Sức under Nghệ Thuật & Trang Sức', 'trang-suc', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500');

-- Adjust ID sequence
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));