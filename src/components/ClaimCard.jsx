export default function ClaimCard({ claim }) {
  const getStatusColor = (status) => {
    switch(status) {
      case 'verified': return 'bg-green-100 text-green-800'
      case 'debunked': return 'bg-red-100 text-red-800'
      default: return 'bg-yellow-100 text-yellow-800'
    }
  }

  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold">{claim.content}</h3>
        <span className={`px-2 py-1 rounded text-sm ${getStatusColor(claim.status)}`}>
          {claim.status}
        </span>
      </div>
      
      <div className="mt-2 flex justify-between text-sm text-gray-600">
        <span>By: {claim.profiles?.username}</span>
        <span>Score: {claim.credibility_score}</span>
      </div>
      
      <div className="mt-3 flex gap-2">
        <VoteButtons claimId={claim.id} />
        <button className="text-blue-500 hover:text-blue-700">
          Discuss ({claim.evidence?.[0]?.count || 0})
        </button>
      </div>
    </div>
  )
}