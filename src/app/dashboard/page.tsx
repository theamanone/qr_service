'use client'
import Header from '@/components/Header'
import Confirm from '@/components/Confirm'
import { deleteQr, fetchDashboard, fetchUserQrCodes } from '@/utils/apiHandlers'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState, useRef } from 'react'
import QRCodeStyling from 'qr-code-styling'
import useOutsideClick from '@/utils/documentOutSideClick'
import ScanModal from '@/components/common/ScanModal'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

import { Pagination } from '@nextui-org/react'
import RecentActivity from '@/components/RecentActivity'
import { useAppContext } from '@/context/useContext'
import QRCodeCard from '@/components/QRCodeCard'
import LargeQRCodeModal from '@/components/LargeQRCodeModal'

const Dashboard: React.FC = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showConfirm, setShowConfirm] = useState(false)
  const [selectedQr, setSelectedQr] = useState<any>(null)
  const [selectedQRCode, setSelectedQRCode] = useState<any>(null)
  const [selectedScan, setSelectedScan] = useState<any | null>(null)

  const [largeQRCode, setLargeQRCode] = useState<any>(null)
  const [qrCodes, setQrCodes] = useState<any[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const [qrIdForDelete, setQrIdForDelete] = useState("")
  const [currentPage, setCurrentPage] = useState(1) // Manage current page state
  const itemsPerPage = 6 // Set the number of items per page

  // Calculate the index range for the current page
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage

  const paginatedQRs = dashboardData?.qrCodes?.slice(startIndex, endIndex) || [] // Get the QR codes for the current page

  // const totalPages = Math.ceil((dashboardData?.qrCodes?.length || 0) / itemsPerPage); // Total number of pages

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page) // Update current page state
    fetchQrCodes(page) // Fetch QR codes for the selected page
  }

  const didFetchRef = useRef(false)
  const LarageQrRef = useRef(null)
  const qrCodeRefs = useRef<Array<HTMLDivElement | null>>([])
  const largeQRRef = useRef<HTMLDivElement | null>(null)
  const closeModalRef = useRef(null)
  const closeOptions = useRef(null)

  const { setDemoHistory } = useAppContext()

  useOutsideClick(LarageQrRef, () => setLargeQRCode(null))
  useOutsideClick(closeModalRef, () => setSelectedScan(null))
  useOutsideClick(closeOptions, () => setSelectedQRCode(null))

  const handleOpenScanModal = (scanData: any) => {
    setSelectedScan(scanData) // Set selected scan details when IP is clicked
  }

  const handleCloseScanModal = () => {
    setSelectedScan(null) // Close modal by resetting selectedScan state
  }

  const handleViewLargeQR = (qrCode: any, index: number) => {
    const qrCodeInstance = new QRCodeStyling({
      ...qrCode?.qrOptions,
      width: 300,
      height: 300
    })

    setLargeQRCode({ qrCode, qrCodeInstance })
  }

  // Fetch QR codes with pagination
  const fetchQrCodes = async (page: number) => {
    try {
      setLoading(true)
      const response: any = await fetchUserQrCodes(page, 6) // Fetch 10 QR codes per page
      if (response?.success) {
        setQrCodes(response?.data?.qrCodes);
        // console.log("response data qr", response?.data?.qrCodes)
        setTotalPages(response?.data?.pagination?.totalPages);
        setHasMore(page < response?.data?.pagination?.totalPages);

        
      }
    } catch (error: any) {
      console.error('Error fetching QR codes:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQrCodes(1) // Fetch the first page of QR codes on load
  }, [])

  // Function to close large QR code view
  const closeLargeQR = () => setLargeQRCode(null)

  useEffect(() => {
    // Render the QR code in large view
    if (largeQRCode?.qrCodeInstance && largeQRRef.current) {
      largeQRCode.qrCodeInstance.append(largeQRRef.current)
    }
    return () => {
      if (largeQRRef.current) {
        largeQRRef.current.innerHTML = '' // Clear the large QR view
      }
    }
  }, [largeQRCode])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetchDashboard()
        setDashboardData(response?.dashboardData)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (didFetchRef.current) return
    didFetchRef.current = true
    fetchDashboardData()
  }, [])

  useEffect(() => {
    if (qrCodes?.length > 0) {
      qrCodes.forEach((qrCode: any, index: number) => {
        const qrCodeInstance = new QRCodeStyling({
          ...qrCode?.qrOptions,
          width: 130,
          height: 130
        })

        if (qrCodeRefs.current[index]) {
          qrCodeInstance.append(qrCodeRefs.current[index])
        }
        return () => {
          if (qrCodeRefs.current[index]) {
            qrCodeRefs.current[index]!.innerHTML = '' // Clear the QR code DOM element
          }
        }
      })
    }
    return () => {
      qrCodeRefs.current.forEach(ref => {
        if (ref) {
          ref.innerHTML = '' // Clear the QR code from the DOM
        }
      })
    }
  }, [qrCodes])

 
  
  const handleDelete = async () => {
   
    try {
      // console.log('Before deletion:', qrIdForDelete)

      // Call the deleteQr function and pass the QR code ID
      const response = await deleteQr(qrIdForDelete)
      // console.log('response delete : ', response)

      if (response?.success) {
        // Update state to remove the QR code from the list
        setDashboardData((prevData: any) => {
          const updatedQrCodes = prevData.qrCodes.filter(
            (item: any) => item._id !== qrIdForDelete
          )
          return { ...prevData, qrCodes: updatedQrCodes }
        })

        setDemoHistory((prevHistory: any[]) => [
          ...prevHistory, // Retain existing history
          {
            id: response?.historyId || `demo-${Date.now()}`, // Unique ID for the demo history activity
            description: `Deleted QR Code: ${selectedQr?.title || 'Untitled'}`, // Description of the activity
            createdAt: new Date().toISOString() // Current time as createdAt
          }
        ])
        setShowConfirm(false)
        // Close dropdown or reset selected QR code
        setSelectedQRCode(null)
      } else {
        console.error('Failed to delete QR code:', response?.message)
      }
    } catch (error) {
      console.error('Error deleting QR code:', error)
    }
  }

  const handleShare = (qrCode: any) => {
    const shareUrl = qrCode?.targetUrl
    if (navigator.share) {
      navigator
        .share({
          title: 'QR Code',
          url: shareUrl
        })
        .then(() => console.log('Shared successfully'))
        .catch(error => console.error('Error sharing:', error))
    } else {
      // Fallback logic for unsupported browsers
      navigator?.clipboard?.writeText(shareUrl.toString())
      alert('URL copied to clipboard!')
    }
    setSelectedQRCode(null) // Close dropdown
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <main className="p-4 lg:p-8">
          <section className="bg-white shadow-md rounded-lg p-6 mb-6">
            <Skeleton height={24} width={200} />
            <Skeleton height={16} width={250} className="mt-2" />
          </section>
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="p-4 bg-white rounded-lg shadow-md"
              >
                <Skeleton height={130} className="mb-4" />
                <Skeleton height={20} width={100} />
                <Skeleton height={16} width="80%" className="mt-2" />
              </div>
            ))}
          </section>
        </main>
      </div>
    )
  }


  return (
  <div className="min-h-screen !h-full relative  !max-w-full flex flex-col">
      <Header />
      <main className='p-4 lg:p-8'>
        <section className='bg-white shadow-md rounded-lg p-6 mb-6'>
          <h2 className='text-xl font-semibold text-gray-800'>{`Welcome back, ${session?.user?.name || session?.user?.email?.split('@')[0].replace(/\d+/g, '') || 'User'}`}</h2>
          <p className='text-gray-600 mt-2'> Here's an overview of your QR Generator app. </p>
        </section>

        <section className='flex flex-col items-center justify-center w-full py-8'>
          <section className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-full px-0'>
            {qrCodes.map((qrCode: any, index: number) => (
              <QRCodeCard
                key={qrCode._id}
                qrCode={qrCode}
                setQrIdForDelete={setQrIdForDelete}
                qrPreview={(el: any) => (qrCodeRefs.current[index] = el)}
                index={index}
                handleViewLargeQR={handleViewLargeQR}
                handleOpenScanModal={handleOpenScanModal}
                handleShare={handleShare}
                setSelectedQRCode={setSelectedQRCode}
                selectedQRCode={selectedQRCode}
                closeOptions={closeOptions}
                setShowConfirm={setShowConfirm}
              />
            ))}
          </section>

          {/* Pagination */}
          {totalPages > 1 && (
            <section className='flex justify-center mt-8'>
              <Pagination total={totalPages}  initialPage={currentPage}  onChange={handlePageChange}  />
            </section>
          )} 
        </section>
        <ScanModal scanData={selectedScan} isOpen={!!selectedScan} closeModal={handleCloseScanModal} closeModalRef={closeModalRef} />
        <LargeQRCodeModal isVisible={!!largeQRCode} closeModal={closeLargeQR} qrRef={largeQRRef} modalRef={LarageQrRef} />
        <RecentActivity />
      </main>

      {/* Confirmation Dialog */}
      <Confirm
        isOpen={showConfirm}
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
        message={`Are you sure you want to delete the QR Code "${
          selectedQr?.title || 'Untitled'
        }"?`} />
    </div>
  )
}

export default Dashboard
