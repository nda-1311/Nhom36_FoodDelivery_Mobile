-- Insert sample restaurants
INSERT INTO restaurants (name, cuisine, description, image_url, delivery_time, rating, review_count, tags) VALUES
('Hana Chicken', 'Fried Chicken', 'Crispy fried chicken and wings', '/restaurant-food-variety.png', 15, 4.8, 289, ARRAY['Freeship', 'Near you']),
('Bamsu Restaurant', 'Chicken Salad, Sandwich & Desserts', 'Fresh salads and sandwiches', '/restaurant-food-variety.png', 20, 4.1, 150, ARRAY['Freeship', 'Near you']),
('Neighbor Milk', 'Dairy Drinks & Smoothies', 'Fresh milk and smoothies', '/cozy-coffee-cafe.png', 35, 4.1, 100, ARRAY['Freeship']),
('B Fresh Coffee', 'Coffee & Pastries', 'Premium coffee and pastries', '/cozy-coffee-cafe.png', 30, 4.5, 200, ARRAY['Freeship', 'Near you']),
('Loran Seal', 'Seafood & Grill', 'Fresh seafood dishes', '/seafood-restaurant.png', 30, 4.2, 180, ARRAY['Deal $1']),
('Mr. John Tapas', 'Spanish Tapas', 'Best tapas in town', '/restaurant-food-variety.png', 35, 4.1, 120, ARRAY['Freeship']);

-- Insert sample food items for Hana Chicken
INSERT INTO food_items (restaurant_id, name, description, category, collection, price, image_url, rating, review_count) VALUES
((SELECT id FROM restaurants WHERE name = 'Hana Chicken'), 'Fried Chicken', 'Crispy fried wings and thigh', 'fastfood', 'popular', 15, '/crispy-fried-chicken.png', 4.5, 99),
((SELECT id FROM restaurants WHERE name = 'Hana Chicken'), 'Chicken Salad', 'Fresh chicken with vegetables', 'healthy', 'freeship', 10, '/creamy-chicken-salad.png', 4.5, 99),
((SELECT id FROM restaurants WHERE name = 'Hana Chicken'), 'Spicy Chicken', 'Hot and spicy chicken', 'fastfood', 'popular', 15, '/crispy-fried-chicken.png', 4.5, 99),
((SELECT id FROM restaurants WHERE name = 'Hana Chicken'), 'Fried Potatoes', 'Golden fried potatoes', 'fastfood', 'popular', 15, '/crispy-fried-chicken.png', 4.5, 99);

-- Insert sample food items for Bamsu Restaurant
INSERT INTO food_items (restaurant_id, name, description, category, collection, price, image_url, rating, review_count) VALUES
((SELECT id FROM restaurants WHERE name = 'Bamsu Restaurant'), 'Saute Chicken Rice', 'Chicken fried rice with vegetables', 'rice', 'popular', 15, '/simple-rice-bowl.png', 4.5, 99),
((SELECT id FROM restaurants WHERE name = 'Bamsu Restaurant'), 'Chicken Burger', 'Fried chicken burger with cheese', 'fastfood', 'popular', 15, '/classic-beef-burger.png', 4.5, 99);

-- Insert sample food items for Neighbor Milk
INSERT INTO food_items (restaurant_id, name, description, category, collection, price, image_url, rating, review_count) VALUES
((SELECT id FROM restaurants WHERE name = 'Neighbor Milk'), 'Smoothie', 'Fresh fruit smoothie', 'drink', 'deal-1', 5, '/colorful-fruit-smoothie.png', 4.5, 99),
((SELECT id FROM restaurants WHERE name = 'Neighbor Milk'), 'Milk Tea', 'Creamy milk tea', 'drink', 'freeship', 6, '/milk-drink.jpg', 4.8, 99);

-- Insert sample food items for B Fresh Coffee
INSERT INTO food_items (restaurant_id, name, description, category, collection, price, image_url, rating, review_count) VALUES
((SELECT id FROM restaurants WHERE name = 'B Fresh Coffee'), 'Iced Coffee', 'Cold brew iced coffee', 'drink', 'popular', 5, '/colorful-fruit-smoothie.png', 4.5, 99),
((SELECT id FROM restaurants WHERE name = 'B Fresh Coffee'), 'Green Salad', 'Fresh green salad', 'healthy', 'freeship', 9, '/vibrant-green-salad.png', 4.5, 99);

-- Insert sample food items for Loran Seal
INSERT INTO food_items (restaurant_id, name, description, category, collection, price, image_url, rating, review_count) VALUES
((SELECT id FROM restaurants WHERE name = 'Loran Seal'), 'Grilled Fish', 'Fresh grilled fish', 'healthy', 'deal-1', 20, '/seafood-restaurant.png', 4.5, 99),
((SELECT id FROM restaurants WHERE name = 'Loran Seal'), 'Seafood Pasta', 'Pasta with fresh seafood', 'fastfood', 'popular', 18, '/seafood-restaurant.png', 4.5, 99);

-- Insert sample food items for Mr. John Tapas
INSERT INTO food_items (restaurant_id, name, description, category, collection, price, image_url, rating, review_count) VALUES
((SELECT id FROM restaurants WHERE name = 'Mr. John Tapas'), 'Spanish Tapas', 'Best tapas in town', 'fastfood', 'freeship', 15, '/vibrant-salad-bowl.png', 4.5, 99);

-- Insert sample promotions
INSERT INTO promotions (code, description, discount_type, discount_value, min_order_amount, max_uses, is_active, expires_at) VALUES
('SAVE10', '10% off on all orders', 'percentage', 10, 0, 100, true, NOW() + INTERVAL '30 days'),
('FREESHIP', 'Free shipping on orders over $50', 'fixed', 5, 50, 50, true, NOW() + INTERVAL '30 days'),
('WELCOME20', '20% off for new users', 'percentage', 20, 0, 1000, true, NOW() + INTERVAL '30 days'),
('DEAL30', '30% off on bill over $50', 'percentage', 30, 50, 100, true, NOW() + INTERVAL '30 days');
