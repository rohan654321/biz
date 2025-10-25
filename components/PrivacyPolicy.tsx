'use client';

import { useState } from 'react';

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const sections = [
    {
      id: 'preliminary',
      title: 'Preliminary',
      content: `BizTradeFairs.com Online Private Limited ("BizTradeFairs.com," the "Company," "we," "us," and "our") respects your privacy and is committed to protecting it through compliance with this privacy policy.`
    },
    {
      id: 'information-collection',
      title: 'I. The Information We Collect and How We Use It',
      content: `We collect several types of information from and about users of our Services, including:
• Information by which you may be personally identified
• Information about your internet connection, equipment, and usage details

We collect this information directly from you and automatically as you navigate through our Services.`
    },
    {
      id: 'information-use',
      title: 'II. How We Use the Information',
      content: `We use the information to:
• Respond to queries
• Improve content and features
• Administer Services and diagnose technical issues
• Send communications (with consent)
• Display relevant advertisements
• Conduct research and analytics`
    },
    {
      id: 'legal-basis',
      title: 'III. Legal Basis for Processing',
      content: `We rely on:
• Consent: Withdrawable at any time
• Performance of a Contract: Necessary for contractual obligations
• Legitimate Interests: To provide and improve our Services`
    },
    {
      id: 'sharing',
      title: 'IV. Sharing Information',
      content: `We may share information:
• With subsidiaries, affiliates, service providers
• In connection with mergers or acquisitions
• With third parties for marketing (with consent)
• For legal compliance and enforcement`
    },
    {
      id: 'choices',
      title: 'V. Choices About Use and Disclosure',
      content: `You can manage cookies and Flash cookies and set browser/device preferences. Disabling cookies may limit functionality.`
    },
    {
      id: 'communications',
      title: 'VI. Communications Choices',
      content: `You can manage email preferences and unsubscribe from promotional messages. Some service and legal notices cannot be opted out of.`
    },
    {
      id: 'user-rights',
      title: 'VII. User Rights',
      content: `• Review and update your account information via settings
• Request correction, deletion, or access to your personal data
• Deleting content may not remove it from cached or archived pages`
    },
    {
      id: 'security',
      title: 'IX. Security',
      content: `We follow industry-standard safeguards but cannot guarantee 100% security. Keep your username and password secure.`
    },
    {
      id: 'children',
      title: 'X. Children Under 16',
      content: `We do not knowingly collect data from children under 16. Accounts identified as belonging to children will be deleted.`
    },
    {
      id: 'data-transfers',
      title: 'XII. Data Transfers',
      content: `Information may be processed and stored in India, USA, or other global servers. By using our Services, you consent to such transfers.`
    },
    {
      id: 'contact',
      title: 'XVI. Contact Us',
      content: `For queries or grievances:
Maxx Business Media Private Limited
T9, 3rd Floor, Swastik Manandi Arcade, 
Subedar Chatram Road, Seshadripuram, 
Bengaluru – 560020, India

Grievance Officer: Mr. Padmanabham
Email: nodalofficer@biztradefairs.com`
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            BizTradeFairs.com Privacy Policy
          </h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div>
              <span className="font-semibold">Last updated:</span> Nov 20, 2025
            </div>
            <div>
              <span className="font-semibold">Date of Revision:</span> Mar 25, 2020
            </div>
          </div>
          <p className="mt-4 text-gray-700">
            This document provides information regarding the privacy and data protection 
            practices of BizTradeFairs.com. Please read this policy in full before 
            continuing to use our website.
          </p>
        </div>

        {/* Important Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Important Information
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  By accessing or using our Services, you agree to this Privacy Policy. 
                  If you do not agree, you may choose not to use or discontinue using our Services.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Policy Sections */}
        <div className="space-y-4">
          {sections.map((section) => (
            <div key={section.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
              >
                <span className="text-lg font-semibold text-gray-900">
                  {section.title}
                </span>
                <svg
                  className={`h-5 w-5 text-gray-500 transform transition-transform duration-200 ${
                    activeSection === section.id ? 'rotate-180' : ''
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              
              {activeSection === section.id && (
                <div className="px-6 pb-4">
                  <div className="prose prose-sm max-w-none text-gray-700">
                    {section.content.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-2">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => window.open('mailto:help@biztradefairs.com')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Contact Support
            </button>
            <button
              onClick={() => window.open('mailto:nodalofficer@biztradefairs.com')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Contact Grievance Officer
            </button>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back to Top
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            This policy may change from time to time. Please check this policy periodically for updates.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;