import ThemeToggle from "@/components/ThemeToggle";
export default function PageHeader({title,subtitle,action}:{title:string,subtitle?:string,action?:React.ReactNode}){return <header className="page-header"><div><h1>{title}</h1>{subtitle&&<p>{subtitle}</p>}</div><div className="header-actions">{action}<div className="mobile-theme"><ThemeToggle/></div></div></header>}
