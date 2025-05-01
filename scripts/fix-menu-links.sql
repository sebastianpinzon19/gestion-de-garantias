-- SQL script to fix all menu links for admin and seller
UPDATE "MenuItem" SET link = '/admin/dashboard' WHERE link = '/modules/admin/pages/dashboard';
UPDATE "MenuItem" SET link = '/admin/users' WHERE link = '/modules/admin/pages/users';
UPDATE "MenuItem" SET link = '/admin/warranties' WHERE link = '/modules/admin/pages/garantias/lista';
UPDATE "MenuItem" SET link = '/seller/dashboard' WHERE link = '/modules/seller/pages/dashboard-main';
UPDATE "MenuItem" SET link = '/seller/warranties' WHERE link = '/modules/seller/pages/warranties';
UPDATE "MenuItem" SET link = '/warranty-form' WHERE link = '/modules/warranty/pages/formulario';
-- Add more as needed for your menu structure
