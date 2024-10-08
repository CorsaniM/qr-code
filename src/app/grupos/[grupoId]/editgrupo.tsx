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
import { Checkbox } from "@radix-ui/react-checkbox";

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
    createdAt: Date;
    updatedAt: Date | null;
} 

export function EditGrupo(props:{grupo: Grupo}) {
    const grupo = props.grupo
    const [open,setOpen] = useState(false)
    const [name, setName] = useState(grupo.name ?? "")
    const {mutateAsync: uploadgrupo} = api.grupos.update.useMutation()
    const { mutateAsync: removeParticipant } = api.gruposParticipantes.removeParticipant.useMutation();
    const { mutateAsync: addParticipant } = api.gruposParticipantes.addParticipant.useMutation();
    const [participanteId, setParticipanteId] = useState('');
    const [mostrarDesocupados, setMostrarDesocupados] = useState(false); // Estado para alternar entre todos/desocupados
    const [participantesSeleccionados, setParticipantesSeleccionados] = useState([]);
  
    const {data: participantes} = api.participants.list.useQuery()
    const participanteGrupo = grupo.participantes 
    console.log(participantes)
    // Función para manejar la selección de participantes
    /*const handleSelect = (e) => {
      console.log(e);
      setParticipanteId(e);
      const participanteSeleccionado = grupo?.participantes?.find(part => part.id.toString() === e);
      console.log(participanteSeleccionado);
      if (participanteSeleccionado) {
        setParticipantesSeleccionados([...participantesSeleccionados, participanteSeleccionado]);
      }*/

    async function HandleCreate() {
        await uploadgrupo({
            id: grupo.id,
            name,
            fecha_ultimo_trabajo: grupo.fecha_ultimo_trabajo,
            qrCode: grupo.qrCode ?? ""
        })
        setOpen(false)
    }
    async function change(partId: number) {
      try {
        await addParticipant({
          grupoId: grupo.id, // El ID del grupo
          participantId: partId, // El ID del participante a agregar
        });
        // Después de que la actualización sea exitosa, podrías querer actualizar el estado o hacer refetch
        console.log("Participante agregado al grupo");
      } catch (error) {
        console.error("Error agregando participante al grupo", error);
      }
    }

    async function delet(partId: number) {
      try {
        await removeParticipant({
          grupoId: grupo.id, // El ID del grupo
          participantId: partId, // El ID del participante a eliminar
        });
        console.log("Participante eliminado del grupo");
      } catch (error) {
        console.error("Error eliminando participante del grupo", error);
      }
    }
    


    return (

        <div>
          
<Dialog open={open}
      onOpenChange={setOpen} >
      <DialogTrigger asChild>
        <Button variant="outline">Edit equipo</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Edit equipo</DialogTitle>
          <DialogDescription>
            Elige a los participantes del grupo
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
        <label htmlFor="participante" className="text-center">
          Participante:
        </label>
          

        <div className="mt-4">
        <h3>Participantes totales:</h3>
        <br />
        <ul>
          {participantes?.map((part)  => (
            <li key={part.id} className="flex justify-between"> {part.name} {part.lastname} <Button onClick={() => change(part.id)}>agregar al grupo</Button></li>
          ))} 
        </ul>
      </div>
      <div className="mt-4">
        <h3>Participantes del grupo:</h3>
        <br />
        <ul>
          {participanteGrupo?.map((part) => (
            <li key={part.id} className="flex justify-between"> {part.name} {part.lastname} <Button onClick={() => delet(part.id)}>eliminar del grupo</Button></li>
          ))} 
        </ul>
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