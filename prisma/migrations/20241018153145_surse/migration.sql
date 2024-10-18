-- CreateTable
CREATE TABLE `sursefinantare` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `denumire` VARCHAR(255) NOT NULL,
    `cod` VARCHAR(64) NOT NULL,
    `scurt` VARCHAR(64) NOT NULL,
    `stare` VARCHAR(24) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
