'use client';

function smoothScrollTo(selector: string) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const element = document.querySelector(selector);
  if (element) {
    element.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'center',
      inline: 'center',
    });
  }
}

export default function ContributingButton() {
  return (
    <a
      className="max-w-max rounded-xl bg-blue-500 px-4 py-2 font-display font-bold text-white transition-colors duration-200 ease-in-out hover:bg-blue-600"
      role="button"
      onClick={() => {
        smoothScrollTo('#contributing');
        window.history.pushState({}, '', '#contributing');
      }}
    >
      How does this site work, and how can I help?
    </a>
  );
}
