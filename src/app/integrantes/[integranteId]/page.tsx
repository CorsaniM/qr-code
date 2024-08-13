import { api } from "~/trpc/server";
import { Title } from "../../components/ui/title";
import IntegrantePage from "./integrante";

export default async function Page(props: { params: { integranteId: string } }){

    const integranteId = parseInt(props.params.integranteId)
    
    const integrante = await api.participants.get({id: integranteId})
    
 if(!integrante){
    return(
<h1>No existe el integrante</h1>
    )
}
else{
    return(

<IntegrantePage integranteId={integranteId}/>
    )
}
} 