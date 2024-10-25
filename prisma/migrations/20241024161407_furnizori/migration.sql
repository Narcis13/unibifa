-- CreateTable
CREATE TABLE `furnizori` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_user` INTEGER NULL,
    `denumire` VARCHAR(120) NOT NULL,
    `regcom` VARCHAR(120) NULL,
    `localitate` VARCHAR(50) NULL,
    `judet` VARCHAR(50) NOT NULL,
    `codfiscal` VARCHAR(13) NOT NULL,
    `banca` VARCHAR(120) NULL,
    `iban` VARCHAR(24) NULL,
    `tara` VARCHAR(50) NOT NULL,
    `perscontact` VARCHAR(60) NULL,
    `platitortva` BOOLEAN NOT NULL DEFAULT false,
    `adresa` VARCHAR(120) NOT NULL,
    `email` VARCHAR(50) NULL,
    `telefon` VARCHAR(20) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
