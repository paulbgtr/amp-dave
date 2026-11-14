import type { SVGProps } from "react";

function Icon({ children, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export const LockIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /><path d="M12 15v2" /></Icon>
);
export const PeopleIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}><circle cx="9" cy="8" r="3" /><path d="M3.5 19a5.5 5.5 0 0 1 11 0" /><circle cx="17" cy="9" r="2.5" /><path d="M15.5 14.2A4.5 4.5 0 0 1 21 18.5" /></Icon>
);
export const CheckIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}><path d="M5 12.5l4.5 4.5L19 7.5" /></Icon>
);
export const EyeIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" /><circle cx="12" cy="12" r="3" /></Icon>
);
export const BrainIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}><path d="M9 4.5a3 3 0 0 0-3 3 3 3 0 0 0-2 5.2A3 3 0 0 0 7 17a3 3 0 0 0 5 1.8V6a2.5 2.5 0 0 0-3-1.5Z" /><path d="M15 4.5a3 3 0 0 1 3 3 3 3 0 0 1 2 5.2A3 3 0 0 1 17 17a3 3 0 0 1-5 1.8" /></Icon>
);
export const HandIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}><path d="M8 13V6a1.5 1.5 0 0 1 3 0v5" /><path d="M11 10.5V4.5a1.5 1.5 0 0 1 3 0v6" /><path d="M14 10.5V6a1.5 1.5 0 0 1 3 0v7.5a6.5 6.5 0 0 1-6.5 6.5H10a5 5 0 0 1-4.1-2.2l-2.3-3.5a1.5 1.5 0 0 1 2.4-1.8L8 15" /></Icon>
);
export const RobotIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}><rect x="5" y="8" width="14" height="11" rx="3" /><path d="M12 8V4.5" /><circle cx="12" cy="3.5" r="1" /><circle cx="9.5" cy="13" r="1" /><circle cx="14.5" cy="13" r="1" /><path d="M2.5 12.5v3M21.5 12.5v3" /></Icon>
);
export const ShieldIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}><path d="M12 3l7 3v5.5c0 4.5-3 8-7 9.5-4-1.5-7-5-7-9.5V6l7-3Z" /><path d="M9 12l2 2 4-4" /></Icon>
);
export const HomeIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}><path d="M4 11l8-6.5 8 6.5" /><path d="M6 9.5V19h12V9.5" /><path d="M10 19v-5h4v5" /></Icon>
);
export const MailIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}><rect x="3" y="5.5" width="18" height="13" rx="2" /><path d="M3.5 7l8.5 6 8.5-6" /></Icon>
);
export const PinIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}><path d="M12 21s-6.5-5.7-6.5-11A6.5 6.5 0 0 1 18.5 10c0 5.3-6.5 11-6.5 11Z" /><circle cx="12" cy="10" r="2.5" /></Icon>
);
export const ArrowIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}><path d="M5 12h14M13 6l6 6-6 6" /></Icon>
);
export const PulseIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}><path d="M2.5 12h4l2.5-6 4 12 2.5-6h6" /></Icon>
);
