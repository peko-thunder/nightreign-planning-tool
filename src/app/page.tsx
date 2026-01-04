import { Roulette } from "@/components/Roulette";

export default function Home() {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* ヘッダー */}
      <header className="py-3 border-b border-gray-800/50 flex-shrink-0">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-nightreign-gold tracking-widest">
              夜渡りルーレット
            </h1>
            <p className="text-gray-500 text-xs tracking-wider">
              ELDEN RING NIGHTREIGN
            </p>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1 py-4 overflow-auto">
        <div className="container mx-auto px-4 max-w-6xl h-full">
          <Roulette />
        </div>
      </main>

      {/* フッター */}
      <footer className="py-2 border-t border-gray-800/50 flex-shrink-0">
        <div className="container mx-auto px-4 max-w-6xl text-center space-y-1">
          <p className="text-gray-500 text-xs">
            &copy; BANDAI NAMCO Entertainment Inc. / &copy; FromSoftware Inc.<br/>
            当サイト上で使用しているゲーム画像の著作権および商標権、その他知的財産権は、当該コンテンツの提供元に帰属します。
          </p>
          <p className="text-xs">
            <a
              href="https://x.com/peko_thunder"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-nightreign-gold transition-colors"
            >
              Contact: @peko_thunder
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
