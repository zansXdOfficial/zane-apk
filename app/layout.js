import "./globals.css";

export const metadata = {
  title: "ZANE AI Studio",
  description: "Studio pembuat prompt foto berbasis AI"
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}