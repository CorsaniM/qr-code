"use client"

import Link from "next/link";
export default function Page() {
  return (
      <main className="flex min-h-screen flex-col items-center justify-center">
      <Link href={"/integrantes"}> Home</Link>
      <h1>Hola</h1>
      </main>
  );
}
