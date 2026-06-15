import {
  PrismaClient,
  RsvpStatus,
  EventStepType,
  EventType,
  MessageType,
  GiftStatus,
  ActivityAction,
  NotificationType,
} from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const DEMO_EMAIL = 'organisateur@fairepart.fr'
const DEMO_PASSWORD = 'password123'

interface GuestSeed {
  key: string
  firstName: string
  lastName: string
  email: string
  phone: string
  rsvpStatus: RsvpStatus
  steps: EventStepType[]
  familyGroup?: string
  avatarColor?: string
  respondedAt?: string
  dietaryRestrictions?: string
}

const guestSeeds: GuestSeed[] = [
  {
    key: 'g001',
    firstName: 'Marie',
    lastName: 'Dupont',
    email: 'marie.dupont@email.fr',
    phone: '+33 6 12 34 56 78',
    rsvpStatus: RsvpStatus.accepted,
    steps: [EventStepType.mairie, EventStepType.ceremonie, EventStepType.reception, EventStepType.soiree],
    familyGroup: 'Famille Dupont',
    avatarColor: '#C9748F',
    respondedAt: '2026-05-15T10:30:00',
    dietaryRestrictions: 'Végétarien',
  },
  {
    key: 'g002',
    firstName: 'Pierre',
    lastName: 'Martin',
    email: 'pierre.martin@email.fr',
    phone: '+33 6 23 45 67 89',
    rsvpStatus: RsvpStatus.accepted,
    steps: [EventStepType.ceremonie, EventStepType.reception, EventStepType.soiree],
    familyGroup: 'Famille Martin',
    avatarColor: '#2563EB',
    respondedAt: '2026-05-20T14:15:00',
  },
  {
    key: 'g003',
    firstName: 'Sophie',
    lastName: 'Bernard',
    email: 'sophie.bernard@email.fr',
    phone: '+33 6 34 56 78 90',
    rsvpStatus: RsvpStatus.accepted,
    steps: [EventStepType.mairie, EventStepType.ceremonie, EventStepType.reception],
    familyGroup: 'Famille Bernard',
    avatarColor: '#059669',
    respondedAt: '2026-05-18T09:00:00',
  },
  {
    key: 'g004',
    firstName: 'Lucas',
    lastName: 'Lefebvre',
    email: 'lucas.lefebvre@email.fr',
    phone: '+33 6 45 67 89 01',
    rsvpStatus: RsvpStatus.pending,
    steps: [EventStepType.ceremonie, EventStepType.reception],
    familyGroup: 'Famille Lefebvre',
    avatarColor: '#7C3AED',
  },
  {
    key: 'g005',
    firstName: 'Emma',
    lastName: 'Rousseau',
    email: 'emma.rousseau@email.fr',
    phone: '+33 6 56 78 90 12',
    rsvpStatus: RsvpStatus.pending,
    steps: [EventStepType.ceremonie, EventStepType.reception, EventStepType.soiree],
    avatarColor: '#D97706',
  },
  {
    key: 'g006',
    firstName: 'Hugo',
    lastName: 'Moreau',
    email: 'hugo.moreau@email.fr',
    phone: '+33 6 67 89 01 23',
    rsvpStatus: RsvpStatus.declined,
    steps: [],
    familyGroup: 'Famille Moreau',
    avatarColor: '#DC2626',
    respondedAt: '2026-05-22T16:45:00',
  },
  {
    key: 'g007',
    firstName: 'Camille',
    lastName: 'Simon',
    email: 'camille.simon@email.fr',
    phone: '+33 6 78 90 12 34',
    rsvpStatus: RsvpStatus.accepted,
    steps: [EventStepType.ceremonie, EventStepType.reception, EventStepType.soiree],
    avatarColor: '#9333EA',
    respondedAt: '2026-05-25T11:00:00',
    dietaryRestrictions: 'Sans gluten',
  },
  {
    key: 'g008',
    firstName: 'Antoine',
    lastName: 'Laurent',
    email: 'antoine.laurent@email.fr',
    phone: '+33 6 89 01 23 45',
    rsvpStatus: RsvpStatus.pending,
    steps: [EventStepType.soiree],
    avatarColor: '#0891B2',
  },
  {
    key: 'g009',
    firstName: 'Julie',
    lastName: 'Michel',
    email: 'julie.michel@email.fr',
    phone: '+33 6 90 12 34 56',
    rsvpStatus: RsvpStatus.accepted,
    steps: [EventStepType.mairie, EventStepType.ceremonie, EventStepType.reception, EventStepType.soiree],
    familyGroup: 'Famille Michel',
    avatarColor: '#16A34A',
    respondedAt: '2026-05-28T08:30:00',
  },
  {
    key: 'g010',
    firstName: 'Nicolas',
    lastName: 'Petit',
    email: 'nicolas.petit@email.fr',
    phone: '+33 6 01 23 45 67',
    rsvpStatus: RsvpStatus.declined,
    steps: [],
    avatarColor: '#C9748F',
    respondedAt: '2026-05-30T13:20:00',
  },
]

