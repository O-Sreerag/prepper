import { notFound } from "next/navigation"
import { TestPaperDetails } from "../_components/test-papers-details"

interface TestPaperDetailsPageProps {
  params: {
    id: string
  }
}

async function getTestPaperDetails(id: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/test-paper/${id}`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch test paper details')
    }
    
    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.error || 'Test paper not found')
    }
    
    return result.data
  } catch (error) {
    console.error('Error fetching test paper details:', error)
    return null
  }
}

export default async function TestPaperDetailsPage({ params }: TestPaperDetailsPageProps) {
  const testPaper = await getTestPaperDetails(params.id)
  
  if (!testPaper) {
    notFound()
  }
  
  return <TestPaperDetails testPaper={testPaper} />
}
