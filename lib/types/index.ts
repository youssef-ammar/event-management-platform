export type RSVPStatus = 'accepted' | 'pending' | 'declined'
export type EventStep = 'ceremonie' | 'mairie' | 'reception' | 'soiree' | 'religieux'
export type EventType = 'mariage' | 'anniversaire' | 'naissance' | 'autre'
export type MessageType = 'message' | 'sondage'
export type MessageChannel = 'whatsapp' | 'sms' | 'email' | 'link' | 'facebook'
export type GiftStatus = 'disponible' | 'reserve' | 'offert'

export interface Guest {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  rsvpStatus: RSVPStatus
  steps: EventStep[]
  familyGroup?: string
  relatedGuests?: string[]
  tableId?: string
  avatarColor?: string
  respondedAt?: string
  dietaryRestrictions?: string
  photoCount?: number
}

export interface EventStepInfo {
  id: EventStep
  label: string
  date: string
  time: string
  address: string
  guestCount: number
  icon?: string
}

export interface Message {
  id: string
  type: MessageType
  content: string
  channel: MessageChannel
  sentAt: string
  recipientCount: number
  steps?: EventStep[]
  scheduledAt?: string
  poll?: Poll
}

export interface Poll {
  id: string
  question: string
  options: PollOption[]
  isAnonymous: boolean
  totalResponses: number
}

export interface PollOption {
  id: string
  text: string
  count: number
  voters?: string[]
}

export interface SeatingTable {
  id: string
  name: string
  capacity: number
  guests: string[]
  shape?: 'round' | 'rectangular'
  position?: { x: number; y: number }
}

export interface Photo {
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

export interface GiftItem {
  id: string
  name: string
  description: string
  imageUrl: string
  status: GiftStatus
  price?: number
  reservedBy?: string
  reservedAt?: string
  link?: string
}

export interface KittyGoal {
  id: string
  name: string
  description: string
  imageUrl?: string
  targetAmount: number
  currentAmount: number
  contributors: KittyContributor[]
  isActive: boolean
  createdAt: string
}

export interface KittyContributor {
  id: string
  name: string
  amount: number
  contributedAt: string
  message?: string
  avatarColor?: string
}

export interface InvitationStyle {
  id: string
  name: string
  thumbnailUrl: string
  primaryColor: string
  fontFamily: string
  backgroundPattern?: string
}

export interface Event {
  id: string
  name: string
  type: EventType
  date: string
  venue: string
  coupleNames?: string
  coverImageUrl?: string
  steps: EventStepInfo[]
  totalGuests: number
  acceptedCount: number
  pendingCount: number
  declinedCount: number
  token: string
}

export interface StatsCard {
  label: string
  value: number | string
  icon: string
  trend?: number
  color: 'rose' | 'green' | 'amber' | 'red' | 'blue'
}

export interface ActivityItem {
  id: string
  guestName: string
  guestId: string
  action: 'accepted' | 'declined' | 'pending' | 'viewed'
  timestamp: string
  avatarColor: string
}

export interface Notification {
  id: string
  type: 'rsvp' | 'photo' | 'gift' | 'message' | 'system'
  title: string
  body: string
  read: boolean
  createdAt: string
}

export interface EventSettings {
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

export interface PublicSeatingTable {
  id: string
  name: string
  capacity: number
  shape?: 'round' | 'rectangular'
  guests: { id: string; firstName: string; lastName: string }[]
}

export interface User {
  id: string
  name: string
  email: string
  phone?: string
}
