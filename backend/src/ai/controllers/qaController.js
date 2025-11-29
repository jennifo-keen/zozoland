import { retrieveContext } from "../rag/retrieveEmbedding.js";
import { runAI } from "../aiService.js";

export async function answerQuestion(req, res) {
    const { question } = req.body;

    try {
        // Lấy 5 context liên quan từ embedding
        const contexts = await retrieveContext(question, 5);

        // Ghép context, đánh số chunk để model dễ theo dõi
        const contextText = contexts
            .map((c, i) => `[Chunk ${i + 1}]: ${c.chunkText || ""}`)
            .join("\n");

        // Shortcut: câu hỏi về giờ mở cửa
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

        // Tạo prompt tối ưu cho RAG
        const prompt = `
<s>[INST]
Bạn là trợ lý AI. Chỉ trả lời dựa trên dữ liệu được cung cấp.

Quy tắc:
- Nếu dữ liệu KHÔNG chứa thông tin trả lời → trả lời: "Không tìm thấy thông tin."
- Trả lời ngắn gọn, chính xác, không lặp lại câu hỏi.
- Không giải thích thêm, không nhắc lại hướng dẫn.

Dữ liệu liên quan:
${contextText}

Hãy trả lời câu hỏi: "${question}"

TRẢ LỜI:
[/INST]</s>
`;

        // Gọi model
        const answer = await runAI(prompt, {
            n_predict: 400,
            temperature: 0.1
        });

        // Làm sạch kết quả
        let clean = (answer || "")
            .replace(/[\s\S]*TRẢ LỜI:/i, "")
            .replace(/\[\/?INST\]/gi, "")
            .replace(/<s>/gi, "")
            .replace(/<\/s>/gi, "")
            .trim();

        // Lấy 1–2 dòng cuối để tránh echo
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
