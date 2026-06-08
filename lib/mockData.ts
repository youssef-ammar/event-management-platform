import type { Guest, EventStepInfo, Message, SeatingTable, Photo, GiftItem, KittyGoal, Event, ActivityItem, Notification } from './types'

export const AVATAR_COLORS = [
  '#C9748F', '#D4AF7A', '#7C3AED', '#2563EB', '#059669',
  '#DC2626', '#D97706', '#0891B2', '#9333EA', '#16A34A',
]

export const mockEvent: Event = {
  id: 'evt_001',
  name: 'Mariage Sophie & Thomas',
  type: 'mariage',
  date: '2026-09-12',
  venue: 'Château de Versailles Gardens',
  coupleNames: 'Sophie & Thomas',
  coverImageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1280',
  token: 'inv_abc123def456',
  totalGuests: 63,
  acceptedCount: 12,
  pendingCount: 45,
  declinedCount: 6,
  steps: [
    { id: 'mairie', label: 'Mairie', date: '2026-09-12', time: '10:00', address: '1 Place de la Mairie, Versailles', guestCount: 30 },
    { id: 'ceremonie', label: 'Cérémonie laïque', date: '2026-09-12', time: '14:00', address: 'Château de Versailles, Orangerie', guestCount: 63 },
    { id: 'reception', label: 'Réception', date: '2026-09-12', time: '17:00', address: 'Château de Versailles, Grande Galerie', guestCount: 63 },
    { id: 'soiree', label: 'Soirée', date: '2026-09-12', time: '20:00', address: 'Château de Versailles, Jardins', guestCount: 45 },
  ],
}

export const mockGuests: Guest[] = [
  {
    id: 'g001', firstName: 'Marie', lastName: 'Dupont', email: 'marie.dupont@email.fr',
    phone: '+33 6 12 34 56 78', rsvpStatus: 'accepted',
    steps: ['mairie', 'ceremonie', 'reception', 'soiree'], familyGroup: 'Famille Dupont',
    avatarColor: '#C9748F', respondedAt: '2026-05-15T10:30:00', dietaryRestrictions: 'Végétarien', photoCount: 8,
  },
  {
    id: 'g002', firstName: 'Pierre', lastName: 'Martin', email: 'pierre.martin@email.fr',
    phone: '+33 6 23 45 67 89', rsvpStatus: 'accepted',
    steps: ['ceremonie', 'reception', 'soiree'], familyGroup: 'Famille Martin',
    avatarColor: '#2563EB', respondedAt: '2026-05-20T14:15:00', photoCount: 12,
  },
  {
    id: 'g003', firstName: 'Sophie', lastName: 'Bernard', email: 'sophie.bernard@email.fr',
    phone: '+33 6 34 56 78 90', rsvpStatus: 'accepted',
    steps: ['mairie', 'ceremonie', 'reception'], familyGroup: 'Famille Bernard',
    avatarColor: '#059669', respondedAt: '2026-05-18T09:00:00', photoCount: 5,
  },
  {
    id: 'g004', firstName: 'Lucas', lastName: 'Lefebvre', email: 'lucas.lefebvre@email.fr',
    phone: '+33 6 45 67 89 01', rsvpStatus: 'pending',
    steps: ['ceremonie', 'reception'], familyGroup: 'Famille Lefebvre',
    avatarColor: '#7C3AED', photoCount: 0,
  },
  {
    id: 'g005', firstName: 'Emma', lastName: 'Rousseau', email: 'emma.rousseau@email.fr',
    phone: '+33 6 56 78 90 12', rsvpStatus: 'pending',
    steps: ['ceremonie', 'reception', 'soiree'],
    avatarColor: '#D97706', photoCount: 0,
  },
  {
    id: 'g006', firstName: 'Hugo', lastName: 'Moreau', email: 'hugo.moreau@email.fr',
    phone: '+33 6 67 89 01 23', rsvpStatus: 'declined',
    steps: [], familyGroup: 'Famille Moreau',
    avatarColor: '#DC2626', respondedAt: '2026-05-22T16:45:00', photoCount: 0,
  },
  {
    id: 'g007', firstName: 'Camille', lastName: 'Simon', email: 'camille.simon@email.fr',
    phone: '+33 6 78 90 12 34', rsvpStatus: 'accepted',
    steps: ['ceremonie', 'reception', 'soiree'],
    avatarColor: '#9333EA', respondedAt: '2026-05-25T11:00:00', dietaryRestrictions: 'Sans gluten', photoCount: 10,
  },
  {
    id: 'g008', firstName: 'Antoine', lastName: 'Laurent', email: 'antoine.laurent@email.fr',
    phone: '+33 6 89 01 23 45', rsvpStatus: 'pending',
    steps: ['soiree'],
    avatarColor: '#0891B2', photoCount: 0,
  },
  {
    id: 'g009', firstName: 'Julie', lastName: 'Michel', email: 'julie.michel@email.fr',
    phone: '+33 6 90 12 34 56', rsvpStatus: 'accepted',
    steps: ['mairie', 'ceremonie', 'reception', 'soiree'], familyGroup: 'Famille Michel',
    avatarColor: '#16A34A', respondedAt: '2026-05-28T08:30:00', photoCount: 7,
  },
  {
    id: 'g010', firstName: 'Nicolas', lastName: 'Petit', email: 'nicolas.petit@email.fr',
    phone: '+33 6 01 23 45 67', rsvpStatus: 'declined',
    steps: [],
    avatarColor: '#C9748F', respondedAt: '2026-05-30T13:20:00', photoCount: 0,
  },
]

