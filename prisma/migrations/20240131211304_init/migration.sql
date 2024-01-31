-- CreateTable
CREATE TABLE "Sub" (
    "username" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "tier" INTEGER NOT NULL,

    PRIMARY KEY ("username", "channel", "month", "year")
);
