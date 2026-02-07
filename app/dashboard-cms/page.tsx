"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function DashboardCMS() {
  const router = useRouter()

  useEffect(() => {
    window.location.href = "/dashboard.html"
  }, [])

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
        background: "#ffffff",
        color: "#18181b",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: 48,
            height: 48,
            background: "#18181b",
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            width="24"
            height="24"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </div>
        <p style={{ fontSize: "0.875rem", color: "#71717a" }}>
          Carregando Tirzepatida Control...
        </p>
      </div>
    </div>
  )
}
