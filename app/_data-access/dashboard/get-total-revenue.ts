import "server-only";

import { db } from "@/app/_lib/prisma";

export const getTotalRevenue = async (): Promise<number> => {
  await new Promise((resolve) => setTimeout(resolve, 3500));
  const totalRevenueQuery = `
    SELECT SUM("SaleProduct"."unitPrice" * "SaleProduct"."quantity") as "totalRevenue"
    FROM "SaleProduct"
    JOIN "Sale" ON "SaleProduct"."saleId" = "Sale"."id";
  `;
  const totalRevenue =
    await db.$queryRawUnsafe<{ totalRevenue: number }[]>(totalRevenueQuery);
  return totalRevenue[0].totalRevenue;
};
