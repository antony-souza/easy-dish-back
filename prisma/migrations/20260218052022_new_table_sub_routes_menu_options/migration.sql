-- CreateEnum
CREATE TYPE "DeviceType" AS ENUM ('desktop', 'mobile');

-- CreateTable
CREATE TABLE "menu_options" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "device_type" "DeviceType" NOT NULL DEFAULT 'desktop',
    "role_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "menu_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sub_menu_options" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "menu_option_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "sub_menu_options_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "menu_options_slug_key" ON "menu_options"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "sub_menu_options_slug_key" ON "sub_menu_options"("slug");

-- AddForeignKey
ALTER TABLE "menu_options" ADD CONSTRAINT "menu_options_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_menu_options" ADD CONSTRAINT "sub_menu_options_menu_option_id_fkey" FOREIGN KEY ("menu_option_id") REFERENCES "menu_options"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
