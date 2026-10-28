import Link from "next/link";
import { notFound } from "next/navigation";
import Blocks from "../../../components/Blocks";
import { Icon } from "../../../components/icons";
import { getPage, getSite } from "../../../lib/content";

export async function generateStaticParams() {
  const site = await getSite();
  return site.pages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const [page, site] = await Promise.all([getPage(slug), getSite()]);
  return page ? { title: `${page.title} by ${site.profile.name}` } : {};
}

export default async function SubPage({ params }) {
  const { slug } = await params;
  const [page, site] = await Promise.all([getPage(slug), getSite()]);
  if (!page) notFound();
  return (
    <div className="subpage">
      <header className="sub-header">
        <Link href="/" className="back-link">
          <Icon name="back" size="1.125em" style={{ marginRight: 8 }} />
          回上一頁
        </Link>
        <div style={{ flex: 1 }} />
        <Link href="/" className="sub-avatar">
          <img src={site.profile.avatar} alt={site.profile.name} />
        </Link>
      </header>
      <div className="sub-content">
        <Blocks blocks={page.blocks} integrations={site.integrations} />
      </div>
    </div>
  );
}
