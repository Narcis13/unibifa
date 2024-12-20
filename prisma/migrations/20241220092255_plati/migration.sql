-- CreateTable
CREATE TABLE `Plati` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `numarop` INTEGER NOT NULL,
    `anfiscal` INTEGER NOT NULL,
    `dataop` DATETIME(3) NOT NULL,
    `numefurnizor` VARCHAR(255) NOT NULL,
    `ibanplatitor` VARCHAR(34) NOT NULL,
    `ibanbeneficiar` VARCHAR(34) NOT NULL,
    `explicatii` TEXT NULL,
    `suma` DECIMAL(15, 2) NOT NULL,
    `codangajament` VARCHAR(24) NULL,
    `indicator` VARCHAR(24) NULL,
    `artbug` VARCHAR(24) NULL,
    `codfiscalfurnizor` VARCHAR(13) NOT NULL,
    `stare` VARCHAR(24) NOT NULL DEFAULT 'activ',
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(3) NULL,

    INDEX `Plati_codfiscalfurnizor_idx`(`codfiscalfurnizor`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FacturiPlati` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idFactura` INTEGER NOT NULL,
    `idPlata` INTEGER NOT NULL,
    `sumaAchitata` DECIMAL(15, 2) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `FacturiPlati_idFactura_idx`(`idFactura`),
    INDEX `FacturiPlati_idPlata_idx`(`idPlata`),
    UNIQUE INDEX `FacturiPlati_idFactura_idPlata_key`(`idFactura`, `idPlata`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `FacturiPlati` ADD CONSTRAINT `FacturiPlati_idFactura_fkey` FOREIGN KEY (`idFactura`) REFERENCES `FacturiPrimite`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FacturiPlati` ADD CONSTRAINT `FacturiPlati_idPlata_fkey` FOREIGN KEY (`idPlata`) REFERENCES `Plati`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
