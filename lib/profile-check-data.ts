import { getBranches, getCountries } from "./content";

/** Destination and branch options passed from the server to the profile check. */
export function profileCheckProps() {
  const destinations = getCountries().map((c) => ({ slug: c.slug, name: c.name, code: c.code }));
  const branches = getBranches().map(({ slug, name, city, cityCode, phone, phoneDisplay, whatsapp }) => ({
    slug,
    name,
    city,
    cityCode,
    phone,
    phoneDisplay,
    whatsapp,
  }));
  return { destinations, branches };
}
