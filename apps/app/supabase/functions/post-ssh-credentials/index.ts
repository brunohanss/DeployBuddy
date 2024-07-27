import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js";
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("OK", {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: {
      "Access-Control-Allow-Origin": "*",
    }, });
  }

  if (req.headers.get("Content-Type") !== "application/json") {
    return new Response(JSON.stringify({ error: "Invalid content type, expected application/json" }), {
      headers: { "Content-Type": "application/json" , "Access-Control-Allow-Origin": "*"},
      status: 400,
    });
  }
  let requestBody;
  try {
    requestBody = await req.json();
  } catch (error) {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      status: 400,
    });
  }
  const { user_id, name, ssh_command, status } = requestBody;

  if (!user_id || !name || !ssh_command || !status) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      status: 400,
    });
  }

  const supabaseClient = createClient(
    Deno.env.get("API_URL")!,
    Deno.env.get("API_SERVICE_ROLE")!
  );

  const { data, error } = await supabaseClient
    .from("instances")
    .upsert([{ user_id, name, ssh_command, status }], { onConflict: ['user_id', 'ssh_command'] });

  if (error) {
    console.log("error", error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      status: 500,
    });
  }

  return new Response(JSON.stringify({ data }), {
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
  });
});
