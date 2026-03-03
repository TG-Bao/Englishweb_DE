export type CreateTopicDto = {
  title: string;
  description?: string;
  order: number;
  level: string;
  isPublished: boolean;
};

export type UpdateTopicDto = {
  title?: string;
  description?: string;
  order?: number;
  level?: string;
  isPublished?: boolean;
};
