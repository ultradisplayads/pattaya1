import { DirectoryPage } from "@/components/directory/directory-page"

export default function SubcategoryPage({
  params,
}: {
  params: { category: string; subcategory: string }
}) {
  return <DirectoryPage category={params.category} subcategory={params.subcategory} />
}
