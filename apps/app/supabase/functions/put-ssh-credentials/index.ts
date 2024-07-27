import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const {
    id,
    user_id,
    name,
    ssh_command,
    status,
    uuid,
    private_key,
    public_key
  } = await req.json();

  console.log("PUT instances", {
    id,
    user_id,
    name,
    ssh_command,
    status,
    uuid,
    private_key,
    public_key
  });

  if (!user_id || !name || !ssh_command) {
    return new Response(
      JSON.stringify({ error: "Missing required fields" }),
      {
        headers: { "Content-Type": "application/json" },
        status: 400,
      }
    );
  }

  const supabaseClient = createClient(
    Deno.env.get("API_URL")!,
    Deno.env.get("API_SERVICE_ROLE")!
  );

  const { data, error } = await supabaseClient
    .from("instances")
    .update({ name, ssh_command, status, uuid, private_key, public_key })
    .eq("id", id);

  if (error) {
    console.log("error", error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }

  return new Response(JSON.stringify({ data }), {
    headers: { "Content-Type": "application/json" },
  });
});