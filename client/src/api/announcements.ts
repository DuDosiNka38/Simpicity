import apiClient from "./axios.ts";
import type { Announcement, AnnouncementUpsert, Category } from "../types/announcements.ts";

export type ListParams = {
  search?: string;
  categories?: number[];
  sort?: "lastUpdate" | "publicationDate" | "title";
  order?: "asc" | "desc";
};


export async function listAnnouncements(params: ListParams): Promise<Announcement[]> {
  const res = await apiClient.get<Announcement[]>("/api/announcements", {
    params: {
      search: params.search,
      categories: params.categories?.length ? params.categories.join(",") : undefined,
      sort: params.sort ?? "lastUpdate",
      order: params.order ?? "desc",
    },
  });

  return res.data as Announcement[];
}
export async function getAnnouncement(id: string): Promise<Announcement> {
  return (await apiClient.get<Announcement>(`/api/announcements/${id}`)).data as Announcement;
}

export async function createAnnouncement(payload: AnnouncementUpsert): Promise<Announcement> {
  return (await apiClient.post<Announcement>(`/api/announcements`, payload)).data as Announcement;
}

export async function updateAnnouncement(id: string, payload: AnnouncementUpsert): Promise<Announcement> {
  return (await apiClient.put<Announcement>(`/api/announcements/${id}`, payload)).data as Announcement;
}

export async function listCategories(): Promise<Category[]> {
  return (await apiClient.get<Category[]>(`/api/categories`)).data as Category[];
}