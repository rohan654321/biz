'use client';

import { useState } from 'react';

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert('Please select an Excel file');
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/admin/import-excel', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setMessage(data.message || 'Upload completed');
    setLoading(false);
  };

  const handleDownloadTemplate = () => {
    // Create a CSV or Excel-compatible template dynamically
    const headers = [
      'eventTitle',
      'eventDescription',
      'startDate',
      'endDate',
      'category',
      'tags',
      'organizerName',
      'organizerEmail',
      'speakerName',
      'speakerEmail',
      'exhibitorName',
      'exhibitorEmail',
      'venueName',
      'venueEmail',
      'venueCity',
      'venueCountry',
    ];

    const sampleRow = [
      'Tech Expo 2025',
      'Annual innovation conference',
      '2025-05-01',
      '2025-05-03',
      'Technology',
      'AI,Innovation',
      'John Doe',
      'john@expo.com',
      'Sarah Lee',
      'sarah@speaker.io',
      'InnoCorp',
      'info@innocorp.com',
      'Expo Center',
      'contact@expocenter.com',
      'San Francisco',
      'USA',
    ];

    const csvContent = [headers.join(','), sampleRow.join(',')].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'event_import_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col items-center p-10 space-y-4">
      <h2 className="text-2xl font-bold mb-4">📊 Import Event Data (Excel)</h2>

      {/* Download Template Button */}
      <button
        onClick={handleDownloadTemplate}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        📥 Download Template
      </button>

      {/* Upload Section */}
      <input
        type="file"
        accept=".xlsx, .xls, .csv"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="border p-2 w-80"
      />

      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className={`px-4 py-2 rounded text-white ${
          loading ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? 'Uploading...' : 'Upload Excel'}
      </button>

      {message && (
        <p
          className={`mt-4 ${
            message.includes('✅') ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
