const express = require('express');
const { Resend } = require('resend');

const router = express.Router();

// Initialize Resend with API key from environment variable or fallback
const resendApiKey = process.env.RESEND_API_KEY || 're_CK33DB7V_3JF9phyLqA2JVHVzR4GexdGy';
const resend = new Resend(resendApiKey);

// Test endpoint to verify Resend is working
router.get('/test', async (req, res) => {
  try {
    console.log('[Contact API] Test endpoint called');
    console.log('[Contact API] Resend API key:', resendApiKey.substring(0, 10) + '...');
    
    const testResult = await resend.emails.send({
      from: 'journi@resend.dev',
      to: 'muhammad.shawal980@gmail.com',
      subject: 'Test Email from Journi Contact API',
      html: '<p>This is a test email to verify the Resend API is working correctly.</p>'
    });

    if (testResult.error) {
      return res.status(500).json({ 
        error: 'Resend test failed',
        details: testResult.error 
      });
    }

    res.json({ 
      success: true, 
      message: 'Test email sent successfully',
      emailId: testResult.data?.id 
    });
  } catch (error) {
    console.error('[Contact API] Test error:', error);
    res.status(500).json({ 
      error: 'Test failed',
      message: error.message 
    });
  }
});

// Contact form submission
router.post('/', async (req, res) => {
  try {
    console.log('[Contact API] Received request:', {
      body: req.body,
      headers: req.headers['content-type']
    });

    const { firstName, surname, emailAddress, subject, message } = req.body;

    console.log('[Contact API] Parsed data:', { firstName, surname, emailAddress, subject, hasMessage: !!message });

    // Validate required fields
    if (!firstName || !surname || !emailAddress || !subject || !message) {
      console.error('[Contact API] Validation failed - missing fields');
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['firstName', 'surname', 'emailAddress', 'subject', 'message'],
        received: { firstName: !!firstName, surname: !!surname, emailAddress: !!emailAddress, subject: !!subject, message: !!message }
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailAddress)) {
      console.error('[Contact API] Invalid email format:', emailAddress);
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Prepare email content
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #101820; border-bottom: 2px solid #101820; padding-bottom: 10px;">
          New Contact Form Submission
        </h2>
        
        <div style="margin-top: 20px;">
          <p><strong>Name:</strong> ${firstName} ${surname}</p>
          <p><strong>Email:</strong> <a href="mailto:${emailAddress}">${emailAddress}</a></p>
          <p><strong>Subject:</strong> ${subject}</p>
        </div>
        
        <div style="margin-top: 30px; padding: 20px; background-color: #f5f5f5; border-left: 4px solid #101820;">
          <h3 style="margin-top: 0; color: #101820;">Message:</h3>
          <p style="white-space: pre-wrap; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</p>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
          <p>This email was sent from the Journi contact form.</p>
          <p>Submitted on: ${new Date().toLocaleString('en-GB', { 
            dateStyle: 'long', 
            timeStyle: 'short' 
          })}</p>
        </div>
      </div>
    `;

    // Send email using Resend
    console.log('[Contact API] Sending email via Resend...');
    console.log('[Contact API] Resend config:', {
      from: 'journi@resend.dev',
      to: 'muhammad.shawal980@gmail.com',
      subject: `Contact Form: ${subject}`,
      hasHtml: !!emailHtml,
      replyTo: emailAddress
    });

    const emailResult = await resend.emails.send({
      from: 'journi@resend.dev',
      to: 'muhammad.shawal980@gmail.com',
      subject: `Contact Form: ${subject}`,
      html: emailHtml,
      replyTo: emailAddress, // Allow replying directly to the sender
    });

    console.log('[Contact API] Resend response:', {
      success: !emailResult.error,
      error: emailResult.error,
      data: emailResult.data
    });

    if (emailResult.error) {
      console.error('[Contact API] Resend API error:', emailResult.error);
      return res.status(500).json({ 
        error: 'Failed to send email',
        details: emailResult.error.message || JSON.stringify(emailResult.error),
        code: emailResult.error.name || 'UNKNOWN_ERROR'
      });
    }

    // Success response
    console.log('[Contact API] Email sent successfully, ID:', emailResult.data?.id);
    res.status(200).json({ 
      success: true,
      message: 'Contact form submitted successfully',
      emailId: emailResult.data?.id
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ 
      error: 'Failed to process contact form submission',
      message: error.message 
    });
  }
});

module.exports = router;

