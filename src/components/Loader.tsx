// components/Loader.tsx

export default function Loader() {
  return (
    <div className="flex items-center justify-center h-48">
      <div className="flex space-x-2">
        <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
        <div className="w-4 h-4 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
        <div className="w-4 h-4 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
      </div>
    </div>
  );
}
