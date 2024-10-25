-- CreateTable
CREATE TABLE `regviza` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userid` INTEGER NOT NULL,
    `nume` VARCHAR(40) NOT NULL,
    `nrviza` INTEGER NOT NULL,
    `nrvizac` VARCHAR(12) NOT NULL,
    `dataviza` DATETIME(3) NOT NULL,
    `document` VARCHAR(40) NOT NULL,
    `explicatii` VARCHAR(80) NOT NULL,
    `compartiment` VARCHAR(40) NOT NULL,
    `valoare` DECIMAL(13, 2) NOT NULL,
    `stare` VARCHAR(12) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
