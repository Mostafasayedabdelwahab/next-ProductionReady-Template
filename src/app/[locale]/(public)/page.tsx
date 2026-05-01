import type { Metadata } from "next";
import { getCachedSiteSettings } from "@/loaders/site-settings.loader";
import { createPageMetadata } from "@/lib/page-metadata";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/utils/utils";
import Image from "next/image";
import { getMediaUrl } from "@/utils/media";


export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const settings = await getCachedSiteSettings();
  const baseUrl = settings.domainUrl || "https://example.com";
  const metadata = createPageMetadata(baseUrl, locale);

  return {
    ...metadata,
  };
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {

  const { locale } = await params;
  const isAr = locale === "ar";
  const settings = await getCachedSiteSettings();


  return (

    <>
      <div>home</div>
    </>
  );
}