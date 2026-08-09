import { BannerForm } from '@/components/admin/banner-form';

export default function NewBannerPage() {
  return (
    <div>
      <h1 className="font-display text-2xl mb-8">Add Banner</h1>
      <BannerForm />
    </div>
  );
}