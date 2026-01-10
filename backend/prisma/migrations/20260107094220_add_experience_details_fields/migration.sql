-- AlterTable
ALTER TABLE "experiences" ADD COLUMN     "accessibility" TEXT,
ADD COLUMN     "cancellation_policy" TEXT,
ADD COLUMN     "included_items" TEXT,
ADD COLUMN     "languages" TEXT,
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "location_details" TEXT,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "requirements" TEXT;

-- CreateTable
CREATE TABLE "availability_slots" (
    "id" TEXT NOT NULL,
    "experience_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "start_time" TEXT,
    "end_time" TEXT,
    "price" DOUBLE PRECISION,
    "max_guests" INTEGER DEFAULT 10,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "availability_slots_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "availability_slots" ADD CONSTRAINT "availability_slots_experience_id_fkey" FOREIGN KEY ("experience_id") REFERENCES "experiences"("id") ON DELETE CASCADE ON UPDATE CASCADE;
