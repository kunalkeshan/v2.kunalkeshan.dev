import { Nunito_Sans, Montserrat, Space_Mono } from "next/font/google";

export const fontSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

export const fontSerif = Montserrat({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const fontMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "700"],
});

export const rootBodyClassName = `${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} font-sans antialiased`;
