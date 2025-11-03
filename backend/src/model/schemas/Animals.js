import mongoose from "mongoose";

const { Schema, Types } = mongoose;

const animalSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    commonName: { type: String, required: true, trim: true },        // Tên thường
    scientificName: { type: String, trim: true },                    // Tên khoa học
    shortDescription: { type: String, trim: true, maxlength: 400 },
    description: { type: String }, // có thể là HTML string
    thumbnail: { type: String },
    heroImage: { type: String },
    galleryImages: [{ type: String }],
    exhibitId: { type: Types.ObjectId, ref: "Exhibit" },
    tags: [{ type: String }],            // ["bò sát","đêm","ăn thịt"]
    originRegions: [{ type: String }],   // ["Đông Nam Á",...]
    diet: { type: String },              // "Côn trùng, ... "
    habitat: { type: String },           // "Rừng ẩm, ..."
    lifespan: { type: String },          // "10–15 năm"
    size: { type: String },              // "20–35 cm"
    iucnStatus: {
      type: String,
      enum: ["NE","DD","LC","NT","VU","EN","CR","EW","EX"], // chuẩn IUCN
      default: "LC"
    },

    isActive: { type: Boolean, default: true },
    order: { type: Number }
  },
  { timestamps: { updatedAt: true, createdAt: false } }
);

export const Animal = mongoose.model("Animal", animalSchema, "animals");
