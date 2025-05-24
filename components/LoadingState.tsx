export default function LoadingState({ query }: { query: string }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="loading-spinner mb-4"></div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Analyzing "{query}"
        </h2>
        <p className="text-gray-600">
          Gathering data from multiple sources...
        </p>
      </div>
    </div>
  )
}