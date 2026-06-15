import {
  ActivityLog,
  Event,
  EventSettings,
  EventStepInfo,
  Guest,
  GiftItem,
  KittyContributor,
  KittyGoal,
  Message,
  Notification,
  Photo,
  Poll,
  PollOption,
  PollVote,
  SeatingTable,
} from '@prisma/client'
import { prisma } from '../lib/prisma'
import {
  ActivityItemDTO,
  EventDTO,
  EventSettingsDTO,
  EventStepInfoDTO,
  GiftItemDTO,
  GuestDTO,
  KittyGoalDTO,
  MessageDTO,
  NotificationDTO,
  PhotoDTO,
  PollDTO,
  SeatingTableDTO,
} from '../types/dto'

type GuestWithCounts = Guest & { _count?: { photos: number } }

export function toGuestDTO(guest: GuestWithCounts): GuestDTO {
  return {
    id: guest.id,
    firstName: guest.firstName,
    lastName: guest.lastName,
    email: guest.email,
    phone: guest.phone,
    rsvpStatus: guest.rsvpStatus,
    steps: guest.steps,
    familyGroup: guest.familyGroup ?? undefined,
    relatedGuests: guest.relatedGuestIds.length ? guest.relatedGuestIds : undefined,
    tableId: guest.tableId ?? undefined,
    avatarColor: guest.avatarColor ?? undefined,
    respondedAt: guest.respondedAt?.toISOString(),
    dietaryRestrictions: guest.dietaryRestrictions ?? undefined,
    photoCount: guest._count?.photos,
  }
}

type EventWithSteps = Event & { steps: EventStepInfo[] }

export async function toEventDTO(event: EventWithSteps): Promise<EventDTO> {
  const [totalGuests, acceptedCount, pendingCount, declinedCount] = await Promise.all([
    prisma.guest.count({ where: { eventId: event.id } }),
    prisma.guest.count({ where: { eventId: event.id, rsvpStatus: 'accepted' } }),
    prisma.guest.count({ where: { eventId: event.id, rsvpStatus: 'pending' } }),
    prisma.guest.count({ where: { eventId: event.id, rsvpStatus: 'declined' } }),
  ])

  const steps: EventStepInfoDTO[] = await Promise.all(
    event.steps.map(async (step): Promise<EventStepInfoDTO> => ({
      id: step.step,
      label: step.label,
      date: step.date.toISOString().slice(0, 10),
      time: step.time,
      address: step.address,
      guestCount: await prisma.guest.count({
        where: { eventId: event.id, steps: { has: step.step } },
      }),
    }))
  )

  return {
    id: event.id,
    name: event.name,
    type: event.type,
    date: event.date.toISOString().slice(0, 10),
    venue: event.venue,
    coupleNames: event.coupleNames ?? undefined,
    coverImageUrl: event.coverImageUrl ?? undefined,
    steps,
    totalGuests,
    acceptedCount,
    pendingCount,
    declinedCount,
    token: event.token,
  }
}

type TableWithGuests = SeatingTable & { guests: Guest[] }

export function toTableDTO(table: TableWithGuests): SeatingTableDTO {
  return {
    id: table.id,
    name: table.name,
    capacity: table.capacity,
    guests: table.guests.map((g) => g.id),
    shape: (table.shape as 'round' | 'rectangular' | null) ?? undefined,
    position:
      table.positionX != null && table.positionY != null
        ? { x: table.positionX, y: table.positionY }
        : undefined,
  }
}

type PollOptionWithVotes = PollOption & { votes: (PollVote & { guest: Guest })[] }
type PollWithOptions = Poll & { options: PollOptionWithVotes[] }
type MessageWithPoll = Message & { poll: PollWithOptions | null }

