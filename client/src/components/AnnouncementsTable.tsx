import type { Announcement } from "../types/announcements";
import AnnouncementRow from "./AnnouncementRow";
import "./AnnouncementsTable.css"
export default function AnnouncementsTable({ items }: { items: Announcement[] }) {
  return (
      <div className="tableWrap">
          <table className="table">
              <thead className="thead">
              <tr>
                  <th>Title</th>
                  <th>Publication date</th>
                  <th>Last update</th>
                  <th>Categories</th>
                  <th></th>
              </tr>
              </thead>
              <tbody className="tbody">
              {items.length === 0 ? (
                  <tr>
                      <td colSpan={5} className="empty">No announcements found.</td>
                  </tr>
              ) : (
                  items.map((a) => <AnnouncementRow key={a.id} item={a}/>)
              )}
              </tbody>
          </table>
      </div>
  )
      ;
}