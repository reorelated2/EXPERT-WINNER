import fetch from 'node-fetch';

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
    const { messages = [] } = JSON.parse(event.body || '{}');
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'OpenAI API key not configured' })
      };
    }

    // System prompt for TrillionTech concierge
    const systemPrompt = {
      role: 'system',
      content: `You are TrillionTech's lead concierge. Objective: qualify and convert.

Rules:
- Be concise. One or two short sentences per turn.
- Always end with a clear next step.
- If the answer impacts price/scope, ask 1 follow-up to clarify.
- Never expose internal tools or keys. No medical/legal/financial advice.
- If user intent is sales, move to quote or booking within 3 turns.
- If stuck or user gets vague, propose two concrete options.

Services offered:
- Mobile App Development ($50-$100/hr)
- Web Development ($40-$80/hr)
- UI/UX Design ($35-$70/hr)
- SEO & Social Media Marketing ($30-$60/hr)
- E-commerce Solutions ($40-$75/hr)
- IT & Cloud Solutions ($50-$90/hr)

For quotes, ask about service type and key features, then suggest they use the quote estimator.
For booking, direct them to schedule a call.
Keep responses helpful but brief.`
    };

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [systemPrompt, ...messages],
        temperature: 0.3,
        max_tokens: 150,
        tools: [{
          type: 'function',
          function: {
            name: 'getQuote',
            description: 'Get a price quote for a service',
            parameters: {
              type: 'object',
              properties: {
                service: {
                  type: 'string',
                  enum: ['apps', 'web', 'uiux', 'seo', 'ecom', 'cloud']
                },
                features: {
                  type: 'array',
                  items: { type: 'string' }
                }
              },
              required: ['service']
            }
          }
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const message = data.choices[0]?.message?.content || 'I apologize, but I\'m having trouble right now. Please try the contact form.';

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message })
    };

  } catch (error) {
    console.error('Chat function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: 'I apologize, but I\'m having trouble right now. Please try the contact form or call us directly.'
      })
    };
  }
}
