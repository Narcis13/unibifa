-- CreateTable
CREATE TABLE `Receptii` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idAngajament` INTEGER NOT NULL,
    `idFurnizor` INTEGER NOT NULL,
    `datafact` DATETIME(3) NOT NULL,
    `valoare` DECIMAL(15, 2) NOT NULL,
    `mentiuni` TEXT NULL,
    `stare` VARCHAR(24) NOT NULL DEFAULT 'activ',
    `idCompartiment` INTEGER NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(3) NULL,

    INDEX `Receptii_idAngajament_datafact_idx`(`idAngajament`, `datafact`),
    INDEX `Receptii_idFurnizor_datafact_idx`(`idFurnizor`, `datafact`),
    INDEX `Receptii_idCompartiment_datafact_idx`(`idCompartiment`, `datafact`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Receptii` ADD CONSTRAINT `Receptii_idAngajament_fkey` FOREIGN KEY (`idAngajament`) REFERENCES `Angajamente`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Receptii` ADD CONSTRAINT `Receptii_idFurnizor_fkey` FOREIGN KEY (`idFurnizor`) REFERENCES `furnizori`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Receptii` ADD CONSTRAINT `Receptii_idCompartiment_fkey` FOREIGN KEY (`idCompartiment`) REFERENCES `compartimente`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
