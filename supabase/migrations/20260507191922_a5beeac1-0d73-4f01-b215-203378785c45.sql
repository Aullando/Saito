-- =========================================================
-- Helper: obtener organización del usuario (ya existe current_org_id)
-- Helper para comprobar si el usuario es miembro de una org
-- =========================================================
CREATE OR REPLACE FUNCTION public.is_org_member(_org_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT _org_id IS NOT NULL
    AND _org_id = public.current_org_id();
$$;

REVOKE EXECUTE ON FUNCTION public.is_org_member(uuid) FROM PUBLIC, anon, authenticated;

-- Helper: comprobar si tiene cualquiera de varios roles
CREATE OR REPLACE FUNCTION public.has_any_role(_user_id uuid, _roles public.app_role[])
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = ANY(_roles)
  )
$$;

REVOKE EXECUTE ON FUNCTION public.has_any_role(uuid, public.app_role[]) FROM PUBLIC, anon, authenticated;

-- =========================================================
-- FACILITIES
-- =========================================================
CREATE TABLE public.facilities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  location text,
  address text,
  capacity int,
  status text NOT NULL DEFAULT 'Active',
  photo_url text,
  sports text[] DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_facilities_updated_at BEFORE UPDATE ON public.facilities
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_facilities_org ON public.facilities(organization_id);

-- =========================================================
-- SPORT SECTIONS
-- =========================================================
CREATE TABLE public.sport_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.sport_sections ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_sections_updated_at BEFORE UPDATE ON public.sport_sections
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_sections_org ON public.sport_sections(organization_id);

