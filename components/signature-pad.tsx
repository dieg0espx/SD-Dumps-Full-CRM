"use client"

import React, { useRef, useEffect, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RotateCcw, Download, Check, AlertCircle } from 'lucide-react'

interface SignaturePadProps {
  onSignatureComplete: (signatureDataUrl: string) => void
  onClear: () => void
  disabled?: boolean
}

interface Point {
  x: number
  y: number
}

export function SignaturePad({ onSignatureComplete, onClear, disabled = false }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasSignature, setHasSignature] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [lastPoint, setLastPoint] = useState<Point>({ x: 0, y: 0 })
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })

  // Initialize canvas and set up drawing context
  const initializeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Get the container dimensions
    const container = canvas.parentElement
    if (!container) return

    const rect = container.getBoundingClientRect()
    const width = rect.width - 8 // Account for minimal mobile padding
    const height = 200 // Fixed height for signature area

    // Set canvas size
    canvas.width = width
    canvas.height = height
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`

    setCanvasSize({ width, height })

    // Set drawing styles
    ctx.strokeStyle = '#1f2937'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.fillStyle = '#ffffff'

    // Fill with white background
    ctx.fillRect(0, 0, width, height)
  }, [])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      initializeCanvas()
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [initializeCanvas])

  // Initialize canvas on mount
  useEffect(() => {
    initializeCanvas()
  }, [initializeCanvas])

  // Get point coordinates relative to canvas
  const getPointFromEvent = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    }
  }

  // Start drawing
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (disabled) return
    
    e.preventDefault()
    const point = getPointFromEvent(e)
    
    setIsDrawing(true)
    setLastPoint(point)

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Start a new path
    ctx.beginPath()
    ctx.moveTo(point.x, point.y)
  }

  // Continue drawing
  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || disabled) return

    e.preventDefault()
    const point = getPointFromEvent(e)

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Draw line from last point to current point
    ctx.lineTo(point.x, point.y)
    ctx.stroke()

    setLastPoint(point)
    setHasSignature(true)
  }

  // Stop drawing
  const stopDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    
    e.preventDefault()
    setIsDrawing(false)
  }

  // Clear signature
  const clearSignature = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Fill with white background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Reset stroke style
    ctx.strokeStyle = '#1f2937'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    setHasSignature(false)
    onClear()
  }

  // Save signature as base64 PNG
  const saveSignature = async () => {
    const canvas = canvasRef.current
    if (!canvas || !hasSignature || isSaving) return

    setIsSaving(true)
    try {
      // Force PNG format with high quality
      const dataURL = canvas.toDataURL('image/png', 1.0)
      
      // Validate the data URL
      if (!dataURL || !dataURL.startsWith('data:image/png;base64,')) {
        throw new Error('Failed to generate valid PNG signature')
      }
      
      // Extract base64 data for validation
      const base64Data = dataURL.split(',')[1]
      if (!base64Data || base64Data.length < 100) {
        throw new Error('Signature data too small - please draw a signature')
      }

      // Call the completion handler
      await onSignatureComplete(dataURL)
    } catch (error) {
      console.error('❌ Error saving PNG signature:', error)
      throw error // Re-throw to let parent component handle
    } finally {
      setIsSaving(false)
    }
  }

  // Check if canvas has any drawing
  const checkForSignature = () => {
    const canvas = canvasRef.current
    if (!canvas) return false

    const ctx = canvas.getContext('2d')
    if (!ctx) return false

    // Get image data and check if it's not just white
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    // Check if any pixel is not white (255, 255, 255)
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      
      if (r !== 255 || g !== 255 || b !== 255) {
        return true
      }
    }
    
    return false
  }

  // Update hasSignature state when drawing changes
  useEffect(() => {
    if (isDrawing) {
      const timer = setTimeout(() => {
        setHasSignature(checkForSignature())
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isDrawing])

  return (
    <Card className="border border-gray-200">
      <CardHeader className="px-1 sm:px-6">
        <CardTitle className="text-lg flex items-center">
          <Check className="w-5 h-5 mr-2 text-blue-600" />
          Digital Signature
        </CardTitle>
        <CardDescription>
          Please sign below to confirm your booking agreement
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 px-1 sm:px-6">
        {/* Signature Canvas */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-1 sm:p-4 bg-gray-50 flex justify-center">
          <canvas
            ref={canvasRef}
            className="w-full cursor-crosshair touch-none border border-gray-200 rounded"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            style={{ 
              touchAction: 'none',
              backgroundColor: '#ffffff'
            }}
          />
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={clearSignature}
            disabled={!hasSignature || disabled}
            className="flex items-center"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Clear
          </Button>
          
          <Button
            type="button"
            onClick={saveSignature}
            disabled={!hasSignature || disabled || isSaving}
            className="flex items-center bg-blue-600 hover:bg-blue-700"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Save Signature
              </>
            )}
          </Button>
        </div>
        
        {/* Status Message */}
        <div className="text-center">
          {isSaving ? (
            <div className="text-sm text-blue-600 flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              Saving signature and proceeding to payment...
            </div>
          ) : hasSignature ? (
            <div className="text-sm text-green-600 flex items-center justify-center">
              <Check className="w-4 h-4 mr-2" />
              Signature captured. Click 'Save Signature' to proceed to payment.
            </div>
          ) : (
            <div className="text-sm text-gray-500 flex items-center justify-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              Please sign in the box above to continue with your booking.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}