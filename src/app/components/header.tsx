import Link from "next/link";

export default function Header(){


    return(
        <div className="top-0 bg-slate-400 fixed  h-36 w-screen">
                <div className="mt-5 m-12">
                <Link className="text-3xl font-serif font-semibold" href={"/"}>Mantenimiento IanTech</Link>
                </div>
        </div>
    )
}