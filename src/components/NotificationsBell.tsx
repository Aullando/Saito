import { useEffect, useRef, useState } from "react";
import { Bell, Check, CheckCheck, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { isDemoMode } from "@/lib/appMode";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";

type Notification = {
  id: string;
  organization_id: string;
  user_id: string;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  read_at: string | null;
  created_at: string;
};

function timeAgo(iso: string, lang: "es" | "en") {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  const r = (n: number, es: string, en: string) => `${Math.floor(n)} ${lang === "es" ? es : en}`;
  if (diff < 60) return lang === "es" ? "ahora" : "now";
  if (diff < 3600) return r(diff / 60, "min", "min");
  if (diff < 86400) return r(diff / 3600, "h", "h");
  return r(diff / 86400, "d", "d");
}

export function NotificationsBell() {
  const { user, profile } = useAuth();
  const lang = (profile?.language ?? "es") as "es" | "en";
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const demoMode = isDemoMode();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const q = useQuery({
    queryKey: ["notifications", user?.id],
    enabled: !!user && !demoMode,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(30);
      if (error) throw error;
      return (data ?? []) as Notification[];
    },
  });

  useEffect(() => {
    if (!user || demoMode) return;
    const ch = supabase
      .channel("notifications:" + user.id)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` },
        () => qc.invalidateQueries({ queryKey: ["notifications", user.id] }),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [user, qc, demoMode]);

  const markRead = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("notifications")
        .update({ read_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications", user?.id] }),
  });

  const markAll = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("notifications")
        .update({ read_at: new Date().toISOString() })
        .eq("user_id", user!.id)
        .is("read_at", null);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications", user?.id] }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("notifications").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications", user?.id] }),
  });

  const items = q.data ?? [];
  const unread = items.filter((n) => !n.read_at).length;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full bg-card text-muted-foreground shadow-sm hover:text-foreground"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[340px] overflow-hidden rounded-2xl border border-border bg-popover shadow-xl">
          <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
            <span className="text-sm font-semibold">
              {lang === "es" ? "Notificaciones" : "Notifications"}
            </span>
            {unread > 0 && (
              <button
                onClick={() => markAll.mutate()}
                className="flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
              >
                <CheckCheck className="h-3 w-3" />
                {lang === "es" ? "Marcar todo leído" : "Mark all read"}
              </button>
            )}
          </div>
          <ul className="max-h-[420px] overflow-y-auto">
            {q.isLoading && (
              <li className="px-4 py-6 text-center text-xs text-muted-foreground">…</li>
            )}
            {!q.isLoading && items.length === 0 && (
              <li className="px-4 py-8 text-center text-xs text-muted-foreground">
                {lang === "es" ? "No tienes notificaciones." : "No notifications."}
              </li>
            )}
            {items.map((n) => {
              const Body = (
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {!n.read_at && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />}
                    <span className="truncate text-sm font-medium">{n.title}</span>
                  </div>
                  {n.body && (
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{n.body}</p>
                  )}
                  <span className="mt-1 block text-[10px] uppercase tracking-wider text-muted-foreground">
                    {timeAgo(n.created_at, lang)}
                  </span>
                </div>
              );
              return (
                <li
                  key={n.id}
                  className={cn(
                    "group flex items-start gap-2 border-b border-border px-4 py-3 last:border-b-0",
                    !n.read_at && "bg-primary/5",
                  )}
                >
                  {n.link ? (
                    <Link
                      to={n.link}
                      onClick={() => {
                        if (!n.read_at) markRead.mutate(n.id);
                        setOpen(false);
                      }}
                      className="flex flex-1 min-w-0 gap-2"
                    >
                      {Body}
                    </Link>
                  ) : (
                    <button
                      onClick={() => !n.read_at && markRead.mutate(n.id)}
                      className="flex flex-1 min-w-0 gap-2 text-left"
                    >
                      {Body}
                    </button>
                  )}
                  <div className="flex shrink-0 flex-col gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    {!n.read_at && (
                      <button
                        onClick={() => markRead.mutate(n.id)}
                        className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                        title={lang === "es" ? "Marcar leído" : "Mark read"}
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => remove.mutate(n.id)}
                      className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-destructive"
                      title={lang === "es" ? "Eliminar" : "Delete"}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
