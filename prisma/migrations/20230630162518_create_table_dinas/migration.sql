-- AlterTable
ALTER TABLE `akun` MODIFY `id` BINARY(16) NOT NULL DEFAULT (UUID_TO_BIN(UUID(), 1));

-- AlterTable
ALTER TABLE `koperasi` MODIFY `id` BINARY(16) NOT NULL DEFAULT (UUID_TO_BIN(UUID(), 1));

-- AlterTable
ALTER TABLE `pabrik_kelapa_sawit` MODIFY `id` BINARY(16) NOT NULL DEFAULT (UUID_TO_BIN(UUID(), 1));

-- AlterTable
ALTER TABLE `petani` MODIFY `id` BINARY(16) NOT NULL DEFAULT (UUID_TO_BIN(UUID(), 1));

-- CreateTable
CREATE TABLE `dinas` (
    `id` BINARY(16) NOT NULL DEFAULT (UUID_TO_BIN(UUID(), 1)),
    `id_akun` BINARY(16) NOT NULL,
    `nama` VARCHAR(200) NOT NULL,
    `alamat` TEXT NOT NULL,
    `nomor_telepon` VARCHAR(20) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `dinas_id_akun_key`(`id_akun`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB;

-- AddForeignKey
ALTER TABLE `dinas` ADD CONSTRAINT `dinas_id_akun_fkey` FOREIGN KEY (`id_akun`) REFERENCES `akun`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
