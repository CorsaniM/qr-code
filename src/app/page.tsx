"use client"

import { Title } from "./components/ui/title";
import Link from "next/link";

export default function Page() {

  return (
      <main className="flex min-h-screen flex-col items-center justify-center">
      <Title>Bienvenido</Title>


     <Link href="/integrantes">pagina integrantes</Link>

    </main>
  )

}