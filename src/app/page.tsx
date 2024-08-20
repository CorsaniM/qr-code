"use client"

import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { List, ListTile } from "./components/ui/list";
import { Button } from "./components/ui/button";
import { Title } from "./components/ui/title";

export default function Page() {

const { mutateAsync: CreateParticipantes, isPending} = api.participants.create.useMutation()

const participantes = api.participants.list.useQuery().data

const  { mutateAsync: deleteP} = api.participants.delete.useMutation({})


const router = useRouter();

  async function HandleCreate() {
    await CreateParticipantes({
      name: "Fran",
      lastname: "Marmo",
      grupoId: 0
    })
    router.refresh();
  }

async function Delete(Id: number) {

  await deleteP({
      id: Id
  })
  
  router.refresh()

}

  return (
      <main className="flex min-h-screen flex-col items-center justify-center">
      <Title>Hola</Title>


      <button className="bord" disabled={isPending} onClick={HandleCreate}>crear participantes</button>
      <br/>


    <List>
        {participantes ? participantes!.map((integrante) => {
          return(
            <div className="flex">


            <ListTile
            key={integrante.id}
            title={integrante.lastname}
            href={`/${integrante.id}`}
            // onClick={() => deleteP}
            />
          
          <Button className="mt-1" onClick={() => Delete(integrante.id)}>Borrar</Button>
            </div>
          )
        }) : (<h1>No existen participantes</h1>)}
    </List>


      </main>
  );
}
