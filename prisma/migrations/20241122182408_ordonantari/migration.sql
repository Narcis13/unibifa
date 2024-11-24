-- CreateTable
CREATE TABLE `OrdonantariPlata` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `numar` VARCHAR(191) NOT NULL,
    `dataord` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `idFurnizor` INTEGER NOT NULL,
    `valoare` DECIMAL(15, 2) NOT NULL,
    `stare` VARCHAR(24) NOT NULL DEFAULT 'creat',
    `explicatii` TEXT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `OrdonantariPlata_numar_key`(`numar`),
    INDEX `OrdonantariPlata_idFurnizor_dataord_idx`(`idFurnizor`, `dataord`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ReceptiiOrdonantari` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idOrdonantare` INTEGER NOT NULL,
    `idReceptie` INTEGER NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `ReceptiiOrdonantari_idReceptie_idx`(`idReceptie`),
    UNIQUE INDEX `ReceptiiOrdonantari_idOrdonantare_idReceptie_key`(`idOrdonantare`, `idReceptie`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `OrdonantariPlata` ADD CONSTRAINT `OrdonantariPlata_idFurnizor_fkey` FOREIGN KEY (`idFurnizor`) REFERENCES `furnizori`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReceptiiOrdonantari` ADD CONSTRAINT `ReceptiiOrdonantari_idOrdonantare_fkey` FOREIGN KEY (`idOrdonantare`) REFERENCES `OrdonantariPlata`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReceptiiOrdonantari` ADD CONSTRAINT `ReceptiiOrdonantari_idReceptie_fkey` FOREIGN KEY (`idReceptie`) REFERENCES `Receptii`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
