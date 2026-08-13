import React, { useEffect, useState } from 'react'
import flashcardService from '../../services/flashcardService'
import toast from 'react-hot-toast'
import Spinner from '../../components/common/Spinner'
import EmptyState from '../../components/common/EmptyState'
import FlashcardSetCard from '../../components/flashcards/FlashcardSetCard'
import PageHeader from '../../components/common/PageHeader'

const FlashcardListPage = () => {

  const [flashcardSets, setFlashcardSets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=> {
    const fetchFlashCardSets = async () => {
      try{
        const response = await flashcardService.getAllFlashCardSets();

        setFlashcardSets(response.data);
      } catch (error) {
        toast.error('Failed to fetch flashcard sets')
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchFlashCardSets()
  },[])

  const renderContent = () => {
    if (loading) {
      return <Spinner />
    }

    if (flashcardSets.length === 0) {
      return (
        <EmptyState
          title="No Flashcard Sets Found"
          description="You haven't created any flashcard sets yet. Go to a document and create one."
        />
      )
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {flashcardSets.map((set) => (
          <FlashcardSetCard key={set._id} flashcardSet={set} />
        ))}
      </div>
    )
  }
  return (
    <div>
      <PageHeader title={"All Flashcard Sets"} />
      {renderContent()}
    </div>
  )
}

export default FlashcardListPage