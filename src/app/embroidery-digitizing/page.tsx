import { ServiceView } from "@/components/services/ServicePage";
import { pageMetadata } from "@/lib/seo";
import { getService } from "@/lib/services";

const service = getService("embroidery-digitizing")!;

export const metadata = pageMetadata({
  title: service.title,
  description: service.lede,
  path: service.href,
});

export default function Page() {
  return <ServiceView service={service} />;
}
