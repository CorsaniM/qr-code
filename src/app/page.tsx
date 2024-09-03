"use client"

import { Title } from "./components/ui/title";
import Link from "next/link";

export default function Page() {

  return (
      <main className="">
      <Title>Bienvenido</Title>


     <Link href="/integrantes">pagina integrantes</Link>

    </main>
  )

}