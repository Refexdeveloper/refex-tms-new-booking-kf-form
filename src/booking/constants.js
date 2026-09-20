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
  { id: 'air', label: 'Flight', icon: 'ri-flight-takeoff-line', sub: 'Domestic & International', accent: '#2d7bbf', soft: '#e8f4fc' },
  { id: 'train', label: 'Train', icon: 'ri-train-line', sub: 'Across India', accent: '#70b62c', soft: '#e8f6e0' },
  { id: 'bus', label: 'Bus', icon: 'ri-bus-line', sub: 'Pan India Travel', accent: '#e88a2d', soft: '#fff3e0' },
  { id: 'flightHotel', label: 'Flight + Hotel', icon: 'ri-plane-line', sub: 'Complete Travel', accent: '#6b5ce7', soft: '#eeeffb' },
  { id: 'accommodation', label: 'Hotel', icon: 'ri-hotel-line', sub: 'Stay with comfort', accent: '#8b5cf6', soft: '#f5e8ff' },
  { id: 'cab', label: 'Cab', icon: 'ri-taxi-line', sub: 'Airport & Local', accent: '#4f6bed', soft: '#e8eeff' },
]

export function modeLabel(mode) {
  if (mode === 'air' || mode === 'flightHotel') return 'Flight'
  if (mode === 'train') return 'Train'
  if (mode === 'bus') return 'Bus'
  if (mode === 'cab') return 'Cab'
  return 'Hotel'
}
