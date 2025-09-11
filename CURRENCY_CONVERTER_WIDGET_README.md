# Currency Converter Widget

A comprehensive currency converter widget with real-time exchange rates, integrated with both Strapi backend and Next.js frontend.

## Features

### Core Functionality
- **Real-time Exchange Rates**: Fetches live exchange rates from multiple APIs with fallback support
- **20+ Major Currencies**: Supports major world currencies with Thai Baht (THB) as the base currency
- **Instant Conversion**: Convert between any supported currencies with real-time calculations
- **Currency Swap**: Quick swap functionality between from/to currencies
- **Historical Data**: View exchange rate history with trend indicators

### User Interface
- **Modern Design**: Clean, responsive UI with both primary and nightlife themes
- **Quick Amount Buttons**: Pre-set amount buttons (100, 1K, 10K) for common conversions
- **Rate Indicators**: Visual indicators showing rate changes (up/down trends)
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Loading States**: Smooth loading animations and states

### Technical Features
- **Auto-refresh**: Configurable automatic rate updates
- **Caching**: Intelligent caching system to reduce API calls
- **Fallback Rates**: Offline fallback rates when external APIs are unavailable
- **Widget Permissions**: Full integration with the widget permission system
- **Sponsorship Support**: Built-in sponsorship banner support

## Supported Currencies

| Code | Currency | Symbol | Flag |
|------|----------|--------|------|
| THB | Thai Baht | ฿ | 🇹🇭 |
| USD | US Dollar | $ | 🇺🇸 |
| EUR | Euro | € | 🇪🇺 |
| GBP | British Pound | £ | 🇬🇧 |
| JPY | Japanese Yen | ¥ | 🇯🇵 |
| KRW | South Korean Won | ₩ | 🇰🇷 |
| SGD | Singapore Dollar | S$ | 🇸🇬 |
| MYR | Malaysian Ringgit | RM | 🇲🇾 |
| IDR | Indonesian Rupiah | Rp | 🇮🇩 |
| PHP | Philippine Peso | ₱ | 🇵🇭 |
| VND | Vietnamese Dong | ₫ | 🇻🇳 |
| CNY | Chinese Yuan | ¥ | 🇨🇳 |
| HKD | Hong Kong Dollar | HK$ | 🇭🇰 |
| TWD | Taiwan Dollar | NT$ | 🇹🇼 |
| AUD | Australian Dollar | A$ | 🇦🇺 |
| CAD | Canadian Dollar | C$ | 🇨🇦 |
| CHF | Swiss Franc | CHF | 🇨🇭 |
| NZD | New Zealand Dollar | NZ$ | 🇳🇿 |
| INR | Indian Rupee | ₹ | 🇮🇳 |
| RUB | Russian Ruble | ₽ | 🇷🇺 |

## API Endpoints

### Backend (Strapi)

#### Get Exchange Rates
```
GET /api/currency-converter/rates
```
Returns current exchange rates with timestamp and source information.

**Response:**
```json
{
  "success": true,
  "data": {
    "rates": {
      "USD": 36.50,
      "EUR": 39.80,
      "GBP": 46.20
    },
    "timestamp": "2024-01-15T10:30:00Z",
    "source": "https://api.exchangerate-api.com/v4/latest/THB",
    "baseCurrency": "THB"
  }
}
```

#### Convert Currency
```
GET /api/currency-converter/convert?from=THB&to=USD&amount=100
```
Converts between currencies.

**Response:**
```json
{
  "success": true,
  "data": {
    "from": {
      "currency": "THB",
      "amount": 100
    },
    "to": {
      "currency": "USD",
      "amount": 2.74
    },
    "rate": 0.0274,
    "timestamp": "2024-01-15T10:30:00Z",
    "source": "live"
  }
}
```

#### Get Supported Currencies
```
GET /api/currency-converter/currencies
```
Returns list of supported currencies with metadata.

#### Get Historical Rates
```
GET /api/currency-converter/history?currency=USD&days=7
```
Returns historical exchange rate data.

#### Get Widget Settings
```
GET /api/currency-converter/settings
```
Returns widget configuration settings.

### Frontend Hooks

#### useCurrencyConverter
Main hook for currency converter functionality.

```typescript
const {
  currencies,
  rates,
  settings,
  loading,
  error,
  convertCurrency,
  getHistoricalData,
  refreshRates
} = useCurrencyConverter();
```

#### useCurrencyConversion
Hook for individual currency conversions.

```typescript
const {
  result,
  loading,
  error,
  convert,
  clearResult
} = useCurrencyConversion();
```

#### useCurrencyHistory
Hook for historical rate data.