-- =========================================================
-- CATEGORIES
-- =========================================================
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  section_id uuid NOT NULL REFERENCES public.sport_sections(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_categories_updated_at BEFORE UPDATE ON public.categories
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_categories_org ON public.categories(organization_id);
CREATE INDEX idx_categories_section ON public.categories(section_id);

-- =========================================================
-- GROUPS
-- =========================================================
CREATE TABLE public.groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  section_id uuid NOT NULL REFERENCES public.sport_sections(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_groups_updated_at BEFORE UPDATE ON public.groups
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_groups_org ON public.groups(organization_id);

-- =========================================================
-- ATHLETES
-- =========================================================
CREATE TABLE public.athletes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  section_id uuid REFERENCES public.sport_sections(id) ON DELETE SET NULL,
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'Active',
  medical_status text NOT NULL DEFAULT 'Unknown',
  performance_status text NOT NULL DEFAULT 'Medium',
  birth_date date,
  email text,
  phone text,
  photo_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.athletes ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_athletes_updated_at BEFORE UPDATE ON public.athletes
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_athletes_org ON public.athletes(organization_id);
CREATE INDEX idx_athletes_section ON public.athletes(section_id);

-- ATHLETE-GROUP relation
CREATE TABLE public.athlete_groups (
  athlete_id uuid NOT NULL REFERENCES public.athletes(id) ON DELETE CASCADE,
  group_id uuid NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  PRIMARY KEY (athlete_id, group_id)
);
ALTER TABLE public.athlete_groups ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_athlete_groups_org ON public.athlete_groups(organization_id);

-- =========================================================
-- CALENDAR EVENTS
-- =========================================================
CREATE TABLE public.calendar_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  title text NOT NULL,
  type text NOT NULL DEFAULT 'training',
  event_date date NOT NULL,
  start_time time,
  end_time time,
  section_id uuid REFERENCES public.sport_sections(id) ON DELETE SET NULL,
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  group_id uuid REFERENCES public.groups(id) ON DELETE SET NULL,
  athlete_id uuid REFERENCES public.athletes(id) ON DELETE SET NULL,
  staff_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  facility_id uuid REFERENCES public.facilities(id) ON DELETE SET NULL,
  notes text,
  recurrence jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_events_updated_at BEFORE UPDATE ON public.calendar_events
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_events_org_date ON public.calendar_events(organization_id, event_date);

-- =========================================================
-- FEES
-- =========================================================
CREATE TABLE public.fees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  amount numeric(10,2) NOT NULL DEFAULT 0,
  frequency text NOT NULL DEFAULT 'Monthly',
  kind text NOT NULL DEFAULT 'fee',
  section_id uuid REFERENCES public.sport_sections(id) ON DELETE SET NULL,
  applies_to_group_ids uuid[] DEFAULT '{}',
  period_start date,
  period_end date,
  payment_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.fees ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_fees_updated_at BEFORE UPDATE ON public.fees
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_fees_org ON public.fees(organization_id);

-- =========================================================
-- PAYMENTS
-- =========================================================
CREATE TABLE public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  athlete_id uuid REFERENCES public.athletes(id) ON DELETE SET NULL,
  fee_id uuid REFERENCES public.fees(id) ON DELETE SET NULL,
  subscription text,
  section_id uuid REFERENCES public.sport_sections(id) ON DELETE SET NULL,
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  amount numeric(10,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'Pending',
  payment_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_payments_updated_at BEFORE UPDATE ON public.payments
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_payments_org ON public.payments(organization_id);

-- =========================================================
-- CONVERSATIONS / MESSAGES
-- =========================================================
CREATE TABLE public.conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  title text NOT NULL,
  type text NOT NULL DEFAULT 'direct',
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_conv_updated_at BEFORE UPDATE ON public.conversations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_conv_org ON public.conversations(organization_id);

CREATE TABLE public.conversation_participants (
  conversation_id uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  joined_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (conversation_id, user_id)
);
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_conv_part_user ON public.conversation_participants(user_id);

-- Helper: ¿es participante de la conversación?
CREATE OR REPLACE FUNCTION public.is_conv_participant(_conv_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.conversation_participants
    WHERE conversation_id = _conv_id AND user_id = _user_id
  )
$$;
REVOKE EXECUTE ON FUNCTION public.is_conv_participant(uuid, uuid) FROM PUBLIC, anon, authenticated;

CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  conversation_id uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_messages_conv ON public.messages(conversation_id, created_at);

-- =========================================================
-- MEDICAL APPOINTMENTS
-- =========================================================
CREATE TABLE public.medical_appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  athlete_id uuid NOT NULL REFERENCES public.athletes(id) ON DELETE CASCADE,
  staff_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  appointment_date date NOT NULL,
  appointment_time time,
  reason text,
  status text NOT NULL DEFAULT 'Scheduled',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.medical_appointments ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_med_updated_at BEFORE UPDATE ON public.medical_appointments
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_med_org ON public.medical_appointments(organization_id);

-- =========================================================
-- POLÍTICAS RLS (genéricas org-scoped)
-- =========================================================

-- helper macro pattern: SELECT para todos los miembros, INSERT/UPDATE/DELETE para admin/manager
DO $do$
DECLARE
  t text;
  org_tables text[] := ARRAY[
    'facilities','sport_sections','categories','groups','athletes','athlete_groups',
    'calendar_events','fees','conversations','conversation_participants'
  ];
BEGIN
  FOREACH t IN ARRAY org_tables LOOP
    EXECUTE format($f$
      CREATE POLICY "select_org_members_%1$s" ON public.%1$I
      FOR SELECT TO authenticated
      USING (public.is_org_member(organization_id) OR public.has_role(auth.uid(),'sysadmin'));
    $f$, t);

    EXECUTE format($f$
      CREATE POLICY "manage_admin_manager_%1$s" ON public.%1$I
      FOR ALL TO authenticated
      USING (
        public.is_org_member(organization_id)
        AND public.has_any_role(auth.uid(), ARRAY['admin','manager']::public.app_role[])
        OR public.has_role(auth.uid(),'sysadmin')
      )
      WITH CHECK (
        public.is_org_member(organization_id)
        AND public.has_any_role(auth.uid(), ARRAY['admin','manager']::public.app_role[])
        OR public.has_role(auth.uid(),'sysadmin')
      );
    $f$, t);
  END LOOP;
END
$do$;

-- Eventos: technical también puede gestionar
CREATE POLICY "manage_technical_events" ON public.calendar_events
FOR ALL TO authenticated
USING (
  public.is_org_member(organization_id)
  AND public.has_role(auth.uid(),'technical')
)
WITH CHECK (
  public.is_org_member(organization_id)
  AND public.has_role(auth.uid(),'technical')
);

-- PAYMENTS: solo admin/manager pueden ver y gestionar
CREATE POLICY "select_payments_admin" ON public.payments
FOR SELECT TO authenticated
USING (
  (public.is_org_member(organization_id)
   AND public.has_any_role(auth.uid(), ARRAY['admin','manager']::public.app_role[]))
  OR public.has_role(auth.uid(),'sysadmin')
);
CREATE POLICY "manage_payments_admin" ON public.payments
FOR ALL TO authenticated
USING (
  (public.is_org_member(organization_id)
   AND public.has_any_role(auth.uid(), ARRAY['admin','manager']::public.app_role[]))
  OR public.has_role(auth.uid(),'sysadmin')
)
WITH CHECK (
  (public.is_org_member(organization_id)
   AND public.has_any_role(auth.uid(), ARRAY['admin','manager']::public.app_role[]))
  OR public.has_role(auth.uid(),'sysadmin')
);

-- MEDICAL: solo medical/admin/manager
CREATE POLICY "select_medical" ON public.medical_appointments
FOR SELECT TO authenticated
USING (
  (public.is_org_member(organization_id)
   AND public.has_any_role(auth.uid(), ARRAY['medical','admin','manager']::public.app_role[]))
  OR public.has_role(auth.uid(),'sysadmin')
);
CREATE POLICY "manage_medical" ON public.medical_appointments
FOR ALL TO authenticated
USING (
  (public.is_org_member(organization_id)
   AND public.has_any_role(auth.uid(), ARRAY['medical','admin','manager']::public.app_role[]))
  OR public.has_role(auth.uid(),'sysadmin')
)
WITH CHECK (
  (public.is_org_member(organization_id)
   AND public.has_any_role(auth.uid(), ARRAY['medical','admin','manager']::public.app_role[]))
  OR public.has_role(auth.uid(),'sysadmin')
);

-- MESSAGES: solo participantes
CREATE POLICY "select_messages_participant" ON public.messages
FOR SELECT TO authenticated
USING (public.is_conv_participant(conversation_id, auth.uid()));

CREATE POLICY "insert_messages_participant" ON public.messages
FOR INSERT TO authenticated
WITH CHECK (
  author_id = auth.uid()
  AND public.is_conv_participant(conversation_id, auth.uid())
  AND public.is_org_member(organization_id)
);

CREATE POLICY "delete_own_messages" ON public.messages
FOR DELETE TO authenticated
USING (author_id = auth.uid());