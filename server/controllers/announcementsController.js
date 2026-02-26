const announcementRepo = require("../repositories/announcementRepository.js");
const { successResponse, errorResponse } = require("../utils/response");



function toAnnouncement(a) {
  return {
    id: a.id,
    title: a.title,
    body: a.body,
    user_id: a.user_id,
    publication_date: a.publication_date,
    last_update: a.last_update,
    categories: a.categories || []
  };
}

class AnnouncementsController {

  // GET /api/announcements?search=text&category_id=1
  getAll(req, res) {
    const search = req.query.search || "";
    const category_id = req.query.categories || null;

    try {
      const items = announcementRepo.getAll(search, category_id);

      return successResponse(res, 200,
        items.map(toAnnouncement),
        "Announcements fetched successfully"
      );
    } catch (e) {
      return errorResponse(res, 500, "Server error");
    }
  }

  // GET /api/announcements/:id
  getOne(req, res) {
    const id = Number(req.params.id);

    const announcement = announcementRepo.getById(id);
    if (!announcement) {
      return errorResponse(res, 404, "Not Found", {
        id: ["Announcement not found"]
      });
    }

    return successResponse(res, 200,
      toAnnouncement(announcement),
      "Announcement fetched successfully"
    );
  }

  // POST /api/announcements
  create(req, res) {
    const userId = req.user?.id || 1;
    const { title, body, publication_date, categories } = req.body || {};

    // validation
    if (!title || !body || !publication_date) {
      return errorResponse(res, 400, "Validation failed", {
        fields: ["title, body and publication_date are required"]
      });
    }

    try {
      const announcement = announcementRepo.create({
        title: title.trim(),
        body,
        user_id: userId,
        publication_date,
        categories: categories || []
      });

      return successResponse(res, 201,
        toAnnouncement(announcement),
        "Announcement created successfully"
      );

    } catch (e) {
      return errorResponse(res, 500, "Server error");
    }
  }

  // PUT /api/announcements/:id
  update(req, res) {
    const id = Number(req.params.id);
    const { title, body, publicationDate, categories } = req.body || {};

    console.log(publicationDate,  req.body)

    const existing = announcementRepo.getById(id);
    if (!existing) {
      return errorResponse(res, 404, "Not Found", {
        id: ["Announcement not found"]
      });
    }

    try {
      const updated = announcementRepo.update(id, {
        title: title ?? existing.title,
        body: body ?? existing.body,
        publication_date: publicationDate ?? existing.publication_date,
        categories: categories ?? existing.categories
      });

      return successResponse(res, 200,
        toAnnouncement(updated),
        "Announcement updated successfully"
      );

    } catch (e) {
      console.log(e)
      return errorResponse(res, 500, "Server error");
    }
  }

  // DELETE /api/announcements/:id
  remove(req, res) {
    const id = Number(req.params.id);

    const existing = announcementRepo.getById(id);
    if (!existing) {
      return errorResponse(res, 404, "Not Found", {
        id: ["Announcement not found"]
      });
    }

    announcementRepo.remove(id);

    return successResponse(res, 200,
      { id },
      "Announcement deleted successfully"
    );
  }
}

module.exports = new AnnouncementsController();