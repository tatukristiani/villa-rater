interface WaitOverlayProps {
  message: string;
  subMessage?: string;
}

export default function WaitOverlay({ message, subMessage }: WaitOverlayProps) {
  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-sm mx-4 text-center">
        <div className="mb-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
        <h3 className="text-lg font-medium mb-2">{message}</h3>
        {subMessage && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {subMessage}
          </p>
        )}
      </div>
    </div>
  );
}
