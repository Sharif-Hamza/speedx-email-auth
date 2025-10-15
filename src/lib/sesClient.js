const AWS = require('aws-sdk');

// Validate environment variables
if (!process.env.AWS_REGION) {
  throw new Error('AWS_REGION is required');
}

if (!process.env.AWS_ACCESS_KEY_ID) {
  throw new Error('AWS_ACCESS_KEY_ID is required');
}

if (!process.env.AWS_SECRET_ACCESS_KEY) {
  throw new Error('AWS_SECRET_ACCESS_KEY is required');
}

if (!process.env.SES_SOURCE_EMAIL) {
  throw new Error('SES_SOURCE_EMAIL is required');
}

// Configure AWS SDK
AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

// Create SES client
const ses = new AWS.SES({ apiVersion: '2010-12-01' });

/**
 * Send email via AWS SES
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.htmlBody - HTML email body
 * @param {string} options.textBody - Plain text email body
 * @returns {Promise<Object>} SES response
 */
async function sendEmail({ to, subject, htmlBody, textBody }) {
  const params = {
    Source: process.env.SES_SOURCE_EMAIL,
    Destination: {
      ToAddresses: [to]
    },
    Message: {
      Subject: {
        Data: subject,
        Charset: 'UTF-8'
      },
      Body: {
        Html: {
          Data: htmlBody,
          Charset: 'UTF-8'
        },
        Text: {
          Data: textBody,
          Charset: 'UTF-8'
        }
      }
    },
    // Optional: Add list-unsubscribe header
    // Tags: [
    //   {
    //     Name: 'email-type',
    //     Value: 'confirmation'
    //   }
    // ]
  };

  try {
    const result = await ses.sendEmail(params).promise();
    console.log('✅ Email sent successfully:', result.MessageId);
    return result;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
  }
}

module.exports = {
  ses,
  sendEmail
};
