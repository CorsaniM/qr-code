"use client"

import { useState } from "react";
import { Button } from "~/app/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/app/components/ui/dialog";
import { Input } from "~/app/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/app/components/ui/select";
import { Label } from "~/components/ui/label";
import { api } from "~/trpc/react";
import { QrCode } from "lucide-react";
import { EditGrupo } from "./editgrupo";
import { toast } from "sonner";
import { redirect, useRouter } from "next/navigation"
import { Checkbox } from "~/app/components/ui/checkbox";


export default function GruposPage(props:{params:{grupoId: string}}){

const [partId, setPartId] = useState(0)

const [descripcion, setDescripcion] = useState("")

const [titulo, setTitulo] = useState("")

const [partIdQr, setPartIdQr] = useState("")

const [descripcionQr, setDescripcionQr] = useState("")

const [tituloQr, setTituloQr] = useState("")

const [tituloTarea, setTituloTarea] = useState("")
const [descripcionTarea, setDescripcionTarea] = useState("")

const router = useRouter();


const [openQr, setOpenQr] = useState(false)

const [qrstring, setqrString] = useState("")

async function addQr() {
  setqrString(partIdQr + "-" + descripcionQr + "-" + tituloQr) 
}



const grupoId = props.params.grupoId;
const {data: grupo} = api.grupos.get.useQuery({id: parseInt(grupoId)})
const [open, setOpen] = useState(false)
const {mutateAsync: tareas} = api.tareas.create.useMutation() 


async function HandleCreate() {
    if(!grupoId || !tituloTarea || !descripcionTarea){
        return toast.error("Error");
    }
    try {
    await tareas({
        title: tituloTarea,
        description: descripcionTarea,
        grupoid: parseInt(grupoId),
        participanteid: (partId),
        createdAt: new Date,
        fecha: new Date
    })
    toast.success("Cambios guardados correctamente")
    router.refresh();
    } catch (e) {

        toast.error("Error");
    }
    setOpen(false)
}

console.log(grupoId, grupo?.name, "test")
    return(
      <div className="flex">
        <div className="border border-black p-10 text-center">
          <h1>Modificar Qr</h1>
          <button onClick={() => setOpenQr(true)}>Modificar</button>
          <QrCode values={qrstring} size={200} />
          <h1>{qrstring}</h1>
        </div>
        <div className="border border-black p-10 text-center">
          <h1>Hola grupo: {grupo?.name}</h1>
          <button onClick={() => setOpen(true)} >agregar tareas</button>
          <br></br>
          <h1>Participantes:</h1>
          <br />
          {grupo?.participantes ? grupo.participantes.map((part) => (
            <h1 className="flex border-2" key={part.id}>
              <a href={`/integrantes/${part.id}`}> 
                {part.id}: {part.name} {part.lastname}
              </a>
            </h1>
          )): null}
          <br />
          <h1>tareas:</h1>
          <br />
          {grupo?.tareas ? grupo.tareas.map((part) => (
          <h1 key={part.id}>N°{part.id}: {part.title} {part.description}</h1>
          )): null}
        <div className="w-full flex justify-center">
            {grupo ? <EditGrupo grupo={grupo} /> : <div>No se encontró el grupo</div>}




        <Dialog open={openQr}
      onOpenChange={setOpenQr} >
      <DialogTrigger asChild>
        <Button variant="outline">open QR</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>open Qr</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <h1>tareas:</h1>
          {grupo?.tareas ? grupo.tareas.map((tareas) => (
            <h1 key={tareas.id}>
              
              N°{tareas.id}: {tareas.title} 
              <br />
              {grupo?.participantes ? grupo.participantes.map((part) => (
                <div key={part.id}>
                <h1 className="flex border-2" >
                  {part.id}: {part.name} {part.lastname}
                </h1>
                <Checkbox  ></Checkbox>
                </div>
                )): null}
              
              descripcion:{tareas.description}
              </h1>
          )): null}
        </div>
        <DialogFooter>
        <Button onClick={() => setOpenQr(false)}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>



    <Dialog open={open}
      onOpenChange={setOpen} >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>open Tarea</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          
          <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="titulo" className="text-right">
              titulo
            </Label>
            <Input
              id="titulo"
              value={tituloTarea}
              onChange={(e) => setTituloTarea(e.target.value)}
              defaultValue="..."
              className="col-span-3"
              />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="descripcion" className="text-right">
              descripcion
            </Label>
            <Input
              id="descripcion"
              value={descripcionTarea}
              onChange={(e) => setDescripcionTarea(e.target.value)}
              defaultValue="..."
              className="col-span-3"
              />
          </div>
              <DialogDescription>
               {qrstring}
              </DialogDescription>
        </div>
        <DialogFooter>
        <Button onClick={() => HandleCreate()}>Save changes</Button>
        <Button onClick={() => setOpen(false)}>Cancelar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
              </div>
      </div>
              </div>

    )
    
    }
    