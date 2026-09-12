export type UserRole = 
  | 'public' 
  | 'customer' 
  | 'provider' 
  | 'admin';

export type StaffRole =
  | 'super_admin'
  | 'admin'
  | 'operations_manager'
  | 'kyc_reviewer'
  | 'support_staff';

export type AppSystemRole =
  | 'guest'
  | 'customer'
  | 'provider'
  | StaffRole;

export type ServiceCategoryId = 
  | 'gardener'
  | 'maid'
  | 'caretaker'
  | 'painter'
  | 'pest_control'
  | 'sanitation'
  | 'labour'
  | 'helper'
  | 'driver';

export type PricingModel = 
  | 'Fixed Price'
  | 'Starting From'
  | 'Hourly'
  | 'Per Visit'
  | 'Per Day'
  | 'Per Room'
  | 'Per Sq Ft'
  | 'Per Job'
  | 'Per Trip'
  | 'Custom Quote'
  | 'Inspection Required';

export interface ServiceCategory {
  id: ServiceCategoryId | string;
  name: string;
  slug?: string;
  hindiName?: string;
  icon: string;
  shortDesc: string;
  fullDesc: string;
  description?: string;
  pricingModel: PricingModel;
  startingPrice: number;
  estimatedDuration: string;
  subServices: string[];
  requirements: string[];
  requiredDocuments?: string[];
  requiredSkills?: string[];
  popularInBhel: boolean;
  image: string;
  displayOrder?: number;
  isActive?: boolean;
  doitCommissionPct?: number;
}

export type BookingStatus =
  | 'DRAFT'
  | 'REQUESTED'
  | 'UNDER_REVIEW'
  | 'PROVIDER_MATCHING'
  | 'PROVIDER_ASSIGNED'
  | 'PROVIDER_ACCEPTED'
  | 'QUOTE_GENERATED'
  | 'CUSTOMER_APPROVAL'
  | 'CUSTOMER_CONFIRMED'
  | 'SCHEDULED'
  | 'BOOKED'
  | 'PROVIDER_ON_THE_WAY'
  | 'ARRIVED'
  | 'SERVICE_STARTED'
  | 'IN_PROGRESS'
  | 'SERVICE_COMPLETED'
  | 'COMPLETED'
  | 'PAYMENT_PENDING'
  | 'PAID'
  | 'RATING_SUBMITTED'
  | 'CLOSED'
  | 'CANCELLED'
  | 'REFUNDED'
  | 'DISPUTED';

export type KycStatus = 
  | 'NOT_SUBMITTED'
  | 'PENDING' 
  | 'UNDER_REVIEW' 
  | 'VERIFIED'
  | 'APPROVED' 
  | 'REJECTED' 
  | 'RESUBMISSION_REQUIRED'
  | 'DOCUMENT_REQUIRED';

export type ProviderAccountStatus =
  | 'APPLICATION_STARTED'
  | 'APPLICATION_SUBMITTED'
  | 'KYC_PENDING'
  | 'KYC_UNDER_REVIEW'
  | 'KYC_APPROVED'
  | 'KYC_REJECTED'
  | 'PROFILE_INCOMPLETE'
  | 'TRAINING_REQUIRED'
  | 'ACTIVE'
  | 'SUSPENDED'
  | 'INACTIVE'
  | 'REJECTED'
  | 'UNDER_REVIEW';

export type KycDocumentType =
  | 'Aadhaar Card'
  | 'PAN Card'
  | 'Driving Licence'
  | 'Voter ID'
  | 'Pest Control Licence'
  | 'Trade Certification'
  | 'Police Verification';

export interface KycDocument {
  id: string;
  type: KycDocumentType;
  number: string; // Masked e.g. "XXXX-XXXX-6821" or "ABCDE****F"
  rawNumber?: string; // Stored securely, only visible to KYC Reviewer / Super Admin
  documentUrl: string;
  documentBackUrl?: string;
  selfieUrl?: string;
  nameAsPerDoc?: string;
  dob?: string;
  addressAsPerDoc?: string;
  status: KycStatus;
  uploadedAt?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  adminNotes?: string;
  rejectionReason?: string;
  policeVerificationNote?: string;
}