export const mockMessages: Message[] = [
  {
    id: 'm001', type: 'message', recipientCount: 63,
    content: 'Chers invités, nous sommes ravis de vous confirmer que notre mariage aura bien lieu le 12 septembre 2026 au Château de Versailles. Nous vous attendons avec impatience !',
    sentAt: '2026-05-01T10:00:00',
  },
  {
    id: 'm002', type: 'sondage', recipientCount: 63,
    content: 'Sondage : Régimes alimentaires',
    sentAt: '2026-05-05T14:00:00',
    poll: {
      id: 'p001', question: 'Avez-vous des restrictions alimentaires ?', isAnonymous: false, totalResponses: 28,
      options: [
        { id: 'o1', text: 'Aucune restriction', count: 18 },
        { id: 'o2', text: 'Végétarien', count: 5 },
        { id: 'o3', text: 'Vegan', count: 2 },
        { id: 'o4', text: 'Sans gluten', count: 3 },
      ],
    },
  },
  {
    id: 'm003', type: 'sondage', recipientCount: 45,
    content: 'Sondage : Nuit sur place',
    sentAt: '2026-05-10T09:00:00',
    poll: {
      id: 'p002', question: 'Souhaitez-vous dormir sur place après la soirée ?', isAnonymous: true, totalResponses: 35,
      options: [
        { id: 'o5', text: 'Oui, réservez-moi une chambre', count: 20 },
        { id: 'o6', text: 'Non, je rentre chez moi', count: 15 },
      ],
    },
  },
  {
    id: 'm004', type: 'message', recipientCount: 63,
    content: 'Rappel : N\'oubliez pas de confirmer votre présence avant le 1er juillet 2026. Merci !',
    sentAt: '2026-05-20T08:00:00',
  },
  {
    id: 'm005', type: 'message', recipientCount: 30,
    content: 'Pour ceux qui participent à la cérémonie civile : merci d\'être présents à 9h30 devant la mairie pour une photo de groupe.',
    sentAt: '2026-05-25T16:00:00',
    steps: ['mairie'],
  },
]

export const mockTables: SeatingTable[] = [
  { id: 't001', name: "Table d'honneur", capacity: 10, guests: ['g001', 'g002', 'g003'], shape: 'rectangular' },
  { id: 't002', name: 'Table des parents', capacity: 8, guests: ['g007', 'g009'], shape: 'round' },
  { id: 't003', name: 'Table des amis', capacity: 8, guests: ['g004', 'g005'], shape: 'round' },
  { id: 't004', name: 'Table champagne', capacity: 6, guests: ['g008'], shape: 'round' },
]

