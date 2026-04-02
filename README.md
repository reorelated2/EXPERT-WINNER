# Trillion Web Solutions - Premium Digital Agency Website

A premium, enterprise-grade website for Trillion Web Solutions featuring AI-powered quote estimation and lead capture.

## 🚀 Features

- **Premium Design**: $30,000+ quality UI/UX with smooth animations and responsive design
- **AI Quote Estimator**: Instant price estimates for all services
- **AI Concierge**: 24/7 chat-based lead qualification and capture
- **Interactive Demos**: Live previews of mobile apps, websites, and dashboards
- **Service Catalog**: Complete pricing and feature breakdown for all services
- **Case Studies**: Real client success stories with metrics
- **Contact Forms**: Lead capture with Netlify Forms integration

## 🛠 Tech Stack

- **Frontend**: React + Vite
- **UI Components**: shadcn/ui + Tailwind CSS
- **Icons**: Lucide React
- **Backend**: Netlify Serverless Functions
- **AI**: OpenAI GPT-4o-mini
- **Deployment**: Netlify
- **Domain**: trilliontech.dev

## 📋 Prerequisites

- Node.js 18+ and npm/pnpm
- Netlify account
- OpenAI API key

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

For Netlify deployment, add this environment variable in your Netlify dashboard:
- Go to Site Settings → Environment Variables
- Add `OPENAI_API_KEY` with your OpenAI API key

## 🚀 Local Development

1. **Install dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Start development server:**
   ```bash
   npm run dev --host
   # or
   pnpm dev --host
   ```

3. **Test Netlify functions locally:**
   ```bash
   netlify dev
   ```

## 📦 Deployment

### Build for Production
```bash
npm run build
# or
pnpm build
```

### Deploy to Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard
5. Deploy!

## 🤖 AI Endpoints

### POST `/api/ai/chat`
AI Concierge for lead qualification and FAQ responses.

**Request:**
```json
{
  "messages": [
    {"role": "user", "content": "I need a quote for a mobile app"}
  ]
}
```

**Response:**
```json
{
  "message": "I'd be happy to help with a mobile app quote! What type of app are you looking to build? For example: booking, e-commerce, social, or something else?"
}
```

### POST `/api/ai/quote`
Instant price estimation for services.

**Request:**
```json
{
  "service": "apps",
  "features": ["User Login / Authentication", "Online Payments"],
  "description": "A booking app for a salon with payment integration"
}
```

**Response:**
```json
{
  "hours": 110,
  "priceLow": 5500,
  "priceHigh": 11000,
  "service": "apps",
  "features": ["User Login / Authentication", "Online Payments"],
  "breakdown": {
    "baseHours": 80,
    "featureHours": 30,
    "complexityMultiplier": 1
  }
}
```

## 📊 Services & Pricing

| Service | Rate | Base Hours | Description |
|---------|------|------------|-------------|
| Mobile Apps | $50-$100/hr | 80h | iOS & Android development |
| Web Development | $40-$80/hr | 40h | Full-stack web applications |
| UI/UX Design | $35-$70/hr | 24h | User experience design |
| SEO & Social | $30-$60/hr | 20h | Digital marketing campaigns |
| E-commerce | $40-$75/hr | 60h | Online store development |
| IT & Cloud | $50-$90/hr | 30h | Infrastructure & DevOps |

## 🎯 Analytics Events

The website tracks the following events for analytics:

- `page_loaded` - Initial page load
- `quote_requested` - User requests a quote
- `quote_returned` - Quote calculation completed
- `chat_message_sent` - User sends chat message
- `chat_response_received` - AI responds to chat
- `lead_captured` - Lead information captured
- `error` - Any error occurred

Events are dispatched as custom DOM events:
```javascript
window.dispatchEvent(new CustomEvent('analytics', { 
  detail: { type: 'quote_requested', payload: { service: 'apps' } }
}));
```

## 🔒 Security & Privacy

- All API keys are server-side only
- No sensitive data exposed to client
- CORS properly configured
- Rate limiting implemented
- PII handling compliant

## 📈 Performance Targets

- **Lighthouse Score**: ≥90/90/100/100
- **LCP**: ≤2.5s on 4G
- **CLS**: ≤0.05
- **First Response**: <1s
- **Quote Generation**: ≤3s
- **Total JS Bundle**: ≤200KB gzipped

## 🎨 Brand Guidelines

The website follows the TrillionTech brand system:

- **Colors**: Brand (#5a2dff), Ink (#0b0b0c), Muted (#666)
- **Typography**: Inter 400/600/700
- **Radius**: 12px (cards), 10px (buttons), 8px (inputs)
- **Motion**: 200ms ease with reduced motion support
- **Spacing**: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64px scale

## 🐛 Troubleshooting

### Common Issues

1. **AI functions not working**
   - Check OPENAI_API_KEY is set in Netlify environment variables
   - Verify API key has sufficient credits
   - Check function logs in Netlify dashboard

2. **Build failures**
   - Ensure all dependencies are installed
   - Check for TypeScript/ESLint errors
   - Verify all imports are correct

3. **Styling issues**
   - Ensure Tailwind CSS is properly configured
   - Check for conflicting CSS classes
   - Verify custom CSS variables are defined

## 📞 Support

For technical support or questions:
- Email: hello@trilliontech.dev
- Phone: +1 (555) 123-4567
- Hours: Mon-Fri 9AM-6PM EST

## 📄 License

© 2025 Trillion Web Solutions. All rights reserved.
