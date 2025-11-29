import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// service & model
import { embedText } from "../services/embedding.js";
import { Embedding } from "../../model/schemas/Embeddings.js";
import { Animal } from "../../model/schemas/Animals.js";
import { Exhibit } from "../../model/schemas/Exhibit.js";
import { TicketCategory } from "../../model/schemas/TicketCategory.js";


function splitIntoChunks(text, maxLen = 1200, overlap = 200) {
    if (!text || typeof text !== "string") return [];

    if (overlap >= maxLen) {
        throw new Error("Overlap phải nhỏ hơn maxLen");
    }

    const chunks = [];
    let start = 0;

    while (start < text.length) {
        const end = Math.min(start + maxLen, text.length);
        const chunk = text.slice(start, end);

        if (chunk.trim()) chunks.push(chunk);

        start += (maxLen - overlap);
    }
    return chunks;
}


async function indexAnimals() {
    const animals = await Animal.find({}).populate("exhibitId");

    for (const a of animals) {
        const combinedText = [
            a.slug,
            a.commonName,
            a.scientificName,
            a.shortDescription,
            a.description,
            a.diet,
            a.habitat,
            a.lifespan,
            a.size,
            `IUCN: ${a.iucnStatus}`,
            ...(a.tags || []),
            ...(a.originRegions || []),

            // exhibit
            a.exhibitId?.name,
            a.exhibitId?.description
        ]
            .filter(Boolean)
            .join(" | ");

        if (!combinedText) continue;

        const chunks = splitIntoChunks(combinedText);

        for (let i = 0; i < chunks.length; i++) {
            const vec = await embedText(chunks[i]);

            await Embedding.create({
                sourceId: a._id,
                chunkIndex: i,
                chunkText: chunks[i],
                embedding: vec,
                metadata: {
                    collection: "animals",
                    slug: a.slug,
                    commonName: a.commonName,
                    exhibitId: a.exhibitId?._id,
                    exhibitName: a.exhibitId?.name
                }
            });
        }
    }

    console.log("🦁 Done indexing animals");
}


async function indexExhibits() {
    const exhibits = await Exhibit.find({});

    for (const ex of exhibits) {
        const combinedText = [
            ex.slug,
            ex.name,
            ex.description,
            ...(ex.tags || []),
        ]
            .filter(Boolean)
            .join(" | ");

        if (!combinedText) continue;

        const chunks = splitIntoChunks(combinedText);

        for (let i = 0; i < chunks.length; i++) {
            const vec = await embedText(chunks[i]);

            await Embedding.create({
                sourceId: ex._id,
                chunkIndex: i,
                chunkText: chunks[i],
                embedding: vec,
                metadata: {
                    collection: "exhibits",
                    slug: ex.slug,
                    name: ex.name,
                }
            });
        }
    }

    console.log("🏛 Done indexing exhibits");
}

async function indexTicketCategories() {
    const tickets = await TicketCategory.find({});

    for (const t of tickets) {
        const combinedText = [
            t.code,
            t.name,
            `Giá: ${t.basePrice} ${t.currency}`,
            t.minAge ? `Min age: ${t.minAge}` : "",
            t.maxAge ? `Max age: ${t.maxAge}` : "",
            ...(t.features || []),
        ]
            .filter(Boolean)
            .join(" | ");

        if (!combinedText) continue;

        const chunks = splitIntoChunks(combinedText);

        for (let i = 0; i < chunks.length; i++) {
            const vec = await embedText(chunks[i]);

            await Embedding.create({
                sourceId: t._id,
                chunkIndex: i,
                chunkText: chunks[i],
                embedding: vec,
                metadata: {
                    collection: "ticketCategories",
                    code: t.code,
                    name: t.name,
                }
            });
        }
    }

    console.log("🎫 Done indexing ticket categories");
}


async function run() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // xóa embedding cũ (khuyến nghị)
        await Embedding.deleteMany({});

        await indexAnimals();
        await indexExhibits();
        await indexTicketCategories();

        await mongoose.disconnect();
        console.log("🎉 All embeddings generated successfully");
    } catch (err) {
        console.error("❌ Lỗi:", err);
    }
}

run();
