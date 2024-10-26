-- CreateTable
CREATE TABLE `Angajamente` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `numar` VARCHAR(191) NOT NULL,
    `data` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `idCategorie` INTEGER NOT NULL,
    `idCompartiment` INTEGER NOT NULL,
    `descriere` TEXT NOT NULL,
    `exercitiuBugetar` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Angajamente_numar_key`(`numar`),
    INDEX `Angajamente_exercitiuBugetar_idCompartiment_idx`(`exercitiuBugetar`, `idCompartiment`),
    INDEX `Angajamente_idCategorie_exercitiuBugetar_idx`(`idCategorie`, `exercitiuBugetar`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ModificariAngajamente` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idAngajament` INTEGER NOT NULL,
    `tipModificare` ENUM('MAJORARE', 'DIMINUARE') NOT NULL,
    `suma` DECIMAL(15, 2) NOT NULL,
    `motiv` TEXT NOT NULL,
    `idUser` INTEGER NOT NULL,
    `sumaBuget` DECIMAL(15, 2) NOT NULL,
    `disponibilBugetar` DECIMAL(15, 2) NOT NULL,
    `vizaCFPP` BOOLEAN NOT NULL DEFAULT false,
    `nr_viza` VARCHAR(191) NULL,
    `dataCFPP` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ModificariAngajamente_idAngajament_created_at_idx`(`idAngajament`, `created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Angajamente` ADD CONSTRAINT `Angajamente_idCategorie_fkey` FOREIGN KEY (`idCategorie`) REFERENCES `Categorii`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Angajamente` ADD CONSTRAINT `Angajamente_idCompartiment_fkey` FOREIGN KEY (`idCompartiment`) REFERENCES `compartimente`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ModificariAngajamente` ADD CONSTRAINT `ModificariAngajamente_idAngajament_fkey` FOREIGN KEY (`idAngajament`) REFERENCES `Angajamente`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ModificariAngajamente` ADD CONSTRAINT `ModificariAngajamente_idUser_fkey` FOREIGN KEY (`idUser`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
