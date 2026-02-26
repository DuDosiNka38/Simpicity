import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { AnnouncementUpsert, Category } from "../types/announcements";
import {
  createAnnouncement,
  getAnnouncement,
  listCategories,
  updateAnnouncement,
} from "../api/announcements";
import { hint, isValidDateTime } from "../utils/datetime";
import CategoryMultiSelect from "../components/CategoryMultiSelect";
import DateTimeInput from "../components/DateTimeInput";
import styles from "./AnnouncementEditPage.module.css";

type Mode = "create" | "edit";

type FormState = AnnouncementUpsert;

export default function AnnouncementEditPage({ mode }: { mode: Mode }) {
  const nav = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState<boolean>(mode === "edit");
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<FormState>({
    title: "",
    body: "",
    publicationDate: "",
    categories: [],
  });

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


  useEffect(() => {
    if (mode !== "edit" || !id) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const res = await getAnnouncement(id);
        const a = res.data;

        if (cancelled) return;

        setForm({
          title: a.title ?? "",
          body: a.body ?? "",
          publicationDate: a.publication_date ?? "",
          categories: a.categories ?? [],
        });
      } catch (e) {
        if (!cancelled) setError("Failed to load announcement.");
        // eslint-disable-next-line no-console
        console.log(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [mode, id]);

  // --- validation ---
  const validationError = useMemo(() => {
    if (!form.title.trim()) return "Title is required.";
    if (!form.body.trim()) return "Content is required.";
    if (!form.categories.length) return "Select at least one category.";
    if (!form.publicationDate.trim()) return "Publication date is required.";
    if (!isValidDateTime(form.publicationDate.trim()))
      return `Publication date must be in format ${hint()}.`;
    return null;
  }, [form]);

  const canSubmit = !loading && !saving && !validationError;

  async function onPublish() {
    if (validationError) return;

    setSaving(true);
    setError(null);

    const payload: AnnouncementUpsert = {
      title: form.title.trim(),
      body: form.body.trim(),
      publicationDate: form.publicationDate.trim(),
      categories: form.categories,
    };

    try {
      if (mode === "create") {
        await createAnnouncement(payload);
      } else {
        if (!id) throw new Error("Missing id");
        await updateAnnouncement(id, payload);
      }
      nav("/announcements");
    } catch (e) {
      setError("Failed to save announcement. Please try again.");
      // eslint-disable-next-line no-console
      console.log(e);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <div className={styles.skeletonTitle} />
          <div className={styles.skeletonLine} />
          <div className={styles.skeletonLine} />
          <div className={styles.skeletonBlock} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>
              {mode === "edit" ? "Edit announcement" : "Create announcement"}
            </h1>
            <p className={styles.subtitle}>
              Fill in the fields below and publish when ready.
            </p>
          </div>

          <div className={styles.headerActions}>
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={() => nav("/announcements")}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={onPublish}
              disabled={!canSubmit}
            >
              {saving ? "Publishing…" : "Publish"}
            </button>
          </div>
        </header>

        {error && (
          <div role="alert" className={styles.alertError}>
            {error}
          </div>
        )}

        {validationError && (
          <div role="status" className={styles.alertInfo}>
            {validationError}
          </div>
        )}

        <div className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="title">
              Title
            </label>
            <input
              id="title"
              className={styles.input}
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              placeholder="e.g. Office closed on Friday"
              autoComplete="off"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="content">
              Content
            </label>
            <textarea
              id="content"
              className={styles.textarea}
              value={form.body}
              onChange={(e) => setForm((p) => ({ ...p, body: e.target.value }))}
              rows={10}
              placeholder="Write the announcement text…"
            />
            <div className={styles.helpRow}>
              <span className={styles.helpText}>
                Keep it clear: what happened, when, and what to do next.
              </span>
              <span className={styles.counter}>{form.body.trim().length} chars</span>
            </div>
          </div>

          <div className={styles.field}>
            <div className={styles.labelRow}>
              <label className={styles.label}>Categories</label>
              <span className={styles.muted}>{form.categories.length} selected</span>
            </div>

            <div className={styles.categoriesWrap}>
              <CategoryMultiSelect
                options={categories}
                value={form.categories}
                onChange={(next) => setForm((p) => ({ ...p, categories: next }))}
              />
            </div>
          </div>

          <div className={styles.field}>
            <div className={styles.labelRow}>
              <label className={styles.label}>Publication date</label>
              <span className={styles.muted}>Format: {hint()}</span>
            </div>

            <div className={styles.dateWrap}>
              <DateTimeInput
                value={form.publicationDate}
                onChange={(v) => setForm((p) => ({ ...p, publicationDate: v }))}
              />
            </div>
          </div>

          <div className={styles.footerActions}>
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={() => nav("/announcements")}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={onPublish}
              disabled={!canSubmit}
            >
              {saving ? "Publishing…" : "Publish"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}