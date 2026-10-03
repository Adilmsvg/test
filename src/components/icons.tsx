interface IconProps {
  size?: number;
  className?: string;
}

export const WhatsAppIcon = ({ size = 40, className }: IconProps) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.18 8.18 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.41a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.98-.14.16-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.42l-.48-.01c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.29Z" />
  </svg>
);

export const UserIcon = ({ size = 48, className }: IconProps) => (
  <svg
    className={className}
    viewBox="0 0 48 48"
    width={size}
    height={size}
    aria-hidden="true"
  >
    <circle cx="24" cy="24" r="24" fill="#6a7175" />
    <circle cx="24" cy="18" r="8" fill="#cfd4d6" />
    <path d="M8 42c2-8 8-12 16-12s14 4 16 12Z" fill="#cfd4d6" />
  </svg>
);

export const PlusIcon = ({ size = 24, className }: IconProps) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M20 14h-6v6h-4v-6H4v-4h6V4h4v6h6Z" />
  </svg>
);

export const LogoutIcon = ({ size = 24, className }: IconProps) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M10 18v-4H4v-4h6V6l8 6Zm2-16a10 10 0 0 1 0 20v-2a8 8 0 0 0 0-16Z" />
  </svg>
);

export const BackIcon = ({ size = 24, className }: IconProps) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M20 10v4H8l6 6-2 2-10-10 10-10 2 2-6 6Z" />
  </svg>
);

export const SendIcon = ({ size = 24, className }: IconProps) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M2 2v8l16 2-16 2v8l20-10Z" />
  </svg>
);

export const ClockIcon = ({ size = 16, className }: IconProps) => (
  <svg
    className={className}
    viewBox="0 0 16 16"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <circle cx="8" cy="8" r="6" />
    <path d="M8 4v4l2 2" />
  </svg>
);

export const CheckIcon = ({ size = 16, className }: IconProps) => (
  <svg
    className={className}
    viewBox="0 0 16 16"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <path d="M2 8l4 4 6-8" />
    <path d="M8 12l6-8" />
  </svg>
);
