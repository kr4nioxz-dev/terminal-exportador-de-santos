import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TES · Terminal Exportador de Santos" },
      {
        name: "description",
        content:
          "Do Porto de Santos para o mundo: operação portuária integrada de granéis sólidos para o agronegócio brasileiro.",
      },
    ],
  }),
  component: TesStaticPage,
});

function TesStaticPage() {
  return (
    <iframe
      src="/tes/index.html"
      title="TES — Terminal Exportador de Santos"
      style={{
        width: "100%",
        height: "100vh",
        border: "none",
        display: "block",
      }}
    />
  );
}
