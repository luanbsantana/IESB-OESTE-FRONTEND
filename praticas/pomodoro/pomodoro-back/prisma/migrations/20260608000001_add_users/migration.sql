-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `resetToken` VARCHAR(191) NULL,
    `resetTokenExpiry` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Alter Settings: drop old PK, add userId column, make id auto-increment
ALTER TABLE `Settings`
    ADD COLUMN `userId` VARCHAR(191) NULL;

-- Alter Task: add userId column
ALTER TABLE `Task`
    ADD COLUMN `userId` VARCHAR(191) NULL;

-- If there are existing rows, they reference no user — handled by app at startup.

-- AddForeignKey
ALTER TABLE `Settings` ADD CONSTRAINT `Settings_userId_fkey`
    FOREIGN KEY (`userId`) REFERENCES `User`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Task` ADD CONSTRAINT `Task_userId_fkey`
    FOREIGN KEY (`userId`) REFERENCES `User`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE;

-- UniqueIndex on Settings.userId
CREATE UNIQUE INDEX `Settings_userId_key` ON `Settings`(`userId`);

-- Index on Task.userId
CREATE INDEX `Task_userId_idx` ON `Task`(`userId`);
