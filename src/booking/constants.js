/** Travel_Management_A02 process FieldIds — synced via kf.context.updateField */
export const APP_ID = 'Expense_and_Travel_Management_A00'
export const TRAVEL_PROCESS_ID = 'Travel_Management_A02'

export const FIELDS = {
  purpose: 'Purpose_of_Travel',
  purposeAlt: 'Purpose',
  domesticInternational: 'DomesticInternational',
  modeOfTransport: 'Mode_of_Transport',
  travelType: 'Travel_Type',
  tripType: 'Trip_Type',
  departureDate: 'Departure_Date',
  fsDepartureDate: 'FS_Departure_Date',
  fromDate: 'From_Date',
  toDate: 'To_Date',
  commonFrom: 'common_From',
  commonTo: 'common_To',
  fsFromCity: 'FS_From_City',
  fsToCity: 'FS_To_City',
  boardingFrom: 'Boarding_from',
  destinationTo: 'Destination_to_1',
  bookingAmount: 'FS_Booking_Amount_1',
  bookingAmountAlt: 'Booking_Amount_1',
  mcRoute: 'MC_Route_Summary',
  mcAmount: 'MC_Total_Booking_Amount',
  accommodation: 'Is_accommodation_required',
  beneficiary: 'Beneficiary',
  comments: 'Comments',
  city: 'City',
  checkin: 'Checkin_Date',
  checkout: 'Checkout_Date',
  pickup: 'Pickup_Location',
  drop: 'Drop_Location',
  pickupTime: 'Pickup_Time',
  dropTime: 'Drop_Time',
  greenMobility: 'Go_with_Green_mobility',
  requesterEmail: 'Requester_Email',
  empEmail: 'emp_email_address',
  employeeDetails: 'Employee_Details',
}

export const CLOUD_RUN = 'https://refex-tms-flightsearch-dhwffeu7pq-el.a.run.app'

export const MODES = [
  { id: 'air', label: 'Flight', icon: 'ri-flight-takeoff-line', sub: 'Domestic & International', accent: '#1E88E5', soft: '#EFF6FF' },
  { id: 'train', label: 'Train', icon: 'ri-train-line', sub: 'Across India', accent: '#0084AD', soft: '#E0F7FA' },
  { id: 'bus', label: 'Bus', icon: 'ri-bus-line', sub: 'Pan India Travel', accent: '#F97316', soft: '#FFF7ED' },
  { id: 'flightHotel', label: 'Flight + Hotel', icon: 'ri-hotel-bed-line', sub: 'Complete Travel', accent: '#2B5AED', soft: '#EEF2FF' },
  { id: 'accommodation', label: 'Hotel', icon: 'ri-building-line', sub: 'Stay with comfort', accent: '#8B5CF6', soft: '#F5F3FF' },
  { id: 'cab', label: 'Cab', icon: 'ri-taxi-line', sub: 'Airport & Local', accent: '#0F766E', soft: '#ECFDF5' },
]

export function modeLabel(mode) {
  if (mode === 'air' || mode === 'flightHotel') return 'Flight'
  if (mode === 'train') return 'Train'
  if (mode === 'bus') return 'Bus'
  if (mode === 'cab') return 'Cab'
  return 'Hotel'
}
