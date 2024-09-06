"use client"

import { SelectItem } from "~/app/components/ui/select";
import { api } from "~/trpc/react";

export default function GruposPage(props:{params:{grupoId: string}}){

const grupoId = props.params.grupoId;
const {data: grupo} = api.grupos.get.useQuery({id: parseInt(grupoId)})

console.log(grupoId, grupo?.name, "test")
    return(
        <div>
            <h1>Hola grupos {grupo?.name}</h1>
            {grupo?.participantes ? grupo.participantes.map((part) => (
                <h1 key={part.id}>N {part.id}: {part.name} {part.lastname}</h1>
            )): null}
            {grupo?.tareas ? grupo.tareas.map((part) => (
                <h1 key={part.id}>N {part.id}: {part.title} {part.description}</h1>
            )): null}
        </div>
    )
    }
    