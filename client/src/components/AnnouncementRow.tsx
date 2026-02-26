import { Link } from "react-router-dom";
import type { Announcement } from "../types/announcements";
import "./AnnouncementRow.css"
export default function AnnouncementRow({ item }: { item: Announcement }) {


    console.log(item.categories.join(" "))
  return (
      <tr>
          <td className="titleCell">{item.title}</td>
          <td className="muted">{item.publication_date}</td>
          <td className="muted">{item.last_update}</td>
          <td className="categories">
                  {item.categories.map(c => c.name).join(", ")}
          </td>
          <td className="actions">
              <Link className="editLink" to={`/announcements/${item.id}`} aria-label="Edit announcement">
                  ✎
              </Link>
          </td>
      </tr>
  );
}