import { EmailTemplate } from '../components/ui';
import ReactDOMServer from 'react-dom/server';

export const sendEmail = async (emailData) => {
  const { username, service, date, selectedTime, email } = emailData;

  // Convert the `date` object to a readable string format
  const formattedDate = new Date(date).toLocaleDateString(); // You can customize this format if needed

  // Define the email theme directly as JSX
  const emailHtml = ReactDOMServer.renderToStaticMarkup(
    <EmailTemplate
        customerName={username}
        serviceName={service}
        appointmentDate={formattedDate}
        appointmentTime={selectedTime}
    />
  );

  // Email payload for Sendinblue API
  const emailPayload = {
    sender: { name: 'Magic Touch', email: process.env.NEXT_PUBLIC_SENDER_EMAIL }, // Replace with your sender email
    to: [{ email }], // Recipient email
    subject: `Booking Confirmation - ${service}`,
    htmlContent: emailHtml, // Pass the rendered HTML here
  };

  try {
    // Send email using Sendinblue API
    const response = await fetch('https://api.sendinblue.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.NEXT_PUBLIC_SENDINBLUE_API_KEY, // Replace with your Sendinblue API key
      },
      body: JSON.stringify(emailPayload),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Failed to send email:', error);
      return { success: false, error };
    }

    console.log('Email sent successfully');
    return { success: true };
  } catch (err) {
    console.error('Error sending email:', err);
    return { success: false, error: err };
  }
};
