import type { Metadata } from "next";
import { Sen, Unica_One } from "next/font/google";
import "./globals.css";

const sen = Sen({
  variable: "--font-sen",
  subsets: ["latin"],
});

const unicaOne = Unica_One({
  variable: "--font-unica-one",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Coffee Blend Builder",
  description: "Describe your perfect cup and get a blend recommendation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${sen.variable} ${unicaOne.variable}`}>
        <header>
          <div className="header-inner">
            <h1 className="site-title">Coffee Blend Builder</h1>
            <nav aria-label="Primary">
              <ul>
                <li>
                  <a href="#builder">Blend Builder</a>
                </li>
                <li>
                  <a href="#results">Results</a>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        <main>{children}</main>

        <footer />
      </body>
    </html>
  );
}
