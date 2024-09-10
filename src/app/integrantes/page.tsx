"use client"

import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { List, ListTile } from "../components/ui/list";
import { Title } from "../components/ui/title";
import { useState } from "react";
import { boolean } from "drizzle-orm/mysql-core";
import { z } from "zod"




import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"
import { Input } from "../components/ui/input";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export default function Page() {

const { mutateAsync: CreateParticipantes, isPending} = api.participants.create.useMutation()
const { mutateAsync: CreateGrupo} = api.grupos.create.useMutation()



// const {data: participantes} = api.participants.list.useQuery()
const {data: grupos} = api.grupos.list.useQuery()



const { mutateAsync: update} = api.participants.update.useMutation()
async function HandleUpdate() {
  await update({
    id: 1,
    name: name,
    lastname: lastname,
    grupoId: 0
  })
}

const participantes = grupos?.flatMap(grupo => grupo.participantes) ?? [];

const longText = z.object({
  text: z.string().max(12),
})

const router = useRouter();

const [isLoading, setIsloading] = useState(false)

  const [nameGrupo, setNameGrupo] = useState("")
  const [grupoId, setGrupoId] = useState(0)


  const [name, setName] = useState("")
  const [lastname, setLastname] = useState("")


  const queryClient = useQueryClient();
  
  async function HandleCreate() {
    
    if(!grupoId || !name || !lastname){
      return toast.error("Error");
      
  }
    if(!grupos?.some((x) => x.id === grupoId)){
      return toast.error("No existe el grupo");
    }
try{
    longText.parse({ text:name })
    await CreateParticipantes({
      name: name,
      lastname: lastname,
      grupoId: grupoId
    })

    toast.success("Cambios guardados correctamente")
    await queryClient.invalidateQueries()

            } catch (e) {
                
                toast.error("Error");
            }
  }

const [error, setError] = useState("")
  async function HandleCreateGrupo() {
    
  if(!nameGrupo){
    return
    setError("no se encontro el nombre del grupo")
  }
    setIsloading(true)
    if(!nameGrupo){
      return toast.error("Error");
  }
  try{

    await CreateGrupo({
      name: nameGrupo,
      fecha_ultimo_trabajo: new Date()
    })
    
    setIsloading(false)
    toast.success("Cambios guardados correctamente")
    await queryClient.invalidateQueries()
            } catch (e) {
                
                toast.error("Error");
            }
  }


  return (
     




<div className="flex justify-between w-1/2">
    <div className="border border-dashed p-10 mb-10">
    <List>
        {participantes ? participantes.map((integrante) => {
          return(
            <div key={integrante.id} className="flex">
            <ListTile
            
            title={integrante.name + " " + integrante.grupoId}
            href={`/integrantes/${integrante.id}`}
            />

            </div>
          )
        }) : (<h1>No existen participantes</h1>)}
    </List>
    </div>


      <div className="border border-dashed p-10 mb-10">
                  <h1>Crear participante</h1>
          <label>Nombre del participante</label>

          <Input
                                      value={name}
                                      placeholder='nombre...'
                                      onChange={(e) => setName(e.target.value)}
                                  />

          <Input
                                      value={lastname}
                                      placeholder='apellido...'
                                      onChange={(e) => setLastname(e.target.value)}
                                  />
          <label>Seleccione el grupo</label>
          <Select onValueChange={(e) => setGrupoId(parseInt(e))}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
              {grupos?.map((grupo) => (
                  <SelectItem value={grupo.id.toString()} key={grupo.id}>{grupo.name}</SelectItem>
            
            ))}

                
              </SelectContent>
            </Select>
            <br />
<button onClick={HandleCreate}>crear participante</button                        >

      </div>




<div className="border border-dashed p-10 mb-10">

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
        {grupos ? grupos.map((grupo) => {
          return(
            <div  key={grupo.id} className="flex">
            <ListTile
            title={grupo.name! + " " + grupo.id}
            href={`/grupos/${grupo.id}`}
            // onClick={() => deleteP}
            />
          
         
            </div>
          )
        }) : (<h1>No existen participantes</h1>)}
    </List>
    </div>


  );
}
