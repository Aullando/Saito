-- Notifications table
CREATE TABLE public.notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id uuid NOT NULL,
  user_id uuid NOT NULL,
  type text NOT NULL DEFAULT 'info',
  title text NOT NULL,
  body text,
  link text,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_user_unread ON public.notifications(user_id, read_at, created_at DESC);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Recipients can read their own notifications
CREATE POLICY "Users read own notifications"
ON public.notifications FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Recipients can update (mark read) their own notifications
CREATE POLICY "Users update own notifications"
ON public.notifications FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

-- Recipients can delete their own notifications
CREATE POLICY "Users delete own notifications"
ON public.notifications FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Org admins/managers (and sysadmins) can create notifications for their org members
CREATE POLICY "Org admins create notifications"
ON public.notifications FOR INSERT
TO authenticated
WITH CHECK (
  (is_org_member(organization_id) AND has_any_role(auth.uid(), ARRAY['admin'::app_role, 'manager'::app_role]))
  OR has_role(auth.uid(), 'sysadmin'::app_role)
);

-- Org admins can view all notifications in their org (audit)
CREATE POLICY "Org admins view org notifications"
ON public.notifications FOR SELECT
TO authenticated
USING (
  (is_org_member(organization_id) AND has_role(auth.uid(), 'admin'::app_role))
  OR has_role(auth.uid(), 'sysadmin'::app_role)
);

-- Enable realtime
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;