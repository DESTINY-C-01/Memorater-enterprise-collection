import { createClient } from '@/lib/supabase/server';
import { OrderStatusSelect } from '@/components/admin/order-status-select';
import { OrderStatus } from '@/types';

async function getOrders() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('orders')
    .select('id, order_number, customer_name, phone_number, delivery_location, total_amount, currency, status, created_at')
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  return data ?? [];
}

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div>
      <h1 className="font-display text-2xl mb-8">Orders</h1>

      <div className="border border-black/10 rounded-xl2 overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-black/5 text-left text-xs text-brand-black/50">
            <tr>
              <th className="px-4 py-3">Order #</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t border-black/5">
                <td className="px-4 py-3 font-medium whitespace-nowrap">{order.order_number}</td>
                <td className="px-4 py-3 whitespace-nowrap">{order.customer_name}</td>
                <td className="px-4 py-3 whitespace-nowrap">{order.phone_number}</td>
                <td className="px-4 py-3">{order.delivery_location}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {order.currency} {order.total_amount}
                </td>
                <td className="px-4 py-3">
                  <OrderStatusSelect orderId={order.id} status={order.status as OrderStatus} />
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-brand-black/40">
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
