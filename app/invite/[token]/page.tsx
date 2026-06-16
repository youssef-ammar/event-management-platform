import InvitePageClient from './InvitePageClient'

export function generateStaticParams() {
  return [{ token: '_' }]
}

export default function InvitePage({ params }: { params: { token: string } }) {
  return <InvitePageClient token={params.token} />
}
