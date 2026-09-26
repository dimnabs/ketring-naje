export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({
    status: "ok",
    service: "naje-web",
    timestamp: new Date().toISOString(),
  });
}
