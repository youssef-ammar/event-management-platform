/**
 * Response shapes returned by the API. These intentionally mirror the
 * frontend's contract defined in `lib/types/index.ts`.
 */

export type RsvpStatus = 'accepted' | 'pending' | 'declined'
export type EventStep = 'ceremonie' | 'mairie' | 'reception' | 'soiree' | 'religieux'
export type EventTypeName = 'mariage' | 'anniversaire' | 'naissance' | 'autre'
export type MessageTypeName = 'message' | 'sondage'
export type MessageChannelName = 'whatsapp' | 'sms' | 'email' | 'link' | 'facebook'
export type GiftStatusName = 'disponible' | 'reserve' | 'offert'

export interface UserDTO {
  id: string
  name: string
  email: string
  phone?: string
}

export interface GuestDTO {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  rsvpStatus: RsvpStatus
  steps: EventStep[]
  familyGroup?: string
  relatedGuests?: string[]
  tableId?: string
  avatarColor?: string
  respondedAt?: string
  dietaryRestrictions?: string
  photoCount?: number
}

export interface EventStepInfoDTO {
  id: EventStep
  label: string
  date: string
  time: string
  address: string
  guestCount: number
}

export interface PollOptionDTO {
  id: string
  text: string
  count: number
  voters?: string[]
}

export interface PollDTO {
  id: string
  question: string
  options: PollOptionDTO[]
  isAnonymous: boolean
  totalResponses: number
}

export interface MessageDTO {
  id: string
  type: MessageTypeName
  content: string
  channel: MessageChannelName
  sentAt: string | null
  recipientCount: number
  steps?: EventStep[]
  scheduledAt?: string | null
  poll?: PollDTO
}

export interface SeatingTableDTO {
  id: string
  name: string
  capacity: number
  guests: string[]
  shape?: 'round' | 'rectangular'
  position?: { x: number; y: number }
}

export interface PhotoDTO {
  id: string
  url: string
  thumbnailUrl: string
  guestId: string
  guestName: string
  uploadedAt: string
  approved: boolean
  width: number
  height: number
}

export interface GiftItemDTO {
  id: string
  name: string
  description: string
  imageUrl: string
  status: GiftStatusName
  price?: number
  reservedBy?: string
  reservedAt?: string
  link?: string
}

export interface KittyContributorDTO {
  id: string
  name: string
  amount: number
  contributedAt: string
  message?: string
  avatarColor?: string
}

export interface KittyGoalDTO {
  id: string
  name: string
  description: string
  imageUrl?: string
  targetAmount: number
  currentAmount: number
  contributors: KittyContributorDTO[]
  isActive: boolean
  createdAt: string
}

export interface InvitationStyleDTO {
  id: string
  name: string
  thumbnailUrl: string
  primaryColor: string
  fontFamily: string
  backgroundPattern?: string
}

export interface EventDTO {
  id: string
  name: string
  type: EventTypeName
  date: string
  venue: string
  coupleNames?: string
  coverImageUrl?: string
  steps: EventStepInfoDTO[]
  totalGuests: number
  acceptedCount: number
  pendingCount: number
  declinedCount: number
  token: string
}

export interface StatsCardDTO {
  label: string
  value: number | string
  icon: string
  trend?: number
  color: 'rose' | 'green' | 'amber' | 'red' | 'blue'
}

export interface ActivityItemDTO {
  id: string
  guestName: string
  guestId: string
  action: 'accepted' | 'declined' | 'pending' | 'viewed'
  timestamp: string
  avatarColor: string
}

export interface NotificationDTO {
  id: string
  type: 'rsvp' | 'photo' | 'gift' | 'message' | 'system'
  title: string
  body: string
  read: boolean
  createdAt: string
}

export interface EventSettingsDTO {
  notifEmail: boolean
  notifSMS: boolean
  notifRSVP: boolean
  notifPhoto: boolean
  notifGift: boolean
  photoApproval: boolean
  publicAlbum: boolean
  showGuestList: boolean
  language: string
  theme: string
  guestLimit?: number
}

export interface PublicSeatingTableDTO {
  id: string
  name: string
  capacity: number
  shape?: 'round' | 'rectangular'
  guests: { id: string; firstName: string; lastName: string }[]
}
