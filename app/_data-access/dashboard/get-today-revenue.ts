import "server-only";

import { db } from "@/app/_lib/prisma";

export const getTodayRevenue = async (): Promise<number> => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const todayRevenueQuery = `
    SELECT SUM("SaleProduct"."unitPrice" * "SaleProduct"."quantity") as "todayRevenue"
    FROM "SaleProduct"
    JOIN "Sale" ON "SaleProduct"."saleId" = "Sale"."id"
    WHERE "Sale"."date" >= $1 AND "Sale"."date" <= $2;
  `;
  const startOfDay = new Date(new Date().setHours(0, 0, 0, 0));
  const endOfDay = new Date(new Date().setHours(23, 59, 59, 999));
  const todayRevenue = await db.$queryRawUnsafe<{ todayRevenue: number }[]>(
    todayRevenueQuery,
    startOfDay,
    endOfDay,
  );
  return todayRevenue[0].todayRevenue;
};
