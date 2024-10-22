-- CreateTable
CREATE TABLE `Bugete` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idSursa` INTEGER NOT NULL,
    `idArticol` INTEGER NOT NULL,
    `explicatii` TEXT NOT NULL,
    `trimI` DECIMAL(15, 2) NOT NULL DEFAULT 0,
    `trimII` DECIMAL(15, 2) NOT NULL DEFAULT 0,
    `trimIII` DECIMAL(15, 2) NOT NULL DEFAULT 0,
    `trimIV` DECIMAL(15, 2) NOT NULL DEFAULT 0,
    `total` DECIMAL(15, 2) NOT NULL DEFAULT 0,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `lastUpdated` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Bugete_idSursa_idArticol_key`(`idSursa`, `idArticol`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Bugete` ADD CONSTRAINT `Bugete_idSursa_fkey` FOREIGN KEY (`idSursa`) REFERENCES `sursefinantare`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Bugete` ADD CONSTRAINT `Bugete_idArticol_fkey` FOREIGN KEY (`idArticol`) REFERENCES `articolebugetare`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
