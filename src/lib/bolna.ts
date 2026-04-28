const BOLNA_BASE = "https://api.bolna.dev"

export async function triggerBolnaCall(params: {
  agentId:    string
  toPhone:    string
  repName:    string
}): Promise<{ callId: string } | null> {
  const { agentId, toPhone, repName } = params

  try {
    const res = await fetch(`${BOLNA_BASE}/call`, {
      method: "POST",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `Bearer ${process.env.BOLNA_API_KEY}`,
      },
      body: JSON.stringify({
        agent_id:           agentId,
        recipient_phone_no: toPhone,
        user_data: {
          rep_name: repName,
        },
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error("[bolna] trigger failed:", err)
      return null
    }

    const data = await res.json()
    return { callId: data.call_id ?? data.id }

  } catch (err) {
    console.error("[bolna] network error:", err)
    return null
  }
}   