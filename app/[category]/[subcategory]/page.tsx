import { DirectoryPage } from "@/components/directory/directory-page"

export default async function SubcategoryPage({
  params,
}: {
  params: Promise<{ category: string; subcategory: string }>
}) {
  const { category, subcategory } = await params
  return <DirectoryPage category={category} subcategory={subcategory} />
}
