-- Insert sample villas
INSERT INTO villas (id, title, country, city, address, latitude, longitude, smoking_allowed, nearby, amenities, description)
VALUES 
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Sunset Beach Villa', 'Spain', 'Mallorca', 'Calle de la Playa 123', 39.5696, 2.6502, false, 
   'Beautiful beaches within walking distance. Historic town center 10 minutes by car. Local restaurants and cafes nearby.',
   '["Pool", "WiFi", "Air Conditioning", "Beach Access", "BBQ Area", "Parking", "4 Bedrooms", "3 Bathrooms"]'::jsonb,
   'Stunning beachfront villa with panoramic ocean views. Perfect for families looking for a relaxing vacation.'),
  
  ('b2c3d4e5-f678-90ab-cdef-123456789012', 'Mountain Retreat Chalet', 'France', 'Chamonix', '456 Rue de la Montagne', 45.9237, 6.8694, true,
   'Ski slopes 5 minutes away. Village center with shops and restaurants. Hiking trails directly accessible.',
   '["Fireplace", "Hot Tub", "WiFi", "Ski Storage", "Mountain Views", "Parking", "5 Bedrooms", "4 Bathrooms", "Game Room"]'::jsonb,
   'Luxurious mountain chalet with breathtaking Alpine views. Ideal for winter sports enthusiasts.'),
  
  ('c3d4e5f6-7890-abcd-ef12-345678901234', 'Tuscany Countryside Villa', 'Italy', 'Florence', 'Via dei Cipressi 789', 43.7696, 11.2558, false,
   'Historic Florence 30 minutes drive. Local wineries nearby. Traditional markets every weekend.',
   '["Pool", "Wine Cellar", "WiFi", "Garden", "Olive Grove", "Parking", "6 Bedrooms", "5 Bathrooms", "Pizza Oven"]'::jsonb,
   'Authentic Tuscan villa surrounded by vineyards and olive groves. Experience true Italian countryside living.'),
  
  ('d4e5f678-90ab-cdef-1234-567890123456', 'Modern City Penthouse', 'Portugal', 'Lisbon', 'Avenida da Liberdade 321', 38.7223, -9.1393, false,
   'City center location. Metro station 2 minutes walk. Restaurants, bars, and cultural sites all around.',
   '["Rooftop Terrace", "WiFi", "Air Conditioning", "City Views", "Elevator", "Concierge", "3 Bedrooms", "2 Bathrooms"]'::jsonb,
   'Sleek penthouse in the heart of Lisbon with stunning city views and modern amenities.'),
  
  ('e5f67890-abcd-ef12-3456-789012345678', 'Greek Island Paradise', 'Greece', 'Santorini', 'Oia Village Road 555', 36.4618, 25.3753, true,
   'Famous Oia sunset point nearby. Beach clubs within walking distance. Traditional tavernas in the village.',
   '["Infinity Pool", "WiFi", "Sea Views", "Cave House", "Terrace", "Outdoor Shower", "2 Bedrooms", "2 Bathrooms"]'::jsonb,
   'Traditional cave house with modern luxury touches. Spectacular caldera views and romantic sunsets.'),
  
  ('f6789012-cdef-1234-5678-901234567890', 'Caribbean Beachfront', 'Barbados', 'St. James', 'Sandy Lane Estate 777', 13.1939, -59.6138, false,
   'Private beach access. Golf course 5 minutes. Shopping and dining in Holetown nearby.',
   '["Private Beach", "Pool", "WiFi", "Tennis Court", "Staff Included", "Parking", "7 Bedrooms", "8 Bathrooms", "Gym"]'::jsonb,
   'Exclusive beachfront estate with private beach and full staff. Ultimate luxury Caribbean experience.'),
  
  ('01234567-89ab-cdef-1234-567890abcdef', 'Alpine Ski Lodge', 'Switzerland', 'Zermatt', 'Bahnhofstrasse 999', 46.0207, 7.7491, false,
   'Ski-in/ski-out access. Village center walking distance. Matterhorn views from every window.',
   '["Ski Access", "Sauna", "WiFi", "Boot Warmer", "Fireplace", "Parking", "4 Bedrooms", "3 Bathrooms", "Wine Bar"]'::jsonb,
   'Traditional Swiss chalet with modern comforts. Direct access to world-class skiing.'),
  
  ('12345678-90ab-cdef-1234-567890123abc', 'Bali Jungle Villa', 'Indonesia', 'Ubud', 'Jalan Raya Ubud 888', -8.5069, 115.2625, true,
   'Rice terraces views. Yoga studios nearby. Monkey forest 10 minutes. Traditional markets in town.',
   '["Private Pool", "Yoga Deck", "WiFi", "Jungle Views", "Open Living", "Staff", "3 Bedrooms", "3 Bathrooms"]'::jsonb,
   'Serene jungle retreat with rice paddy views. Perfect for yoga and meditation enthusiasts.'),
  
  ('23456789-0abc-def1-2345-678901234def', 'Dubai Marina Luxury', 'UAE', 'Dubai', 'Marina Walk 1001', 25.0762, 55.1337, false,
   'Marina promenade at doorstep. Beach 5 minutes. Shopping malls and restaurants abundant.',
   '["Gym", "Pool", "WiFi", "Marina Views", "Concierge", "Parking", "4 Bedrooms", "5 Bathrooms", "Cinema Room"]'::jsonb,
   'Ultra-modern apartment with spectacular marina views. Experience luxury Dubai living.'),
  
  ('34567890-abcd-ef12-3456-789012345abc', 'Scottish Highland Castle', 'Scotland', 'Inverness', 'Loch Ness Road 666', 57.4778, -4.2247, true,
   'Historic sites nearby. Loch views. Whisky distilleries within driving distance. Hiking trails abundant.',
   '["Library", "Fireplace", "WiFi", "Loch Views", "Gardens", "Historic Features", "8 Bedrooms", "6 Bathrooms", "Billiards Room"]'::jsonb,
   'Authentic Scottish castle with modern amenities. Experience Highland hospitality in historic surroundings.');

