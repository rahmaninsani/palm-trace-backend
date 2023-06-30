-- AlterTable
ALTER TABLE `akun` MODIFY `id` BINARY(16) NOT NULL DEFAULT (UUID_TO_BIN(UUID(), 1));

-- AlterTable
ALTER TABLE `dinas` MODIFY `id` BINARY(16) NOT NULL DEFAULT (UUID_TO_BIN(UUID(), 1));

-- AlterTable
ALTER TABLE `koperasi` MODIFY `id` BINARY(16) NOT NULL DEFAULT (UUID_TO_BIN(UUID(), 1));

-- AlterTable
ALTER TABLE `pabrik_kelapa_sawit` MODIFY `id` BINARY(16) NOT NULL DEFAULT (UUID_TO_BIN(UUID(), 1));

-- AlterTable
ALTER TABLE `petani` MODIFY `id` BINARY(16) NOT NULL DEFAULT (UUID_TO_BIN(UUID(), 1));

-- CreateTable
CREATE TABLE `session` (
    `id` VARCHAR(191) NOT NULL,
    `sid` VARCHAR(191) NOT NULL,
    `data` TEXT NOT NULL,
    `expires_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `session_sid_key`(`sid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB;
