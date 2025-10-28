import React from "react";

export default function ContactSuccess() {
    return (
        <div className="contact-success-message" style={{ textAlign: 'center', marginTop: '2rem' }}>
            <svg
                width="60"
                height="60"
                fill="none"
                viewBox="0 0 60 60"
                style={{ display: 'block', margin: '0 auto 1rem auto' }}
            >
                <circle cx="30" cy="30" r="30" fill="#d1fae5" />
                <path
                    d="M20 32l7 7 13-13"
                    stroke="#059669"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
            <h2 style={{ color: '#059669', marginBottom: '.5rem' }}>Message Sent!</h2>
            <p>Thank you for contacting us. We have received your message and will get back to you soon.</p>
        </div>
    );
}
