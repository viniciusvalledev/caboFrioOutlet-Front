-- CreateTable
CREATE TABLE `HeroSlide` (
    `id` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `eyebrow` VARCHAR(191) NOT NULL DEFAULT '',
    `title` VARCHAR(191) NOT NULL,
    `highlight` VARCHAR(191) NOT NULL DEFAULT '',
    `subtitle` VARCHAR(191) NOT NULL DEFAULT '',
    `ctaLabel` VARCHAR(191) NOT NULL DEFAULT 'Ver Coleção',
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
