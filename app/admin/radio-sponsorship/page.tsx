import { RadioWidgetAdmin } from "@/components/admin/radio-widget-admin"

export default function RadioSponsorshipPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Radio Widget Sponsorship Management
          </h1>
          <p className="text-gray-600">
            Configure sponsorship settings for the radio widget on the homepage.
            This allows you to display a sponsored banner regardless of which station is selected.
          </p>
        </div>
        
        <RadioWidgetAdmin />
        
        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            How It Works
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Enable widget sponsorship to show a banner above the radio player</li>
            <li>• The banner displays "Sponsored by {'{Company Name}'}" or your custom message</li>
            <li>• This is separate from individual station sponsorship</li>
            <li>• The banner appears regardless of which radio station is selected</li>
            <li>• Perfect for major brand partnerships and homepage-level advertising</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
