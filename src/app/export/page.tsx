"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';

const ExportDataPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exportFormat, setExportFormat] = useState<'excel' | 'json' | 'pdf'>('excel');

  const handleExportClick = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/auth/user/data/export?format=${exportFormat}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Use stored token
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `UserData.${exportFormat === 'excel' ? 'xlsx' : exportFormat === 'pdf' ? 'pdf' : 'json'}`;
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        setError('Failed to export data');
      }
    } catch (err) {
      setError('An error occurred while exporting data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gray-100 py-8 px-4 text-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="max-w-lg w-full bg-white p-6 rounded-lg shadow-lg"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold text-center mb-6">Export User Data</h1>

        <div className="flex items-center justify-center mb-4">
          <label htmlFor="exportFormat" className="mr-4">Select Export Format:</label>
          <select
            id="exportFormat"
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value as 'excel' | 'json' | 'pdf')}
            className="border border-gray-300 p-2 rounded-md"
          >
            <option value="excel">Excel (.xlsx)</option>
            <option value="json">JSON (.json)</option>
            <option value="pdf">PDF (.pdf)</option>
          </select>
        </div>

        <div className="text-center">
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            onClick={handleExportClick}
            disabled={loading}
            className={`${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'
            } text-white font-semibold py-2 px-4 rounded-md w-full`}
          >
            {loading ? 'Exporting...' : 'Download Data'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ExportDataPage;
