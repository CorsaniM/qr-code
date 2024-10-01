"use client"

import { useState } from "react";
import { Button } from "~/app/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/app/components/ui/dialog";
import { Input } from "~/app/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/app/components/ui/select";
import { Label } from "~/components/ui/label";
import { api } from "~/trpc/react";
import { QrCode } from "lucide-react";
import { Console } from "console";
import { Checkbox } from "~/app/components/ui/checkbox";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface participantes {
    id: number;
    name: string | null;
    lastname: string | null;
    grupoId: number | null;
    disponible: boolean | null;
    createdAt: Date;
    updatedAt: Date | null;
  }

interface Grupo  {
    id: number;
    name: string | null;
    fecha_ultimo_trabajo: Date;
    qrCode: string | null;
    participantes: participantes[] | null;
    tareas: Tarea[] | null;
    createdAt: Date;
    updatedAt: Date | null;
} 

interface Tarea {
  id: number;
  title: string | null;
  grupoid: number | null;
  participantesid: number | null;
  description: string | null;
  fecha: Date | null;
}

export default function EditQrCode(props: { grupo: Grupo}) {

    const grupo = props.grupo
    const [openQr, setOpenQr] = useState(false)
    const [qrstring, setqrString] = useState(grupo.qrCode ?? "")
    const {mutateAsync: cambiarQrCode} = api.grupos.update.useMutation()
    const router = useRouter()



async function changeQrCode() {
    if( !qrstring){
        return toast.error("Error")
    }    
    await cambiarQrCode({
        id: grupo.id,
        qrCode: qrstring
    })
    router.refresh()
    toast.success("Cambiado con exito")
    setOpenQr(false)
}

async function addQr(e:string) {
  if(qrstring.includes(e)){
    qrstring.replace(e, "")
  }
  else{
    setqrString(e + "-" + qrstring) 
  }
}
console.log(qrstring)
    return (
        <div>
            <div className="">
          <Button onClick={() => setOpenQr(true)}>Modificar</Button>
        </div>
        <Dialog open={openQr}
      onOpenChange={setOpenQr} >
      <DialogTrigger asChild>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>grupo: {grupo?.name}</DialogTitle>
          <Checkbox onClick={() => addQr(grupo?.name ?? "")}  ></Checkbox>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <h1>tareas:</h1>
          {grupo?.tareas ? grupo.tareas.map((tareas) => (
            <h1 key={tareas.id}>
              
              N°{tareas.id}: {tareas.title} 
              <Checkbox onClick={() => addQr(tareas.title ?? "")}  ></Checkbox>
              <div className="border border-black 2px w-full">  </div>
              <br />
              <h1>Participantes:</h1>
              {grupo?.participantes ? grupo.participantes.map((part) => (
                  <div key={part.id}>
                <h1 className="flex border-2" >
                  {part.id}: {part.name} {part.lastname}
                <Checkbox onClick={() => addQr(part.lastname ?? "")} ></Checkbox>
                </h1>
              <div className="border border-black 2px w-full">  </div>
                </div>
                )): null}
              descripcion:{tareas.description}
              <Checkbox onClick={() => addQr(tareas.description ?? "")}  ></Checkbox>
              <div className="border border-black 2px w-full">  </div>
              </h1>
          )): null}
        </div>
        <DialogFooter>
          <h1>{qrstring} hola</h1>
        <Button onClick={ changeQrCode }> cambiar codigo qr </Button>
        <Button onClick={() => setOpenQr(false)}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
          </div>
    )
} 