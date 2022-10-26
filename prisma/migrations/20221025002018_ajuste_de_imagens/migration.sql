-- AlterTable
ALTER TABLE `Category` MODIFY `img` TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `Product` MODIFY `img` TEXT NOT NULL,
    MODIFY `description` TEXT NOT NULL;
