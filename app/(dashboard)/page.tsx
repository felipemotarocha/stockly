import { DollarSign } from "lucide-react";
import { getRevenueLast14Days } from "../_data-access/sale/get-last-14-days-revenue";
import { formatCurrency } from "../_helpers/currency";
import { db } from "../_lib/prisma";
import RevenueChart from "./_components/revenue-chart";

const Home = async () => {
  const totalRevenue = await db.saleProduct.aggregate({
    _sum: {
      unitPrice: true,
    },
  });
  const todayRevenue = await db.saleProduct.aggregate({
    _sum: {
      unitPrice: true,
    },
    where: {
      createdAt: {
        gte: new Date(new Date().setHours(0, 0, 0, 0)),
        lt: new Date(new Date().setHours(23, 59, 59, 999)),
      },
    },
  });
  const chartData = await getRevenueLast14Days();
  return (
    <div className="flex w-full flex-col space-y-4 p-8">
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-white p-6">
          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-md bg-emerald-500 bg-opacity-10">
            <DollarSign className="text-emerald-500" />
          </div>
          <p className="text-sm font-medium text-slate-500">Receita total</p>
          <p className="text-2xl font-semibold text-slate-900">
            {formatCurrency(Number(totalRevenue._sum.unitPrice))}
          </p>
        </div>

        <div className="rounded-xl bg-white p-6">
          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-md bg-emerald-500 bg-opacity-10">
            <DollarSign className="text-emerald-500" />
          </div>
          <p className="text-sm font-medium text-slate-500">Receita hoje</p>
          <p className="text-2xl font-semibold text-slate-900">
            {formatCurrency(Number(todayRevenue._sum.unitPrice))}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3">
        <div className="rounded-xl bg-white p-6">
          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-md bg-emerald-500 bg-opacity-10">
            <DollarSign className="text-emerald-500" />
          </div>
          <p className="text-sm font-medium text-slate-500">Vendas totais</p>
          <p className="text-2xl font-semibold text-slate-900">
            {formatCurrency(Number(todayRevenue._sum.unitPrice))}
          </p>
        </div>
        <div className="rounded-xl bg-white p-6">
          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-md bg-emerald-500 bg-opacity-10">
            <DollarSign className="text-emerald-500" />
          </div>
          <p className="text-sm font-medium text-slate-500">Vendas totais</p>
          <p className="text-2xl font-semibold text-slate-900">
            {formatCurrency(Number(todayRevenue._sum.unitPrice))}
          </p>
        </div>
        <div className="rounded-xl bg-white p-6">
          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-md bg-emerald-500 bg-opacity-10">
            <DollarSign className="text-emerald-500" />
          </div>
          <p className="text-sm font-medium text-slate-500">Vendas totais</p>
          <p className="text-2xl font-semibold text-slate-900">
            {formatCurrency(Number(todayRevenue._sum.unitPrice))}
          </p>
        </div>
      </div>

      <div className="flex h-full flex-col overflow-hidden rounded-xl bg-white p-6">
        <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-md bg-emerald-500 bg-opacity-10">
          <DollarSign className="text-emerald-500" />
        </div>
        <p className="text-sm font-medium text-slate-500">Receita total</p>
        <p className="text-2xl font-semibold text-slate-900">
          {formatCurrency(Number(totalRevenue._sum.unitPrice))}
        </p>

        <RevenueChart data={chartData} />
      </div>
    </div>
  );
};

export default Home;