export const mockPhotos: Photo[] = [
  { id: 'ph001', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800', thumbnailUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400', guestId: 'g001', guestName: 'Marie Dupont', uploadedAt: '2026-05-15T12:00:00', approved: true, width: 1600, height: 1067 },
  { id: 'ph002', url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800', thumbnailUrl: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400', guestId: 'g002', guestName: 'Pierre Martin', uploadedAt: '2026-05-16T10:30:00', approved: true, width: 1600, height: 1200 },
  { id: 'ph003', url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800', thumbnailUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400', guestId: 'g003', guestName: 'Sophie Bernard', uploadedAt: '2026-05-17T15:45:00', approved: true, width: 1067, height: 1600 },
  { id: 'ph004', url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800', thumbnailUrl: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400', guestId: 'g007', guestName: 'Camille Simon', uploadedAt: '2026-05-18T09:15:00', approved: true, width: 1600, height: 1067 },
  { id: 'ph005', url: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=800', thumbnailUrl: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=400', guestId: 'g009', guestName: 'Julie Michel', uploadedAt: '2026-05-19T14:00:00', approved: true, width: 1600, height: 1200 },
  { id: 'ph006', url: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800', thumbnailUrl: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=400', guestId: 'g001', guestName: 'Marie Dupont', uploadedAt: '2026-05-20T11:30:00', approved: true, width: 1067, height: 1600 },
  { id: 'ph007', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800', thumbnailUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400', guestId: 'g002', guestName: 'Pierre Martin', uploadedAt: '2026-05-21T16:20:00', approved: false, width: 1600, height: 1067 },
  { id: 'ph008', url: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800', thumbnailUrl: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=400', guestId: 'g007', guestName: 'Camille Simon', uploadedAt: '2026-05-22T08:45:00', approved: true, width: 1600, height: 1200 },
  { id: 'ph009', url: 'https://images.unsplash.com/photo-1550005809-91ad75fb315f?w=800', thumbnailUrl: 'https://images.unsplash.com/photo-1550005809-91ad75fb315f?w=400', guestId: 'g003', guestName: 'Sophie Bernard', uploadedAt: '2026-05-23T13:10:00', approved: true, width: 800, height: 1200 },
  { id: 'ph010', url: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800', thumbnailUrl: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=400', guestId: 'g009', guestName: 'Julie Michel', uploadedAt: '2026-05-24T10:00:00', approved: false, width: 1200, height: 800 },
  { id: 'ph011', url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800', thumbnailUrl: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400', guestId: 'g001', guestName: 'Marie Dupont', uploadedAt: '2026-05-25T15:30:00', approved: true, width: 1600, height: 1067 },
  { id: 'ph012', url: 'https://images.unsplash.com/photo-1600803907087-f56d462fd26b?w=800', thumbnailUrl: 'https://images.unsplash.com/photo-1600803907087-f56d462fd26b?w=400', guestId: 'g007', guestName: 'Camille Simon', uploadedAt: '2026-05-26T09:45:00', approved: true, width: 1200, height: 1600 },
]

