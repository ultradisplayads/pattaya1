import { BusinessDetailPage } from "@/components/business/business-detail-page"

export default function BusinessDetail({ params }: { params: { id: string } }) {
  return <BusinessDetailPage businessId={params.id} />
}
