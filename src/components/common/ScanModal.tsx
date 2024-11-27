import { motion } from 'framer-motion';
import { FaTimes, FaGlobe, FaDesktop, FaClock } from 'react-icons/fa';

import { format } from 'date-fns';

interface DeviceInfo {
  type: string;
  browser: string;
  os: string;
}

interface ScanData {
  _id: string;
  ip: string;
  userAgent: string;
  referer: string;
  timestamp: string;
}

interface ScanModalProps {
  scanData: ScanData[]
  isOpen: boolean
  closeModal: () => void
  closeModalRef?: React.RefObject<HTMLDivElement>
}

const formatUserAgent = (userAgent: string): DeviceInfo => {
  if (!userAgent) {
    return {
      type: 'Unknown',
      browser: 'Unknown',
      os: 'Unknown'
    };
  }

  const isMobile = /Mobile|Android|iPhone|iPad/i.test(userAgent);
  const browser = /Chrome|Safari|Firefox|Edge/i.exec(userAgent)?.[0] || 'Unknown';
  const os = /Windows|Mac|Linux|iOS|Android/i.exec(userAgent)?.[0] || 'Unknown';

  return {
    type: isMobile ? 'Mobile' : 'Desktop',
    browser,
    os
  };
};

const formatReferer = (referer: string): string => {
  if (!referer) return 'Direct Access';
  try {
    const refererUrl = new URL(referer);
    return refererUrl.hostname || 'Unknown Source';
  } catch {
    return 'Invalid Source';
  }
};

const ScanModal: React.FC<ScanModalProps> = ({
  scanData,
  isOpen,
  closeModal,
  closeModalRef
}) => {
  if (!scanData || !scanData.length || !isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeModal();
      }}
    >
      <div ref={closeModalRef} className="w-full max-w-4xl">
        <motion.div
          className="bg-white rounded-2xl shadow-2xl w-full"
          initial={{ scale: 0.95, y: 10 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-100 bg-gray-50/80 rounded-t-2xl backdrop-blur-sm">
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                Scan Activity
              </h2>
              <p className="text-xs text-gray-500">
                {scanData.length} scan{scanData.length !== 1 ? 's' : ''} recorded
              </p>
            </div>
            <button
              onClick={closeModal}
              className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
              aria-label="Close modal"
            >
              <FaTimes className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Scan List */}
          <div className="max-h-[70vh] overflow-y-auto">
            <div className="divide-y divide-gray-100">
              {scanData.map((scan, index) => {
                const deviceInfo = formatUserAgent(scan.userAgent);
                return (
                  <div
                    key={scan._id}
                    className="px-5 py-4 sm:px-6 sm:py-5 hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-500">
                        Scan #{index + 1}
                      </span>
                      <span className="text-xs text-gray-500">
                        {scan.timestamp ? format(new Date(scan.timestamp), 'PP p') : 'Unknown time'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-sm">
                      <div className="space-y-2">
                        {/* Device Info */}
                        <div className="flex items-center space-x-2">
                          <FaDesktop className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                          <span className="text-gray-600 truncate">
                            {deviceInfo.type} • {deviceInfo.browser}
                          </span>
                        </div>

                        {/* IP */}
                        <div className="flex items-center space-x-2">
                          ip : 
                          <span className="text-gray-600 truncate text-sm">{scan.ip}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {/* Source */}
                        <div className="flex items-center space-x-2">
                          <FaGlobe className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                          <span className="text-gray-600 truncate">
                            {formatReferer(scan.referer)}
                          </span>
                        </div>

                        {/* Time */}
                        <div className="flex items-center space-x-2">
                          <FaClock className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                          <span className="text-gray-600 truncate">
                            {scan.timestamp 
                              ? format(new Date(scan.timestamp), 'h:mm a')
                              : 'Unknown'
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 sm:px-6 sm:py-4 border-t border-gray-100 bg-gray-50/80 rounded-b-2xl backdrop-blur-sm">
            <p className="text-xs text-gray-500 text-center">
              End of scan activity log
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ScanModal;
