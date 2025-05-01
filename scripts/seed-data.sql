-- Insertar usuarios adicionales con valores únicos para la columna `id`
INSERT INTO "users" (id, email, name, role, password, createdAt, updatedAt) VALUES
('1', 'admin@example.com', 'Admin User', 'admin', '$2b$10$eBz1j1K1Q9F9J8F9J8F9J8F9J8F9J8F9J8F9J8F9J8F9J8F9J8F9J8', NOW(), NOW()),
('2', 'seller@example.com', 'Seller User', 'seller', '$2b$10$eBz1j1K1Q9F9J8F9J8F9J8F9J8F9J8F9J8F9J8F9J8F9J8F9J8F9J8', NOW(), NOW()),
('3', 'user@example.com', 'Regular User', 'user', '$2b$10$eBz1j1K1Q9F9J8F9J8F9J8F9J8F9J8F9J8F9J8F9J8F9J8F9J8F9J8', NOW(), NOW());

-- Insertar garantías
INSERT INTO "Warranty" (
  id, customerName, customerPhone, ownerName, ownerPhone, address, brand, model, serial, purchaseDate, invoiceNumber,
  damagedPart, damagedPartSerial, damageDate, damageDescription, customerSignature, crediMemo, replacementPart,
  replacementSerial, sellerSignature, managementDate, warrantyStatus, technicianNotes, resolutionDate, createdAt, updatedAt
) VALUES
('1', 'John Doe', '123456789', 'Jane Doe', '987654321', '123 Main St', 'Brand A', 'Model X', 'SN12345', '2025-01-01', 'INV123',
 'Part A', 'SN67890', '2025-04-01', 'Broken screen', 'Signature1', NULL, NULL, NULL, NULL, NULL, 'pending', NULL, NULL, NOW(), NOW()),
('2', 'Alice Smith', '555123456', 'Bob Smith', '555654321', '456 Elm St', 'Brand B', 'Model Y', 'SN54321', '2025-02-01', 'INV456',
 'Part B', NULL, '2025-04-10', 'Battery issue', 'Signature2', NULL, NULL, NULL, NULL, NULL, 'pending', NULL, NULL, NOW(), NOW());