-- CreateTable
CREATE TABLE `institutie` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `denumire` VARCHAR(255) NULL,
    `adresa` VARCHAR(255) NULL,
    `cui` VARCHAR(255) NULL,
    `reprezentant` VARCHAR(255) NULL,
    `observatii` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
