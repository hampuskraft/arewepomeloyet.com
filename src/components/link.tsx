export default function Link({href, children}: {href: string; children: React.ReactNode}) {
  return (
    <a className="text-blue-500 font-semibold hover:underline" href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}
