-- CreateTable
CREATE TABLE `FacturiPrimite` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idFurnizor` INTEGER NOT NULL,
    `numarFactura` VARCHAR(50) NOT NULL,
    `dataFactura` DATETIME(3) NOT NULL,
    `detaliiFactura` TEXT NULL,
    `valoare` DECIMAL(15, 2) NOT NULL,
    `idArticolBugetar` INTEGER NULL,
    `idSursaFinantare` INTEGER NULL,
    `idOrdonantare` INTEGER NULL,
    `idReceptie` INTEGER NULL,
    `idCompartiment` INTEGER NULL,
    `stare` VARCHAR(24) NOT NULL DEFAULT 'activ',
    `tipDocument` ENUM('FACTURA', 'AVIZ', 'CHITANTA', 'ALTE_DOCUMENTE') NOT NULL DEFAULT 'FACTURA',
    `termenPlata` DATETIME(3) NULL,
    `statusPlata` ENUM('NEPLATITA', 'PARTIAL_PLATITA', 'PLATITA', 'ANULATA') NOT NULL DEFAULT 'NEPLATITA',
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(3) NULL,

    INDEX `FacturiPrimite_idFurnizor_dataFactura_idx`(`idFurnizor`, `dataFactura`),
    INDEX `FacturiPrimite_idArticolBugetar_idx`(`idArticolBugetar`),
    INDEX `FacturiPrimite_idSursaFinantare_idx`(`idSursaFinantare`),
    INDEX `FacturiPrimite_idOrdonantare_idx`(`idOrdonantare`),
    INDEX `FacturiPrimite_idReceptie_idx`(`idReceptie`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `FacturiPrimite` ADD CONSTRAINT `FacturiPrimite_idFurnizor_fkey` FOREIGN KEY (`idFurnizor`) REFERENCES `furnizori`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FacturiPrimite` ADD CONSTRAINT `FacturiPrimite_idArticolBugetar_fkey` FOREIGN KEY (`idArticolBugetar`) REFERENCES `articolebugetare`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FacturiPrimite` ADD CONSTRAINT `FacturiPrimite_idSursaFinantare_fkey` FOREIGN KEY (`idSursaFinantare`) REFERENCES `sursefinantare`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FacturiPrimite` ADD CONSTRAINT `FacturiPrimite_idOrdonantare_fkey` FOREIGN KEY (`idOrdonantare`) REFERENCES `OrdonantariPlata`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FacturiPrimite` ADD CONSTRAINT `FacturiPrimite_idReceptie_fkey` FOREIGN KEY (`idReceptie`) REFERENCES `Receptii`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FacturiPrimite` ADD CONSTRAINT `FacturiPrimite_idCompartiment_fkey` FOREIGN KEY (`idCompartiment`) REFERENCES `compartimente`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
