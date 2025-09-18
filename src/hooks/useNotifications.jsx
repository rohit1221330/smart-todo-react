import { useState, useEffect } from 'react';

export const useNotifications = () => {
    const [permission, setPermission] = useState(Notification.permission);

    useEffect(() => {
        if (!("Notification" in window)) {
            console.log("This browser does not support desktop notification");
        }
    }, []);

    const requestPermission = async () => {
        const result = await Notification.requestPermission();
        setPermission(result);
        return result;
    };

    const showNotification = (title, options) => {
        if (permission === 'granted') {
            new Notification(title, options);
        } else if (permission === 'default') {
            // Optionally, prompt user again if they haven't made a choice
            console.log('Notification permission not yet granted. Please request it first.');
        } else {
            console.log('Notification permission was denied.');
        }
    };

    return { permission, requestPermission, showNotification };
};