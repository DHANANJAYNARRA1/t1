import { TongueAnalyzer } from "@/components/tongue-analyzer"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-purple-600 mb-2">Tongue Health Analyzer</h1>
        <p className="text-center text-gray-600 mb-8">Upload a clear image of your tongue for analysis</p>
        <TongueAnalyzer />
      </div>
    </main>
  )
}
