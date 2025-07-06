# Soham Number 5

A World ID Mini App built with Next.js that demonstrates authentication, payments, and smart contract interactions.

## Features

- 🔐 **Authentication**: World ID wallet authentication with session management
- 💰 **Payments**: USDC transfers using MiniKit payment commands
- 🔗 **Smart Contracts**: Counter contract interaction on Worldchain Sepolia
- 🎵 **Audio**: Background music playback
- 🎨 **UI**: World App compliant design using Mini Apps UI Kit

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- ngrok (for local development)
- World ID account

### Setup

1. **Clone and install dependencies**
   ```bash
   git clone <your-repo>
   cd my-first-mini-app
   npm install
   ```

2. **Environment setup**
   ```bash
   cp .env.example .env.local
   ```

3. **Configure environment variables**
   - Run `npx auth secret` to generate `AUTH_SECRET`
   - Add your app ID from [developer.worldcoin.org](https://developer.worldcoin.org) to `NEXT_PUBLIC_APP_ID`
   - Set `HMAC_SECRET_KEY` by running `openssl rand -base64 32`

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Setup ngrok tunnel**
   ```bash
   ngrok http 3000
   ```

6. **Update configuration**
   - Add your ngrok URL to `AUTH_URL` in `.env.local`
   - Add your ngrok domain to `allowedDevOrigins` in `next.config.ts`
   - Update your app URL in the [developer portal](https://developer.worldcoin.org)

### Audio Setup

Place your audio file (`sohamn5.mp3`) in the `/public` folder. The app will automatically play it on loop when loaded.

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Main app page with audio
│   └── layout.tsx            # Root layout
├── components/
│   ├── AuthButton/           # Authentication component
│   ├── Pay/                  # Payment & contract interaction
│   └── PageLayout/           # Page wrapper components
├── abi/
│   └── CounterABI.json       # Smart contract ABI
└── styles/
    └── globals.css           # Global styles
```

## Key Components

### Authentication (`AuthButton`)
- Handles World ID wallet connection
- Manages user sessions with next-auth
- Displays user profile information

### Payments (`Pay`)
- Sends USDC payments to users
- Interacts with counter smart contract
- Monitors transaction confirmation status

### Smart Contract Integration
- Contract Address: `0xf6c9f4A8e497677AC5e01DaF90e549605d5FFC5A`
- Network: Worldchain Sepolia
- Function: Counter increment (`inc()`)

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Authentication**: NextAuth.js + MiniKit wallet auth
- **Blockchain**: Worldchain Sepolia, Viem
- **UI**: Mini Apps UI Kit React
- **Styling**: Tailwind CSS

## Configuration Files

### `next.config.ts`
```typescript
allowedDevOrigins: ['your-ngrok-domain.ngrok-free.app']
```

### `.env.local`
```bash
AUTH_SECRET="your-auth-secret"
HMAC_SECRET_KEY="your-hmac-key"
AUTH_URL="https://your-ngrok-url.ngrok-free.app/"
NEXT_PUBLIC_APP_ID="your-app-id"
```

## Development

### Local Testing
1. Start your dev server: `npm run dev`
2. Run ngrok: `ngrok http 3000`
3. Update your app URL in the developer portal
4. Test in World App simulator or on mobile

### Debugging
- Use Eruda for mobile console debugging (enabled in development)
- Check browser console for transaction logs
- Monitor network requests in DevTools

## Deployment

For production deployment:
1. Update `AUTH_URL` to your production domain
2. Remove ngrok domain from `allowedDevOrigins`
3. Disable Eruda in production
4. Update app URL in developer portal

## Resources

- [World ID Mini Apps Documentation](https://docs.worldcoin.org/mini-apps)
- [MiniKit JavaScript SDK](https://github.com/worldcoin/minikit-js)
- [Mini Apps UI Kit](https://github.com/worldcoin/mini-apps-ui-kit)
- [World App Design Guidelines](https://docs.world.org/mini-apps/design/app-guidelines)

## Contributing

This template was made with help from the amazing [supercorp-ai](https://github.com/supercorp-ai) team.

## License

MIT License
