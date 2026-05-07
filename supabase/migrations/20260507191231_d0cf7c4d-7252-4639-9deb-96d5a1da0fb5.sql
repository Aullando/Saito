-- Enum de roles
CREATE TYPE public.app_role AS ENUM ('sysadmin', 'admin', 'manager', 'technical', 'medical');

-- Trigger genérico para updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Tabla organizations
CREATE TABLE public.organizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  language TEXT NOT NULL DEFAULT 'es',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_organizations_updated_at
BEFORE UPDATE ON public.organizations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Tabla profiles
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  language TEXT NOT NULL DEFAULT 'es',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Tabla user_roles
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, organization_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Helper: has_role (security definer, evita recursión RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Helper: organización actual del usuario
CREATE OR REPLACE FUNCTION public.current_org_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT organization_id FROM public.profiles WHERE id = auth.uid()
$$;

-- Trigger: crear profile al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS: profiles
CREATE POLICY "Users can view profiles in their org"
ON public.profiles FOR SELECT TO authenticated
USING (
  id = auth.uid()
  OR organization_id = public.current_org_id()
  OR public.has_role(auth.uid(), 'sysadmin')
);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE TO authenticated
USING (id = auth.uid());

CREATE POLICY "Sysadmins can update any profile"
ON public.profiles FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'sysadmin'));

CREATE POLICY "Admins can update profiles in their org"
ON public.profiles FOR UPDATE TO authenticated
USING (
  public.has_role(auth.uid(), 'admin')
  AND organization_id = public.current_org_id()
);

-- RLS: organizations
CREATE POLICY "Members can view their organization"
ON public.organizations FOR SELECT TO authenticated
USING (
  id = public.current_org_id()
  OR public.has_role(auth.uid(), 'sysadmin')
);

CREATE POLICY "Sysadmins can insert organizations"
ON public.organizations FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'sysadmin'));

CREATE POLICY "Sysadmins can update organizations"
ON public.organizations FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'sysadmin'));

CREATE POLICY "Admins can update their organization"
ON public.organizations FOR UPDATE TO authenticated
USING (
  public.has_role(auth.uid(), 'admin')
  AND id = public.current_org_id()
);

CREATE POLICY "Sysadmins can delete organizations"
ON public.organizations FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'sysadmin'));

-- RLS: user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can view roles in their org"
ON public.user_roles FOR SELECT TO authenticated
USING (
  organization_id = public.current_org_id()
  AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'sysadmin'))
);

CREATE POLICY "Sysadmins can view all roles"
ON public.user_roles FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'sysadmin'));

CREATE POLICY "Admins can manage roles in their org"
ON public.user_roles FOR ALL TO authenticated
USING (
  organization_id = public.current_org_id()
  AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'sysadmin'))
)
WITH CHECK (
  organization_id = public.current_org_id()
  AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'sysadmin'))
);

CREATE POLICY "Sysadmins can manage any role"
ON public.user_roles FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'sysadmin'))
WITH CHECK (public.has_role(auth.uid(), 'sysadmin'));

-- Índices
CREATE INDEX idx_profiles_org ON public.profiles(organization_id);
CREATE INDEX idx_user_roles_user ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_org ON public.user_roles(organization_id);