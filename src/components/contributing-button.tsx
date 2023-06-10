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
      className="max-w-max rounded-xl bg-white px-4 py-2 font-display font-bold text-blue-500 transition-colors duration-200 ease-in-out hover:bg-opacity-80"
      role="button"
      onClick={() => {
        smoothScrollTo('#contributing');
        window.history.pushState({}, '', '#contributing');
      }}
    >
      How does this work? (And how can I contribute?)
    </a>
  );
}
