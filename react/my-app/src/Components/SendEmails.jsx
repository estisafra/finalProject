import React, { useEffect } from 'react';
import axios from 'axios';

const SendEmails = () => {
    useEffect(() => {
        const callSendEmails = async () => {
            try {
                const response = await axios.post('http://localhost:8080/System/sendEmails');
                console.log('Response from sendEmails:', response.data);
            } catch (error) {
                console.error('Error calling sendEmails:', error);
            }
        };

        callSendEmails();
    }, []);

    return (
        <>
            <h1>Sending Emails...</h1>
        </>
    );
};

export default SendEmails;
