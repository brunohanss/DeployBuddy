import { useToast } from '@chakra-ui/react';
import { useEffect } from 'react';

const useNotifications = () => {
  const toast = useToast();

  const showNotification = (title: string, description: string, status:"info" | "warning" | "success" | "error" | "loading" | undefined) => {
    toast({
      title,
      description,
      status,
      duration: 5000,
      isClosable: true,
    });

    if (!document.hasFocus()) {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, { body: description });
      } else if ('Notification' in window && Notification.permission !== 'denied') {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            new Notification(title, { body: description });
          }
        });
      }
    }
  };

  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  return showNotification;
};

export default useNotifications;
