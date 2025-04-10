'use client'
import React, { memo, useCallback } from 'react'
import { Button } from '@/components/ui/button'

interface SuggestedQuestionsProps {
  questions: string[]
  onSelectQuestion: (question: string) => void
}

export const SuggestedQuestions = memo(function SuggestedQuestions({ questions, onSelectQuestion }: SuggestedQuestionsProps) {
  // Optimized question selection handler
  const onQuestionClick = useCallback(
    (question: string) => () => {
      onSelectQuestion(question)
    },
    [onSelectQuestion]
  )

  if (!questions.length) return null

  return (
    <div className='mx-auto mt-4 max-w-4xl' role='region' aria-label='Suggested questions'>
      <p className='mb-2 text-center text-xs font-medium text-amber-800'>Câu hỏi gợi ý:</p>
      <div className='flex flex-wrap items-center justify-center gap-2'>
        {questions.map((question, index) => (
          <Button
            key={index}
            variant='outline'
            onClick={onQuestionClick(question)}
            className='rounded-full border-amber-200 bg-white px-4 py-1.5 text-xs text-amber-800 shadow-sm transition-all duration-200 hover:border-amber-300 hover:bg-amber-50 hover:shadow-md'
          >
            {question}
          </Button>
        ))}
      </div>
    </div>
  )
})
