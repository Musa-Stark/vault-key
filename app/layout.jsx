export const metadata = {
  title: "Vault Key",
  description: "Secure password vault",
};

import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
