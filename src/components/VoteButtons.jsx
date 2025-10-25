import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function VoteButtons({ claimId }) {
  const [userVote, setUserVote] = useState(null)
  const [upvotes, setUpvotes] = useState(0)
  const [downvotes, setDownvotes] = useState(0)

  useEffect(() => {
    fetchVotes()
  }, [claimId])

  const fetchVotes = async () => {
    const { data: votes } = await supabase
      .from('votes')
      .select('vote_type')
      .eq('claim_id', claimId)

    const up = votes.filter(v => v.vote_type === 'upvote').length
    const down = votes.filter(v => v.vote_type === 'downvote').length
    
    setUpvotes(up)
    setDownvotes(down)
  }

  const handleVote = async (voteType) => {
    const { user } = await supabase.auth.getUser()
    if (!user) return alert('Please login to vote')

    if (userVote === voteType) {
      // Remove vote
      await supabase
        .from('votes')
        .delete()
        .eq('claim_id', claimId)
        .eq('user_id', user.id)
      
      setUserVote(null)
    } else {
      // Upsert vote
      await supabase
        .from('votes')
        .upsert({
          claim_id: claimId,
          user_id: user.id,
          vote_type: voteType
        })
      
      setUserVote(voteType)
    }

    fetchVotes()
  }

  return (
    <div className="flex gap-2">
      <button 
        onClick={() => handleVote('upvote')}
        className={`px-3 py-1 rounded ${
          userVote === 'upvote' ? 'bg-green-500 text-white' : 'bg-gray-200'
        }`}
      >
        👍 {upvotes}
      </button>
      <button 
        onClick={() => handleVote('downvote')}
        className={`px-3 py-1 rounded ${
          userVote === 'downvote' ? 'bg-red-500 text-white' : 'bg-gray-200'
        }`}
      >
        👎 {downvotes}
      </button>
    </div>
  )
}