import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js";
Deno.serve(async (req) => {
  if (req.method !== "DELETE") {
    return new Response("Method not allowed", { status: 405 });
  }

  const { id } = await req.json();

  if (!id) {
    return new Response(JSON.stringify({ error: "Missing required field: id" }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }

  const supabaseClient = createClient(
    Deno.env.get("API_URL")!,
    Deno.env.get("API_SERVICE_ROLE")!
  );

  const { data, error } = await supabaseClient
    .from("ssh_credentials")
    .delete()
    .eq("id", id);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }

  return new Response(JSON.stringify({ data }), {
    headers: { "Content-Type": "application/json" },
  });
});
