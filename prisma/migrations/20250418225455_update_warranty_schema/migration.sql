/*
  Warnings:

  - You are about to drop the column `customerId` on the `Warranty` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Warranty` table. All the data in the column will be lost.
  - You are about to drop the column `productName` on the `Warranty` table. All the data in the column will be lost.
  - You are about to drop the column `serialNumber` on the `Warranty` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Warranty` table. All the data in the column will be lost.
  - Added the required column `address` to the `Warranty` table without a default value. This is not possible if the table is not empty.
  - Added the required column `brand` to the `Warranty` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerPhone` to the `Warranty` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerSignature` to the `Warranty` table without a default value. This is not possible if the table is not empty.
  - Added the required column `damageDate` to the `Warranty` table without a default value. This is not possible if the table is not empty.
  - Added the required column `damageDescription` to the `Warranty` table without a default value. This is not possible if the table is not empty.
  - Added the required column `damagedPart` to the `Warranty` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invoiceNumber` to the `Warranty` table without a default value. This is not possible if the table is not empty.
  - Added the required column `model` to the `Warranty` table without a default value. This is not possible if the table is not empty.
  - Added the required column `purchaseDate` to the `Warranty` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serial` to the `Warranty` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Warranty" DROP COLUMN "customerId",
DROP COLUMN "description",
DROP COLUMN "productName",
DROP COLUMN "serialNumber",
DROP COLUMN "status",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "brand" TEXT NOT NULL,
ADD COLUMN     "crediMemo" TEXT,
ADD COLUMN     "customerPhone" TEXT NOT NULL,
ADD COLUMN     "customerSignature" TEXT NOT NULL,
ADD COLUMN     "damageDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "damageDescription" TEXT NOT NULL,
ADD COLUMN     "damagedPart" TEXT NOT NULL,
ADD COLUMN     "damagedPartSerial" TEXT,
ADD COLUMN     "invoiceNumber" TEXT NOT NULL,
ADD COLUMN     "managementDate" TIMESTAMP(3),
ADD COLUMN     "model" TEXT NOT NULL,
ADD COLUMN     "ownerName" TEXT,
ADD COLUMN     "ownerPhone" TEXT,
ADD COLUMN     "purchaseDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "replacementPart" TEXT,
ADD COLUMN     "replacementSerial" TEXT,
ADD COLUMN     "resolutionDate" TIMESTAMP(3),
ADD COLUMN     "sellerSignature" TEXT,
ADD COLUMN     "serial" TEXT NOT NULL,
ADD COLUMN     "technicianNotes" TEXT,
ADD COLUMN     "warrantyStatus" TEXT NOT NULL DEFAULT 'pending';
