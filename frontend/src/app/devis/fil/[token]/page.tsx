"use client";

import { use } from "react";
import Link from "next/link";
import FilConversation from "@/components/FilConversation/FilConversation";

export default function DevisFilClientPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: "var(--creme, #FAF8F5)",
      }}
    >
      {/* Minimal header with logo */}
      <div
        style={{
          height: 56,
          padding: "0 20px",
          display: "flex",
          alignItems: "center",
          background: "var(--blanc, #FFFFFF)",
          borderBottom: "1px solid var(--sable, #E8D5C0)",
          flexShrink: 0,
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 20,
            fontWeight: 700,
            color: "#C4531A",
            textDecoration: "none",
            letterSpacing: -0.5,
          }}
        >
          Bativio
        </Link>
      </div>

      {/* Conversation thread */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <FilConversation clientToken={token} />
      </div>
    </div>
  );
}
