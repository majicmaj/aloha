export function TypingIndicator() {
  return (
    <div className="flex gap-4 p-4">
      <div className="flex-shrink-0 mt-1">
        <div className="w-10 h-10 bg-gradient-to-br rounded-2xl flex items-center justify-center">
          <div className="flex space-x-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 bg-gray-300 rounded-full typing-indicator"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
