// Invite a user to the current admin's organization by email.
// Sends a Supabase auth invite (or signup link if user already exists),
// upserts the profile's organization_id, and assigns roles via user_roles.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  try {
    const auth = req.headers.get("Authorization") ?? "";
    const jwt = auth.replace("Bearer ", "");
    if (!jwt) return json({ error: "unauthorized" }, 401);

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const ANON = Deno.env.get("SUPABASE_ANON_KEY")!;

    const userClient = createClient(SUPABASE_URL, ANON, {
      global: { headers: { Authorization: `Bearer ${jwt}` } },
    });
    const { data: ures } = await userClient.auth.getUser();
    const caller = ures?.user;
    if (!caller) return json({ error: "unauthorized" }, 401);

    const admin = createClient(SUPABASE_URL, SERVICE);

    // Verify caller is admin in their org
    const { data: profile } = await admin
      .from("profiles")
      .select("organization_id")
      .eq("id", caller.id)
      .maybeSingle();
    const orgId = profile?.organization_id;
    if (!orgId) return json({ error: "no_org" }, 400);

    const { data: roleRows } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", caller.id)
      .eq("organization_id", orgId);
    const callerRoles = (roleRows ?? []).map((r) => r.role);
    if (!callerRoles.includes("admin")) return json({ error: "forbidden" }, 403);

    const body = await req.json().catch(() => ({}));
    const email = String(body.email ?? "")
      .trim()
      .toLowerCase();
    const fullName = String(body.full_name ?? "").trim() || null;
    const roles: string[] = Array.isArray(body.roles) ? body.roles : [];
    const validRoles = ["admin", "manager", "technical", "medical"];
    const cleanRoles = roles.filter((r) => validRoles.includes(r));
    if (!email) return json({ error: "email_required" }, 400);
    if (cleanRoles.length === 0) return json({ error: "role_required" }, 400);

    // Try to find existing user
    let userId: string | null = null;
    const { data: list } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
    const existing = list?.users?.find((u) => (u.email ?? "").toLowerCase() === email);
    if (existing) {
      userId = existing.id;
    } else {
      const { data: invited, error: invErr } = await admin.auth.admin.inviteUserByEmail(email, {
        data: { full_name: fullName },
      });
      if (invErr) return json({ error: invErr.message }, 400);
      userId = invited.user?.id ?? null;
    }
    if (!userId) return json({ error: "no_user_id" }, 500);

    // Ensure profile row + org assignment
    await admin.from("profiles").upsert({
      id: userId,
      email,
      full_name: fullName,
      organization_id: orgId,
    });

    // Replace roles for this user in this org
    await admin.from("user_roles").delete().eq("user_id", userId).eq("organization_id", orgId);
    const rows = cleanRoles.map((role) => ({ user_id: userId, organization_id: orgId, role }));
    const { error: rErr } = await admin.from("user_roles").insert(rows);
    if (rErr) return json({ error: rErr.message }, 400);

    return json({ ok: true, user_id: userId, invited: !existing });
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}
