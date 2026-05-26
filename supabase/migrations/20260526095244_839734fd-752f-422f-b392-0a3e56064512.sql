
-- 1) Prevent privilege escalation: admins can only manage non-privileged roles within their org.
DROP POLICY IF EXISTS "Admins can manage roles in their org" ON public.user_roles;

CREATE POLICY "Admins can manage roles in their org"
ON public.user_roles
FOR ALL
TO authenticated
USING (
  organization_id = current_org_id()
  AND has_role(auth.uid(), 'admin'::app_role)
  AND role NOT IN ('sysadmin'::app_role, 'admin'::app_role)
)
WITH CHECK (
  organization_id = current_org_id()
  AND has_role(auth.uid(), 'admin'::app_role)
  AND role NOT IN ('sysadmin'::app_role, 'admin'::app_role)
);

-- Keep an explicit policy so sysadmins can still manage everything (already exists, but ensure).
-- "Sysadmins can manage any role" is left untouched.

-- 2) Realtime channel authorization: only allow users to subscribe to their own notification topic.
ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own notification channel" ON realtime.messages;
CREATE POLICY "Users can read own notification channel"
ON realtime.messages
FOR SELECT
TO authenticated
USING (
  realtime.topic() = ('notifications:' || auth.uid()::text)
);

-- 3) Revoke EXECUTE on internal trigger-only SECURITY DEFINER functions from authenticated.
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
