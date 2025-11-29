import { retrieveContext } from "../rag/retrieveEmbedding.js";
import { runAI } from "../aiService.js";

export async function answerQuestion(req, res) {
    const { question } = req.body;

    try {
        // Lấy 5 context liên quan
        const contexts = await retrieveContext(question, 5);

        // Ghép tất cả context, không cắt quá ngắn
        const contextText = contexts
            .map(c => c.chunkText || "")
            .join("\n---\n");

        // Fallback nếu câu hỏi về giờ mở cửa
        const openingMatch = contextText.match(/Opening:\s*([0-9]{2}:[0-9]{2})/i);
        const closingMatch = contextText.match(/Closing:\s*([0-9]{2}:[0-9]{2})/i);
        if (/giờ|mấy giờ|mở cửa|opening|closing/i.test(question)) {
            if (openingMatch && closingMatch) {
                return res.json({
                    question,
                    answer: `Giờ mở cửa: ${openingMatch[1]} – ${closingMatch[1]}`,
                    contexts
                });
            }
        }
            const prompt = `
            <s>[INST]
            Bạn là trợ lý AI. Chỉ trả lời dựa trên dữ liệu được cung cấp.

            Quy tắc:
            - Nếu dữ liệu KHÔNG chứa thông tin trả lời → trả lời: "Không tìm thấy thông tin".
            - Không lặp lại câu hỏi.
            - Không nhắc lại hướng dẫn.
            - Không giải thích dài dòng.
            - Trả lời đúng dựa trên dữ liệu.

Dữ liệu liên quan:
{contextText}

            Dữ liệu liên quan:
            ${contextText}

            TRẢ LỜI:
            [/INST]</s>
            `;


        // Gọi model
        const answer = await runAI(prompt, {
            n_predict: 400,     // tăng số token dự đoán
            temperature: 0.1   // giảm nhiệt độ để tránh đoán lung tung
        });
        let clean = (answer || "").trim();

        // XÓA toàn bộ phần prompt echo
        clean = clean
            .replace(/[\s\S]*TRẢ LỜI:/i, "") // bỏ mọi thứ trước "TRẢ LỜI:"
            .replace(/\[\/?INST\]/gi, "")
            .replace(/<s>/gi, "")
            .replace(/<\/s>/gi, "")
            .trim();

        // lấy 1–2 dòng cuối (phòng khi Falcon vẫn echo context)
        const lines = clean.split("\n").map(l => l.trim()).filter(Boolean);
        clean = lines.slice(-2).join(" ").trim();

        if (!clean) clean = "Không tìm thấy thông tin.";

        res.json({
            question,
            answer: clean,
            contexts
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
