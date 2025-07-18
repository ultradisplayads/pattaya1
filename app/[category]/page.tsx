import { DirectoryPage } from "@/components/directory/directory-page"
import { notFound } from "next/navigation"

interface CategoryPageProps {
  params: Promise<{
    category: string
  }>
}

// Valid categories
const VALID_CATEGORIES = [
  "dining-food",
  "health-wellness",
  "shopping",
  "transportation",
  "services",
  "explore-pattaya",
  "accommodation",
  "nightlife",
  "entertainment",
]

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params

  if (!VALID_CATEGORIES.includes(category)) {
    notFound()
  }

  return <DirectoryPage category={category} />
}

export async function generateStaticParams() {
  return VALID_CATEGORIES.map((category) => ({
    category,
  }))
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { category } = await params

  const categoryNames = {
    "dining-food": "Dining & Food",
    "health-wellness": "Health & Wellness",
    shopping: "Shopping",
    transportation: "Transportation",
    services: "Services",
    "explore-pattaya": "Explore Pattaya",
    accommodation: "Hotels & Accommodation",
    nightlife: "Nightlife",
    entertainment: "Entertainment",
  }

  const categoryName = categoryNames[category] || category

  return {
    title: `${categoryName} in Pattaya | Pattaya1 Directory`,
    description: `Discover the best ${categoryName.toLowerCase()} options in Pattaya. Complete directory with reviews, photos, and contact information.`,
  }
}