export interface Provider {
  id: string; // e.g. PRV-00124
  name: string;
  phone: string;
  whatsapp: string;
  email?: string;
  photo: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  dob?: string;
  residentialLocality: string;
  address?: {
    houseFlatNumber: string;
    street: string;
    landmark: string;
    locality: string;
    city: string;
    state: string;
    pincode: string;
  };
  categories: ServiceCategoryId[];
  skills: string[];
  experienceYears: number;
  previousExperience?: string;
  serviceAreas: string[];
  maxTravelDistanceKm: number;
  canTravelOutside: boolean;
  workingDays: string[];
  workingHours: string;
  languages?: string[];
  employmentType?: 'Individual' | 'Agency';
  agencyName?: string;
  references?: string;
  isAcceptingJobs: boolean;
  coordinates?: { lat: number; lng: number };
  isEmergencyAvailable: boolean;
  pricingRateText: string;
  kycStatus: KycStatus;
  kycDoc: KycDocument; // primary Aadhaar
  panDoc?: KycDocument; // secondary PAN
  additionalDocs?: KycDocument[];
  rating: number;
  ratingsBreakdown: {
    professionalism: number;
    punctuality: number;
    quality: number;
    behaviour: number;
  };
  completedJobsCount: number;
  cancellationRate: number; // percentage
  noShowRate: number;
  onTimeRate: number;
  acceptanceRate: number;
  complaintCount: number;
  earningsThisMonth: {
    gross: number;
    doitFee: number;
    netPayout: number;
  };
  status: ProviderAccountStatus;
  joinedDate?: string;
  internalNotes?: string;
}

export interface TimelineEvent {
  timestamp: string;
  title: string;
  actor: 'Customer' | 'Admin' | 'DOIT Coordinator' | 'DOIT Desk' | 'Provider' | 'System';
  description?: string;
}

export interface BookingQuote {
  labour: number;
  material: number;
  travelFee: number;
  doitCommission: number;
  tax: number;
  discount: number;
  totalAmount: number;
  providerPayout: number;
  terms: string;
  isAcceptedByCustomer?: boolean;
}

export type PaymentStatus = 'PAID' | 'PENDING' | 'REFUNDED' | 'SUCCESS' | 'HELD_IN_ESCROW' | 'RELEASED_TO_PROVIDER' | 'FAILED';

export interface BookingPayment {
  method: 'UPI' | 'Cash' | 'Card' | 'Net Banking' | 'Pending';
  status: PaymentStatus;
  amount?: number;
  transactionId?: string;
  paidAt?: string;
}

export interface BookingRating {
  stars: number;
  quality: number;
  punctuality: number;
  professionalism: number;
  behaviour: number;
  feedbackText: string;
  submittedAt?: string;
  isModerated?: boolean;
}

export interface BookingComplaint {
  id: string;
  category: string;
  description: string;
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'REFUNDED';
  resolutionNote?: string;
  refundAmount?: number;
  createdAt?: string;
}

export interface Booking {
  id: string; // e.g. DOIT-2026-000123
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  categoryId: ServiceCategoryId;
  subService: string;
  requirementDescription: string;
  photos: string[];
  locality: string; // e.g. BHEL Sector 1
  address: string;
  landmark: string;
  houseFlatNumber?: string;
  city?: string;
  state?: string;
  pincode?: string;
  coordinates?: { lat: number; lng: number };
  preferredDate: string;
  preferredTime: string;
  isFlexibleTime: boolean;
  recurringSchedule?: 'One Time' | 'Weekly' | 'Every 2 Weeks' | 'Monthly';
  expectedBudget?: number;
  pricingType?: 'FIXED' | 'HOURLY' | 'PER_VISIT' | 'PER_DAY' | 'PER_JOB' | 'PER_TRIP' | 'CUSTOM_QUOTE' | 'INSPECTION_REQUIRED';
  status: BookingStatus;
  assignedProviderId?: string;
  backupProviderId?: string;
  quote?: BookingQuote;
  payment?: BookingPayment;
  beforePhoto?: string;
  afterPhoto?: string;
  completionNotes?: string;
  rating?: BookingRating;
  complaint?: BookingComplaint;
  timeline: TimelineEvent[];
  createdAt: string;
}

export interface CustomerProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatarUrl?: string;
  savedAddresses: SavedAddress[];
  defaultAddressId?: string;
  favoriteProviderIds?: string[];
  createdAt: string;
}

export interface SavedAddress {
  id?: string;
  label?: string; // 'Home Quarter', 'Workplace', 'Parent House'
  latitude: number;
  longitude: number;
  houseFlatNumber: string;
  address: string;
  locality: string;
  city: string;
  state: string;
  pincode: string;
  landmark: string;
  isDefault?: boolean;
}

