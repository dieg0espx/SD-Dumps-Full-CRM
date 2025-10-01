"use client"

import { X, User, Calendar, Package, MapPin, DollarSign, FileText, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"
import Image from "next/image"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

interface Booking {
  id: string
  start_date: string
  end_date: string
  service_type: string
  total_amount: number
  status: string
  payment_status: string
  signature_img_url: string
  created_at: string
  delivery_address?: string
  customer_address: string
  notes?: string
  profiles: {
    id: string
    full_name: string
    email: string
    phone: string
  }
  container_types: {
    id: string
    name: string
    size: string
  }
}

interface ContractDetailsSidebarProps {
  contract: Booking | null
  isOpen: boolean
  onClose: () => void
}

export function ContractDetailsSidebar({ contract, isOpen, onClose }: ContractDetailsSidebarProps) {
  if (!contract) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleDownloadContract = async () => {
    try {
      // Get the contract content element
      const contractElement = document.getElementById('contract-content')
      if (!contractElement) {
        console.error('Contract content element not found')
        return
      }

      // Create a new jsPDF instance
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()

      // Convert the contract content to canvas
      const canvas = await html2canvas(contractElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        ignoreElements: (element) => {
          // Skip elements that might cause color parsing issues
          return element.classList?.contains('no-print') || false
        },
        onclone: (clonedDoc) => {
          // Force all colors to standard hex values to avoid oklch parsing errors
          const style = clonedDoc.createElement('style')
          style.textContent = `
            /* Force all elements to use standard hex colors */
            *, *::before, *::after {
              color: #000000 !important;
              background-color: #ffffff !important;
              border-color: #000000 !important;
            }
            
            /* Override specific color classes with standard hex equivalents */
            .text-white {
              color: #ffffff !important;
            }
            .text-black {
              color: #000000 !important;
            }
            .text-gray-900 {
              color: #000000 !important;
            }
            .text-gray-600 {
              color: #666666 !important;
            }
            .text-green-800 {
              color: #155724 !important;
            }
            .text-yellow-800 {
              color: #856404 !important;
            }
            .text-red-800 {
              color: #721c24 !important;
            }
            
            .bg-black {
              background-color: #000000 !important;
            }
            .bg-white {
              background-color: #ffffff !important;
            }
            .bg-gray-100 {
              background-color: #f3f4f6 !important;
            }
            .bg-green-100 {
              background-color: #dcfce7 !important;
            }
            .bg-yellow-100 {
              background-color: #fef3c7 !important;
            }
            .bg-red-100 {
              background-color: #fee2e2 !important;
            }
            
            .border-black {
              border-color: #000000 !important;
            }
            .border-gray-200 {
              border-color: #e5e7eb !important;
            }
            .border-gray-300 {
              border-color: #d1d5db !important;
            }
          `
          clonedDoc.head.appendChild(style)
          
          // Remove any inline styles that might contain oklch
          const allElements = clonedDoc.querySelectorAll('*')
          allElements.forEach(element => {
            const htmlElement = element as HTMLElement
            if (htmlElement.style) {
              // Remove any style properties that might contain oklch
              const styleProps = ['color', 'background-color', 'border-color', 'box-shadow']
              styleProps.forEach(prop => {
                const styleValue = htmlElement.style.getPropertyValue(prop)
                if (styleValue && styleValue.includes('oklch')) {
                  htmlElement.style.setProperty(prop, '')
                }
              })
            }
          })
        }
      })

      const imgData = canvas.toDataURL('image/png')
      const imgWidth = pageWidth - 20 // 10mm margin on each side
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      let heightLeft = imgHeight
      let position = 10

      // Add the image to PDF
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight)
      heightLeft -= pageHeight - 20

      // Add new pages if content is longer than one page
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight + 10
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight)
        heightLeft -= pageHeight - 20
      }

      // Save the PDF
      const fileName = `contract-${contract.id.slice(-8)}-${format(new Date(), 'yyyy-MM-dd')}.pdf`
      pdf.save(fileName)
    } catch (error) {
      console.error('Error generating PDF:', error)
    }
  }


  return (
    <>
      {/* Sidebar */}
      <div className={`w-1/2 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="max-h-[calc(100vh-150px)] flex flex-col bg-white shadow-2xl border-l border-gray-200">
          {/* Document Header */}
          <div className="bg-white border-b border-gray-300 px-8 py-6 flex-shrink-0">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">SERVICE AGREEMENT</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>Contract #{contract.id.slice(-8)}</span>
                <span>•</span>
                <span>{format(new Date(contract.created_at), "MMM dd, yyyy")}</span>
              </div>
            </div>
          </div>

          {/* Document Content - Scrollable */}
          <div className="flex-1 overflow-y-auto bg-white">
            <div id="contract-content" className="px-8 py-6 space-y-8">
              {/* Contract Parties */}
              <div className="border-b border-black pb-6">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-sm font-bold text-black mb-3 uppercase tracking-wide">CUSTOMER</h3>
                    <div className="space-y-1 text-sm">
                      <p><strong>Name:</strong> {contract.profiles.full_name}</p>
                      <p><strong>Email:</strong> {contract.profiles.email}</p>
                      <p><strong>Phone:</strong> {contract.profiles.phone}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-black mb-3 uppercase tracking-wide">SERVICE PROVIDER</h3>
                    <div className="space-y-1 text-sm">
                      <p><strong>Company:</strong> San Diego Dumping Solutions</p>
                      <p><strong>Container:</strong> {contract.container_types.name} ({contract.container_types.size})</p>
                      <p><strong>Service Type:</strong> {contract.service_type}</p>
                      <p><strong>Period:</strong> {format(new Date(contract.start_date), "MMM dd, yyyy")} - {format(new Date(contract.end_date), "MMM dd, yyyy")}</p>
                      <p><strong>Location:</strong> {contract.service_type === "delivery" ? contract.delivery_address : "Pickup"}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-black">
                  <div className="flex justify-between items-center">
                    <div className="text-sm">
                      <p><strong>Contract Status:</strong> {contract.status.toUpperCase()}</p>
                      <p><strong>Payment Status:</strong> {contract.payment_status.toUpperCase()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm"><strong>Total Amount</strong></p>
                      <p className="text-xl font-bold">${contract.total_amount.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contract Terms */}
              <div>
                <h2 className="text-lg font-bold text-black mb-4 text-center border-b border-black pb-2">TERMS AND CONDITIONS</h2>
                
                <div className="space-y-4 text-sm leading-relaxed">
                  {/* Customer Notes */}
                  <div className="border border-black p-4">
                    <h4 className="font-bold text-black mb-2 text-sm uppercase tracking-wide">CUSTOMER NOTES</h4>
                    <div className="space-y-1">
                      <p>Includes 2 Tons - Overage @ $125/Ton</p>
                      <p>PO#: {contract.notes || 'Not provided'}</p>
                      <p className="font-bold mt-2">THANK YOU FOR YOUR BUSINESS!</p>
                    </div>
                  </div>

                  {/* Terms of Lease */}
                  <div>
                    <h4 className="font-bold text-black mb-2 text-sm uppercase tracking-wide">1. TERMS OF LEASE</h4>
                    <p className="leading-relaxed pl-4">
                      San Diego Dumping Solutions will provide dumpster disposal service using our roll-off containers. 
                      Service will be provided on the day requested when using our online ordering software. 
                      Additional days on your rental period will be $25 Per Day, starting on the 4th day until the roll-off is picked up.
                    </p>
                  </div>

                  {/* Additional Charges */}
                  <div>
                    <h4 className="font-bold text-black mb-2 text-sm uppercase tracking-wide">2. ADDITIONAL CHARGES</h4>
                    <div className="pl-4 space-y-1">
                      <p>• All customers are responsible for the total weight of the contents of their dumpster(s)</p>
                      <p>• All customers are responsible for scheduling the removal of their dumpster(s)</p>
                      <p>• All customers are responsible for ensuring their dumpster(s) are not overloaded</p>
                      <p>• Customers shall inspect the dumpster upon delivery for any existing damage</p>
                      <p>• Upon removal of the dumpster, San Diego Dumping Solutions shall be entitled to charge the customer for the repair or replacement costs attributable to any damage to the dumpster while in the customer's possession</p>
                      <p>• The customer shall be liable for any repair or replacement costs</p>
                      <p>• Upon removal, the customer authorizes San Diego Dumping Solutions to collect any additional disposal and repair or replacement costs attributable to the customer</p>
                    </div>
                  </div>

                  {/* Weight Allowances */}
                  <div>
                    <h4 className="font-bold text-black mb-2 text-sm uppercase tracking-wide">3. WEIGHT ALLOWANCES</h4>
                    <p className="mb-3 pl-4">Exceeding stated weight allowance will result in an additional charge of $125 per ton</p>
                    <div className="pl-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="border border-black p-3">
                        <p className="font-semibold mb-1">17 yard</p>
                        <p className="text-sm">4,000 lbs included ($125 per additional 2,000 pounds)</p>
                        <p className="text-xs mt-1">Max: 12,000 lbs</p>
                      </div>
                      <div className="border border-black p-3">
                        <p className="font-semibold mb-1">21 yard</p>
                        <p className="text-sm">4,000 lbs included ($125 per additional 2,000 pounds)</p>
                        <p className="text-xs mt-1">Max: 12,000 lbs</p>
                      </div>
                    </div>
                    <p className="mt-3 pl-4">
                      Any weight above the max tonnage allowed will result in refusal of service and off-loading shall be required. 
                      A dry run charge can range from $150 to up $200 per occurrence.
                    </p>
                  </div>

                  {/* Additional Fees */}
                  <div>
                    <h4 className="font-bold text-black mb-2 text-sm uppercase tracking-wide">4. ADDITIONAL FEES</h4>
                    <div className="pl-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="border border-black p-3">
                        <p className="font-medium">Mattresses and box springs</p>
                        <p className="text-sm">$25 each</p>
                      </div>
                      <div className="border border-black p-3">
                        <p className="font-medium">Appliances</p>
                        <p className="text-sm">$25 each</p>
                      </div>
                      <div className="border border-black p-3">
                        <p className="font-medium">Electronics</p>
                        <p className="text-sm">$25 each</p>
                      </div>
                      <div className="border border-black p-3">
                        <p className="font-medium">Hazardous materials cleaning</p>
                        <p className="text-sm">3rd party rate + markup</p>
                      </div>
                    </div>
                  </div>

                  {/* Waste Material */}
                  <div>
                    <h4 className="font-bold text-black mb-2 text-sm uppercase tracking-wide">5. WASTE MATERIAL</h4>
                    <div className="pl-4">
                      <p className="font-medium mb-2">Non-Hazardous Solid Waste Only</p>
                      <p className="mb-3">
                        Customer agrees not to put any waste that is liquid, or any waste that is, or contains, radioactive, volatile, corrosive, highly flammable, explosive, biomedical, biohazardous, infectious, toxic, and/or any hazardous wastes or substances ("Prohibited Waste") into roll-off containers.
                      </p>
                      <div className="border border-black p-3">
                        <p className="font-medium text-sm mb-1">Prohibited Waste includes:</p>
                        <p className="text-sm">tires, paint, batteries, paint cans, ashes, oil, vehicle parts, sewage sludge, etc.</p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Terms */}
                  <div>
                    <h4 className="font-bold text-black mb-2 text-sm uppercase tracking-wide">6. PAYMENT TERMS</h4>
                    <p className="pl-4">
                      Prepayment at the time of reservation is required by debit card or credit card, San Diego Dumping Solutions will keep that card on file until the account is at a zero balance.
                    </p>
                  </div>

                  {/* Signature Acknowledgement */}
                  <div className="border border-black p-4">
                    <h4 className="font-bold text-black mb-2 text-sm uppercase tracking-wide">SIGNATURE ACKNOWLEDGEMENT</h4>
                    <p className="font-medium">
                      By signing, I am acknowledging that I have read and agree to terms listed in the entirety of the contract.
                    </p>
                  </div>
                </div>
              </div>

              {/* Digital Signature */}
              <div className=" border-black pt-8">
                <div className="space-y-0">
                  <div className="border-b border-black p-8">
                    <div className="flex items-center justify-center">
                      <Image
                        src={contract.signature_img_url}
                        alt="Customer Signature"
                        width={400}
                        height={200}
                        className="max-w-full h-auto"
                      />
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className=" border-black pb-2 mb-2 mt-2">
                      <p className="text-sm font-bold">{contract.profiles.full_name}</p>
                    </div>
                    <div className="inline-block px-6 py-3 ">
                      <p className="text-sm">Signed on {format(new Date(contract.created_at), "MMM dd, yyyy 'at' h:mm a")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Document Footer - Fixed */}
          <div className="border-t border-black px-8 py-4 flex-shrink-0">
            <div className="flex justify-between items-center">
              <div className="text-sm">
                <p><strong>San Diego Dumping Solutions</strong></p>
                <p>Service Agreement - Contract #{contract.id.slice(-8)}</p>
              </div>
              <div>
                <Button
                  onClick={handleDownloadContract}
                  className="border border-black text-white hover:bg-white hover:text-black font-medium px-4 py-2 rounded-none"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
