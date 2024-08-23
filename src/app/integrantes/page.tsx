"use client"

import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { List, ListTile } from "../components/ui/list";
import { Button } from "../components/ui/button";
import { Title } from "../components/ui/title";
import { useState } from "react";
import { boolean } from "drizzle-orm/mysql-core";
import { error } from "console";
import { z } from "zod"




import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"
import { Input } from "../components/ui/input";

export default function Page() {

const { mutateAsync: CreateParticipantes, isPending} = api.participants.create.useMutation()
const { mutateAsync: CreateGrupo} = api.grupos.create.useMutation()



// const {data: participantes} = api.participants.list.useQuery()
const {data: grupos} = api.grupos.list.useQuery()





const participantes = grupos?.flatMap(grupo => grupo.participantes) ?? [];

const longText = z.object({
  text: z.string().max(12),
})

const router = useRouter();

const [isLoading, setIsloading] = useState(false)

  const [nameGrupo, setNameGrupo] = useState("")
  const [grupoId, setGrupoId] = useState(0)


  const [name, setName] = useState("")
  const [lasname, setLastname] = useState("")



  async function HandleCreate() {
    console.log("grupos",grupos?.map((x) => x.id))

    if(!grupos?.some((x) => x.id === grupoId)){
      console.log("No existe el grupo: ", grupoId)

      return null
    }
    longText.parse({ text:name })
    await CreateParticipantes({
      name: name,
      lastname: lasname,
      grupoId: grupoId
    })
    router.refresh();
  }

const [error, setError] = useState("")
  async function HandleCreateGrupo() {
    
  if(!nameGrupo){
    return
    setError("no se encontro el nombre del grupo")
  }
    setIsloading(true)
    
    await CreateGrupo({
      name: nameGrupo,
      fecha_ultimo_trabajo: new Date()
    })
    
    setIsloading(false)
    router.refresh();
  }


  return (
      <main className="flex min-h-screen flex-col items-center justify-center">
      <Title>Hola</Title>


      <br/>

    <div className="border border-dashed p-10">

    <List>
        {participantes ? participantes!.map((integrante) => {
          return(
            <div className="flex">
            <ListTile
            key={integrante.id}
            title={integrante.name + " " + integrante.grupoId}
            href={`/integrantes/${integrante.id}`}
            // onClick={() => deleteP}
            />
          
         
            </div>
          )
        }) : (<h1>No existen participantes</h1>)}
    </List>
    </div>


      <div className="border border-dashed p-10">
                  <h1>Crear participante</h1>
                  
         
          <label>Nombre del participante</label>

          <Input
                                      value={name}
                                      placeholder='nombre...'
                                      onChange={(e) => setName(e.target.value)}
                                  />

          <Input
                                      value={lasname}
                                      placeholder='apellido...'
                                      onChange={(e) => setLastname(e.target.value)}
                                  />
          <label>Seleccione el grupo</label>
          <Select onValueChange={(e) => setGrupoId(parseInt(e))}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
              {grupos && grupos.map((grupo) => (
                  <SelectItem value={grupo.id.toString()} key={grupo.id}>{grupo.name}</SelectItem>
            
            ))}

                
              </SelectContent>
            </Select>

            {/* {marcas &&
                  marcas.map((marca) => (
                    <SelectItem
                      key={marca?.id}
                      value={marca?.id}
                      className="rounded-none border-b border-gray-600"
                    >
                      {marca?.name}
                    </SelectItem>
                  ))} */}
      </div>


<button onClick={HandleCreate} disabled={isPending}>crear participante</button>


<div className="border border-dashed p-10">

<label>Nombre del grupo</label>
                  <Input
                                      value={nameGrupo}
                                      placeholder='nombre del grupo...'
                                      onChange={(e) =>{ setNameGrupo(e.target.value)
                                        try{
                                          longText.parse({text:nameGrupo})
                                          setError("")
                                        }catch(e){
                                          setError("ingrese un nombre menor de 12 caracteres")
                                          }
                                      }}
                                      />
                                      {error && <p className="text-red-500">{error}</p>}


                                      <button onClick={HandleCreateGrupo} disabled={isLoading}>crear grupo</button>
                                      </div>
                                      <List>
        {grupos ? grupos!.map((grupo) => {
          return(
            <div className="flex">
            <ListTile
            key={grupo.id}
            title={grupo.name! + " " + grupo.id}
            href={`/grupos/${grupo.id}`}
            // onClick={() => deleteP}
            />
          
         
            </div>
          )
        }) : (<h1>No existen participantes</h1>)}
    </List>
      
      
      </main>

  );
}
