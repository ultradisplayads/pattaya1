import { NextResponse } from 'next/server';
import { buildApiUrl } from '@/lib/strapi-config';

export async function GET() {
  // Return default configs directly since Strapi API doesn't exist yet
  const defaultConfigs = {
    "weather": { "allowResize": true, "allowDrag": true, "allowDelete": true, "isLocked": false },
    "news": { "allowResize": true, "allowDrag": true, "allowDelete": true, "isLocked": false },
    "events": { "allowResize": true, "allowDrag": true, "allowDelete": true, "isLocked": false },
    "businesses": { "allowResize": true, "allowDrag": true, "allowDelete": true, "isLocked": false },
    "deals": { "allowResize": true, "allowDrag": true, "allowDelete": true, "isLocked": false },
    "social": { "allowResize": true, "allowDrag": true, "allowDelete": true, "isLocked": false },
    "radio": { "allowResize": true, "allowDrag": true, "allowDelete": true, "isLocked": false },
    "traffic": { "allowResize": false, "allowDrag": false, "allowDelete": false, "isLocked": true },
    "currency-converter": { "allowResize": true, "allowDrag": true, "allowDelete": true, "isLocked": false }
  };
  
  return NextResponse.json(defaultConfigs);
}
