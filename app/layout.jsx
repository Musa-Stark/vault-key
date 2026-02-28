export const metadata = {
  title: "VaultX",
  description: "Secure password vault",
  icon: "/shield.png"
};

import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
