import ProfileTabs from "../components/ProfileTabs";
import { getSite } from "../lib/content";

export default async function Home() {
  return <ProfileTabs site={await getSite()} />;
}
