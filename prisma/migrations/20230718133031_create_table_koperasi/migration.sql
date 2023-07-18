-- CreateTable
CREATE TABLE `koperasi` (
    `id` CHAR(36) NOT NULL,
    `id_akun` CHAR(36) NOT NULL,
    `siup` CHAR(50) NULL,
    `nama` VARCHAR(200) NOT NULL,
    `alamat` TEXT NOT NULL,
    `nomor_telepon` VARCHAR(20) NOT NULL,
    `nomor_rekening` VARCHAR(20) NULL,
    `nama_bank` VARCHAR(200) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `koperasi_id_akun_key`(`id_akun`),
    UNIQUE INDEX `koperasi_siup_key`(`siup`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB;

-- AddForeignKey
ALTER TABLE `koperasi` ADD CONSTRAINT `koperasi_id_akun_fkey` FOREIGN KEY (`id_akun`) REFERENCES `akun`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
