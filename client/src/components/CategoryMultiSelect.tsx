import { useEffect, useMemo, useRef, useState } from "react";
import type { Category } from "../types/announcements";
import styles from "./CategoryMultiSelect.module.css";

type Props = {
  options: Category[];
  value: Category[];
  onChange: (next: Category[]) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
};

export default function CategoryMultiSelect({options, value, onChange, label = "Multiselect kategorii", placeholder = "Select categories…", disabled = false,}: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const selectedIds = useMemo(() => new Set(value.map((v) => v.id)), [value]);

  function isSelected(c: Category) {
    return selectedIds.has(c.id);
  }

  function toggle(c: Category) {
    if (disabled) return;

    const exists = isSelected(c);
    onChange(exists ? value.filter((x) => x.id !== c.id) : [...value, c]);
  }

  function remove(c: Category) {
    if (disabled) return;
    onChange(value.filter((x) => x.id !== c.id));
  }

  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  if (!options.length) return null;

  return (
    <div className={styles.root} ref={rootRef}>
      {label ? <div className={styles.label}>{label}</div> : null}

      <button
        type="button"
        className={`${styles.control} ${open ? styles.controlOpen : ""}`}
        onClick={() => !disabled && setOpen((v) => !v)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <div className={styles.valueArea}>
          {value.length === 0 ? (
            <span className={styles.placeholder}>{placeholder}</span>
          ) : (
            <div className={styles.chips}>
              {value.map((c) => (
                <span key={c.id} className={styles.chip}>
                  <span className={styles.chipText}>{c.name}</span>
                  <button
                    type="button"
                    className={styles.chipRemove}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      remove(c);
                    }}
                    aria-label={`Remove ${c.name}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <span className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`} aria-hidden="true">
          ▾
        </span>
      </button>

      {open ? (
        <div className={styles.dropdown} role="listbox" aria-multiselectable="true">
          <div className={styles.list}>
            {options.map((c) => {
              const checked = isSelected(c);
              return (
                <button
                  key={c.id}
                  type="button"
                  className={`${styles.option} ${checked ? styles.optionSelected : ""}`}
                  onClick={() => toggle(c)}
                  role="option"
                  aria-selected={checked}
                >
                  <span className={styles.optionText}>{c.name}</span>
                  {checked ? <span className={styles.check} aria-hidden="true">✓</span> : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}