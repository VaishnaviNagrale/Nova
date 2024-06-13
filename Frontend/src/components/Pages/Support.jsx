import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';

function Support() {
  // Dummy FAQ data
  const dummyFAQs = [
    {
      id: 1,
      question: 'How do I create an account?',
      answer: 'To create an account, click on the "Sign Up" button and follow the instructions.'
    },
    {
      id: 2,
      question: 'How do I reset my password?',
      answer: 'To reset your password, go to the login page and click on the "Forgot Password" link.'
    },
    {
      id: 3,
      question: 'Is there a mobile app available?',
      answer: 'Yes, we have a mobile app available for both iOS and Android devices. You can download it from the respective app stores.'
    }
  ];

  // Dummy feedback options
  const feedbackOptions = ['General Feedback', 'Bug Report', 'Feature Request', 'Other'];

  const [faqsVisible, setFaqsVisible] = useState(false);
  const [faqs, setFAQs] = useState([]);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [email, setEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const form = useRef();

  const handleExploreFAQs = () => {
    setFaqsVisible(true);
    setFAQs(dummyFAQs);
  };

  const handleEmailJS = (e, templateId) => {
    e.preventDefault();
    console.log(form.current);
    emailjs
    .sendForm(
      import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
      templateId,
      form.current,
      import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY
    )
      .then((result) => {
        setEmail('');
        setFeedbackMessage('');
        setContactMessage('');
        setFeedbackVisible(false);
        setSuccessMessage('Message sent successfully!');
      })
      .catch((error) => {
        setError('Failed to send message');
      });
    e.target.reset();
  };

  const handleShowFeedbackForm = (feedback) => {
    setFeedbackVisible(true);
    setSelectedFeedback(feedback);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Support</h1>
      {error && <p className="text-red-600">{error}</p>}
      {successMessage && <p className="text-green-600">{successMessage}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* FAQs Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">FAQs</h2>
          <p className="text-gray-400">Find answers to commonly asked questions.</p>
          <button onClick={handleExploreFAQs} className="bg-blue-500 text-white px-4 py-2 mt-4 rounded-md hover:bg-blue-600">Explore FAQs</button>
          {faqsVisible && (
            <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                {faqs.map(faq => (
                    <div key={faq.id} className="mb-4">
                        <h3 className="text-lg font-semibold">{faq.question}</h3>
                        <p className="text-gray-400">{faq.answer}</p>
                    </div>
                ))}
            </div>
          )}
        </div>
        {/* Contact Us Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
            <p className="text-gray-400">Send us a message and we'll get back to you.</p>
            <form ref={form} onSubmit={(e) => handleEmailJS(e, import.meta.env.VITE_APP_EMAILJS_CONTACT_TEMPLATE_ID)}>
              <input
                type="email"
                name="user_email"
                placeholder="Enter your email"
                className="w-full p-2 mb-4 rounded-md bg-gray-700 text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <textarea
                name="message"
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                placeholder="Enter your message"
                className="w-full p-2 mb-4 rounded-md bg-gray-700 text-white"
              />
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Submit</button>
            </form>
        </div>
        {/* Feedback Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Feedback</h2>
          <p className="text-gray-400">Help us improve by providing feedback.</p>
          <div className="mt-4">
            {feedbackOptions.map(option => (
              <button
                key={option}
                onClick={() => handleShowFeedbackForm(option)}
                className="bg-yellow-500 text-white px-4 py-2 rounded-md mr-2 mb-2 hover:bg-yellow-600"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Feedback Form */}
      {feedbackVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-md max-w-lg">
            <button onClick={() => setFeedbackVisible(false)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-xl font-semibold mb-4">Feedback: {selectedFeedback}</h2>
            <form ref={form} onSubmit={(e) => handleEmailJS(e, import.meta.env.VITE_APP_EMAILJS_FEEDBACK_TEMPLATE_ID)}>
              <input
                type="email"
                name="user_email"
                placeholder="Enter your email"
                className="w-full p-2 mb-4 rounded-md bg-gray-700 text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <textarea
                name="message"
                value={feedbackMessage}
                onChange={(e) => setFeedbackMessage(e.target.value)}
                placeholder="Enter your feedback"
                className="w-full p-2 mb-4 rounded-md bg-gray-700 text-white"
              />
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Submit</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Support;