export const mockGifts: GiftItem[] = [
  { id: 'gift001', name: 'Batterie de cuisine Le Creuset', description: 'Ensemble 5 pièces en fonte émaillée rouge', imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400', status: 'disponible', price: 380, link: '#' },
  { id: 'gift002', name: 'Week-end SPA à Évian', description: 'Séjour romantique 2 nuits pour 2 personnes', imageUrl: 'https://images.unsplash.com/photo-1596178060671-7a80dc8059ea?w=400', status: 'reserve', price: 450, reservedBy: 'Marie D.', reservedAt: '2026-05-10T10:00:00', link: '#' },
  { id: 'gift003', name: 'Robot pâtissier KitchenAid', description: 'Modèle Artisan 6.9L couleur pivoine', imageUrl: 'https://images.unsplash.com/photo-1586511925558-a4134d4c0f64?w=400', status: 'offert', price: 650, reservedBy: 'Pierre M.', reservedAt: '2026-05-12T14:00:00', link: '#' },
  { id: 'gift004', name: 'Abonnement Netflix 2 ans', description: 'Offre Premium en Ultra HD', imageUrl: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=400', status: 'disponible', price: 360, link: '#' },
  { id: 'gift005', name: 'Cours de cuisine gastronomique', description: 'Atelier pour 2 chez un Chef étoilé parisien', imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400', status: 'reserve', price: 280, reservedBy: 'Sophie B.', reservedAt: '2026-05-18T11:00:00', link: '#' },
  { id: 'gift006', name: 'Photophore cristal Baccarat', description: 'Set de 2 photophores en cristal soufflé', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', status: 'offert', price: 220, reservedBy: 'Camille S.', reservedAt: '2026-05-20T16:00:00', link: '#' },
]

export const mockKitties: KittyGoal[] = [
  {
    id: 'k001', name: 'Voyage de noces à Santorini', isActive: true,
    description: 'Aidez-nous à financer notre lune de miel de rêve en Grèce !',
    imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400',
    targetAmount: 3000, currentAmount: 1850, createdAt: '2026-04-01T10:00:00',
    contributors: [
      { id: 'kc1', name: 'Marie D.', amount: 200, contributedAt: '2026-04-15T10:00:00', message: 'Profitez bien !', avatarColor: '#C9748F' },
      { id: 'kc2', name: 'Pierre M.', amount: 150, contributedAt: '2026-04-20T14:00:00', avatarColor: '#2563EB' },
      { id: 'kc3', name: 'Sophie B.', amount: 300, contributedAt: '2026-04-25T09:00:00', message: 'Bon voyage !', avatarColor: '#059669' },
      { id: 'kc4', name: 'Camille S.', amount: 250, contributedAt: '2026-05-01T11:00:00', avatarColor: '#9333EA' },
      { id: 'kc5', name: 'Julie M.', amount: 400, contributedAt: '2026-05-05T16:00:00', message: 'Avec tout notre amour !', avatarColor: '#16A34A' },
      { id: 'kc6', name: 'Antoine L.', amount: 100, contributedAt: '2026-05-10T08:00:00', avatarColor: '#0891B2' },
      { id: 'kc7', name: 'Emma R.', amount: 350, contributedAt: '2026-05-15T13:00:00', avatarColor: '#D97706' },
      { id: 'kc8', name: 'Lucas L.', amount: 100, contributedAt: '2026-05-20T10:00:00', avatarColor: '#7C3AED' },
    ],
  },
  {
    id: 'k002', name: 'Appartement de nos rêves', isActive: true,
    description: 'Participez à notre apport pour notre premier appartement ensemble.',
    imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400',
    targetAmount: 5000, currentAmount: 2200, createdAt: '2026-04-15T10:00:00',
    contributors: [
      { id: 'kc9', name: 'Famille Dupont', amount: 500, contributedAt: '2026-05-01T10:00:00', message: 'Pour votre nouveau chez-vous !', avatarColor: '#C9748F' },
      { id: 'kc10', name: 'Famille Martin', amount: 800, contributedAt: '2026-05-05T14:00:00', avatarColor: '#2563EB' },
      { id: 'kc11', name: 'Pierre M.', amount: 300, contributedAt: '2026-05-10T09:00:00', avatarColor: '#059669' },
      { id: 'kc12', name: 'Camille S.', amount: 600, contributedAt: '2026-05-15T11:00:00', avatarColor: '#9333EA' },
    ],
  },
]

export const mockActivity: ActivityItem[] = [
  { id: 'a1', guestName: 'Marie Dupont', guestId: 'g001', action: 'accepted', timestamp: '2026-06-05T10:30:00', avatarColor: '#C9748F' },
  { id: 'a2', guestName: 'Nicolas Petit', guestId: 'g010', action: 'declined', timestamp: '2026-06-05T09:15:00', avatarColor: '#C9748F' },
  { id: 'a3', guestName: 'Julie Michel', guestId: 'g009', action: 'accepted', timestamp: '2026-06-04T16:45:00', avatarColor: '#16A34A' },
  { id: 'a4', guestName: 'Antoine Laurent', guestId: 'g008', action: 'viewed', timestamp: '2026-06-04T14:20:00', avatarColor: '#0891B2' },
  { id: 'a5', guestName: 'Emma Rousseau', guestId: 'g005', action: 'pending', timestamp: '2026-06-03T11:00:00', avatarColor: '#D97706' },
]

export const mockNotifications: Notification[] = [
  { id: 'n1', type: 'rsvp', title: 'Nouvelle réponse RSVP', body: 'Marie Dupont a accepté votre invitation', read: false, createdAt: '2026-06-05T10:30:00' },
  { id: 'n2', type: 'gift', title: 'Cadeau réservé', body: 'Pierre M. a réservé "Week-end SPA à Évian"', read: false, createdAt: '2026-06-05T09:00:00' },
  { id: 'n3', type: 'photo', title: 'Nouvelles photos', body: '3 nouvelles photos en attente d\'approbation', read: true, createdAt: '2026-06-04T15:00:00' },
  { id: 'n4', type: 'rsvp', title: 'Refus RSVP', body: 'Nicolas Petit ne pourra pas assister', read: true, createdAt: '2026-06-04T13:20:00' },
]

export const INVITATION_STYLES = [
  { id: 's1', name: 'Élégant Blanc', thumbnailUrl: '/images/style-1.jpg', primaryColor: '#C9748F', fontFamily: 'Playfair Display', backgroundPattern: 'floral' },
  { id: 's2', name: 'Or & Ivoire', thumbnailUrl: '/images/style-2.jpg', primaryColor: '#D4AF7A', fontFamily: 'Cormorant Garamond', backgroundPattern: 'geometric' },
  { id: 's3', name: 'Botanique', thumbnailUrl: '/images/style-3.jpg', primaryColor: '#059669', fontFamily: 'Playfair Display', backgroundPattern: 'botanical' },
  { id: 's4', name: 'Minimaliste', thumbnailUrl: '/images/style-4.jpg', primaryColor: '#1A1A2E', fontFamily: 'Inter', backgroundPattern: 'minimal' },
  { id: 's5', name: 'Rose Poudré', thumbnailUrl: '/images/style-5.jpg', primaryColor: '#E8A0B0', fontFamily: 'Cormorant Garamond', backgroundPattern: 'soft' },
  { id: 's6', name: 'Champêtre', thumbnailUrl: '/images/style-6.jpg', primaryColor: '#92400E', fontFamily: 'Playfair Display', backgroundPattern: 'rustic' },
]
