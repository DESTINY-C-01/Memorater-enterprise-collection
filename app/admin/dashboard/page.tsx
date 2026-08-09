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
      <h1 className="font-display text-2xl mb-8">Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {cards.map((card) => (
          <div key={card.label} className="border border-black/10 rounded-xl2 p-6">
            <p className="text-xs text-brand-black/50 mb-2">{card.label}</p>
            <p className="font-display text-3xl">{card.value}</p>
          </div>
        ))}
      </div>

      <h2 className="font-medium mb-4">Recent Orders</h2>
      <div className="border border-black/10 rounded-xl2 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-black/5 text-left text-xs text-brand-black/50">
            <tr>
              <th className="px-4 py-3">Order #</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {stats.recentOrders.map((order) => (
              <tr key={order.id} className="border-t border-black/5">
                <td className="px-4 py-3 font-medium">{order.order_number}</td>
                <td className="px-4 py-3">{order.customer_name}</td>
                <td className="px-4 py-3">
                  {order.currency} {order.total_amount}
                </td>
                <td className="px-4 py-3 capitalize">{order.status}</td>
              </tr>
            ))}
            {stats.recentOrders.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-brand-black/40">
                  No orders yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
