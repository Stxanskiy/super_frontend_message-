import { useEffect, useState } from 'react';
import { websocketService } from '@/lib/websocket-service';
import { cn } from '@/lib/utils';
import { Wifi, WifiOff } from 'lucide-react';

export const ConnectionStatus = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [reconnectAttempt, setReconnectAttempt] = useState(0);

  useEffect(() => {
    const handleConnect = () => {
      setIsConnected(true);
      setIsReconnecting(false);
      setReconnectAttempt(0);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    const handleReconnecting = (attempt: number) => {
      setIsReconnecting(true);
      setReconnectAttempt(attempt);
    };

    websocketService.subscribe('connection_status', (data) => {
      if (data.status === 'connected') {
        handleConnect();
      } else if (data.status === 'disconnected') {
        handleDisconnect();
      } else if (data.status === 'reconnecting') {
        handleReconnecting(data.attempt);
      }
    });

    return () => {
      websocketService.unsubscribe('connection_status', handleConnect);
      websocketService.unsubscribe('connection_status', handleDisconnect);
      websocketService.unsubscribe('connection_status', handleReconnecting);
    };
  }, []);

  return (
    <div
      className={cn(
        'fixed bottom-4 right-4 flex items-center space-x-2 px-3 py-2 rounded-full text-sm transition-all duration-300',
        isConnected
          ? 'bg-green-100 text-green-800'
          : isReconnecting
          ? 'bg-yellow-100 text-yellow-800'
          : 'bg-red-100 text-red-800'
      )}
    >
      {isConnected ? (
        <>
          <Wifi className="h-4 w-4" />
          <span>Connected</span>
        </>
      ) : isReconnecting ? (
        <>
          <Wifi className="h-4 w-4 animate-pulse" />
          <span>Reconnecting... ({reconnectAttempt}/5)</span>
        </>
      ) : (
        <>
          <WifiOff className="h-4 w-4" />
          <span>Disconnected</span>
        </>
      )}
    </div>
  );
}; 