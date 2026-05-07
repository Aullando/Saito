CREATE OR REPLACE FUNCTION public.create_organization(_name text, _slug text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid uuid := auth.uid();
  _existing uuid;
  _new_id uuid;
BEGIN
  IF _uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT organization_id INTO _existing FROM public.profiles WHERE id = _uid;
  IF _existing IS NOT NULL THEN
    RETURN _existing;
  END IF;

  INSERT INTO public.organizations (name, slug)
  VALUES (_name, _slug)
  RETURNING id INTO _new_id;

  UPDATE public.profiles SET organization_id = _new_id WHERE id = _uid;

  INSERT INTO public.user_roles (user_id, organization_id, role)
  VALUES (_uid, _new_id, 'admin')
  ON CONFLICT DO NOTHING;

  RETURN _new_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.create_organization(text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_organization(text, text) TO authenticated;