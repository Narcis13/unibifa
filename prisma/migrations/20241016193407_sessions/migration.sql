/*
  Warnings:

  - A unique constraint covering the columns `[sid]` on the table `sessions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sid` to the `sessions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `sessions` ADD COLUMN `sid` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `sid` ON `sessions`(`sid`);
