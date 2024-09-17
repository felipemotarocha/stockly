"use server";

import { db } from "@/app/_lib/prisma";
import { createSaleSchema } from "./schema";
import { revalidatePath } from "next/cache";
import { actionClient } from "@/app/_lib/safe-action";
import { returnValidationErrors } from "next-safe-action";

export const createSale = actionClient
  .schema(createSaleSchema)
  .action(async ({ parsedInput: { products } }) => {
    await db.$transaction(async (trx) => {
      const sale = await trx.sale.create({
        data: {
          date: new Date(),
        },
      });
      for (const product of products) {
        const productFromDb = await db.product.findUnique({
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
