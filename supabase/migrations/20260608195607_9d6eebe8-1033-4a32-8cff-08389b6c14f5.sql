
-- 1) Restrict conversations SELECT to participants only
DROP POLICY IF EXISTS select_org_members_conversations ON public.conversations;

CREATE POLICY select_participants_conversations
ON public.conversations
FOR SELECT
TO authenticated
USING (public.is_conv_participant(id, auth.uid()));

-- 2) Tighten notifications INSERT: target user must belong to same org
DROP POLICY IF EXISTS "Org admins create notifications" ON public.notifications;

CREATE POLICY "Org admins create notifications"
ON public.notifications
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_org_member(organization_id)
  AND public.has_any_role(auth.uid(), ARRAY['admin','manager']::app_role[])
  AND (SELECT organization_id FROM public.profiles WHERE id = user_id) = organization_id
);
