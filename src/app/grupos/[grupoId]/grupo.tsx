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
import EditQrCode from "./editQrCode";
import EditTarea from "./editTarea";

export default function GruposPage(props:{params:{grupoId: string}}){





const grupoId = props.params.grupoId;

const {data: grupo} = api.grupos.get.useQuery({id: parseInt(grupoId)})
const {data: participante} = api.participants.getByGroup.useQuery({grupoId: parseInt(grupoId)})
const [open, setOpen] = useState(false)

console.log(grupoId)


    return(
      <div className="flex">
          
        

        <div className="border border-black p-10 text-center">
          <h1>Hola grupo: {grupo?.name}</h1>
          <button onClick={() => setOpen(true)} >agregar tareas</button>
          <br></br>
          <h1>Participantes:</h1>
          <br />
          {participante ? participante.map((part) => (
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
          <br />
        <div className="w-full flex justify-center">
            {grupo ? <EditQrCode grupo={grupo} /> : <div>No se encontró el grupo</div>}
            {grupo ? <EditGrupo grupo={grupo} /> : <div>No se encontró el grupo</div>}
            {grupo ? <EditTarea grupo={grupo} /> : <div>No se encontró el grupo</div>}
              </div>
      </div>
      {
        grupo?.qrCode ? 
        <div> 
          <QrCode values={grupo?.qrCode} size={200} />
        <h1>{grupo?.qrCode}</h1> 
        </div> : <h1>no existe codigo qr</h1>}
              </div>

    )
    
    }
    