import { getNavigation } from "@/controllers/content";
import { NavbarClient } from "./NavbarClient";

// Fetches the links on the server; everything interactive lives in <NavbarClient />.
export async function Navbar() {
  const { links, cta } = await getNavigation();
  return <NavbarClient links={links} cta={cta} />;
}
