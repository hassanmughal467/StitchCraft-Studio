import { QuoteForm, type QuoteFormProps } from "@/components/quote/QuoteForm";
import { IntakeOffline } from "@/components/quote/IntakeOffline";
import type { CustomerType } from "@/lib/quote";
import { getIntakeStatus, publicIntakeConfig } from "@/lib/server/intake-config";

/**
 * Server wrapper that decides between the live form and the offline notice, and
 * passes only browser-safe configuration to the client component.
 */
export function QuoteIntake({ initialService, initialCustomerType, initialPortfolio, serviceTitle }: { initialService?: string; initialCustomerType?: CustomerType; initialPortfolio?: QuoteFormProps["initialPortfolio"]; serviceTitle?: string }) {
  const status = getIntakeStatus();
  if (!status.online) return <IntakeOffline message={status.offlineMessage} service={serviceTitle} />;
  const config: QuoteFormProps["config"] = {
    ...publicIntakeConfig(status),
    uploadPrefix: status.uploadMode === "direct" ? `${process.env.QUOTE_STORE_PREFIX?.trim() || "stitchcraft"}/uploads/` : null,
    turnstileSiteKey: status.spamCheck === "turnstile" ? process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() ?? null : null,
  };
  return <QuoteForm initialService={initialService} initialCustomerType={initialCustomerType} initialPortfolio={initialPortfolio} config={config} />;
}
