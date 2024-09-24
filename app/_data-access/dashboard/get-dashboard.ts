import { db } from "@/app/_lib/prisma";

interface DashboardDto {
  totalRevenue: number;
  todayRevenue: number;
  totalSales: number;
  totalStock: number;
  totalProducts: number;
}

export const getDashboard = async (): Promise<DashboardDto> => {
  const totalRevenueQuery = `
    SELECT SUM("unitPrice" * "quantity") as "totalRevenue"
    FROM "SaleProduct";
  `;

  const todayRevenueQuery = `
    SELECT SUM("unitPrice" * "quantity") as "todayRevenue"
    FROM "SaleProduct"
    WHERE "createdAt" >= $1 AND "createdAt" <= $2;
  `;

  const startOfDay = new Date(new Date().setHours(0, 0, 0, 0));
  const endOfDay = new Date(new Date().setHours(23, 59, 59, 999));

  const totalRevenuePromise =
    db.$queryRawUnsafe<{ totalRevenue: number }[]>(totalRevenueQuery);
  const todayRevenuePromise = db.$queryRawUnsafe<{ todayRevenue: number }[]>(
    todayRevenueQuery,
    startOfDay,
    endOfDay,
  );

  const totalSalesPromise = db.sale.count();
  const totalStockPromise = db.product.aggregate({
    _sum: {
      stock: true,
    },
  });
  const totalProductsPromise = db.product.count();
  const [totalRevenue, todayRevenue, totalSales, totalStock, totalProducts] =
    await Promise.all([
      totalRevenuePromise,
      todayRevenuePromise,
      totalSalesPromise,
      totalStockPromise,
      totalProductsPromise,
    ]);
  return {
    totalRevenue: totalRevenue[0].totalRevenue,
    todayRevenue: todayRevenue[0].todayRevenue,
    totalSales,
    totalStock: Number(totalStock._sum.stock),
    totalProducts,
  };
};
