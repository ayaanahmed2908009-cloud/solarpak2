import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';

interface AuthenticatedWebSocket extends WebSocket {
  userId?: number;
  isAdmin?: boolean;
}

class WebSocketManager {
  private wss: WebSocketServer | null = null;
  private clients: Map<number, AuthenticatedWebSocket[]> = new Map();

  initialize(server: Server) {
    this.wss = new WebSocketServer({ port: 8081, host: '0.0.0.0' });

    this.wss.on('connection', (ws: AuthenticatedWebSocket, req) => {
      console.log('WebSocket connection established');

      ws.on('message', (message: string) => {
        try {
          const data = JSON.parse(message);
          
          if (data.type === 'authenticate' && data.userId) {
            ws.userId = data.userId;
            ws.isAdmin = data.isAdmin || false;
            
            // Add client to user's connection list
            if (!this.clients.has(data.userId)) {
              this.clients.set(data.userId, []);
            }
            this.clients.get(data.userId)!.push(ws);
            
            ws.send(JSON.stringify({
              type: 'authenticated',
              message: 'WebSocket authenticated successfully'
            }));
            
            console.log(`User ${data.userId} authenticated via WebSocket`);
          }
        } catch (error) {
          console.error('WebSocket message parsing error:', error);
        }
      });

      ws.on('close', () => {
        // Remove client from all user connection lists
        if (ws.userId) {
          const userClients = this.clients.get(ws.userId);
          if (userClients) {
            const index = userClients.indexOf(ws);
            if (index > -1) {
              userClients.splice(index, 1);
            }
            if (userClients.length === 0) {
              this.clients.delete(ws.userId);
            }
          }
        }
        console.log('WebSocket connection closed');
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
      });
    });
  }

  // Notify a specific user about new impact media
  notifyUserImpactUpdate(userId: number, impactData: any) {
    const userClients = this.clients.get(userId);
    if (userClients && userClients.length > 0) {
      const message = JSON.stringify({
        type: 'impact_update',
        data: impactData,
        timestamp: new Date().toISOString()
      });

      userClients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
      
      console.log(`Notified user ${userId} about new impact media`);
    }
  }

  // Broadcast to all connected clients (for general updates)
  broadcast(message: any) {
    const messageStr = JSON.stringify(message);
    
    this.clients.forEach((clientList) => {
      clientList.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(messageStr);
        }
      });
    });
  }
}

export const wsManager = new WebSocketManager();