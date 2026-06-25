import { createClient } from '@supabase/supabase-js'

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

const supabase = createClient(supabaseUrl, supabaseServiceKey)

function isSameDayMonth(birthDate: string, targetDate: Date): boolean {
  const birthMonth = parseInt(birthDate.substring(5, 7), 10)
  const birthDay = parseInt(birthDate.substring(8, 10), 10)
  return birthMonth === targetDate.getUTCMonth() + 1 && birthDay === targetDate.getUTCDate()
}

export default {
  async fetch(_request: Request): Promise<Response> {
    try {
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, notification_lead_days')

      if (profileError) {
        console.error('Failed to fetch profiles:', profileError.message)
        return new Response('Internal Server Error', { status: 500 })
      }

      const today = new Date()
      const todayUtc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
      const processed: Array<{ owner_id: string; contact_id: string; lead_day: number }> = []

      for (const profile of profiles ?? []) {
        const leadDays: number[] = profile.notification_lead_days ?? [11, 5, 1]

        for (const leadDay of leadDays) {
          const targetDate = new Date(todayUtc + leadDay * 86400000)

          const { data: contacts, error: contactsError } = await supabase
            .from('contacts')
            .select('id, full_name, birth_date')
            .eq('owner_id', profile.id)

          if (contactsError) {
            console.error(`Failed to fetch contacts for profile ${profile.id}:`, contactsError.message)
            continue
          }

          for (const contact of contacts ?? []) {
            if (!isSameDayMonth(contact.birth_date, targetDate)) {
              continue
            }

            processed.push({ owner_id: profile.id, contact_id: contact.id, lead_day: leadDay })
          }
        }
      }

      for (const item of processed) {
        const { error: insertError } = await supabase
          .from('notifications_log')
          .insert({
            owner_id: item.owner_id,
            contact_id: item.contact_id,
            type: 'birthday_reminder',
            lead_days: item.lead_day,
          })

        if (insertError) {
          if (insertError.code === '23505') {
            continue
          }
          console.error(`Failed to log notification for contact ${item.contact_id}:`, insertError.message)
          continue
        }

        console.log(
          `Birthday reminder scheduled for contact ${item.contact_id} (${item.lead_day} days before)`,
        )
      }

      return new Response('OK', { status: 200 })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      console.error('Unexpected error:', message)
      return new Response('Internal Server Error', { status: 500 })
    }
  },
}
