-- Insert sample villas
insert into public.villas (title, country, city, address, price, start_date, end_date, images, additional_information) values
  ('Sunset Paradise Villa', 'Greece', 'Santorini', '123 Cliff View Road, Oia, Santorini 84702', 5500, '2024-06-01', '2024-06-08', 
   array['https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=800'], 
   'Infinity pool, Sea view, 4 bedrooms, Private chef available'),
  
  ('Royal Azure Estate', 'France', 'Nice', '45 Boulevard de la Croisette, Nice 06400', 7200, '2024-06-15', '2024-06-22',
   array['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'],
   'Private beach access, Tennis court, Wine cellar, 6 bedrooms'),
  
  ('Mountain Majesty Chalet', 'Switzerland', 'Zermatt', '78 Alpine Heights, Zermatt 3920', 8900, '2024-07-01', '2024-07-08',
   array['https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800'],
   'Ski-in/ski-out, Hot tub, Sauna, Mountain views, 5 bedrooms'),
  
  ('Tropical Dream Villa', 'Thailand', 'Phuket', '99 Beach Front Lane, Kamala, Phuket 83150', 4200, '2024-06-10', '2024-06-17',
   array['https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800'],
   'Beachfront, Outdoor kitchen, Yoga pavilion, 4 bedrooms'),
  
  ('Tuscan Heritage Manor', 'Italy', 'Florence', 'Via del Chianti 156, Florence 50125', 6800, '2024-06-20', '2024-06-27',
   array['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
   'Vineyard, Historic architecture, Pool, Cooking classes available'),
  
  ('Modern Glass House', 'USA', 'Malibu', '789 Pacific Coast Highway, Malibu, CA 90265', 12000, '2024-08-01', '2024-08-08',
   array['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800'],
   'Ocean views, Smart home, Private beach, Home theater, 5 bedrooms');