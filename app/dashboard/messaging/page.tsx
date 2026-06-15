'use client'

import { useEffect, useState } from 'react'
import { DashboardTopbar } from '@/components/layout/DashboardTopbar'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { Toggle } from '@/components/ui/Toggle'
import { Textarea } from '@/components/ui/Input'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { SkeletonCard } from '@/components/ui/Skeleton'
import { useEvent } from '@/lib/hooks/useEvent'
import { listMessages, createMessage } from '@/lib/api/messages'
import { ApiError } from '@/lib/api/client'
import type { Message, Poll } from '@/lib/types'
import { MessageSquare, Plus, BarChart2, Users, Send, X, BarChart3 } from 'lucide-react'
import { formatDate } from '@/lib/utils/formatDate'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils/cn'

function PollResultsModal({ poll, onClose }: { poll: Poll; onClose: () => void }) {
  return (
    <Modal open onClose={onClose} title="Résultats du sondage" size="md">
      <div className="space-y-4">
        <p className="font-semibold text-gray-900">{poll.question}</p>
        <p className="text-sm text-gray-500">{poll.totalResponses} réponse(s)</p>
        <div className="space-y-3">
          {poll.options.map(opt => (
            <div key={opt.id}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700">{opt.text}</span>
                <span className="text-gray-500">{opt.count} ({poll.totalResponses ? Math.round((opt.count / poll.totalResponses) * 100) : 0}%)</span>
              </div>
              <ProgressBar value={opt.count} max={poll.totalResponses} color="rose" size="md" />
            </div>
          ))}
        </div>
      </div>
    </Modal>
  )
}

function NewMessageModal({ totalGuests, onClose, onSend }: { totalGuests: number; onClose: () => void; onSend: (m: { type: 'message' | 'sondage'; content: string; poll?: { question: string; isAnonymous?: boolean; options: string[] } }) => Promise<void> }) {
  const [type, setType] = useState<'message' | 'sondage'>('message')
  const [content, setContent] = useState('')
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState(['', ''])
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [loading, setLoading] = useState(false)

  const addOption = () => setOptions([...options, ''])
  const removeOption = (i: number) => setOptions(options.filter((_, idx) => idx !== i))
  const setOption = (i: number, v: string) => setOptions(options.map((o, idx) => idx === i ? v : o))

  const handleSend = async () => {
    setLoading(true)
    try {
      if (type === 'message') {
        await onSend({ type, content })
        toast.success('Message envoyé !')
      } else {
        await onSend({ type, content: question, poll: { question, isAnonymous, options: options.filter(o => o.trim()) } })
        toast.success('Sondage envoyé !')
      }
      onClose()
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={type === 'message' ? 'Nouveau message' : 'Nouveau sondage'}
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Annuler</Button>
          <Button loading={loading} rightIcon={<Send className="w-4 h-4" />} onClick={handleSend}>
            Envoyer maintenant
          </Button>
        </>
      }
    >
      {/* Type Toggle */}
      <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-xl">
        {(['message', 'sondage'] as const).map(t => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={cn('flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200', type === t ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700')}
          >
            {t === 'message' ? '💬 Message' : '📊 Sondage'}
          </button>
        ))}
      </div>

      {type === 'message' ? (
        <div className="space-y-4">
          <Textarea
            label="Message"
            placeholder="Rédigez votre message à tous les invités..."
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={5}
            maxLength={500}
            characterCount={content.length}
          />
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Users className="w-4 h-4" />
            <span>Envoyé à tous les {totalGuests} invités</span>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <Textarea
            label="Question"
            placeholder="Posez votre question..."
            value={question}
            onChange={e => setQuestion(e.target.value)}
            rows={2}
          />
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Options de réponse</p>
            <div className="space-y-2">
              {options.map((opt, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                    placeholder={`Option ${i + 1}`}
                    value={opt}
                    onChange={e => setOption(i, e.target.value)}
                  />
                  {options.length > 2 && (
                    <button onClick={() => removeOption(i)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button onClick={addOption} className="flex items-center gap-1 text-sm text-rose-500 hover:text-rose-600 font-medium">
                <Plus className="w-4 h-4" /> Ajouter une option
              </button>
            </div>
          </div>
          <Toggle checked={isAnonymous} onChange={setIsAnonymous} label="Réponses anonymes" />
        </div>
      )}
    </Modal>
  )
}

export default function MessagingPage() {
  const { event, eventId } = useEvent()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewModal, setShowNewModal] = useState(false)
  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null)

  useEffect(() => {
    if (!eventId) return
    setLoading(true)
    listMessages(eventId).then(setMessages).finally(() => setLoading(false))
  }, [eventId])

  const handleSend = async (m: { type: 'message' | 'sondage'; content: string; poll?: { question: string; isAnonymous?: boolean; options: string[] } }) => {
    const created = await createMessage(eventId!, m)
    setMessages(prev => [created, ...prev])
  }

  return (
    <>
      <DashboardTopbar title="Messagerie" subtitle="Envoyez des messages groupés à vos invités" />
      <div className="p-4 lg:p-8 max-w-5xl mx-auto space-y-6">

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Badge color="blue" size="md">{messages.filter(m => m.type === 'message').length} messages</Badge>
            <Badge color="purple" size="md">{messages.filter(m => m.type === 'sondage').length} sondages</Badge>
          </div>
          <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowNewModal(true)}>
            Nouveau message
          </Button>
        </div>

        {loading ? (
          <div className="space-y-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map(msg => (
              <div key={msg.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-3 items-start flex-1">
                    <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', msg.type === 'sondage' ? 'bg-purple-100' : 'bg-blue-100')}>
                      {msg.type === 'sondage' ? <BarChart2 className="w-5 h-5 text-purple-600" /> : <MessageSquare className="w-5 h-5 text-blue-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <Badge color={msg.type === 'sondage' ? 'purple' : 'blue'} size="sm">
                          {msg.type === 'sondage' ? 'Sondage' : 'Message'}
                        </Badge>
                        <span className="text-xs text-gray-400">{formatDate(msg.sentAt)}</span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Users className="w-3 h-3" /> {msg.recipientCount} invités
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 line-clamp-2">{msg.content}</p>
                      {msg.poll && (
                        <div className="mt-3 p-3 bg-purple-50 rounded-xl">
                          <p className="text-xs font-semibold text-purple-700 mb-2">{msg.poll.totalResponses} réponses</p>
                          <div className="space-y-1.5">
                            {msg.poll.options.slice(0, 2).map(opt => (
                              <div key={opt.id} className="flex items-center gap-2">
                                <div className="flex-1 h-1.5 bg-purple-100 rounded-full overflow-hidden">
                                  <div className="h-full bg-purple-400 rounded-full" style={{ width: `${msg.poll!.totalResponses ? (opt.count / msg.poll!.totalResponses) * 100 : 0}%` }} />
                                </div>
                                <span className="text-xs text-purple-600 w-16 text-right">{opt.text}: {opt.count}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {msg.poll && (
                    <Button size="xs" variant="outlined" leftIcon={<BarChart3 className="w-3 h-3" />} onClick={() => setSelectedPoll(msg.poll!)}>
                      Résultats
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showNewModal && <NewMessageModal totalGuests={event?.totalGuests ?? 0} onClose={() => setShowNewModal(false)} onSend={handleSend} />}
      {selectedPoll && <PollResultsModal poll={selectedPoll} onClose={() => setSelectedPoll(null)} />}
    </>
  )
}
