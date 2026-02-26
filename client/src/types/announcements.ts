export type Category = {
  id: number;
  name: string;
};

export type Announcement = {
  id: string;
  title: string;
  body: string;
  publication_date: string;
  last_update: string;
  categories: Category[];
};

export type AnnouncementUpsert = {
  title: string;
  body: string;
  publicationDate: string;
  categories: Category[];
};