import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const businessId = params.id

  // Simulate deals data
  const deals = [
    {
      id: "1",
      title: "Happy Hour Special",
      description: "50% off all cocktails and appetizers",
      discount: "50",
      originalPrice: "฿400",
      salePrice: "฿200",
      validUntil: "Every day 4-7 PM",
      terms: "Valid Monday to Friday only",
    },
    {
      id: "2",
      title: "Weekend Brunch Buffet",
      description: "All-you-can-eat Thai and international breakfast buffet",
      discount: "25",
      originalPrice: "฿800",
      salePrice: "฿600",
      validUntil: "Weekends only",
      terms: "Available Saturday and Sunday 9 AM - 2 PM",
    },
  ]

  return NextResponse.json({ data: deals })
}
