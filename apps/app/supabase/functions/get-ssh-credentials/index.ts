import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js";
Deno.serve(async (req) => {
  console.log("Received request:", req);

  if (req.method === "OPTIONS") {
    console.log("Handling OPTIONS request");
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
    console.log("Invalid method:", req.method);
    return new Response("Method not allowed", {
      status: 405,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  if (req.headers.get("Content-Type") !== "application/json") {
    console.log("Invalid content type:", req.headers.get("Content-Type"));
    return new Response(JSON.stringify({ error: "Invalid content type, expected application/json" }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      status: 400,
    });
  }

  let requestBody;
  try {
    requestBody = await req.json();
    console.log("Parsed request body:", requestBody);
  } catch (error) {
    console.log("Error parsing JSON body:", error);
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      status: 400,
    });
  }

  const { user_id } = requestBody;

  if (!user_id) {
    console.log("Missing required fields: user_id");
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
    .select("*")
    .eq("user_id", user_id);

  if (error) {
    console.log("Supabase error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      status: 500,
    });
  }

  console.log("Query result:", data);
  return new Response(JSON.stringify({ data }), {
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
  });
});