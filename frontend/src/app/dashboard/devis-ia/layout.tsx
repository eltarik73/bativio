import ModuleGate from "@/components/ModuleGate";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ModuleGate moduleId="devis-ia">{children}</ModuleGate>;
}
