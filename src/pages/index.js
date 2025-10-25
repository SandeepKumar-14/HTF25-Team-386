import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import ClaimCard from '../components/ClaimCard'

export default function Home() {
  const [claims, setClaims] = useState([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchClaims()
  }, [filter])

  const fetchClaims = async () => {
    let query = supabase
      .from('claims')
      .select(`
        *,
        profiles:submitted_by(username),
        evidence:evidence(count)
      `)
      .order('created_at', { ascending: false })

    if (filter !== 'all') {
      query = query.eq('status', filter)
    }

    const { data, error } = await query
    if (!error) setClaims(data)
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold my-6">Fact-Checking Platform</h1>
      
      {/* Filter buttons */}
      <div className="flex gap-4 mb-6">
        {['all', 'pending', 'verified', 'debunked'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded ${
              filter === status ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Claims list */}
      <div className="space-y-4">
        {claims.map(claim => (
          <ClaimCard key={claim.id} claim={claim} />
        ))}
      </div>
    </div>
  )
}