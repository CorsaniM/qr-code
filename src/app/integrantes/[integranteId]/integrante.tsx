"use client"
import { redirect, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "~/app/components/ui/button"
import { Input } from "~/app/components/ui/input"
import { Title } from "~/app/components/ui/title"
import { api } from "~/trpc/react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "../../components/ui/select"
  import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
export default function IntegrantePage(props: {integranteId: number}){

    const integranteId = props.integranteId;

    const {data: integrante} = api.participants.get.useQuery({id: integranteId})
    const {data: grupos } = api.grupos.list.useQuery()

    const  { mutateAsync: deleteP} = api.participants.delete.useMutation({})
    const  { mutateAsync: updateP, isPending} = api.participants.update.useMutation({})
    
    const [name, setName] = useState("")
    const [lastname, setLastname] = useState("")

    const [grupoId, setGrupoId] = useState(0)

    const router = useRouter();
    
    const queryClient = useQueryClient();


    async function Delete(Id: number) {

        await deleteP({
            id: Id
        })
        
        router.push("./")
        await queryClient.invalidateQueries()
    }



    async function UpdateParticipant() {
       if(!grupoId || !name || !lastname){
        return toast.error("Error");
        
    }
    console.log(integrante)
           try {
               await updateP({
                   id: integrante!.id ?? 0,
                   name: name ?? "",
                   grupoId: grupoId ?? "",
                   lastname: lastname ?? ""
                })
                toast.success("Cambios guardados correctamente")
                router.refresh();
                router.push("/integrantes");
            } catch (e) {
                
                toast.error("Error");
            }
    }
    
    useEffect(() => {
        if (integrante) {
          setName(integrante.name ?? "");
          setLastname(integrante.lastname ?? "");
          setGrupoId(integrante.grupoId ?? 0);
        }
      }, [integrante]);
    return (
        <div className="justify-center align-middle w-1/3">

        <Title>Integrante</Title>
        <Button  onClick={() => UpdateParticipant()} >Guardar</Button>
        <Button className="mt-1" onClick={() => Delete(integrante!.id)}>Borrar</Button>
         <Input
          id="name"
          placeholder="Escriba un nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
        /> <Input
        id="Lastname"
        placeholder="Escriba un apellido"
        value={lastname}
        onChange={(e) => setLastname(e.target.value)}
      />
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
        <h1>Fecha: {integrante?.updatedAt?.getDate()}</h1>

        </div>
    )
}