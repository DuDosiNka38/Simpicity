
const {successResponse, errorResponse} = require("../utils/response");
const categoriesRepo = require("../repositories/categoriesRepository");

class categoriesController{

    getAll(req, res) {

    try {
      const items = categoriesRepo.getAllCategories();

      return successResponse(res, 200,
        items,
        "Announcements fetched successfully"
      );
    } catch (e) {
      return errorResponse(res, 500, "Server error");
    }
  }
}



module.exports = new categoriesController();