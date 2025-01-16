export interface IGetModules {
  data: Module[]
}

export interface Module {
  id: number
  module_name: string
  module_description: string
  min_age: number | null
  max_age: number | null
  status: number
  learning_objectives: LearningObjective[]
}

export interface LearningObjective {
  id: number
  module_id: number
  objective_order: number
  learning_objective: string
  learning_paths: LearningPath[]
}

export interface LearningPath {
  id: number
  learning_objective_id: number
  path_order: number
  content_type: string
  content_id: number
  content: Content
}

export interface Content {
  id: number
  trivia_name: string
  trivia_objective: string
  trivia_instructions: string
  title?: string
  link?: string
}
