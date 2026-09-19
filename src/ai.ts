import type { Language, Scenario, UrbanBrief } from './types'

function isScenario(value: unknown): value is Scenario {
  if (!value || typeof value !== 'object') return false
  const item = value as Partial<Scenario>
  return typeof item.id === 'string' && typeof item.title === 'string' && typeof item.narrative === 'string' && Array.isArray(item.tradeoffs) && Array.isArray(item.phases) && Array.isArray(item.indicators) && Array.isArray(item.features)
}

function extractJson(text: string): unknown {
  const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
  if (match) {
    return JSON.parse(match[1])
  }
  return JSON.parse(text)
}

const systemPrompt = `You are CityMirror, an AI urban simulator. 
Generate exactly 3 urban scenarios based on the user's brief.
You MUST reply with ONLY a valid JSON object matching this schema:
{
  "scenarios": [
    {
      "id": "string",
      "title": "string",
      "subtitle": "string",
      "narrative": "string",
      "tradeoffs": ["string"],
      "phases": ["string"],
      "indicators": [{"label": "string", "value": "string", "tone": "good" | "warn" | "neutral"}],
      "features": [{"id": "string", "kind": "housing" | "park" | "school" | "station" | "mixed" | "primary-road" | "local-road", "x": number, "y": number, "width": number, "height": number, "label": "string"}],
      "score": number,
      "traffic": number,
      "costM": number,
      "greenM2": number,
      "parking": number
    }
  ]
}
Coordinates x,y and width,height are percentages 0-100.
Do not add markdown formatting or extra text outside the JSON object.`

export async function requestAiScenarios(brief: UrbanBrief, language: Language): Promise<Scenario[] | null> {
  const endpoint = import.meta.env.VITE_AI_ENDPOINT as string | undefined
  const model = import.meta.env.VITE_OLLAMA_MODEL as string | undefined || 'llama3'
  
  if (!endpoint) return null

  const isOllama = endpoint.includes('/api/chat') || endpoint.includes('/api/generate')
  
  const userPrompt = `Language: ${language}. Brief: City: ${brief.city}, Population: ${brief.population}, Area: ${brief.areaHa} ha, Priorities: ${brief.priorities.join(', ')}.`

  const requestBody: Record<string, unknown> = isOllama
    ? {
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        stream: false,
        format: 'json'
      }
    : { brief, language, responseFormat: 'citymirror-v1', systemPrompt }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(requestBody),
  })

  if (!response.ok) throw new Error(`AI endpoint returned ${response.status}`)
  
  const payload = await response.json()
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let scenarios: any = null
  
  if (isOllama && payload.message?.content) {
    const parsed = extractJson(payload.message.content) as { scenarios: Scenario[] }
    scenarios = parsed.scenarios
  } else {
    scenarios = (payload as { scenarios?: unknown })?.scenarios
  }

  if (!Array.isArray(scenarios) || scenarios.length !== 3 || !scenarios.every(isScenario)) {
    console.error('Invalid response:', scenarios)
    throw new Error('Invalid CityMirror scenario response')
  }
  
  return scenarios
}
