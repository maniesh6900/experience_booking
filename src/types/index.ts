export interface Experience {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  originalPrice: number;
  duration: string;
  imageUrl: string;
  createdAt: string;
}

export interface AvailableDate {
  date: string;
  availableSlots: string[];
  isAvailable: boolean;
}

export interface ExperienceDetails extends Experience {
  availableDates: AvailableDate[];
}

export interface BookingData {
  fullName: string;
  email: string;
  experienceId: string;
  date: string;
  timeSlot: string;
  promoCode?: string;
}

export interface PromoValidationResponse {
  valid: boolean;
  discountType?: 'percentage' | 'fixed';
  discountValue?: number;
  error?: string;
}

export interface BookingResponse {
  success: boolean;
  bookingId?: string;
  message?: string;
  error?: string;
}