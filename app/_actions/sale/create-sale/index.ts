"use server";

import { db } from "@/app/_lib/prisma";
import { createSaleSchema } from "./schema";
import { revalidatePath } from "next/cache";
import { actionClient } from "@/app/_lib/safe-action";
import { returnValidationErrors } from "next-safe-action";

export const createSale = actionClient
  .schema(createSaleSchema)
  .action(async ({ parsedInput: { saleId, products } }) => {
    await db.$transaction(async (trx) => {
      if (saleId) {
        const existingSale = await trx.sale.findUnique({
          where: {
            id: saleId,
          },
          include: {
            saleProducts: true,
          },
        });
        if (!existingSale) return;
        await trx.sale.delete({
          where: {
            id: saleId,
          },
        });
        for (const product of existingSale?.saleProducts) {
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
      }
      const sale = await trx.sale.create({
        data: {
          date: new Date(),
        },
      });
      for (const product of products) {
        const productFromDb = await trx.product.findUnique({
          where: {
            id: product.id,
          },
        });
        if (!productFromDb) {
          returnValidationErrors(createSaleSchema, {
            _errors: ["Product not found."],
          });
        }
        const productIsOutOfStock = product.quantity > productFromDb.stock;
        if (productIsOutOfStock) {
          returnValidationErrors(createSaleSchema, {
            _errors: ["Product out of stock."],
          });
        }
        await trx.saleProduct.create({
          data: {
            saleId: sale.id,
            productId: product.id,
            quantity: product.quantity,
            unitPrice: productFromDb.price,
          },
        });
        await trx.product.update({
          where: {
            id: product.id,
          },
          data: {
            stock: {
              decrement: product.quantity,
            },
          },
        });
      }
    });
    revalidatePath("/products");
  });
