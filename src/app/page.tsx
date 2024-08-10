"use client"

import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";

export default function Page() {

const { mutateAsync: CreateParticipantes, isPending} = api.participants.create.useMutation()

const participantes = api.participants.list.useQuery().data

const  { mutateAsync: deleteP} = api.participants.delete.useMutation({})


const router = useRouter();

  async function HandleCreate() {




    await CreateParticipantes({
      name: "Fran",
      lastname: "Marmo"
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
      <h1>Hola</h1>


      <button className="bord" disabled={isPending} onClick={HandleCreate}>crear participantes</button>


      <ul>
        {participantes ? participantes!.map((integrante) => {
          return(
          <div>
            <li>
                <h1>{integrante.id} {integrante.name} {integrante.lastname}</h1>
                <button className="bord" disabled={isPending} onClick={() => Delete(integrante.id)}>Borrar participantes</button>
            </li>
          </div>
          )
        }) : (<h1>No existen participantes</h1>)}
      </ul>


      </main>
  );
}
