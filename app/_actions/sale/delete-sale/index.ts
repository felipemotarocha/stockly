"use server";

import { actionClient } from "@/app/_lib/safe-action";
import { deleteSaleSchema } from "./schema";
import { db } from "@/app/_lib/prisma";
import { revalidatePath } from "next/cache";

export const deleteSale = actionClient
  .schema(deleteSaleSchema)
  .action(async ({ parsedInput: { id } }) => {
    await db.$transaction(async (trx) => {
      const sale = await trx.sale.findUnique({
        where: {
          id,
        },
        include: {
          saleProducts: true,
        },
      });
      if (!sale) return;
      await trx.sale.delete({
        where: {
          id,
        },
      });
      for (const product of sale.saleProducts) {
        await trx.product.update({
          where: {
            id: product.productId,
          },
          data: {
            stock: {
              increment: product.quantity,
            },
          },
        });
      }
    });
    revalidatePath("/", "layout");
  });
