"use client"

import React, { useState } from 'react';
import { Download, ChevronDown, ChevronUp, FileText, Package, Users, Calendar, MapPin, Clock, Info, AlertCircle, CheckCircle, LucideIcon } from 'lucide-react';

interface ExhibitorManualProps {
  eventsId: string;
}

interface SectionItem {
  label: string;
  value: string;
  status?: 'urgent' | 'warning' | 'info';
}

interface SectionContent {
  id: string;
  title: string;
  description?: string;
  items?: SectionItem[];
  list?: string[];
}

interface Section {
  title: string;
  icon: LucideIcon;
  content: SectionContent[];
}

interface Sections {
  overview: Section;
  booth: Section;
  logistics: Section;
  services: Section;
  marketing: Section;
  regulations: Section;
}

type SectionKey = keyof Sections;

interface Tab {
  id: SectionKey;
  label: string;
  icon: LucideIcon;
}

const ExhibitorManualProfessional: React.FC<ExhibitorManualProps> = ({ eventsId }) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<SectionKey>('overview');

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const sections: Sections = {
    overview: {
      title: 'Event Overview',
      icon: Info,
      content: [
        {
          id: 'event-details',
          title: 'Event Details',
          items: [
            { label: 'Event Name', value: 'Trade Show 2025' },
            { label: 'Date', value: 'March 15-17, 2025' },
            { label: 'Venue', value: 'Convention Center, Hall A' },
            { label: 'Setup Time', value: 'March 14, 8:00 AM - 6:00 PM' },
            { label: 'Show Hours', value: '9:00 AM - 5:00 PM Daily' },
            { label: 'Breakdown', value: 'March 17, 5:00 PM - 10:00 PM' }
          ]
        },
        {
          id: 'important-dates',
          title: 'Important Dates & Deadlines',
          items: [
            { label: 'Booth Payment Deadline', value: 'February 1, 2025', status: 'urgent' },
            { label: 'Service Order Deadline', value: 'February 15, 2025', status: 'warning' },
            { label: 'Marketing Materials Due', value: 'February 20, 2025', status: 'warning' },
            { label: 'Final Attendee List', value: 'March 1, 2025', status: 'info' }
          ]
        }
      ]
    },
    booth: {
      title: 'Booth Information',
      icon: Package,
      content: [
        {
          id: 'booth-specs',
          title: 'Booth Specifications',
          items: [
            { label: 'Booth Number', value: 'A-145' },
            { label: 'Booth Size', value: '10ft x 10ft (Standard)' },
            { label: 'Booth Type', value: 'Inline Booth' },
            { label: 'Power Supply', value: '110V, 15 AMP' },
            { label: 'Internet Access', value: 'WiFi Available (Order Required)' }
          ]
        },
        {
          id: 'booth-package',
          title: 'Standard Booth Package Includes',
          list: [
            '8ft high back drape and 3ft high side drape',
            'Company name sign (7" x 44")',
            'One 6ft draped table',
            'Two folding chairs',
            'One waste basket',
            'Standard carpet (gray)'
          ]
        },
        {
          id: 'booth-rules',
          title: 'Booth Design Rules',
          list: [
            'Maximum height: 8ft for inline booths, 12ft for island booths',
            'No signage or materials blocking neighboring booths',
            'Maintain clear aisle space (minimum 10ft)',
            'All structures must be approved by show management',
            'Comply with local fire and safety regulations'
          ]
        }
      ]
    },
    logistics: {
      title: 'Logistics & Shipping',
      icon: MapPin,
      content: [
        {
          id: 'shipping-info',
          title: 'Shipping Instructions',
          description: 'All shipments must be labeled with booth number and company name.',
          items: [
            { label: 'Advance Warehouse Address', value: 'Available in Service Kit' },
            { label: 'Direct Shipping Dates', value: 'March 13-14, 2025' },
            { label: 'Receiving Hours', value: '8:00 AM - 4:00 PM' },
            { label: 'Material Handling', value: 'Charges apply per CWT' }
          ]
        },
        {
          id: 'move-in',
          title: 'Move-In Procedures',
          list: [
            'Check in at exhibitor services desk',
            'Obtain loading dock pass',
            'Unload materials at designated area',
            'Remove empty crates immediately',
            'Complete setup by 6:00 PM on March 14'
          ]
        },
        {
          id: 'move-out',
          title: 'Move-Out Procedures',
          list: [
            'Breakdown begins at 5:00 PM on last show day',
            'All materials must be removed by 10:00 PM',
            'Schedule pickup with carrier in advance',
            'Return all rental items to service desk',
            'Complete move-out form before leaving'
          ]
        }
      ]
    },
    services: {
      title: 'Services & Orders',
      icon: FileText,
      content: [
        {
          id: 'available-services',
          title: 'Available Services',
          list: [
            'Electrical Service (110V, 220V, 440V)',
            'Internet & Telecommunications',
            'Furniture & Carpet Rental',
            'Audio/Visual Equipment',
            'Floral & Plants',
            'Lead Retrieval Systems',
            'Cleaning Services',
            'Security Services'
          ]
        },
        {
          id: 'ordering',
          title: 'How to Order Services',
          description: 'Access the online service portal using your exhibitor credentials.',
          items: [
            { label: 'Portal URL', value: 'services.tradeshow2025.com' },
            { label: 'Login', value: 'Use registration email' },
            { label: 'Advance Order Deadline', value: 'Feb 15 (Discounted rates)' },
            { label: 'On-Site Orders', value: 'Available at premium rates' }
          ]
        }
      ]
    },
    marketing: {
      title: 'Marketing & Promotion',
      icon: Users,
      content: [
        {
          id: 'pre-show',
          title: 'Pre-Show Marketing',
          list: [
            'Submit company profile for event website and app',
            'Provide high-resolution logo for marketing materials',
            'Schedule social media posts with event hashtag',
            'Send email invitations to clients and prospects',
            'Order promotional materials and giveaways'
          ]
        },
        {
          id: 'show-floor',
          title: 'Show Floor Marketing',
          list: [
            'Engage attendees with interactive displays',
            'Collect leads using event app or lead scanner',
            'Schedule product demonstrations',
            'Offer exclusive show specials',
            'Participate in show floor activities and contests'
          ]
        },
        {
          id: 'post-show',
          title: 'Post-Show Follow-Up',
          list: [
            'Download lead data within 48 hours',
            'Send thank you emails to booth visitors',
            'Share show highlights on social media',
            'Complete post-show survey',
            'Schedule follow-up calls and meetings'
          ]
        }
      ]
    },
    regulations: {
      title: 'Rules & Regulations',
      icon: AlertCircle,
      content: [
        {
          id: 'general-rules',
          title: 'General Show Rules',
          list: [
            'All exhibitors must wear official badges',
            'Setup and breakdown only during designated hours',
            'No soliciting outside assigned booth space',
            'Music and audio must not disturb neighboring booths',
            'Food and beverages served only with proper permits',
            'Smoking prohibited in all indoor areas',
            'Comply with ADA accessibility requirements'
          ]
        },
        {
          id: 'safety',
          title: 'Safety Requirements',
          list: [
            'All materials must be flame-retardant',
            'Keep aisles and exits clear at all times',
            'No open flames or candles',
            'Secure all hanging signs and displays',
            'Report any incidents to security immediately',
            'First aid stations located at main entrances'
          ]
        },
        {
          id: 'liability',
          title: 'Insurance & Liability',
          description: 'Exhibitors are responsible for their property and booth materials.',
          items: [
            { label: 'Required Coverage', value: '$1,000,000 General Liability' },
            { label: 'Certificate Due', value: 'Before setup begins' },
            { label: 'Additional Insured', value: 'Event organizer and venue' },
            { label: 'Property Insurance', value: 'Recommended for all materials' }
          ]
        }
      ]
    }
  };

  const tabs: Tab[] = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'booth', label: 'Booth Info', icon: Package },
    { id: 'logistics', label: 'Logistics', icon: MapPin },
    { id: 'services', label: 'Services', icon: FileText },
    { id: 'marketing', label: 'Marketing', icon: Users },
    { id: 'regulations', label: 'Rules', icon: AlertCircle }
  ];

  const currentSection = sections[activeTab];
  const Icon = currentSection.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Exhibitor Manual</h1>
              <p className="text-slate-600 mt-1">Event ID: {eventsId}</p>
            </div>
            <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md">
              <Download className="w-5 h-5" />
              Download PDF
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-slate-200 sticky top-[104px] z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map(tab => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600 bg-blue-50'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <TabIcon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          {/* Section Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
            <div className="flex items-center gap-3 text-white">
              <Icon className="w-8 h-8" />
              <h2 className="text-2xl font-bold">{currentSection.title}</h2>
            </div>
          </div>

          {/* Section Content */}
          <div className="p-8">
            {currentSection.content.map((section, idx) => (
              <div key={section.id} className={idx > 0 ? 'mt-8' : ''}>
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between p-5 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                      {idx + 1}
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900">{section.title}</h3>
                  </div>
                  {expandedSections[section.id] ? (
                    <ChevronUp className="w-5 h-5 text-slate-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-600" />
                  )}
                </button>

                {expandedSections[section.id] && (
                  <div className="mt-4 p-6 bg-white border border-slate-200 rounded-lg">
                    {section.description && (
                      <p className="text-slate-700 mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        {section.description}
                      </p>
                    )}

                    {section.items && (
                      <div className="space-y-3">
                        {section.items.map((item, i) => (
                          <div key={i} className="flex items-start justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                            <div className="flex items-start gap-3">
                              {item.status === 'urgent' && <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />}
                              {item.status === 'warning' && <Clock className="w-5 h-5 text-amber-500 mt-0.5" />}
                              {item.status === 'info' && <Info className="w-5 h-5 text-blue-500 mt-0.5" />}
                              {!item.status && <CheckCircle className="w-5 h-5 text-slate-400 mt-0.5" />}
                              <div>
                                <span className="font-medium text-slate-900">{item.label}</span>
                              </div>
                            </div>
                            <span className={`text-right font-semibold ${
                              item.status === 'urgent' ? 'text-red-600' :
                              item.status === 'warning' ? 'text-amber-600' :
                              item.status === 'info' ? 'text-blue-600' :
                              'text-slate-700'
                            }`}>
                              {item.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {section.list && (
                      <ul className="space-y-3">
                        {section.list.map((item, i) => (
                          <li key={i} className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">
                              {i + 1}
                            </div>
                            <span className="text-slate-700 flex-1">{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl shadow-lg p-8 text-white">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Info className="w-5 h-5" />
                Questions?
              </h4>
              <p className="text-slate-300">Contact Exhibitor Services</p>
              <p className="text-slate-300">exhibitors@tradeshow.com</p>
              <p className="text-slate-300">+1 (555) 123-4567</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Office Hours
              </h4>
              <p className="text-slate-300">Mon-Fri: 8:00 AM - 6:00 PM</p>
              <p className="text-slate-300">Sat-Sun: 9:00 AM - 3:00 PM</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                On-Site Services
              </h4>
              <p className="text-slate-300">Booth #100 - Main Entrance</p>
              <p className="text-slate-300">Available during show hours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExhibitorManualProfessional;