"use client"

import { useState } from "react";
import { Button } from "~/app/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/app/components/ui/dialog";
import { Input } from "~/app/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/app/components/ui/select";
import { Label } from "~/components/ui/label";
import { api } from "~/trpc/react";

export default function GruposPage(props:{params:{grupoId: string}}){

const [partId, setPartId] = useState(0)

const [titulo, setTitulo] = useState("")

const [descripcion, setDescripcion] = useState("")

const grupoId = props.params.grupoId;
const {data: grupo} = api.grupos.get.useQuery({id: parseInt(grupoId)})
const [open, setOpen] = useState(false)
const {mutateAsync: tareas} = api.tareas.create.useMutation() 
async function HandleCreate() {
    await tareas({
        title: titulo,
        description: descripcion,
        grupoId: parseInt(grupoId),
        participanteid: (partId),
        createdAt: new Date,
        fecha: new Date
    })
    setOpen(false)
}

console.log(grupoId, grupo?.name, "test")
    return(
        <div>
            <h1>Hola grupo {grupo?.name}</h1>
            <button onClick={() => setOpen(true)} >agregar tareas</button>
            <br></br>

            <h1>Participantes:</h1>
            <br />
            {grupo?.participantes ? grupo.participantes.map((part) => (
                 <h1 key={part.id}> {part.id}: {part.name} {part.lastname}</h1>
            )): null}

<br />
<h1>tareas:</h1>
<br />

            {grupo?.tareas ? grupo.tareas.map((part) => (
                <h1 key={part.id}>N {part.id}: {part.title} {part.description}</h1>
            )): null}
            
    <Dialog open={open}
      onOpenChange={setOpen} >
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Select onValueChange={(e) => setPartId(parseInt(e))}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
              {grupo?.participantes.map((part) => (
                  <SelectItem value={part.id.toString()} key={part.id}>{part.name} {part.lastname}</SelectItem>
            
            ))}

                
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="titulo" className="text-right">
              titulo
            </Label>
            <Input
              id="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
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
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              defaultValue="..."
              className="col-span-3"
            />
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
    