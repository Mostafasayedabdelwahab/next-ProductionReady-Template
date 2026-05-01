// use-site-settings-form.ts
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { showError, showSuccess } from "@/lib/toast";
import { getSuccessMessage, SUCCESS_CODES } from "@/config/success";
import {
  type SiteSettingsFormValues,
  siteSettingsSchema,
} from "../site-settings.schema";
import { updateSiteSettingsAction } from "../site-settings.actions";
import { getDictionary } from "@/i18n/get-dictionary";
import { ERROR_CODES, getErrorMessage } from "@/config/errors";

export function useSiteSettingsForm(
  defaultValues: SiteSettingsFormValues | null,
  dict: Awaited<ReturnType<typeof getDictionary>>,
) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<SiteSettingsFormValues>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: {
      siteNameAr: defaultValues?.siteNameAr ?? "",
      siteTitleAr: defaultValues?.siteTitleAr ?? "",
      siteDescriptionAr: defaultValues?.siteDescriptionAr ?? "",

      siteNameEn: defaultValues?.siteNameEn ?? "",
      siteTitleEn: defaultValues?.siteTitleEn ?? "",
      siteDescriptionEn: defaultValues?.siteDescriptionEn ?? "",

      arabicFont: defaultValues?.arabicFont ?? "cairo",
      englishFont: defaultValues?.englishFont ?? "inter",

      logoUrl: defaultValues?.logoUrl ?? null,
      faviconUrl: defaultValues?.faviconUrl ?? null,
      primaryColor: defaultValues?.primaryColor ?? "",
      secondaryColor: defaultValues?.secondaryColor ?? "",
      accentColor: defaultValues?.accentColor ?? "",

      backgroundColor: defaultValues?.backgroundColor ?? "",
      foregroundColor: defaultValues?.foregroundColor ?? "",
      cardColor: defaultValues?.cardColor ?? "",
      borderColor: defaultValues?.borderColor ?? "",
      mutedColor: defaultValues?.mutedColor ?? "",

      radius: defaultValues?.radius ?? "medium",

      defaultTheme: defaultValues?.defaultTheme ?? "system",

      contactEmail: defaultValues?.contactEmail ?? "",
      contactPhone: defaultValues?.contactPhone ?? "",
      whatsappNumber: defaultValues?.whatsappNumber ?? "",
      addressAr: defaultValues?.addressAr ?? "",
      addressEn: defaultValues?.addressEn ?? "",
      facebookUrl: defaultValues?.facebookUrl ?? "",
      instagramUrl: defaultValues?.instagramUrl ?? "",
      twitterUrl: defaultValues?.twitterUrl ?? "",
      linkedinUrl: defaultValues?.linkedinUrl ?? "",
      youtubeUrl: defaultValues?.youtubeUrl ?? "",
      defaultKeywordsAr: defaultValues?.defaultKeywordsAr ?? "",
      defaultKeywordsEn: defaultValues?.defaultKeywordsEn ?? "",
      ogImageUrl: defaultValues?.ogImageUrl ?? null,
      domainUrl: defaultValues?.domainUrl ?? "",
    },
  });

  const normalizeKeywords = (value?: string | null) => {
    if (!value) return null;
    return value
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean)
      .join(", ");
  };

  const onSubmit = (values: SiteSettingsFormValues) => {
    startTransition(async () => {
      const payload = {
        ...values,
        siteNameAr: values.siteNameAr ?? "",
        defaultKeywordsAr: normalizeKeywords(values.defaultKeywordsAr),

        siteNameEn: values.siteNameEn ?? "",
        defaultKeywordsEn: normalizeKeywords(values.defaultKeywordsEn),
      };

      const result = await updateSiteSettingsAction(payload);

      if (result.success) {
        showSuccess(getSuccessMessage(SUCCESS_CODES.SETTINGS_UPDATED, dict));
        form.reset(values);
        router.refresh();
      } else {
        showError(
          getErrorMessage(result.code as keyof typeof ERROR_CODES, dict),
        );
      }
    });
  };

  return { form, isPending, onSubmit };
}
