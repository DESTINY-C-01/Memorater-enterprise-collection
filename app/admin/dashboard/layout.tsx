import { AdminSidebar } from '@/components/admin/admin-sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-brand-white overflow-x-hidden">
      <AdminSidebar />
      <main className="flex-1 p-4 sm:p-8 lg:p-12 overflow-y-auto min-w-0">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}