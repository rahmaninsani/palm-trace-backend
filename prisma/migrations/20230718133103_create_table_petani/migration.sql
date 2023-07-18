-- CreateTable
CREATE TABLE `petani` (
    `id` CHAR(36) NOT NULL,
    `id_akun` CHAR(36) NOT NULL,
    `id_koperasi` CHAR(36) NOT NULL,
    `nik` CHAR(16) NULL,
    `nama` VARCHAR(200) NOT NULL,
    `alamat` TEXT NOT NULL,
    `nomor_telepon` VARCHAR(20) NOT NULL,
    `nomor_rekening` VARCHAR(20) NULL,
    `nama_bank` VARCHAR(200) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `petani_id_akun_key`(`id_akun`),
    UNIQUE INDEX `petani_nik_key`(`nik`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB;

-- AddForeignKey
ALTER TABLE `petani` ADD CONSTRAINT `petani_id_akun_fkey` FOREIGN KEY (`id_akun`) REFERENCES `akun`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `petani` ADD CONSTRAINT `petani_id_koperasi_fkey` FOREIGN KEY (`id_koperasi`) REFERENCES `koperasi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
