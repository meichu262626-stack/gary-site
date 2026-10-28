import Link from "next/link";
import Profile from "../components/Profile";
import Blocks from "../components/Blocks";
import { getSite } from "../lib/content";

export default async function Home() {
  const site = await getSite();
  return (
    <div className="home">
      <Profile profile={site.profile} social={site.social} />
      <div className="tabs-wrap">
        <div className="tabs">
          <span className="tab active">{site.tabs.home}</span>
          {site.tabs.others.map((t) => (
            <Link key={t.url} href={t.url} className="tab">
              {t.text}
            </Link>
          ))}
        </div>
        <div className="tab-content">
          <Blocks blocks={site.blocks} integrations={site.integrations} />
        </div>
      </div>
    </div>
  );
}
