import "server-only";
import { db } from "@/app/_lib/prisma";

export const getTotalInStock = async (): Promise<number> => {
  const totalStock = await db.product.aggregate({
    _sum: {
      stock: true,
    },
  });
  return Number(totalStock._sum.stock);
};
