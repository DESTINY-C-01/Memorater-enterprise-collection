export const metadata = { title: 'FAQ' };

const FAQS = [
  {
    q: 'How do I place an order?',
    a: 'Add your desired items to the bag, fill in your name, phone number and delivery location at checkout, then tap "Order on WhatsApp." Your order summary will be sent directly to us.',
  },
  {
    q: 'Do you accept online payment?',
    a: 'No — we do not process payments on the website. Once your order is confirmed on WhatsApp, we will share payment instructions directly.',
  },
  {
    q: 'Which currencies can I shop in?',
    a: 'You can switch between Nigerian Naira (₦), Ghanaian Cedi (GH₵), and West African CFA Franc (CFA) using the currency selector in the header.',
  },
  {
    q: 'How long does delivery take?',
    a: 'Delivery timelines depend on your location and will be confirmed with you directly after your order is placed.',
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
      <h1 className="font-display text-3xl mb-8">Frequently Asked Questions</h1>
      <div className="space-y-6">
        {FAQS.map((item) => (
          <div key={item.q} className="border-b border-black/10 pb-6">
            <h3 className="font-medium mb-2">{item.q}</h3>
            <p className="text-sm text-brand-black/60 leading-relaxed">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
