import { createClient } from '@supabase/supabase-js'

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
const emisWebhookSecret = Deno.env.get('EMIS_WEBHOOK_SECRET') ?? ''

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 })
    }

    const authHeader = request.headers.get('Authorization')
    if (!authHeader || authHeader !== `Bearer ${emisWebhookSecret}`) {
      return new Response('Unauthorized', { status: 401 })
    }

    let body: Record<string, unknown>
    try {
      body = await request.json()
    } catch {
      return new Response('Invalid JSON body', { status: 400 })
    }

    const orderId = body.order_id as string | undefined
    const transactionId = body.transaction_id as string | undefined
    const status = body.status as string | undefined
    const amount = body.amount as number | undefined

    if (!orderId || !transactionId || !status || amount == null) {
      return new Response('Missing required fields: order_id, transaction_id, status, amount', {
        status: 400,
      })
    }

    const paymentStatus = status === 'sucesso' ? 'sucesso' : 'falhou'
    const orderStatus = status === 'sucesso' ? 'pago' : 'cancelado'

    const { data: existingPayments } = await supabase
      .from('payments')
      .select('id')
      .eq('order_id', orderId)
      .eq('provider_transaction_id', transactionId)
      .limit(1)

    if (existingPayments && existingPayments.length > 0) {
      const { error: orderError } = await supabase
        .from('orders')
        .update({ status: orderStatus })
        .eq('id', orderId)

      if (orderError) {
        console.error('Failed to update order:', orderError.message)
        return new Response(JSON.stringify({ error: orderError.message }), { status: 500 })
      }

      return new Response('OK', { status: 200 })
    }

    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        order_id: orderId,
        provider: 'emis',
        provider_transaction_id: transactionId,
        status: paymentStatus,
        amount_kz: amount,
        raw_webhook_payload: body,
      })

    if (paymentError) {
      console.error('Failed to insert payment:', paymentError.message)
      return new Response(JSON.stringify({ error: paymentError.message }), { status: 500 })
    }

    const { error: orderError } = await supabase
      .from('orders')
      .update({ status: orderStatus })
      .eq('id', orderId)

    if (orderError) {
      console.error('Failed to update order:', orderError.message)
      return new Response(JSON.stringify({ error: orderError.message }), { status: 500 })
    }

    return new Response('OK', { status: 200 })
  },
}