export function toPollDTO(poll: PollWithOptions): PollDTO {
  const totalResponses = new Set(poll.options.flatMap((o) => o.votes.map((v) => v.guestId))).size

  return {
    id: poll.id,
    question: poll.question,
    isAnonymous: poll.isAnonymous,
    totalResponses,
    options: poll.options.map((o) => ({
      id: o.id,
      text: o.text,
      count: o.votes.length,
      voters: poll.isAnonymous
        ? undefined
        : o.votes.map((v) => `${v.guest.firstName} ${v.guest.lastName}`),
    })),
  }
}

export function toMessageDTO(message: MessageWithPoll): MessageDTO {
  return {
    id: message.id,
    type: message.type,
    content: message.content,
    sentAt: message.sentAt?.toISOString() ?? null,
    recipientCount: message.recipientCount,
    steps: message.steps.length ? message.steps : undefined,
    scheduledAt: message.scheduledAt?.toISOString() ?? undefined,
    poll: message.poll ? toPollDTO(message.poll) : undefined,
  }
}

type PhotoWithGuest = Photo & { guest: Guest }

export function toPhotoDTO(photo: PhotoWithGuest): PhotoDTO {
  return {
    id: photo.id,
    url: photo.url,
    thumbnailUrl: photo.thumbnailUrl,
    guestId: photo.guestId,
    guestName: `${photo.guest.firstName} ${photo.guest.lastName}`,
    uploadedAt: photo.uploadedAt.toISOString(),
    approved: photo.approved,
    width: photo.width,
    height: photo.height,
  }
}

type GiftWithReservation = GiftItem & { reservedByGuest?: Guest | null }

export function toGiftDTO(gift: GiftWithReservation): GiftItemDTO {
  return {
    id: gift.id,
    name: gift.name,
    description: gift.description,
    imageUrl: gift.imageUrl,
    status: gift.status,
    price: gift.price ?? undefined,
    reservedBy:
      gift.reservedByName ??
      (gift.reservedByGuest ? `${gift.reservedByGuest.firstName} ${gift.reservedByGuest.lastName}` : undefined),
    reservedAt: gift.reservedAt?.toISOString() ?? undefined,
    link: gift.link ?? undefined,
  }
}

type KittyWithContributors = KittyGoal & { contributors: KittyContributor[] }

export function toKittyDTO(kitty: KittyWithContributors): KittyGoalDTO {
  return {
    id: kitty.id,
    name: kitty.name,
    description: kitty.description,
    imageUrl: kitty.imageUrl ?? undefined,
    targetAmount: kitty.targetAmount,
    currentAmount: kitty.currentAmount,
    isActive: kitty.isActive,
    createdAt: kitty.createdAt.toISOString(),
    contributors: kitty.contributors.map((c) => ({
      id: c.id,
      name: c.name,
      amount: c.amount,
      contributedAt: c.contributedAt.toISOString(),
      message: c.message ?? undefined,
      avatarColor: c.avatarColor ?? undefined,
    })),
  }
}

export function toSettingsDTO(settings: EventSettings): EventSettingsDTO {
  return {
    notifEmail: settings.notifEmail,
    notifSMS: settings.notifSms,
    notifRSVP: settings.notifRsvp,
    notifPhoto: settings.notifPhoto,
    notifGift: settings.notifGift,
    photoApproval: settings.photoApproval,
    publicAlbum: settings.publicAlbum,
    showGuestList: settings.showGuestList,
    language: settings.language,
    theme: settings.theme,
    guestLimit: settings.guestLimit ?? undefined,
  }
}

export function toNotificationDTO(notification: Notification): NotificationDTO {
  return {
    id: notification.id,
    type: notification.type,
    title: notification.title,
    body: notification.body,
    read: notification.read,
    createdAt: notification.createdAt.toISOString(),
  }
}

type ActivityWithGuest = ActivityLog & { guest: Guest }

export function toActivityDTO(activity: ActivityWithGuest): ActivityItemDTO {
  return {
    id: activity.id,
    guestName: `${activity.guest.firstName} ${activity.guest.lastName}`,
    guestId: activity.guestId,
    action: activity.action,
    timestamp: activity.timestamp.toISOString(),
    avatarColor: activity.guest.avatarColor ?? '#C9748F',
  }
}
