
import { motion } from 'framer-motion'
import { FaTimes } from 'react-icons/fa'

interface ScanModalProps {
  scanData: any[] // This is now an array of scan objects
  isOpen: boolean
  closeModal: () => void
  closeModalRef?: any
}

const formatUserAgent = (userAgent: string) => {
  if (!userAgent) return 'Unknown Device'

  // Example of more user-friendly user agent formatting
  const isMobile = /Mobile|Android|iPhone|iPad/i.test(userAgent)
  const browser =
    /Chrome|Safari|Firefox|Edge/i.exec(userAgent)?.[0] || 'Unknown Browser'

  return isMobile ? `${browser} on Mobile` : `${browser} on Desktop`
}

const formatReferer = (referer: string) => {
  if (!referer) return 'No Referer'

  // Just return the base URL of the referer
  try {
    const refererUrl = new URL(referer)
    return refererUrl.hostname || 'Unknown Source'
  } catch {
    return 'Invalid Referer'
  }
}

const ScanModal: React.FC<ScanModalProps> = ({
  scanData,
  isOpen,
  closeModal,
  closeModalRef
}) => {
  if (!scanData || !scanData.length || !isOpen) return null



  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'
    >
      <div ref={closeModalRef}>
        <motion.div
          className='bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full mx-3 text-black overflow-y-auto'
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ duration: 0.3 }}
        >
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-xl font-semibold text-gray-800'>
              Scan Details
            </h2>
            <button
              onClick={closeModal}
              className='text-gray-500 hover:text-gray-800'
            >
              <FaTimes />
            </button>
          </div>

          <div className='space-y-4 max-h-80 overflow-y-auto'>
            {scanData.map((scan, index) => (
              <div key={scan._id} className='border-b pb-4'>
                <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                  Scan {index + 1}
                </h3>

                <div className='space-y-2 text-xs sm:text-sm'>
                  <div className='flex justify-between'>
                    <p className='font-medium text-gray-600'>IP Address:</p>
                    <p className='text-gray-800'>{scan?.ip}</p>
                  </div>

                  <div className='flex justify-between'>
                    <p className='font-medium text-gray-600'>
                      Device Information:
                    </p>
                    <p className='text-gray-800'>
                      {formatUserAgent(scan?.userAgent)}
                    </p>
                  </div>

                  <div className='flex justify-between'>
                    <p className='font-medium text-gray-600'>Referer:</p>
                    <p className='text-gray-800'>
                      {formatReferer(scan?.referer)}
                    </p>
                  </div>

                  <div className='flex justify-between'>
                    <p className='font-medium text-gray-600'>Timestamp:</p>
                    <p className='text-gray-800'>
                      {new Date(scan?.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        </div>
    </motion.div>
  )
}

export default ScanModal
