import ModuleGate from "@/components/ModuleGate";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ModuleGate moduleId="vitrine">{children}</ModuleGate>;
}
