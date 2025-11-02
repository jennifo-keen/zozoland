import mongoose from "mongoose";
import { Exhibit } from "../schemas/Exhibit.js";

export async function findExhibitByIdOrSlug(idOrSlug) {
  const byId = mongoose.isValidObjectId(idOrSlug)
    ? await Exhibit.findById(idOrSlug)
    : null;
  if (byId) return byId;
  return Exhibit.findOne({ slug: idOrSlug });
}
