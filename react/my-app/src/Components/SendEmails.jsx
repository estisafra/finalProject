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

    useEffect(() => {
        callSendEmails();
    }, []);

    return(
        <>sendemails</>
    )
};

export default SendEmails;
