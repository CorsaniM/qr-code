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

interface participantes {
  id: number;
  name: string | null;
  lastname: string | null;
  disponible: boolean | null;
  grupoId: number | null;
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
    const [participanteId, setParticipanteId] = useState('');
    const [mostrarDesocupados, setMostrarDesocupados] = useState(false); // Estado para alternar entre todos/desocupados
    const [participantesSeleccionados, setParticipantesSeleccionados] = useState([]);
  
    // Función para filtrar los participantes
    const filtrarParticipantes = () => {
      if (mostrarDesocupados) {
        return grupo?.participantes?.filter((part) => part.grupoId === null); // Asumiendo que 'disponible' es la propiedad que indica si está desocupado
      }
      return grupo?.participantes ?? [];
    };
  
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
        <label htmlFor="participante" className="text-center">
          Participante:
        </label>
          <div className="flex">
        <select onChange={(e) => setMostrarDesocupados(e.target.value === 'desocupados')} className="w-[180px]">
          <option value="todos">Ver todos</option>
          <option value="desocupados">Ver desocupados</option>
        </select>
<br />
        <select onChange={(e) => setParticipanteId(e.target.value)} className="w-[180px]">
          <option value="">Seleccionar participante</option>
          {filtrarParticipantes()?.map((part) => (
            console.log(part),
            <option value={part.id.toString()} key={part.id}>
              {part.name} {part.lastname}
            </option>
          ))}
        </select>
      </div>

      {/* Mostrar los participantes seleccionados */}
      <div className="mt-4">
        <h3>Participantes seleccionados:</h3>
        <ul>
          {participantesSeleccionados.map((part) => (
            console.log(part),
            <li key={1}> Hola </li>
          ))} : <div> nada</div>
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