-- Insert villa images
INSERT INTO villa_images (villa_id, url, alt) VALUES
  -- Sunset Beach Villa
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2', 'Beach villa exterior'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6', 'Living room with ocean view'),
  
  -- Mountain Retreat Chalet
  ('b2c3d4e5-f678-90ab-cdef-123456789012', 'https://images.unsplash.com/photo-1518780664697-55e3ad937233', 'Mountain chalet exterior'),
  ('b2c3d4e5-f678-90ab-cdef-123456789012', 'https://images.unsplash.com/photo-1542718610-a1d656d1884c', 'Cozy fireplace interior'),
  
  -- Tuscany Countryside Villa
  ('c3d4e5f6-7890-abcd-ef12-345678901234', 'https://images.unsplash.com/photo-1558036117-15d82a90b9b1', 'Tuscan villa exterior'),
  ('c3d4e5f6-7890-abcd-ef12-345678901234', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c', 'Pool with countryside view'),
  
  -- Modern City Penthouse
  ('d4e5f678-90ab-cdef-1234-567890123456', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00', 'Modern penthouse interior'),
  ('d4e5f678-90ab-cdef-1234-567890123456', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64', 'Rooftop terrace view'),
  
  -- Greek Island Paradise
  ('e5f67890-abcd-ef12-3456-789012345678', 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff', 'Santorini villa with caldera view'),
  ('e5f67890-abcd-ef12-3456-789012345678', 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7', 'Infinity pool sunset'),
  
  -- Caribbean Beachfront
  ('f6789012-cdef-1234-5678-901234567890', 'https://images.unsplash.com/photo-1519046904884-53103b34b206', 'Caribbean beach villa'),
  ('f6789012-cdef-1234-5678-901234567890', 'https://images.unsplash.com/photo-1540541338287-41700207dee6', 'Private beach access'),
  
  -- Alpine Ski Lodge
  ('01234567-89ab-cdef-1234-567890abcdef', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4', 'Swiss chalet in snow'),
  ('01234567-89ab-cdef-1234-567890abcdef', 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa', 'Mountain view from terrace'),
  
  -- Bali Jungle Villa
  ('12345678-90ab-cdef-1234-567890123abc', 'https://images.unsplash.com/photo-1537640538966-79f369143f8f', 'Bali villa with jungle view'),
  ('12345678-90ab-cdef-1234-567890123abc', 'https://images.unsplash.com/photo-1602002418816-5c0aeef426aa', 'Private pool in jungle'),
  
  -- Dubai Marina Luxury
  ('23456789-0abc-def1-2345-678901234def', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688', 'Dubai apartment interior'),
  ('23456789-0abc-def1-2345-678901234def', 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd', 'Marina view at night'),
  
  -- Scottish Highland Castle
  ('34567890-abcd-ef12-3456-789012345abc', 'https://images.unsplash.com/photo-1552664730-d307ca884978', 'Scottish castle exterior'),
  ('34567890-abcd-ef12-3456-789012345abc', 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7', 'Castle library interior');

-- Insert date options (multiple weeks per villa)
INSERT INTO villa_date_options (villa_id, start_date, end_date, price_cents) VALUES
  -- Sunset Beach Villa
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2025-06-07', '2025-06-14', 350000),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2025-06-14', '2025-06-21', 380000),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2025-06-21', '2025-06-28', 420000),
  
  -- Mountain Retreat Chalet
  ('b2c3d4e5-f678-90ab-cdef-123456789012', '2025-12-20', '2025-12-27', 680000),
  ('b2c3d4e5-f678-90ab-cdef-123456789012', '2025-12-27', '2026-01-03', 750000),
  ('b2c3d4e5-f678-90ab-cdef-123456789012', '2026-01-03', '2026-01-10', 550000),
  
  -- Tuscany Countryside Villa
  ('c3d4e5f6-7890-abcd-ef12-345678901234', '2025-09-06', '2025-09-13', 450000),
  ('c3d4e5f6-7890-abcd-ef12-345678901234', '2025-09-13', '2025-09-20', 450000),
  ('c3d4e5f6-7890-abcd-ef12-345678901234', '2025-09-20', '2025-09-27', 420000),
  
  -- Modern City Penthouse
  ('d4e5f678-90ab-cdef-1234-567890123456', '2025-05-10', '2025-05-17', 280000),
  ('d4e5f678-90ab-cdef-1234-567890123456', '2025-05-17', '2025-05-24', 280000),
  ('d4e5f678-90ab-cdef-1234-567890123456', '2025-05-24', '2025-05-31', 320000),
  
  -- Greek Island Paradise
  ('e5f67890-abcd-ef12-3456-789012345678', '2025-07-05', '2025-07-12', 520000),
  ('e5f67890-abcd-ef12-3456-789012345678', '2025-07-12', '2025-07-19', 550000),
  ('e5f67890-abcd-ef12-3456-789012345678', '2025-07-19', '2025-07-26', 550000),
  
  -- Caribbean Beachfront
  ('f6789012-cdef-1234-5678-901234567890', '2025-11-01', '2025-11-08', 980000),
  ('f6789012-cdef-1234-5678-901234567890', '2025-11-08', '2025-11-15', 980000),
  ('f6789012-cdef-1234-5678-901234567890', '2025-11-15', '2025-11-22', 850000),
  
  -- Alpine Ski Lodge
  ('01234567-89ab-cdef-1234-567890abcdef', '2026-02-07', '2026-02-14', 720000),
  ('01234567-89ab-cdef-1234-567890abcdef', '2026-02-14', '2026-02-21', 720000),
  ('01234567-89ab-cdef-1234-567890abcdef', '2026-02-21', '2026-02-28', 680000),
  
  -- Bali Jungle Villa
  ('12345678-90ab-cdef-1234-567890123abc', '2025-08-02', '2025-08-09', 320000),
  ('12345678-90ab-cdef-1234-567890123abc', '2025-08-09', '2025-08-16', 320000),
  ('12345678-90ab-cdef-1234-567890123abc', '2025-08-16', '2025-08-23', 350000),
  
  -- Dubai Marina Luxury
  ('23456789-0abc-def1-2345-678901234def', '2025-10-04', '2025-10-11', 420000),
  ('23456789-0abc-def1-2345-678901234def', '2025-10-11', '2025-10-18', 420000),
  ('23456789-0abc-def1-2345-678901234def', '2025-10-18', '2025-10-25', 380000),
  
  -- Scottish Highland Castle
  ('34567890-abcd-ef12-3456-789012345abc', '2025-07-26', '2025-08-02', 680000),
  ('34567890-abcd-ef12-3456-789012345abc', '2025-08-02', '2025-08-09', 680000),
  ('34567890-abcd-ef12-3456-789012345abc', '2025-08-09', '2025-08-16', 720000);