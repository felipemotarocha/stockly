import "server-only";

import { db } from "@/app/_lib/prisma";

export interface SaleProductDto {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface SaleDto {
  id: string;
  saleProducts: SaleProductDto[];
  productNames: string;
  totalProducts: number;
  totalAmount: number;
  date: Date;
}

export const getSales = async (): Promise<SaleDto[]> => {
  const sales = await db.sale.findMany({
    include: {
      saleProducts: {
        include: { product: true },
      },
    },
  });
  return sales.map((sale) => ({
    id: sale.id,
    date: sale.date,
    saleProducts: sale.saleProducts.map(
      (product): SaleProductDto => ({
        name: product.product.name,
        productId: product.productId,
        quantity: product.quantity,
        unitPrice: Number(product.unitPrice),
      }),
    ),
    productNames: sale.saleProducts
      .map((saleProduct) => saleProduct.product.name)
      .join(" • "),
    totalAmount: sale.saleProducts.reduce(
      (acc, saleProduct) =>
        acc + saleProduct.quantity * Number(saleProduct.unitPrice),
      0,
    ),
    totalProducts: sale.saleProducts.reduce(
      (acc, saleProduct) => acc + saleProduct.quantity,
      0,
    ),
  }));
};
