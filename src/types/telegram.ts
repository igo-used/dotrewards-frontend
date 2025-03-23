// src/types/telegram.ts

declare global {
    interface Window {
      Telegram?: {
        WebApp?: {
          openLink?: (url: string) => void;
          initDataUnsafe?: {
            user?: {
              id: number;
            };
          };
        };
      };
    }
  }
  
  export {}