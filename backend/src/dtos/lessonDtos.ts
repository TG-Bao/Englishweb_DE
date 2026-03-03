export type CreateLessonDto = {
  topicId: string;
  title: string;
  description?: string;
  order: number;
  isPublished: boolean;
};

export type UpdateLessonDto = {
  topicId?: string;
  title?: string;
  description?: string;
  order?: number;
  isPublished?: boolean;
};
