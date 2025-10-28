# EmailJS Setup Guide

## Getting Started with EmailJS

1. **Sign up for EmailJS**
   - Visit [EmailJS](https://www.emailjs.com/)
   - Create a free account

2. **Get Your Credentials**
   - Navigate to the EmailJS dashboard
   - Copy your **User ID**
   - Create a new **Service**
     - Service ID: Example - `service_your-service-id`
   - Create a new **Email Template**
     - Template ID: Example - `template_your-template-id`

3. **Update Environment Variables**
   Replace the placeholder values in `.env`:
   ```env
   EMAILJS_SERVICE_ID=service_your-service-id
   EMAILJS_TEMPLATE_ID=template_your-template-id
   EMAILJS_USER_ID=your-user-id
   ```

4. **EmailJS Template Example**
   Make sure your EmailJS template includes these placeholders:
   ```
   {{from_name}}
   {{from_email}}
   {{subject}}
   {{message}}
   ```

## Testing the Contact Form

1. Start the development server: `yarn dev`
2. Navigate to the contact page
3. Fill out and submit the form
4. Check your inbox for the test email

## Troubleshooting

- **Email not sending?** Check your EmailJS dashboard for error logs
- **Template variables not working?** Ensure your template includes all required placeholders
- **Environment variables not loading?** Make sure you're using the correct `.env` file for your environment