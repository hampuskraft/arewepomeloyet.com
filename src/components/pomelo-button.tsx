export default function PomeloButton() {
  return (
    <div className="my-4 flex flex-col gap-4">
      <button
        disabled
        className="max-w-max rounded-xl bg-gray-500 px-4 py-2 font-display font-bold text-white cursor-not-allowed"
      >
        I got Pomelo&apos;d!
      </button>

      <div className="flex flex-col gap-2 font-body text-base font-light text-gray-700 dark:text-gray-400">
        <p>User IDs were anonymized with a hash function (SHA-256).</p>
        <p>
          Only the user ID hash, registration date (month and year), and Nitro status (Early Supporter included) were
          stored.
        </p>
      </div>
    </div>
  );
}
