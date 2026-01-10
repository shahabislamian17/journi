/*
  Warnings:

  - You are about to drop the column `featured` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `local_guide` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `review_count` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `source` on the `reviews` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "featured",
DROP COLUMN "local_guide",
DROP COLUMN "review_count",
DROP COLUMN "source";

-- CreateTable
CREATE TABLE "website_reviews" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "review_count" INTEGER,
    "local_guide" BOOLEAN NOT NULL DEFAULT false,
    "source" TEXT NOT NULL DEFAULT 'Google',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "website_reviews_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "website_reviews" ADD CONSTRAINT "website_reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
