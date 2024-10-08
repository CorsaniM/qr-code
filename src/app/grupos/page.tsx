"use client"

import { link } from "fs"
import Link from "next/link"
import { api } from "~/trpc/react"

export default function Page(){

const {data:grupos} = api.grupos.list.useQuery()
    return(
        <div>
            <h1 >Hola grupos</h1>
            {grupos?.map((grupo) => (
                <Link href={`/grupos/${grupo.id}`} key={grupo.id}>
                <h1>{grupo.id}-{grupo.name}</h1>
                </Link>
            ))}
        </div>
    )
    }
    