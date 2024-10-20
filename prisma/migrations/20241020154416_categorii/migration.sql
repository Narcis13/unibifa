/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Post` DROP FOREIGN KEY `Post_authorId_fkey`;

-- DropTable
DROP TABLE `Post`;

-- DropTable
DROP TABLE `User`;

-- CreateTable
CREATE TABLE `Categorii` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `denumire` VARCHAR(255) NOT NULL,
    `explicatii` TEXT NOT NULL,
    `idsursa` INTEGER NOT NULL,
    `idarticol` INTEGER NOT NULL,
    `idcompartiment` INTEGER NOT NULL,
    `stare` VARCHAR(24) NULL DEFAULT 'activ',
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Categorii` ADD CONSTRAINT `Categorii_idsursa_fkey` FOREIGN KEY (`idsursa`) REFERENCES `sursefinantare`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Categorii` ADD CONSTRAINT `Categorii_idarticol_fkey` FOREIGN KEY (`idarticol`) REFERENCES `articolebugetare`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Categorii` ADD CONSTRAINT `Categorii_idcompartiment_fkey` FOREIGN KEY (`idcompartiment`) REFERENCES `compartimente`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
