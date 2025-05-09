/**
 * Represents a specific version of an assessment.
 */
export interface AssessmentVersion {
  id: string; // Unique identifier for the version (e.g., "V1", "V2")
  assessmentId: string; // ID of the assessment this version belongs to
  versionNumber: number; // The version number (e.g., 1, 2, 3)
  status: 'draft' | 'active' | 'archived'; // Status of the version
  createdAt: string; // ISO date string when the version was created
  updatedAt: string; // ISO date string when the version was last updated
  // Potentially add other version-specific details like release notes
}

/**
 * Represents the basic details of an assessment (used by findAssessmentById).
 * This might be expanded or fetched differently in a real application.
 */
export interface AssessmentBaseInfo {
    id: string;
    title: string;
    category: string;
    difficulty: string;
    estimatedTime: number;
    targetSkillLevel: string;
    status: 'draft' | 'active' | 'archived'; // Overall status, maybe latest active version status?
    createdAt: string;
    description?: string;
}
