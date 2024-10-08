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

export default function EditTarea(props: {grupo: Grupo}) {
    
    const grupo = props.grupo
    const [open, setOpen] = useState(false)
    const [tituloTarea,setTituloTarea] = useState("")
    const [descripcionTarea,setDescripcionTarea] = useState("")
    const router = useRouter()
    const participantes = grupo.participantes
    const [participanteId, setParticipanteId] = useState("0")
    const {mutateAsync: crearTareas} = api.tareas.create.useMutation()
    
    async function HandleCreate() {
        if(participanteId === "0" || !tituloTarea || !descripcionTarea){
            return toast.error("Error total");
        }
        try {
        await crearTareas({
            title: tituloTarea,
            description: descripcionTarea,
            grupoid: grupo.id,
            participantesid: parseInt(participanteId) ?? 0,
            createdAt: new Date,
            fecha: new Date
        })
        router.refresh();
        toast.success("Cambios guardados correctamente")
        setOpen(false)
        } catch (e) {
    
            toast.error("Error garrafal");
        }
    }
    return <div>
        <Button onClick={() => setOpen(true)}>open Tarea</Button>
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
          <div className="w-[250px]">
          <Select onValueChange={(e) => setParticipanteId(e)} >
          <SelectTrigger>
          <SelectValue placeholder="Seleccionar participante">

          <SelectContent>
          {
            participantes ? participantes?.map((part) => (
              <SelectItem  value={part.id.toString() } key={part.id}>
              {part.name + " " + part.lastname}
            </SelectItem>
          )) : <h1> no existe participantes</h1>}
          </SelectContent>
          
            </SelectValue>
            </SelectTrigger>
        </Select>
          </div>
        </div>
        <DialogFooter>
        <Button onClick={() => HandleCreate()}>Save changes</Button>
        <Button onClick={() => setOpen(false)}>Cancelar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </div>;
}   