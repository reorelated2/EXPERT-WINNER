export async function handler(event, context) {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { service, features = [], description = '' } = JSON.parse(event.body || '{}');

    if (!service) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Service is required' })
      };
    }

    // Service rates (per hour)
    const rates = {
      apps: [50, 100],
      web: [40, 80],
      uiux: [35, 70],
      seo: [30, 60],
      ecom: [40, 75],
      cloud: [50, 90]
    };

    // Base hours for each service type
    const baseHours = {
      apps: 80,      // Mobile app base
      web: 40,       // Website base
      uiux: 24,      // Design project base
      seo: 20,       // SEO campaign base
      ecom: 60,      // E-commerce store base
      cloud: 30      // Cloud setup base
    };

    // Feature complexity multipliers
    const featureHours = {
      'User Login / Authentication': 12,
      'Online Payments': 18,
      'Booking / Scheduling': 16,
      'Shopping Cart': 14,
      'Loyalty / Rewards': 10,
      'Cloud Hosting / CI/CD': 8,
      'Analytics Dashboard': 15,
      'SEO Audit & Optimization': 12
    };

    // Calculate total hours
    const base = baseHours[service] || 40;
    const additionalHours = features.reduce((total, feature) => {
      return total + (featureHours[feature] || 6);
    }, 0);

    const totalHours = base + additionalHours;

    // Get rate range for service
    const [lowRate, highRate] = rates[service] || [40, 80];

    // Calculate price range
    const priceLow = Math.round(totalHours * lowRate);
    const priceHigh = Math.round(totalHours * highRate);

    // Add some variance based on description complexity
    let complexityMultiplier = 1;
    if (description.toLowerCase().includes('complex') || 
        description.toLowerCase().includes('enterprise') ||
        description.toLowerCase().includes('custom')) {
      complexityMultiplier = 1.2;
    }

    const finalHours = Math.round(totalHours * complexityMultiplier);
    const finalPriceLow = Math.round(priceLow * complexityMultiplier);
    const finalPriceHigh = Math.round(priceHigh * complexityMultiplier);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        hours: finalHours,
        priceLow: finalPriceLow,
        priceHigh: finalPriceHigh,
        service,
        features,
        breakdown: {
          baseHours: base,
          featureHours: additionalHours,
          complexityMultiplier
        }
      })
    };

  } catch (error) {
    console.error('Quote function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: 'Unable to calculate quote. Please try again or contact us directly.'
      })
    };
  }
}
