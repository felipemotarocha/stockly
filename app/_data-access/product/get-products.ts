import "server-only";

import { db } from "@/app/_lib/prisma";
import { Product } from "@prisma/client";

export const getProducts = async (): Promise<Product[]> => {
  return db.product.findMany({});
};
