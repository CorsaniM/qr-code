"use client"
import GruposPage from "./grupo"


export default function Page(props:{params:{grupoId: string}}) {


    const id = props.params.grupoId 


if (id) {
   return(
       <GruposPage  params={{grupoId:id}}/>
   )
}
else {
 return (
    <h1>Este grupo no existe</h1>
 )   
}

}