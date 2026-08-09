export function TikTokIcon({ size = 18, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M16.6 5.82c-.9-.62-1.53-1.6-1.72-2.73h-3.06v13.13c0 1.5-1.22 2.72-2.72 2.72-1.5 0-2.72-1.22-2.72-2.72 0-1.5 1.22-2.71 2.72-2.71.28 0 .54.04.8.12v-3.1a5.9 5.9 0 0 0-.8-.06 5.79 5.79 0 0 0-5.79 5.79A5.79 5.79 0 0 0 9.1 22a5.79 5.79 0 0 0 5.79-5.79V9.03a8.9 8.9 0 0 0 4.98 1.52V7.5a5.6 5.6 0 0 1-3.27-1.68z" />
    </svg>
  );
}