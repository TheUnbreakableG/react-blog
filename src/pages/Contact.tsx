import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setStatus('sending');

    try {
      // For now just simulate sending, replace with real API call/email service
      await new Promise((r) => setTimeout(r, 1000));
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact - React Blog</title>
        <meta name="description" content="Get in touch with the React Blog author." />
      </Helmet>

      <section>
        <h1>Contact Us</h1>

        {status === 'success' && <p>Thank you! Your message has been sent.</p>}
        {status === 'error' && <p>Oops! Something went wrong. Please try again.</p>}

        <form onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="name">Name*</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              aria-required="true"
            />
          </div>

          <div>
            <label htmlFor="email">Email*</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              aria-required="true"
            />
          </div>

          <div>
            <label htmlFor="message">Message*</label>
            <textarea
              id="message"
              name="message"
              required
              value={formData.message}
              onChange={handleChange}
              aria-required="true"
              rows={5}
            />
          </div>

          <button type="submit" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </section>
    </>
  );
};

export default Contact;
