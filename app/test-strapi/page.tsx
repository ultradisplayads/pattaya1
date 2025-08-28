import { StrapiTest } from "@/components/auth/strapi-test"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function TestStrapiPage() {
  return (
    <ProtectedRoute requireAuth={true} requireStrapi={false}>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Strapi Integration Test</h1>
        <StrapiTest />
      </div>
    </ProtectedRoute>
  )
} 