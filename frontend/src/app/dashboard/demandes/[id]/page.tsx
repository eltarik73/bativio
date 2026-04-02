"use client";

import { use } from "react";
import FilConversation from "@/components/FilConversation/FilConversation";

export default function DashboardDemandeFilPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return <FilConversation demandeId={id} isArtisan />;
}
