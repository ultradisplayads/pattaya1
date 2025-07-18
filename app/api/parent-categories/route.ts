import { NextResponse } from "next/server"

// Simulated API endpoint for navigation categories
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const populate = searchParams.get("populate")

  try {
    const categoriesData = {
      data: [
        {
          id: "1",
          attributes: {
            name: "Dining & Food",
            slug: "dining-food",
            icon: "utensils",
            sub_categories:
              populate === "sub-categories"
                ? {
                    data: [
                      { id: "1-1", attributes: { name: "Thai Restaurants", slug: "thai-restaurants" } },
                      { id: "1-2", attributes: { name: "International Cuisine", slug: "international-cuisine" } },
                      { id: "1-3", attributes: { name: "Street Food", slug: "street-food" } },
                      { id: "1-4", attributes: { name: "Bars & Pubs", slug: "bars-pubs" } },
                      { id: "1-5", attributes: { name: "Cafes", slug: "cafes" } },
                    ],
                  }
                : undefined,
          },
        },
        {
          id: "2",
          attributes: {
            name: "Health & Wellness",
            slug: "health-wellness",
            icon: "heart",
            sub_categories:
              populate === "sub-categories"
                ? {
                    data: [
                      { id: "2-1", attributes: { name: "Hospitals", slug: "hospitals" } },
                      { id: "2-2", attributes: { name: "Dental Clinics", slug: "dental-clinics" } },
                      { id: "2-3", attributes: { name: "Pharmacies", slug: "pharmacies" } },
                      { id: "2-4", attributes: { name: "Spas & Massage", slug: "spas-massage" } },
                      { id: "2-5", attributes: { name: "Fitness Centers", slug: "fitness-centers" } },
                    ],
                  }
                : undefined,
          },
        },
        {
          id: "3",
          attributes: {
            name: "Shopping",
            slug: "shopping",
            icon: "shopping-bag",
            sub_categories:
              populate === "sub-categories"
                ? {
                    data: [
                      { id: "3-1", attributes: { name: "Malls", slug: "malls" } },
                      { id: "3-2", attributes: { name: "Markets", slug: "markets" } },
                      { id: "3-3", attributes: { name: "Tailors", slug: "tailors" } },
                      { id: "3-4", attributes: { name: "Electronics", slug: "electronics" } },
                      { id: "3-5", attributes: { name: "Souvenirs", slug: "souvenirs" } },
                    ],
                  }
                : undefined,
          },
        },
        {
          id: "4",
          attributes: {
            name: "Transportation",
            slug: "transportation",
            icon: "car",
            sub_categories:
              populate === "sub-categories"
                ? {
                    data: [
                      { id: "4-1", attributes: { name: "Songthaew Routes", slug: "songthaew-routes" } },
                      { id: "4-2", attributes: { name: "Taxi Services", slug: "taxi-services" } },
                      { id: "4-3", attributes: { name: "Bus Terminals", slug: "bus-terminals" } },
                      { id: "4-4", attributes: { name: "Motorbike Rental", slug: "motorbike-rental" } },
                      { id: "4-5", attributes: { name: "Airport Transfer", slug: "airport-transfer" } },
                    ],
                  }
                : undefined,
          },
        },
        {
          id: "5",
          attributes: {
            name: "Services",
            slug: "services",
            icon: "briefcase",
            sub_categories:
              populate === "sub-categories"
                ? {
                    data: [
                      { id: "5-1", attributes: { name: "Visa Agencies", slug: "visa-agencies" } },
                      { id: "5-2", attributes: { name: "Legal Services", slug: "legal-services" } },
                      { id: "5-3", attributes: { name: "Real Estate", slug: "real-estate" } },
                      { id: "5-4", attributes: { name: "Repairs", slug: "repairs" } },
                      { id: "5-5", attributes: { name: "Banking", slug: "banking" } },
                    ],
                  }
                : undefined,
          },
        },
        {
          id: "6",
          attributes: {
            name: "Explore Pattaya",
            slug: "explore-pattaya",
            icon: "map-pin",
            sub_categories:
              populate === "sub-categories"
                ? {
                    data: [
                      { id: "6-1", attributes: { name: "Top Attractions", slug: "top-attractions" } },
                      { id: "6-2", attributes: { name: "Beaches", slug: "beaches" } },
                      { id: "6-3", attributes: { name: "Walking Street", slug: "walking-street" } },
                      { id: "6-4", attributes: { name: "Markets", slug: "markets" } },
                      { id: "6-5", attributes: { name: "Temples", slug: "temples" } },
                    ],
                  }
                : undefined,
          },
        },
      ],
    }

    return NextResponse.json(categoriesData)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}
