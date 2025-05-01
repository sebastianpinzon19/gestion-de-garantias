-- Crear tabla User
CREATE TABLE "User" (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP DEFAULT NOW()
);

-- Crear tabla Warranty
CREATE TABLE "Warranty" (
    id SERIAL PRIMARY KEY,
    customerName VARCHAR(255) NOT NULL,
    customerPhone VARCHAR(50) NOT NULL,
    ownerName VARCHAR(255),
    ownerPhone VARCHAR(50),
    address TEXT NOT NULL,
    brand VARCHAR(255) NOT NULL,
    model VARCHAR(255) NOT NULL,
    serial VARCHAR(255) NOT NULL,
    purchaseDate DATE NOT NULL,
    invoiceNumber VARCHAR(255) NOT NULL,
    damagedPart VARCHAR(255) NOT NULL,
    damagedPartSerial VARCHAR(255),
    damageDate DATE NOT NULL,
    damageDescription TEXT NOT NULL,
    customerSignature TEXT NOT NULL,
    crediMemo VARCHAR(255),
    replacementPart VARCHAR(255),
    replacementSerial VARCHAR(255),
    sellerSignature TEXT,
    managementDate DATE,
    warrantyStatus VARCHAR(50) DEFAULT 'pending',
    technicianNotes TEXT,
    resolutionDate DATE,
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP DEFAULT NOW()
);

-- Insertar usuarios
INSERT INTO "User" (email, name, role, password, createdAt, updatedAt) VALUES
('admin@example.com', 'Admin User', 'admin', 'admin123', NOW(), NOW()),
('seller@example.com', 'Seller User', 'seller', 'seller123', NOW(), NOW()),
('user@example.com', 'Regular User', 'user', 'user123', NOW(), NOW());

-- Insertar garantías
INSERT INTO "Warranty" (
    customerName, customerPhone, ownerName, ownerPhone, address, brand, model, serial, purchaseDate, invoiceNumber,
    damagedPart, damagedPartSerial, damageDate, damageDescription, customerSignature, crediMemo, replacementPart,
    replacementSerial, sellerSignature, managementDate, warrantyStatus, technicianNotes, resolutionDate, createdAt, updatedAt
) VALUES
('John Doe', '123456789', 'Jane Doe', '987654321', '123 Main St', 'Brand A', 'Model X', 'SN12345', '2025-01-01', 'INV123',
 'Part A', 'SN67890', '2025-04-01', 'Broken screen', 'Signature1', NULL, NULL, NULL, NULL, NULL, 'pending', NULL, NULL, NOW(), NOW()),
('Alice Smith', '555123456', 'Bob Smith', '555654321', '456 Elm St', 'Brand B', 'Model Y', 'SN54321', '2025-02-01', 'INV456',
 'Part B', NULL, '2025-04-10', 'Battery issue', 'Signature2', NULL, NULL, NULL, NULL, NULL, 'pending', NULL, NULL, NOW(), NOW());