export class CreateTopicDto {
  title!: string;
  description!: string;
  order!: number;
  level!: string;
  isPublished!: boolean;
  constructor() {}
}

export class UpdateTopicDto {
  title?: string;
  description?: string;
  order?: number;
  level?: string;
  isPublished?: boolean;
  constructor() {}
}
