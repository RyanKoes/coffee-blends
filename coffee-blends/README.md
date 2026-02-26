Coffee Blend Builder (Next.js)

Describe the coffee you want (brew method + flavor targets) and generate a suggested blend recipe (origins, processing, altitude, roast level, and ratios) via a Gemini-powered API route.

## Getting Started

### 1) Configure env vars

Copy the example env file and add your key (keep this file private; don’t commit it):

```bash
cp .env.local.example .env.local
```

Then edit `.env.local` and set:

```bash
GEMINI_API_KEY=your_key_here
# Optional (defaults to gemini-2.5-flash-lite):
GEMINI_MODEL=gemini-2.5-flash-lite
```

### 2) Run the dev server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Key files:

- The UI lives in `app/page.tsx`
- The Gemini call is in `app/api/blend/route.ts`

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to load Sen + Unica One.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
