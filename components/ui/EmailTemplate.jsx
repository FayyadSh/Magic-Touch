const EmailTemplate = ({ customerName, serviceName, appointmentDate, appointmentTime }) => {
    const primaryColor = '#00A9FF'; // Replace with your desired primary color
  
    return (
      <div
        style={{
          fontFamily: 'Arial, sans-serif',
          lineHeight: '1.6',
          color: '#333',
          maxWidth: '600px',
          margin: '0 auto',
          padding: '20px',
          border: '1px solid #ddd',
          borderRadius: '8px',
        }}
      >
        {/* Header */}

        <h1 style={{backgroundColor: primaryColor, color: 'white', padding: '20px 10px'}}>
          Booking Confirmation
        </h1>
        <h2 style={{ color: primaryColor }}>
          Thank You for Booking {serviceName} with Magic Touch!
        </h2>
        <h1>Hi {customerName},</h1>
        <p>
          Thank you for choosing <strong style={{color: primaryColor}}>Magic Touch</strong> for your home
          service needs! We’re delighted to have the opportunity to serve you.
        </p>
  
        <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '20px 0' }} />
  
        {/* Booking Details */}
        <h3 style={{ color: primaryColor }}>Summary of Your Booking:</h3>
        <ul>
          <li>
            <strong>Service:</strong> {serviceName}
          </li>
          <li>
            <strong>Date & Time:</strong> {appointmentDate} at {appointmentTime}
          </li>
        </ul>
        <p>
          <a
            href='#'
            style={{ color: primaryColor, textDecoration: 'none' }}
          >
            Click here to view your booking details
          </a>
          .
        </p>
  
        <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '20px 0' }} />
  
        {/* Next Steps */}
        <h3 style={{ color: primaryColor }}>What Happens Next?</h3>
        <p>
          Our professional [Technician/Service Provider] will arrive at your
          location at the scheduled time. Here’s what to expect:
        </p>
        <ol>
          <li>A quick introduction and assessment of the task.</li>
          <li>Completion of the service with utmost care and quality.</li>
          <li>Assistance with any questions or feedback you may have.</li>
        </ol>
  
        <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '20px 0' }} />
  
        {/* Support Info */}
        <h3 style={{ color: primaryColor }}>Need Help?</h3>
        <p>
          If you have any questions, need to reschedule, or require assistance,
          feel free to contact us:
        </p>
        <p>
          📧 <strong>Email:</strong>{' '}
          <a
            href={`mailto:magictouch@gmail.com`}
            style={{ color: primaryColor, textDecoration: 'none' }}
          >
            magictouch@gmail.com
          </a>
        </p>
        <p>We’re here to help 24/7!</p>
  
        <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '20px 0' }} />
  
        {/* Closing */}
        <p>
          We appreciate your trust in us and look forward to providing excellent
          service. Don’t forget to leave a review or share your experience with
          friends and family!
        </p>
  
        <p style={{ fontWeight: 'bold' }}>Warm regards,</p>
        <p>Magic Touch</p>
        <p>
          🏠{' '}
          <a
            href='link'
            style={{ color: primaryColor, textDecoration: 'none' }}
          >
            'link'
          </a>
        </p>
      </div>
    );
  };
  
  export default EmailTemplate;
  