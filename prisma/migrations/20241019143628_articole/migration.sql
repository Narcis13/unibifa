-- CreateTable
CREATE TABLE `articolebugetare` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `denumire` VARCHAR(255) NOT NULL,
    `cod` VARCHAR(64) NOT NULL,
    `iban` VARCHAR(24) NULL,
    `codang` VARCHAR(24) NULL,
    `indicator` VARCHAR(24) NULL,
    `stare` VARCHAR(24) NULL DEFAULT 'activ',
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
