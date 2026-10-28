import { notFound } from "next/navigation";
import ProfileTabs from "../../../components/ProfileTabs";
import { getSite } from "../../../lib/content";

export async function generateStaticParams() {
  const site = await getSite();
  return site.pages.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export default async function TabPage({ params }) {
  const { slug } = await params;
  const site = await getSite();
  if (!site.pages.some((p) => p.slug === slug)) notFound();
  return <ProfileTabs site={site} activeSlug={slug} />;
}
