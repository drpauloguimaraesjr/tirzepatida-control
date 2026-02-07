import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tirzepatida Control | Gestao de Estoque",
  description: "Sistema de controle e previsao de estoque de Tirzepatida",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
