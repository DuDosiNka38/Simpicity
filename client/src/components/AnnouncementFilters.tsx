import type { Category } from "../types/announcements";
import CategoryMultiSelect from "./CategoryMultiSelect.tsx";
import "./AnnouncementFilters.css"

type Props = {
  search: string;
  onSearchChange: (v: string) => void;
  categories: Category[];
  selectedCategories: Category[];
  onSelectedCategoriesChange: (v: Category[]) => void;
};

export default function AnnouncementFilters(props: Props) {
  return (
    <div className="filters">
    <div className="field">
      <div className="label">Search</div>
      <input
        className="searchInput"
        value={props.search}
        onChange={(e) => props.onSearchChange(e.target.value)}
        placeholder="Search by title or content"
      />
    </div>

    <div className="field">
      <div className="label">Categories</div>
      <CategoryMultiSelect
        options={props.categories}
        value={props.selectedCategories}
        onChange={props.onSelectedCategoriesChange}
      />
    </div>
  </div>
  );
}