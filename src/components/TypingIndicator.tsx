export function TypingIndicator() {
  return (
    <div className="flex space-x-1">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="w-1.5 h-1.5 bg-gray-400 rounded-full typing-indicator"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}
