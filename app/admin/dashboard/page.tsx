import { createClient } from '@/lib/supabase/server';

async function getStats() {
  const supabase = await createClient();

  const [{ count: productCount }, { count: orderCount }, { count: pendingCount }, { data: recentOrders }] =
    await Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }).is('deleted_at', null),
      supabase.from('orders').select('*', { count: 'exact', head: true }).is('deleted_at', null),
      supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')
        .is('deleted_at', null),
      supabase
        .from('orders')
        .select('id, order_number, customer_name, total_amount, currency, status, created_at')
        .order('created_at', { ascending: false })
        .limit(5),
    ]);

  return {
    productCount: productCount ?? 0,
    orderCount: orderCount ?? 0,
    pendingCount: pendingCount ?? 0,
    recentOrders: recentOrders ?? [],
  };
}

export default async function DashboardOverviewPage() {
  const stats = await getStats();

  const cards = [
    { label: 'Total Products', value: stats.productCount },
    { label: 'Total Orders', value: stats.orderCount },
    { label: 'Pending Orders', value: stats.pendingCount },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl lg:text-4xl mb-10">Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 lg:gap-6 mb-12">
        {cards.map((card) => (
          <div
            key={card.label}
            className="border border-black/10 rounded-xl2 p-7 lg:p-8 hover:border-brand-gold/40 transition-colors"
          >
            <p className="text-sm text-brand-black/50 mb-3">{card.label}</p>
            <p className="font-display text-4xl lg:text-5xl">{card.value}</p>
          </div>
        ))}
      </div>

      <h2 className="font-medium text-lg mb-5">Recent Orders</h2>
      <div className="border border-black/10 rounded-xl2 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm lg:text-base">
            <thead className="bg-black/5 text-left text-xs lg:text-sm text-brand-black/50">
              <tr>
                <th className="px-5 py-4">Order #</th>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Total</th>
                <th className="px-5 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((order) => (
                <tr key={order.id} className="border-t border-black/5">
                  <td className="px-5 py-4 font-medium whitespace-nowrap">{order.order_number}</td>
                  <td className="px-5 py-4 whitespace-nowrap">{order.customer_name}</td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    {order.currency} {order.total_amount}
                  </td>
                  <td className="px-5 py-4 capitalize whitespace-nowrap">{order.status}</td>
                </tr>
              ))}
              {stats.recentOrders.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-brand-black/40">
                    No orders yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}