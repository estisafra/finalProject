import React, { useEffect } from 'react';

const SendEmails = () => {
    const callSendEmails = async () => {
        try {
            const response = await fetch('http://localhost:8080/System/sendEmails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Emails sent successfully:', data);
        } catch (error) {
            console.error('Error sending emails:', error);
        }
    };

    const scheduleSendEmails = (targetHour, targetMinute) => {
        const now = new Date();
        const targetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), targetHour, targetMinute, 0, 0);

        if (targetTime < now) {
            targetTime.setDate(targetTime.getDate() + 1);
        }

        const timeUntilTarget = targetTime - now;

        setTimeout(callSendEmails, timeUntilTarget);
    };

    useEffect(() => {
        scheduleSendEmails(0, 0); 
    }, []);

    return (
        <></>
    );
};

export default SendEmails;
