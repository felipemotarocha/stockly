import "server-only";

import { db } from "@/app/_lib/prisma";
import dayjs from "dayjs";

export interface GetRevenueLast14DaysDto {
  date: string;
  revenue: number;
}

export const getRevenueLast14Days = async (): Promise<
  GetRevenueLast14DaysDto[]
> => {
  const today = dayjs().startOf("day");
  const last14Days = [...Array(14).keys()].map((i) => today.subtract(i, "day"));

  const revenueData: GetRevenueLast14DaysDto[] = [];

  for (const day of last14Days) {
    const dayTotalRevenue = await db.saleProduct.aggregate({
      _sum: {
        unitPrice: true,
      },
      where: {
        sale: {
          date: {
            gte: day.startOf("day").toDate(),
            lt: day.endOf("day").toDate(),
          },
        },
      },
    });
    revenueData.push({
      date: day.format("DD/MM"),
      revenue: Number(dayTotalRevenue._sum.unitPrice) || 0,
    });
  }

  return revenueData.reverse();
};