async function main() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10)

  const user = await prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: { phone: '+33 6 12 34 56 78' },
    create: { email: DEMO_EMAIL, name: 'Sophie & Thomas', passwordHash, phone: '+33 6 12 34 56 78' },
  })

  // Re-seeding: wipe this user's events (cascades to all nested data).
  await prisma.event.deleteMany({ where: { ownerId: user.id } })

  const event = await prisma.event.create({
    data: {
      name: 'Mariage Sophie & Thomas',
      type: EventType.mariage,
      date: new Date('2026-09-12'),
      venue: 'Château de Versailles Gardens',
      coupleNames: 'Sophie & Thomas',
      coverImageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1280',
      token: 'inv_abc123def456',
      ownerId: user.id,
      steps: {
        create: [
          { step: EventStepType.mairie, label: 'Mairie', date: new Date('2026-09-12'), time: '10:00', address: '1 Place de la Mairie, Versailles' },
          { step: EventStepType.ceremonie, label: 'Cérémonie laïque', date: new Date('2026-09-12'), time: '14:00', address: 'Château de Versailles, Orangerie' },
          { step: EventStepType.reception, label: 'Réception', date: new Date('2026-09-12'), time: '17:00', address: 'Château de Versailles, Grande Galerie' },
          { step: EventStepType.soiree, label: 'Soirée', date: new Date('2026-09-12'), time: '20:00', address: 'Château de Versailles, Jardins' },
        ],
      },
    },
  })

  await prisma.eventSettings.create({ data: { eventId: event.id, guestLimit: 300 } })

  // ─── Guests ─────────────────────────────────────────────

  const guestMap: Record<string, string> = {}

  for (const g of guestSeeds) {
    const created = await prisma.guest.create({
      data: {
        firstName: g.firstName,
        lastName: g.lastName,
        email: g.email,
        phone: g.phone,
        rsvpStatus: g.rsvpStatus,
        steps: g.steps,
        familyGroup: g.familyGroup,
        avatarColor: g.avatarColor,
        respondedAt: g.respondedAt ? new Date(g.respondedAt) : null,
        dietaryRestrictions: g.dietaryRestrictions,
        eventId: event.id,
      },
    })
    guestMap[g.key] = created.id
  }

  // ─── Seating tables ─────────────────────────────────────

  const tableSeeds = [
    { name: "Table d'honneur", capacity: 10, shape: 'rectangular', guests: ['g001', 'g002', 'g003'] },
    { name: 'Table des parents', capacity: 8, shape: 'round', guests: ['g007', 'g009'] },
    { name: 'Table des amis', capacity: 8, shape: 'round', guests: ['g004', 'g005'] },
    { name: 'Table champagne', capacity: 6, shape: 'round', guests: ['g008'] },
  ]

  for (const t of tableSeeds) {
    const table = await prisma.seatingTable.create({
      data: { name: t.name, capacity: t.capacity, shape: t.shape, eventId: event.id },
    })
    await prisma.guest.updateMany({
      where: { id: { in: t.guests.map((k) => guestMap[k]) } },
      data: { tableId: table.id },
    })
  }

  // ─── Messages & polls ───────────────────────────────────

  await prisma.message.create({
    data: {
      type: MessageType.message,
      content:
        'Chers invités, nous sommes ravis de vous confirmer que notre mariage aura bien lieu le 12 septembre 2026 au Château de Versailles. Nous vous attendons avec impatience !',
      sentAt: new Date('2026-05-01T10:00:00'),
      recipientCount: guestSeeds.length,
      eventId: event.id,
    },
  })

  const dietaryMessage = await prisma.message.create({
    data: {
      type: MessageType.sondage,
      content: 'Sondage : Régimes alimentaires',
      sentAt: new Date('2026-05-05T14:00:00'),
      recipientCount: guestSeeds.length,
      eventId: event.id,
      poll: {
        create: {
          question: 'Avez-vous des restrictions alimentaires ?',
          isAnonymous: false,
          options: {
            create: [
              { text: 'Aucune restriction' },
              { text: 'Végétarien' },
              { text: 'Vegan' },
              { text: 'Sans gluten' },
            ],
          },
        },
      },
    },
    include: { poll: { include: { options: true } } },
  })

  const dietaryOptionId = (text: string) =>
    dietaryMessage.poll!.options.find((o) => o.text === text)!.id

  const dietaryVotes: Array<[string, string]> = [
    ['g001', 'Végétarien'],
    ['g002', 'Aucune restriction'],
    ['g003', 'Aucune restriction'],
    ['g004', 'Aucune restriction'],
    ['g005', 'Vegan'],
    ['g007', 'Sans gluten'],
    ['g009', 'Aucune restriction'],
  ]

  for (const [guestKey, optionText] of dietaryVotes) {
    await prisma.pollVote.create({
      data: { pollId: dietaryMessage.poll!.id, optionId: dietaryOptionId(optionText), guestId: guestMap[guestKey] },
    })
  }

  const overnightMessage = await prisma.message.create({
    data: {
      type: MessageType.sondage,
      content: 'Sondage : Nuit sur place',
      sentAt: new Date('2026-05-10T09:00:00'),
      recipientCount: guestSeeds.length,
      eventId: event.id,
      poll: {
        create: {
          question: 'Souhaitez-vous dormir sur place après la soirée ?',
          isAnonymous: true,
          options: {
            create: [{ text: 'Oui, réservez-moi une chambre' }, { text: 'Non, je rentre chez moi' }],
          },
        },
      },
    },
    include: { poll: { include: { options: true } } },
  })

  const overnightOptionId = (text: string) =>
    overnightMessage.poll!.options.find((o) => o.text === text)!.id

  const overnightVotes: Array<[string, string]> = [
    ['g001', 'Oui, réservez-moi une chambre'],
    ['g002', 'Non, je rentre chez moi'],
    ['g005', 'Oui, réservez-moi une chambre'],
    ['g007', 'Non, je rentre chez moi'],
    ['g008', 'Oui, réservez-moi une chambre'],
    ['g009', 'Non, je rentre chez moi'],
  ]

  for (const [guestKey, optionText] of overnightVotes) {
    await prisma.pollVote.create({
      data: { pollId: overnightMessage.poll!.id, optionId: overnightOptionId(optionText), guestId: guestMap[guestKey] },
    })
  }

  await prisma.message.create({
    data: {
      type: MessageType.message,
      content: "Rappel : N'oubliez pas de confirmer votre présence avant le 1er juillet 2026. Merci !",
      sentAt: new Date('2026-05-20T08:00:00'),
      recipientCount: guestSeeds.length,
      eventId: event.id,
    },
  })

  const mairieGuestCount = guestSeeds.filter((g) => g.steps.includes(EventStepType.mairie)).length

  await prisma.message.create({
    data: {
      type: MessageType.message,
      content:
        "Pour ceux qui participent à la cérémonie civile : merci d'être présents à 9h30 devant la mairie pour une photo de groupe.",
      sentAt: new Date('2026-05-25T16:00:00'),
      recipientCount: mairieGuestCount,
      steps: [EventStepType.mairie],
      eventId: event.id,
    },
  })

  // ─── Photos ─────────────────────────────────────────────

  const photoSeeds = [
    { guest: 'g001', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800', thumbnailUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400', uploadedAt: '2026-05-15T12:00:00', approved: true, width: 1600, height: 1067 },
    { guest: 'g002', url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800', thumbnailUrl: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400', uploadedAt: '2026-05-16T10:30:00', approved: true, width: 1600, height: 1200 },
    { guest: 'g003', url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800', thumbnailUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400', uploadedAt: '2026-05-17T15:45:00', approved: true, width: 1067, height: 1600 },
    { guest: 'g007', url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800', thumbnailUrl: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400', uploadedAt: '2026-05-18T09:15:00', approved: true, width: 1600, height: 1067 },
    { guest: 'g009', url: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=800', thumbnailUrl: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=400', uploadedAt: '2026-05-19T14:00:00', approved: true, width: 1600, height: 1200 },
    { guest: 'g001', url: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800', thumbnailUrl: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=400', uploadedAt: '2026-05-20T11:30:00', approved: true, width: 1067, height: 1600 },
    { guest: 'g002', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800', thumbnailUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400', uploadedAt: '2026-05-21T16:20:00', approved: false, width: 1600, height: 1067 },
    { guest: 'g007', url: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800', thumbnailUrl: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=400', uploadedAt: '2026-05-22T08:45:00', approved: true, width: 1600, height: 1200 },
    { guest: 'g003', url: 'https://images.unsplash.com/photo-1550005809-91ad75fb315f?w=800', thumbnailUrl: 'https://images.unsplash.com/photo-1550005809-91ad75fb315f?w=400', uploadedAt: '2026-05-23T13:10:00', approved: true, width: 800, height: 1200 },
    { guest: 'g009', url: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800', thumbnailUrl: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=400', uploadedAt: '2026-05-24T10:00:00', approved: false, width: 1200, height: 800 },
    { guest: 'g001', url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800', thumbnailUrl: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400', uploadedAt: '2026-05-25T15:30:00', approved: true, width: 1600, height: 1067 },
    { guest: 'g007', url: 'https://images.unsplash.com/photo-1600803907087-f56d462fd26b?w=800', thumbnailUrl: 'https://images.unsplash.com/photo-1600803907087-f56d462fd26b?w=400', uploadedAt: '2026-05-26T09:45:00', approved: true, width: 1200, height: 1600 },
  ]

  for (const p of photoSeeds) {
    await prisma.photo.create({
      data: {
        url: p.url,
        thumbnailUrl: p.thumbnailUrl,
        width: p.width,
        height: p.height,
        approved: p.approved,
        uploadedAt: new Date(p.uploadedAt),
        guestId: guestMap[p.guest],
        eventId: event.id,
      },
    })
  }

  // ─── Gifts ──────────────────────────────────────────────

  const giftSeeds = [
    { name: 'Batterie de cuisine Le Creuset', description: 'Ensemble 5 pièces en fonte émaillée rouge', imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400', status: GiftStatus.disponible, price: 380, link: '#' },
    { name: 'Week-end SPA à Évian', description: 'Séjour romantique 2 nuits pour 2 personnes', imageUrl: 'https://images.unsplash.com/photo-1596178060671-7a80dc8059ea?w=400', status: GiftStatus.reserve, price: 450, link: '#', reservedByName: 'Marie D.', reservedByGuest: 'g001', reservedAt: '2026-05-10T10:00:00' },
    { name: 'Robot pâtissier KitchenAid', description: 'Modèle Artisan 6.9L couleur pivoine', imageUrl: 'https://images.unsplash.com/photo-1586511925558-a4134d4c0f64?w=400', status: GiftStatus.offert, price: 650, link: '#', reservedByName: 'Pierre M.', reservedByGuest: 'g002', reservedAt: '2026-05-12T14:00:00' },
    { name: 'Abonnement Netflix 2 ans', description: 'Offre Premium en Ultra HD', imageUrl: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=400', status: GiftStatus.disponible, price: 360, link: '#' },
    { name: 'Cours de cuisine gastronomique', description: 'Atelier pour 2 chez un Chef étoilé parisien', imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400', status: GiftStatus.reserve, price: 280, link: '#', reservedByName: 'Sophie B.', reservedByGuest: 'g003', reservedAt: '2026-05-18T11:00:00' },
    { name: 'Photophore cristal Baccarat', description: 'Set de 2 photophores en cristal soufflé', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', status: GiftStatus.offert, price: 220, link: '#', reservedByName: 'Camille S.', reservedByGuest: 'g007', reservedAt: '2026-05-20T16:00:00' },
  ]

  for (const g of giftSeeds) {
    await prisma.giftItem.create({
      data: {
        name: g.name,
        description: g.description,
        imageUrl: g.imageUrl,
        status: g.status,
        price: g.price,
        link: g.link,
        reservedByName: g.reservedByName,
        reservedByGuestId: g.reservedByGuest ? guestMap[g.reservedByGuest] : undefined,
        reservedAt: g.reservedAt ? new Date(g.reservedAt) : undefined,
        eventId: event.id,
      },
    })
  }

  // ─── Kitties ────────────────────────────────────────────

  await prisma.kittyGoal.create({
    data: {
      name: 'Voyage de noces à Santorini',
      description: 'Aidez-nous à financer notre lune de miel de rêve en Grèce !',
      imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400',
      targetAmount: 3000,
      currentAmount: 1850,
      isActive: true,
      createdAt: new Date('2026-04-01T10:00:00'),
      eventId: event.id,
      contributors: {
        create: [
          { name: 'Marie D.', amount: 200, contributedAt: new Date('2026-04-15T10:00:00'), message: 'Profitez bien !', avatarColor: '#C9748F', guestId: guestMap['g001'] },
          { name: 'Pierre M.', amount: 150, contributedAt: new Date('2026-04-20T14:00:00'), avatarColor: '#2563EB', guestId: guestMap['g002'] },
          { name: 'Sophie B.', amount: 300, contributedAt: new Date('2026-04-25T09:00:00'), message: 'Bon voyage !', avatarColor: '#059669', guestId: guestMap['g003'] },
          { name: 'Camille S.', amount: 250, contributedAt: new Date('2026-05-01T11:00:00'), avatarColor: '#9333EA', guestId: guestMap['g007'] },
          { name: 'Julie M.', amount: 400, contributedAt: new Date('2026-05-05T16:00:00'), message: 'Avec tout notre amour !', avatarColor: '#16A34A', guestId: guestMap['g009'] },
          { name: 'Antoine L.', amount: 100, contributedAt: new Date('2026-05-10T08:00:00'), avatarColor: '#0891B2', guestId: guestMap['g008'] },
          { name: 'Emma R.', amount: 350, contributedAt: new Date('2026-05-15T13:00:00'), avatarColor: '#D97706', guestId: guestMap['g005'] },
          { name: 'Lucas L.', amount: 100, contributedAt: new Date('2026-05-20T10:00:00'), avatarColor: '#7C3AED', guestId: guestMap['g004'] },
        ],
      },
    },
  })

  await prisma.kittyGoal.create({
    data: {
      name: 'Appartement de nos rêves',
      description: 'Participez à notre apport pour notre premier appartement ensemble.',
      imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400',
      targetAmount: 5000,
      currentAmount: 2200,
      isActive: true,
      createdAt: new Date('2026-04-15T10:00:00'),
      eventId: event.id,
      contributors: {
        create: [
          { name: 'Famille Dupont', amount: 500, contributedAt: new Date('2026-05-01T10:00:00'), message: 'Pour votre nouveau chez-vous !', avatarColor: '#C9748F' },
          { name: 'Famille Martin', amount: 800, contributedAt: new Date('2026-05-05T14:00:00'), avatarColor: '#2563EB' },
          { name: 'Pierre M.', amount: 300, contributedAt: new Date('2026-05-10T09:00:00'), avatarColor: '#059669', guestId: guestMap['g002'] },
          { name: 'Camille S.', amount: 600, contributedAt: new Date('2026-05-15T11:00:00'), avatarColor: '#9333EA', guestId: guestMap['g007'] },
        ],
      },
    },
  })

  // ─── Activity log ───────────────────────────────────────

  for (const g of guestSeeds) {
    if (g.rsvpStatus === RsvpStatus.pending || !g.respondedAt) continue

    await prisma.activityLog.create({
      data: {
        eventId: event.id,
        guestId: guestMap[g.key],
        action: g.rsvpStatus === RsvpStatus.accepted ? ActivityAction.accepted : ActivityAction.declined,
        timestamp: new Date(g.respondedAt),
      },
    })
  }

  await prisma.activityLog.create({
    data: { eventId: event.id, guestId: guestMap['g008'], action: ActivityAction.viewed, timestamp: new Date('2026-06-04T14:20:00') },
  })
  await prisma.activityLog.create({
    data: { eventId: event.id, guestId: guestMap['g005'], action: ActivityAction.pending, timestamp: new Date('2026-06-03T11:00:00') },
  })

  // ─── Notifications ──────────────────────────────────────

  const notificationSeeds = [
    { type: NotificationType.rsvp, title: 'Nouvelle réponse RSVP', body: 'Marie Dupont a accepté votre invitation', read: false, createdAt: '2026-06-05T10:30:00' },
    { type: NotificationType.gift, title: 'Cadeau réservé', body: 'Pierre M. a réservé "Week-end SPA à Évian"', read: false, createdAt: '2026-06-05T09:00:00' },
    { type: NotificationType.photo, title: 'Nouvelles photos', body: "3 nouvelles photos en attente d'approbation", read: true, createdAt: '2026-06-04T15:00:00' },
    { type: NotificationType.rsvp, title: 'Refus RSVP', body: 'Nicolas Petit ne pourra pas assister', read: true, createdAt: '2026-06-04T13:20:00' },
  ]

  for (const n of notificationSeeds) {
    await prisma.notification.create({
      data: {
        eventId: event.id,
        type: n.type,
        title: n.title,
        body: n.body,
        read: n.read,
        createdAt: new Date(n.createdAt),
      },
    })
  }

  console.log('Seed complete.')
  console.log('─────────────────────────────────────────')
  console.log(`Demo login:  ${DEMO_EMAIL} / ${DEMO_PASSWORD}`)
  console.log(`Invite link: /invite/${event.token}`)
  console.log('─────────────────────────────────────────')
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
