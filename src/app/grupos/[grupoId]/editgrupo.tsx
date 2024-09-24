"use client"

import { useState } from "react";
import { Button } from "~/app/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/app/components/ui/dialog";
import { Input } from "~/app/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/app/components/ui/select";
import { Label } from "~/components/ui/label";
import { api } from "~/trpc/react";
import { QrCode } from "lucide-react";

interface Grupo  {
    id: number;
    name: string | null;
    fecha_ultimo_trabajo: Date;
    createdAt: Date;
    updatedAt: Date | null;
} 

export function EditGrupo(props:{grupo: Grupo}) {
    const grupo = props.grupo
    const [open,setOpen] = useState(false)
    const {data: participanteTotales} = api.participants.getByGrupoId.useQuery({grupoId: grupo.id})   
    const {data: participanteGrupo} = api.participants.getByGrupoId.useQuery({grupoId: grupo.id})   
    const [participanteId, setParticipanteId] = useState("")
    const [name, setName] = useState(grupo.name ?? "")
    const {mutateAsync: uploadgrupo} = api.grupos.update.useMutation()

    async function HandleCreate() {
        await uploadgrupo({
            id: grupo.id,
            name,
            fecha_ultimo_trabajo: grupo.fecha_ultimo_trabajo,
        })
        setOpen(false)
    }



    return (

        <div>
          
<Dialog open={open}
      onOpenChange={setOpen} >
      <DialogTrigger asChild>
        <Button variant="outline">Edit equipo</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit equipo</DialogTitle>
          <DialogDescription>
            Elige que participantes hagan su tarea
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
              grupo
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              defaultValue="..."
              className="col-span-3"
              />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="participante" className="text-right">
              participante
            </Label>
            <Select onValueChange={(e) => setParticipanteId(e)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              {/* <SelectContent>
              {grupo?.participantes.map((part) => (
                <SelectItem value={part.id.toString()} key={part.id}>{part.name} {part.lastname}</SelectItem>
                
              ))}

                
              </SelectContent> */}
            </Select>
          </div>
        
        </div>
        <DialogFooter>
        <Button onClick={HandleCreate}>Save changes</Button>
        <Button onClick={() => setOpen(false)}>Cancelar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
        </div>
    )

}
