import "server-only";

import { db } from "@/app/_lib/prisma";

export const getTotalProducts = async (): Promise<number> => {
  return db.product.count();
};
