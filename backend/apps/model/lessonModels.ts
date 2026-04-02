export interface CreateLessonDto {
    title: string;
    image: string;
    level_id: string;
    order: number;
    isPublished?: boolean;
  }
  
  export interface UpdateLessonDto {
    title?: string;
    image?: string;
    level_id?: string;
    order?: number;
    isPublished?: boolean;
  }
