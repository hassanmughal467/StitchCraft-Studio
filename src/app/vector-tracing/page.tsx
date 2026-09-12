import { ServiceView } from "@/components/services/ServicePage";
import { pageMetadata } from "@/lib/seo";
import { getService } from "@/lib/services";

const service = getService("vector-tracing")!;

export const metadata = pageMetadata({
  title: service.metaTitle,
  description: service.metaDescription,
  path: service.href,
});

export default function Page() {
  return <ServiceView service={service} />;
}