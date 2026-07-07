
-- 1) Org-scoped role helper
CREATE OR REPLACE FUNCTION public.has_role_in_org(_user_id uuid, _role app_role, _org_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
      AND organization_id IS NOT NULL
      AND organization_id = _org_id
  )
$$;

-- 2) Tighten the admin-manage-roles policy to require admin IN the target org
DROP POLICY IF EXISTS "Admins can manage roles in their org" ON public.user_roles;
CREATE POLICY "Admins can manage roles in their org"
ON public.user_roles
FOR ALL
TO authenticated
USING (
  organization_id = public.current_org_id()
  AND public.has_role_in_org(auth.uid(), 'admin'::public.app_role, organization_id)
  AND role <> ALL (ARRAY['sysadmin'::public.app_role, 'admin'::public.app_role])
)
WITH CHECK (
  organization_id = public.current_org_id()
  AND public.has_role_in_org(auth.uid(), 'admin'::public.app_role, organization_id)
  AND role <> ALL (ARRAY['sysadmin'::public.app_role, 'admin'::public.app_role])
);

-- 3) Prevent users from changing their own organization_id or id via profile update.
--    Sysadmins and org admins still have their dedicated update policies.
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (
  id = auth.uid()
  AND organization_id IS NOT DISTINCT FROM (SELECT p.organization_id FROM public.profiles p WHERE p.id = auth.uid())
);
