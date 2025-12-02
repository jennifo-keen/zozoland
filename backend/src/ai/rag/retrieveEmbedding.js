import { embedText } from "../services/embedding.js";
import { Embedding } from "../../model/schemas/Embeddings.js";

function cosineSimilarity(a, b) {
    const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dot / (normA * normB);
}

export async function retrieveContext(question, topK = 10) {
    const queryVec = await embedText(question);


    const pricePattern = /(giá|vé|bao nhiêu|price|ticket)/i;
    const animalPattern = /(động vật|con gì|animal|loài|species|sống ở đâu|ăn gì|nặng|dài|iucn)/i;
    const exhibitPattern = /(khu trưng bày|exhibit|khu vực|ở đâu|zone|khu nào)/i;

    let filter = {};

    if (pricePattern.test(question)) {
        // hỏi vé
        filter = { "metadata.collection": "ticketCategories" };

    } else if (animalPattern.test(question)) {
        // hỏi động vật
        filter = { "metadata.collection": "animals" };

    } else if (exhibitPattern.test(question)) {
        // hỏi khu trưng bày
        filter = { "metadata.collection": "exhibits" };

    } else {
        // fallback: tìm toàn bộ
        filter = {};
    }

    const embeddings = await Embedding.find(filter);

    const scored = embeddings.map(doc => {
        const score = cosineSimilarity(queryVec, doc.embedding);
        return { ...doc.toObject(), score };
    });

    scored.sort((a, b) => b.score - a.score);

    return scored.slice(0, topK);
}
