/**
 * Represents a single question within an assessment version.
 */
export interface AssessmentQuestion {
  id: string; // Unique identifier for the question (e.g., "Q-001")
  assessmentId: string; // ID of the assessment it belongs to
  versionId: string; // ID of the assessment version it belongs to
  order: number; // Display order within the version
  text: string; // The question text itself
  type: 'single-choice' | 'multiple-choice' | 'text'; // Type of question
  options?: { id: string; text: string }[]; // Possible answers for choice questions
  correctAnswer?: string | string[]; // ID(s) of the correct option(s) or correct text answer
  points: number; // Points awarded for a correct answer
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

/**
 * Represents the data structure for the Add/Edit Question form.
 */
export interface AssessmentQuestionFormData {
  text: string;
  type: 'single-choice' | 'multiple-choice' | 'text';
  options: { text: string }[]; // Simplified for form handling, IDs generated on save
  correctAnswer?: string | string[]; // Index(es) of correct option or text answer
  points: number;
}