```typescript
const {
  history,
  loading,
  error,
  fetchHistory,
  clearHistory
} = useCurrencyHistory();
```

## Installation & Setup

### Backend Setup

1. **Content Type**: The currency converter content type is automatically created in Strapi
2. **API Routes**: All API routes are registered automatically
3. **Public Access**: Currency converter endpoints are added to public endpoints in middleware
4. **Widget Permissions**: Currency converter is added to the widget permission system

### Frontend Setup

1. **Widget Component**: Import and use the `CurrencyConverterWidget` component
2. **API Integration**: The `currencyApi` class handles all API communication
3. **Hooks**: Use the provided hooks for state management
4. **Styling**: Component uses Tailwind CSS with theme support

### Adding to Widget Grid

```tsx
import { CurrencyConverterWidget } from '@/components/widgets/currency-converter-widget';

// In your widget grid
<CurrencyConverterWidget theme="primary" />
```

## Configuration

### Widget Settings

The widget can be configured through the Strapi admin panel:

- **Default From Currency**: Default source currency (default: THB)
- **Default To Currency**: Default target currency (default: USD)
- **Update Frequency**: How often to refresh rates in minutes (default: 5)
- **Supported Currencies**: List of enabled currencies
- **Sponsorship**: Enable/disable sponsorship banner
- **Sponsor Details**: Sponsor name and logo

### Environment Variables

No additional environment variables are required. The widget uses public exchange rate APIs.

## Testing

### Manual Testing

1. **Test Page**: Visit `/test-currency-converter` to see both themes
2. **Widget Grid**: The widget is included in the main widget grid
3. **API Testing**: Use the test script to verify all endpoints

### Automated Testing

Run the comprehensive test script:

```bash
node test-currency-converter.js
```

The test script verifies:
- Backend connectivity
- API endpoints functionality
- Currency conversion accuracy
- Historical data retrieval
- Performance under load
- Frontend accessibility

## Error Handling

### API Failures
- **Multiple APIs**: Tries multiple exchange rate APIs for reliability
- **Fallback Rates**: Uses cached fallback rates when all APIs fail
- **Graceful Degradation**: Shows appropriate error messages to users

### Network Issues
- **Timeout Handling**: 10-second timeout for API requests
- **Retry Logic**: Automatic retry for failed requests
- **Offline Support**: Cached rates available when offline

### User Input Validation
- **Amount Validation**: Ensures positive numeric values
- **Currency Validation**: Validates currency codes
- **Error Messages**: Clear, user-friendly error messages

## Performance

### Caching Strategy
- **Rate Caching**: Exchange rates cached for 5 minutes
- **Currency List**: Currency list cached for 1 hour
- **Historical Data**: Historical data cached for 30 minutes

### Optimization
- **Concurrent Requests**: Multiple API endpoints for reliability
- **Lazy Loading**: Historical data loaded on demand
- **Debounced Input**: Prevents excessive API calls during typing

## Security

### Public Endpoints
- Currency converter endpoints are public (no authentication required)
- Rate limiting handled by external APIs
- No sensitive data exposed

### Data Validation
- All inputs validated on both frontend and backend
- SQL injection protection through Strapi ORM
- XSS protection through React's built-in escaping

## Monitoring & Analytics

### Conversion Logging
- All conversions are logged for analytics
- Includes timestamp, currencies, amounts, and user agent
- No personally identifiable information stored

### Performance Monitoring
- API response times tracked
- Error rates monitored
- Cache hit rates measured

## Troubleshooting

### Common Issues

1. **Rates Not Updating**
   - Check network connectivity
   - Verify external API availability
   - Check cache settings

2. **Conversion Errors**
   - Verify currency codes are supported
   - Check amount is positive number
   - Ensure API endpoints are accessible

3. **Widget Not Displaying**
   - Check widget permissions
   - Verify component import
   - Check for JavaScript errors

### Debug Mode

Enable debug logging by setting:
```javascript
localStorage.setItem('currency-converter-debug', 'true');
```

## Future Enhancements

### Planned Features
- **More Currencies**: Add support for additional currencies
- **Cryptocurrency**: Support for major cryptocurrencies
- **Rate Alerts**: Email/SMS alerts for rate changes
- **Charts**: Interactive rate charts
- **Mobile App**: Native mobile app integration

### API Improvements
- **WebSocket**: Real-time rate updates via WebSocket
- **GraphQL**: GraphQL API for more efficient queries
- **Rate Limits**: Implement rate limiting for API calls

## Support

For issues or questions:
1. Check the troubleshooting section
2. Run the test script to identify issues
3. Check browser console for JavaScript errors
4. Verify Strapi backend is running and accessible

## License

This currency converter widget is part of the Pattaya1 project and follows the same licensing terms.
