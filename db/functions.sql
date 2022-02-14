CREATE OR REPLACE FUNCTION public.get_parcel(
	_id integer)
    RETURNS json
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    _parcel JSON;
BEGIN

    SELECT coalesce(row_to_json(rec), '{}'::JSON)
    INTO _parcel
    FROM (
             SELECT *,
				(SELECT coalesce(row_to_json(i), '{}'::JSON)
				 FROM (
						SELECT * FROM public.party WHERE "SUID" = personsinformation."SUID" AND "S_ID"=personsinformation."S_ID" LIMIT 1
					  ) i) AS party,
				 (SELECT coalesce(row_to_json(i), '{}'::JSON)
				 FROM (
						SELECT * FROM public.natureofrights WHERE "SUID" = personsinformation."SUID" AND "S_ID"=personsinformation."S_ID" LIMIT 1
					  ) i) AS natureofrights,
				 (SELECT coalesce(row_to_json(i), '{}'::JSON)
				 FROM (
						SELECT * FROM "landInformation" WHERE "SUID" = personsinformation."SUID" AND "S_ID"=personsinformation."S_ID" LIMIT 1
					  ) i) AS landinformation,
				 (SELECT coalesce(row_to_json(i), '{}'::JSON)
				 FROM (
						SELECT * FROM public.lalevel WHERE "ParcelID" = parcels.p_id
					  ) i) AS lalevel,
				(SELECT coalesce(row_to_json(i), '{}'::JSON)
				 FROM (
						SELECT * FROM public.buildinginformation WHERE "SUID" = personsinformation."SUID" AND "S_ID"=personsinformation."S_ID" LIMIT 1
					  ) i) AS buildinginformation,
				(SELECT coalesce(row_to_json(i), '{}'::JSON)
				 FROM (
						SELECT * FROM public.basicadministrativeinformation WHERE "SUID" = personsinformation."SUID" AND "S_ID"=personsinformation."S_ID" LIMIT 1
					  ) i) AS basicadministrativeinformation,
				(SELECT coalesce(row_to_json(i), '{}'::JSON)
				 FROM (
						SELECT * FROM public.adminsourceinformation WHERE "SUID" = personsinformation."SUID" AND "S_ID"=personsinformation."S_ID" LIMIT 1
					  ) i) AS adminsourceinformation
             FROM public.parcels LEFT JOIN personsinformation ON parcels.p_id= personsinformation."ParcelID" WHERE gid = _id
         ) rec;

    RETURN _parcel;
END;
$BODY$;
