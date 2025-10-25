// pages/submit.js
export default function SubmitClaim() {
  const [claim, setClaim] = useState('')
  const [evidence, setEvidence] = useState('')
  const [source, setSource] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const { data: claimData, error } = await supabase
      .from('claims')
      .insert([{ content: claim }])
      .select()
      .single()

    if (claimData && evidence) {
      await supabase
        .from('evidence')
        .insert([{
          claim_id: claimData.id,
          content: evidence,
          source_url: source,
          supporting: true
        }])
    }

    // Trigger AI analysis
    await analyzeClaimWithAI(claimData.id)
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
      <textarea
        placeholder="Enter claim to fact-check..."
        value={claim}
        onChange={(e) => setClaim(e.target.value)}
        className="w-full h-32 p-2 border rounded"
        required
      />
      <textarea
        placeholder="Supporting evidence..."
        value={evidence}
        onChange={(e) => setEvidence(e.target.value)}
        className="w-full h-24 p-2 border rounded"
      />
      <input
        type="url"
        placeholder="Source URL (optional)"
        value={source}
        onChange={(e) => setSource(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button type="submit" className="bg-green-500 text-white p-2 rounded">
        Submit Claim
      </button>
    </form>
  )
}