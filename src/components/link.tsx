import NextLink from 'next/link';

export default function Link({
  href,
  children,
  isExternal = true,
}: {
  href: string;
  children: React.ReactNode;
  isExternal?: boolean;
}) {
  return (
    <NextLink
      className="text-blue-500 font-semibold hover:underline"
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
    >
      {children}
    </NextLink>
  );
}
