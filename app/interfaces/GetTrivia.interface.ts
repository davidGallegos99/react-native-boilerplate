export interface IGetTriviaData {
  data: {
    id: number
    trivia_name: string
    trivia_objective: string
    trivia_instructions: string
    learning_path: {
      id: number
      content_id: number
    }
    questions: Question[]
  }
}

interface Question {
  id: number
  question_name: string
  trivia_id: number
  answers: Answer[]
}

interface Answer {
  id: number
  answer_name: string
  answer_description: string
  answer_option: number
  question_id: number
}