export interface SupportTicket {
  id: string; // e.g. TCK-901
  bookingId?: string;
  userId?: string;
  userName?: string;
  customerName?: string;
  userPhone?: string;
  userRole?: 'customer' | 'provider';
  subject?: string;
  category: 'Billing' | 'Quality of Work' | 'Delay / Punctuality' | 'Provider Conduct' | 'Safety' | 'General' | string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  description: string;
  attachments?: string[];
  status: 'OPEN' | 'IN_PROGRESS' | 'WAITING_FOR_USER' | 'RESOLVED' | 'CLOSED';
  assignedStaff?: string;
  internalNotes?: string;
  resolutionNote?: string;
  resolutionNotes?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface NotificationItem {
  id: string;
  recipientId: string;
  recipientRole: 'customer' | 'provider' | 'admin';
  title: string;
  message: string;
  channel: 'in_app' | 'sms' | 'whatsapp' | 'email';
  type: 
    | 'booking_created' 
    | 'provider_assigned' 
    | 'provider_accepted' 
    | 'on_the_way' 
    | 'arrived' 
    | 'service_completed' 
    | 'payment_received' 
    | 'kyc_submitted' 
    | 'kyc_approved' 
    | 'kyc_rejected' 
    | 'dispute_update';
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface ProviderPayout {
  id: string; // e.g. PAY-001
  providerId: string;
  providerName: string;
  bookingId?: string;
  serviceName?: string;
  customerAmount?: number;
  grossBillings?: number;
  platformFee?: number; // DOIT share
  platformFeeDeducted?: number;
  providerEarning?: number;
  tax?: number;
  adjustment?: number;
  finalPayout: number;
  period?: string;
  completedJobsCount?: number;
  status: 'PENDING' | 'APPROVED' | 'PROCESSING' | 'PAID' | 'FAILED';
  payoutDate?: string;
  utrNumber?: string;
  paymentReference?: string;
  processedAt?: string;
}

export interface PaymentTransaction {
  id: string; // e.g. TXN-89123
  bookingId: string;
  customerId: string;
  customerName: string;
  amount: number;
  method: 'UPI' | 'Card' | 'Net Banking' | 'Cash';
  status: 'PENDING' | 'PROCESSING' | 'PAID' | 'FAILED' | 'REFUNDED' | 'PARTIALLY_REFUNDED';
  referenceId?: string;
  createdAt: string;
}

export interface ServiceArea {
  id: string;
  country?: string;
  state?: string;
  city: string;
  zone?: string;
  locality?: string;
  name?: string;
  bhelSector?: string;
  pincode: string;
  isActive: boolean;
  demandLevel: 'High' | 'Medium' | 'Surging' | 'HIGH' | 'MEDIUM' | 'LOW';
  coordinates?: { lat: number; lng: number };
  avgResponseMins?: number;
  serviceRadiusKm?: number;
}

export interface PricingConfig {
  basePrice: number;
  hourlyRate: number;
  visitFee: number;
  platformFeePct: number; // e.g. 10%
  providerPayoutPct: number; // e.g. 90%
  cancellationFee: number;
  travelFee: number;
  taxPct: number; // GST 18% or 0%
}

export interface CMSContent {
  heroHeadline: string;
  heroSubheadline: string;
  primaryCtaText: string;
  secondaryCtaText: string;
  aboutUsText: string;
  whyChoosePoints: { title: string; desc: string }[];
  howItWorksSteps: { step: number; title: string; desc: string }[];
  faqs: { question: string; answer: string; category?: string }[];
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
  legalPages: {
    termsAndConditions: string;
    privacyPolicy: string;
    providerTerms: string;
    kycConsent: string;
    cancellationPolicy: string;
    refundPolicy: string;
  };
}

export interface AuditLog {
  id: string;
  timestamp: string;
  staffName?: string;
  actor?: string;
  actorRole?: string;
  action: string;
  bookingId?: string;
  providerId?: string;
  details: string;
}

export interface LocalityData {
  name: string;
  zone: string;
  activeBookings: number;
  availableProviders: number;
  demandLevel: 'High' | 'Medium' | 'Surging';
  avgResponseMins: number;
  coordinates: { lat: number; lng: number };
  landmark?: string;
}

export interface PromotionCoupon {
  id: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FLAT';
  discountValue: number;
  minBookingAmount: number;
  maxDiscountAmount?: number;
  applicableCategory?: string;
  applicableArea?: string;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usedCount: number;
  status: 'ACTIVE' | 'SCHEDULED' | 'EXPIRED' | 'DISABLED';
  description?: string;
}

export type AdminTabType =
  | 'dashboard'
  | 'bookings'
  | 'customers'
  | 'providers'
  | 'services'
  | 'service-areas'
  | 'payments'
  | 'payouts'
  | 'revenue'
  | 'reviews'
  | 'support'
  | 'notifications'
  | 'promotions'
  | 'analytics'
  | 'reports'
  | 'content'
  | 'settings'
  | 'roles'
  | 'audit-logs'
  | 'risk'
  | 'refunds';

