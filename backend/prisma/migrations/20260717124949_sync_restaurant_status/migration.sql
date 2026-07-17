/*
  Warnings:

  - You are about to drop the column `isActive` on the `Restaurant` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "RestaurantStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Restaurant" DROP COLUMN "isActive",
ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "approvedBy" TEXT,
ADD COLUMN     "rejectionReason" TEXT,
ADD COLUMN     "status" "RestaurantStatus" NOT NULL DEFAULT 'PENDING';
