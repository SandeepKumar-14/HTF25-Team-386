import { ChatOpenAI } from "@langchain/openai"
import { StringOutputParser } from "@langchain/core/output_parsers"
import { PromptTemplate } from "@langchain/core/prompts"

export class FactCheckAI {
  constructor() {
    this.llm = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: "gpt-3.5-turbo"
    })
  }

  async analyzeClaim(claimText, evidence) {
    const prompt = PromptTemplate.fromTemplate(`
      Analyze the following claim and supporting evidence for factual accuracy:
      
      CLAIM: {claim}
      
      EVIDENCE: {evidence}
      
      Please provide:
      1. Factual accuracy assessment (0-100 score)
      2. Key supporting/contradicting points
      3. Recommended verification sources
      4. Confidence level in assessment
      
      Respond in JSON format.
    `)

    const chain = prompt.pipe(this.llm).pipe(new StringOutputParser())
    
    try {
      const result = await chain.invoke({
        claim: claimText,
        evidence: evidence.map(e => e.content).join('\n')
      })
      
      return JSON.parse(result)
    } catch (error) {
      console.error('AI analysis error:', error)
      return null
    }
  }

  async moderateContent(content) {
    const prompt = PromptTemplate.fromTemplate(`
      Moderate the following content for relevance and factual basis:
      
      CONTENT: {content}
      
      Assess:
      - Relevance to fact-checking
      - Potential misinformation
      - Tone and appropriateness
      
      Return JSON with {appropriate: boolean, reason: string, confidence: number}
    `)

    const chain = prompt.pipe(this.llm).pipe(new StringOutputParser())
    
    const result = await chain.invoke({ content })
    return JSON.parse(result)
  }
}