"use client";

import { CallbackCode, CallbackCodeToMessage } from "@/app/constants";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

async function handleOAuthRequest({
  code,
  state,
}: {
  code: string;
  state: string;
}) {
  const storedState = window.sessionStorage.getItem("state");
  if (storedState !== state) {
    return CallbackCode.StateMismatch;
  }

  try {
    const response = await fetch("/api/callback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });
    const json = await response.json();
    return json.status ?? CallbackCode.UnknownError;
  } catch (error) {
    return CallbackCode.UnknownError;
  } finally {
    window.sessionStorage.removeItem("state");
  }
}

export default function Callback() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState<CallbackCode>(CallbackCode.UnknownError);

  useEffect(() => {
    const code = searchParams?.get("code");
    const state = searchParams?.get("state");
    if (typeof code !== "string" || typeof state !== "string") {
      setStatus(CallbackCode.UnknownError);
      return;
    }

    handleOAuthRequest({ code, state }).then((status) => {
      setStatus(status);
      setIsLoading(false);
    });
  }, [searchParams]);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <h1 className="font-display text-4xl font-semibold text-black dark:text-white">
        {status === CallbackCode.Success
          ? "Great success!"
          : "Something's wrong, I can feel it"}
      </h1>
      <p className="font-body text-xl text-gray-700 dark:text-gray-400">
        {CallbackCodeToMessage[status]}
      </p>
      <a
        className="max-w-max rounded-xl bg-blue-500 px-4 py-2 font-display font-bold text-white transition-colors duration-200 ease-in-out hover:bg-blue-600"
        href="/"
        rel="noopener noreferrer"
      >
        Take me home, country roads
      </a>
    </main>
  );
}

function LoadingSpinner() {
  return (
    <svg
      className="animate-spin h-16 w-16 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
