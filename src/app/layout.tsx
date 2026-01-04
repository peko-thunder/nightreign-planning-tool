import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "夜渡りルーレット - ELDEN RING NIGHTREIGN",
  description: "ELDEN RING NIGHTREIGNのキャラクター選択ルーレット",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="bg-nightreign-bg min-h-screen font-game text-gray-200">
        {children}
      </body>
    </html>
  );
}
