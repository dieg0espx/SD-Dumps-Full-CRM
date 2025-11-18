"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { BookingDetailsSidebar } from "./booking-details-sidebar"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isWithinInterval,
  startOfWeek,
  endOfWeek,
  eachWeekOfInterval,
} from "date-fns"

interface BookingCalendarProps {
  bookings: any[]
  isAdmin?: boolean
  onBookingUpdate?: () => void
}

export function BookingCalendar({ bookings, isAdmin = false, onBookingUpdate }: BookingCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedBooking, setSelectedBooking] = useState<any>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })
  const weeks = eachWeekOfInterval({ start: calendarStart, end: calendarEnd })

  const getBookingColor = (booking: any) => {
    // Phone bookings awaiting card entry - use distinctive color
    if (booking.status === "awaiting_card") {
      return "bg-amber-500 border-2 border-amber-600"
    }

    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-orange-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
      "bg-red-500",
      "bg-yellow-500",
      "bg-cyan-500",
    ]
    // Use booking ID to consistently assign colors
    const hash = booking.id.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0)
      return a & a
    }, 0)
    return colors[Math.abs(hash) % colors.length]
  }

  const getBookingSpansForWeek = (weekStart: Date, weekIndex: number) => {
    const weekEnd = endOfWeek(weekStart)
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })
    const spans: any[] = []

    bookings.forEach((booking) => {
      const startDate = new Date(booking.start_date)
      const endDate = new Date(booking.end_date)

      // Check if booking overlaps with this week
      if (
        isWithinInterval(startDate, { start: weekStart, end: weekEnd }) ||
        isWithinInterval(endDate, { start: weekStart, end: weekEnd }) ||
        (startDate < weekStart && endDate > weekEnd)
      ) {
        const displayStart = startDate < weekStart ? weekStart : startDate
        const displayEnd = endDate > weekEnd ? weekEnd : endDate

        const startDayIndex = weekDays.findIndex((day) => isSameDay(day, displayStart))
        const endDayIndex = weekDays.findIndex((day) => isSameDay(day, displayEnd))

        if (startDayIndex !== -1) {
          const duration = endDayIndex !== -1 ? endDayIndex - startDayIndex + 1 : 1
          spans.push({
            ...booking,
            startIndex: startDayIndex,
            duration: duration,
            row: 0,
          })
        }
      }
    })

    // Calculate rows to avoid overlaps within the week
    spans.sort((a, b) => a.startIndex - b.startIndex)
    spans.forEach((span, index) => {
      let row = 0
      for (let i = 0; i < index; i++) {
        const otherSpan = spans[i]
        if (
          span.startIndex < otherSpan.startIndex + otherSpan.duration &&
          span.startIndex + span.duration > otherSpan.startIndex
        ) {
          row = Math.max(row, otherSpan.row + 1)
        }
      }
      span.row = row
    })

    return spans
  }

  const handleBookingClick = (booking: any) => {
    setSelectedBooking(booking)
    setIsSidebarOpen(true)
  }

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false)
    setSelectedBooking(null)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{format(currentDate, "MMMM yyyy")}</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 mb-4" style={{ borderCollapse: 'collapse' }}>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
              <div 
                key={day} 
                className="p-2 text-center font-medium text-gray-500 text-sm"
                style={{
                  border: '1px solid #e5e7eb',
                  borderCollapse: 'collapse',
                  margin: '-1px 0 0 -1px'
                }}
              >
                {day}
              </div>
            ))}
          </div>

          <div>
            {weeks.map((weekStart, weekIndex) => {
              const weekDays = eachDayOfInterval({ start: weekStart, end: endOfWeek(weekStart) })
              const weekSpans = getBookingSpansForWeek(weekStart, weekIndex)
              const maxRows = Math.max(0, ...weekSpans.map((span) => span.row)) + 1

              return (
                <div key={weekStart.toISOString()} className="relative" style={{ marginTop: '-1px' }}>
                  {/* Week grid */}
                  <div className="grid grid-cols-7" style={{ borderCollapse: 'collapse' }}>
                    {weekDays.map((day, dayIndex) => {
                      const isCurrentMonth = isSameMonth(day, currentDate)
                      const isToday = isSameDay(day, new Date())

                      const isPast = day < new Date() && !isSameDay(day, new Date())
                      
                      return (
                        <div
                          key={day.toISOString()}
                          className={`h-[70px] p-1 ${
                            isToday ? "bg-yellow-100" : isPast ? "bg-gray-100" : isCurrentMonth ? "bg-white" : "bg-gray-50"
                          }`}
                          style={{ 
                            minHeight: maxRows > 0 ? `${70 + maxRows * 24}px` : '70px',
                            border: '1px solid #e5e7eb',
                            borderCollapse: 'collapse',
                            margin: '-1px 0 0 -1px'
                          }}
                        >
                          <div className={`text-sm font-medium ${
                            isPast ? "text-gray-500" : isCurrentMonth ? "text-gray-900" : "text-gray-400"
                          }`}>
                            {format(day, "d")}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Booking spans overlay for this week */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="grid grid-cols-7 h-full">
                      {weekDays.map((day, dayIndex) => (
                        <div key={dayIndex} className="relative">
                          {weekSpans
                            .filter((span) => span.startIndex === dayIndex)
                            .map((span) => (
                              <div
                                key={`${span.id}-${weekIndex}`}
                                className={`absolute pointer-events-auto cursor-pointer rounded px-2 py-1 text-white text-xs font-medium shadow-sm hover:shadow-md transition-shadow ${getBookingColor(span)}`}
                                style={{
                                  top: `${28 + span.row * 24}px`,
                                  left: "2px",
                                  width: `calc(${span.duration * 100}% - 4px)`,
                                  zIndex: 10,
                                }}
                                onClick={() => handleBookingClick(span)}
                                title={span.status === 'awaiting_card' ? 'Phone Booking - Awaiting Card' : ''}
                              >
                                <div className="truncate">
                                  {span.profiles?.full_name || span.profiles?.email?.split("@")[0] || "Guest"} -{" "}
                                  {span.container_types?.size || "Container"}
                                </div>
                              </div>
                            ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <BookingDetailsSidebar 
        booking={selectedBooking} 
        isOpen={isSidebarOpen} 
        onClose={handleCloseSidebar} 
        isAdmin={isAdmin}
        onUpdate={onBookingUpdate}
      />
    </>
  )
}
