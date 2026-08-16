import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginForm from "@/components/LoginForm";
export default async function LoginPage(){if(await getSession())redirect("/");return <LoginForm/>}
