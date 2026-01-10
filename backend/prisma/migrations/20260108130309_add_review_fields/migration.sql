-- AlterTable
ALTER TABLE "reviews" ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "local_guide" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "review_count" INTEGER,
ADD COLUMN     "source" TEXT NOT NULL DEFAULT 'Google';
