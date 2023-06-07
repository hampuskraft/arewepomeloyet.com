-- AlterTable
ALTER TABLE "pomelos" ADD COLUMN     "possibly_nitro" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "pomelos_possibly_nitro_idx" ON "pomelos"("possibly_nitro");
