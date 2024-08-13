"use client"
import { redirect, useRouter } from "next/navigation"
import { Button } from "~/app/components/ui/button"
import { Title } from "~/app/components/ui/title"
import { api } from "~/trpc/react"

export default function IntegrantePage(props: {integranteId: number}){

    const {data: integrante} = api.participants.get.useQuery({id: props.integranteId})
    
    
    const  { mutateAsync: deleteP} = api.participants.delete.useMutation({})
    const router = useRouter();
    
    async function Delete(Id: number) {

        await deleteP({
            id: Id
        })
        
        router.push("./")
        router.refresh()

      
      }
    return (
        <div>

        <Title>Integrante</Title>
        <h1>{integrante?.name} {integrante?.lastname}</h1>

        <h1>{integrante?.updatedAt?.getDate()}</h1>

        <Button className="mt-1" onClick={() => Delete(integrante!.id)}>Borrar</Button>
        </div>
    )
}