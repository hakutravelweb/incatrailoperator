-- CreateEnum
CREATE TYPE "Variant" AS ENUM ('ATTRACTION', 'PACKAGE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttractionProduct" (
    "id" TEXT NOT NULL,
    "variant" "Variant" NOT NULL,
    "slug" JSONB NOT NULL,
    "photos" TEXT[],
    "title" JSONB NOT NULL,
    "duration" JSONB NOT NULL,
    "about" JSONB NOT NULL,
    "labels" JSONB NOT NULL,
    "cancellationPolicy" JSONB NOT NULL,
    "guideLanguages" JSONB NOT NULL,
    "pickUpService" JSONB NOT NULL,
    "startTime" JSONB NOT NULL,
    "finishTime" JSONB NOT NULL,
    "highlights" JSONB NOT NULL,
    "detailedDescription" JSONB NOT NULL,
    "importantNote" JSONB NOT NULL,
    "includes" JSONB NOT NULL,
    "notIncluded" JSONB NOT NULL,
    "importantWarning" JSONB NOT NULL,
    "recommendations" JSONB NOT NULL,
    "additionalAdvice" JSONB NOT NULL,
    "freeCancellation" JSONB NOT NULL,
    "refundable" JSONB NOT NULL,
    "attractionMap" TEXT NOT NULL,
    "attractionVideo" TEXT NOT NULL,
    "attractionPdf" TEXT NOT NULL,
    "retailPrice" DOUBLE PRECISION NOT NULL,
    "specialPrice" DOUBLE PRECISION NOT NULL,
    "categoryId" TEXT NOT NULL,
    "destinationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AttractionProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Route" (
    "id" TEXT NOT NULL,
    "title" JSONB NOT NULL,
    "attractionProductId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Route_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Waypoint" (
    "id" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "title" JSONB NOT NULL,
    "description" JSONB NOT NULL,
    "routeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Waypoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AskedQuestion" (
    "id" TEXT NOT NULL,
    "title" JSONB NOT NULL,
    "description" JSONB NOT NULL,
    "attractionProductId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AskedQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "traveller" JSONB NOT NULL,
    "comment" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "attractionProductId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "title" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Destination" (
    "id" TEXT NOT NULL,
    "title" JSONB NOT NULL,
    "department" JSONB NOT NULL,
    "about" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Destination_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "AttractionProduct" ADD CONSTRAINT "AttractionProduct_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttractionProduct" ADD CONSTRAINT "AttractionProduct_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Route" ADD CONSTRAINT "Route_attractionProductId_fkey" FOREIGN KEY ("attractionProductId") REFERENCES "AttractionProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Waypoint" ADD CONSTRAINT "Waypoint_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AskedQuestion" ADD CONSTRAINT "AskedQuestion_attractionProductId_fkey" FOREIGN KEY ("attractionProductId") REFERENCES "AttractionProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_attractionProductId_fkey" FOREIGN KEY ("attractionProductId") REFERENCES "AttractionProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
