-- CreateTable
CREATE TABLE `compartimente` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `denumire` VARCHAR(255) NOT NULL,
    `idresponsabil` INTEGER NOT NULL,
    `stare` VARCHAR(24) NULL DEFAULT 'activ',
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `compartimente_idresponsabil_key`(`idresponsabil`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `compartimente` ADD CONSTRAINT `compartimente_idresponsabil_fkey` FOREIGN KEY (`idresponsabil`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
