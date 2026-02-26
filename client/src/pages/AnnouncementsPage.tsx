import { useEffect, useMemo, useState } from "react";
import type { Announcement, Category } from "../types/announcements";
import { listAnnouncements, listCategories } from "../api/announcements";
import type { ListParams } from "../api/announcements";
import AnnouncementFilters from "../components/AnnouncementFilters";
import AnnouncementsTable from "../components/AnnouncementsTable";
import styles from "./AnnouncementsPage.module.css";
import {useNavigate} from "react-router-dom";

export default function AnnouncementsPage() {
  const nav = useNavigate();
  const [items, setItems] = useState<Announcement[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await listCategories();
        if (!cancelled) setCategories(res.data ?? []);
      } catch {
        if (!cancelled) setCategories([]);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const params = useMemo<ListParams>(
    () => ({
      search: search.trim() || undefined,
      categories: selectedCategories.length ? selectedCategories.map((c) => c.id) : undefined,
      sort: "lastUpdate",
      order: "desc",
    }),
    [search, selectedCategories]
  );


  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    (async () => {
      try {
        const res = await listAnnouncements(params);
        if (!cancelled) setItems(res.data ?? []);
      } catch (e) {
        if (!cancelled) setError("Failed to load announcements.");
        // eslint-disable-next-line no-console
        console.log(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [params]);

  return (
      <div className={styles.page}>
          <div className={styles.pageHeader}>
              <div>
                  <h1 className={styles.title}>Announcements</h1>
                  <p className={styles.subtitle}>Search, filter, and manage announcements.</p>
              </div>
          </div>
    <div className={styles.stack}>
        <div className={styles.card}>
            <AnnouncementFilters
                search={search}
                onSearchChange={setSearch}
                categories={categories}
                selectedCategories={selectedCategories}
                onSelectedCategoriesChange={setSelectedCategories}
            />
        </div>

        {error && (
            <div role="alert" className={styles.alertError}>
                {error}
            </div>
        )}

        <div className={styles.card}>
            <div className={styles.headerActions}>
                <button type="button" className={styles.primaryBtn} onClick={() => nav("/announcements/new")}>
                    + Create
                </button>
            </div>
            <div className={styles.tableHeader}>
                <div className={styles.tableHeaderLeft}>
                    <div className={styles.sectionTitle}>Results</div>
                    <div className={styles.muted}>
                        {loading ? "Loading…" : `${items.length} item(s)`}
                    </div>
                </div>

                <div className={styles.tableHeaderRight}>
                    {loading ? <span className={styles.pill}>Updating</span> : null}
                </div>
            </div>

            <div className={styles.tableWrap}>
                {loading ? (
                    <div className={styles.skeletonList}>
                        <div className={styles.skeletonRow}/>
                        <div className={styles.skeletonRow}/>
                        <div className={styles.skeletonRow}/>
                        <div className={styles.skeletonRow}/>
                    </div>
                ) : (
                    <AnnouncementsTable items={items}/>
                )}
            </div>
        </div>
    </div>
      </div>
  );
}