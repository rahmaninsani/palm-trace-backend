-- CreateTable
CREATE TABLE `akun` (
    `id` BINARY(16) NOT NULL DEFAULT (UUID_TO_BIN(UUID(), 1)),
    `email` VARCHAR(200) NOT NULL,
    `password` VARCHAR(200) NOT NULL,
    `role` ENUM('dinas', 'petani', 'koperasi', 'pks') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `akun_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB;
