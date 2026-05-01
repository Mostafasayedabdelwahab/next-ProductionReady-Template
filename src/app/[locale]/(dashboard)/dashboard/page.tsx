import { getSiteSettingsAction } from "@/features/site-settings";
import { Languages } from "@/config/enums";
import { ERROR_CODES, getErrorMessage } from "@/config/errors";
import { requireUser } from "@/guards";
import { getDictionary } from "@/i18n/get-dictionary";

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Dashboard",
};
/**
 * Main Dashboard Home Page
 * Protected by requireUser to ensure the session is valid and account is active.
 */
export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const dict = await getDictionary(locale as Languages);

    // 1. Ensure user is authenticated and active before fetching data
    await requireUser();

    // 2. Fetch data via the action
    const result = await getSiteSettingsAction();

    // 3. Handle action failure (e.g., if settings are admin-only)

    if (result.success === false) {
        return (
            <div className="p-4 text-destructive bg-destructive/10 rounded-md">
                {getErrorMessage(result.code as keyof typeof ERROR_CODES || ERROR_CODES.SERVER_ERROR, dict)}
            </div>
        );
    }


    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">Dashboard Home</h1>
            <p>Welcome to your control panel.</p>
        </div>
    );
}