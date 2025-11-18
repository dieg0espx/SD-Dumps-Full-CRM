# Availability Checking Feature

## Overview
Added real-time availability checking to the Phone Booking form to prevent overbooking.

## What It Does

### Automatic Availability Checking
- **Triggers automatically** when admin selects:
  - Container type
  - Start date
  - End date
- **Shows real-time status** of how many containers are available

### Visual Indicators

#### 🎨 **Calendar Date Colors**

When you open the date picker, you'll see:
- **🔴 Vibrant red background with white text and strikethrough** = Fully booked dates (no containers available)
- **⚪ White/normal** = Available dates (containers available)
- **Past dates are automatically disabled** (greyed out)

#### ✅ **Available (Green Alert)**
```
Available
3 containers available out of 5
2 already booked for this period
```

#### ❌ **Fully Booked (Red Alert)**
```
Fully Booked
0 containers available out of 5
5 already booked for this period
Please select different dates or choose another container type.
```

#### 🔄 **Checking (Blue Alert)**
```
Checking availability...
```

### Prevention Features

1. **Validation Before Submit**
   - Prevents form submission if no containers available
   - Shows error message: "No containers available for the selected dates"

2. **Disabled Submit Button**
   - Button text changes to "No Containers Available"
   - Button is disabled when fully booked

3. **Real-time Updates**
   - Availability rechecks when dates or container type changes
   - Uses `useEffect` to automatically update

## How It Works

### Database Query
```javascript
// Finds overlapping bookings for selected container type
const { data: bookings } = await supabase
  .from("bookings")
  .select("id, start_date, end_date")
  .eq("container_type_id", containerType)
  .not("status", "in", '("cancelled")')
  .gte("end_date", startDate)
  .lte("start_date", endDate)
```

### Calculation
```javascript
const bookedCount = bookings.length
const availableCount = container.available_quantity - bookedCount
```

### Excluded Statuses
- Cancelled bookings are **NOT counted** toward availability
- Only active bookings (`pending`, `confirmed`, `completed`, `awaiting_card`) reduce availability

## User Experience

### For Admins Creating Phone Bookings

1. **Select container type**
2. **Select dates**
3. **See availability immediately**
   - Green = Good to go
   - Red = Change dates or container
4. **Cannot submit if fully booked**

### Benefits

✅ **No Overbooking** - System prevents double-booking
✅ **Real-time Feedback** - Admin sees availability instantly
✅ **Clear Messaging** - Obvious what's available and what's not
✅ **Better Planning** - Admin can adjust dates on the fly
✅ **Professional** - Customers don't receive links for unavailable containers

## Technical Details

### Files Modified
- `/components/phone-booking-form.tsx`

### New State Variables
```typescript
const [availability, setAvailability] = useState<{
  booked: number;
  available: number;
} | null>(null)
const [checkingAvailability, setCheckingAvailability] = useState(false)
```

### New Function
```typescript
const checkAvailability = async () => {
  // Fetches overlapping bookings
  // Calculates available containers
  // Updates UI
}
```

### useEffect Hook
```typescript
useEffect(() => {
  if (containerType && startDate && endDate) {
    checkAvailability()
  }
}, [containerType, startDate, endDate])
```

## Future Enhancements

Possible improvements:
- Show calendar with available/unavailable dates
- Suggest alternative dates if fully booked
- Show booking details (who has what booked)
- Send notification when containers become available
- Allow waitlist for fully booked periods

## Testing

### Test Scenarios

1. **All Available**
   - Select dates with no bookings
   - Should show green alert with full availability

2. **Partially Booked**
   - Select dates with some bookings
   - Should show remaining available count

3. **Fully Booked**
   - Select dates when all containers booked
   - Should show red alert
   - Submit button should be disabled

4. **Date Changes**
   - Change dates after selecting
   - Availability should update automatically

---

**Last Updated**: 2025-01-14
**Status**: ✅ Complete and Working
