import { ObjectId } from "mongodb";
import clientPromise from "lib/mongodb";
import { getSession } from "@auth0/nextjs-auth0";

export default async function handler(req, res) {
    try {
        const { user } = await getSession(req, res);
        if (!req.body.chatId) {
            return res.status(400).json({
                message: "O parâmetro chatId é obrigatório.",
            });
        }

        const { chatId } = req.body;

        const client = await clientPromise;
        const db = client.db("ChatBob");

        const chatToDelete = await db.collection("chats").findOne({
            _id: new ObjectId(chatId),
            userId: user.sub,
        });

        if (!chatToDelete) {
            return res.status(404).json({
                message: "Chat não encontrado ou não pertence ao usuário.",
            });
        }

        const result = await db.collection("chats").deleteOne({
            _id: new ObjectId(chatId),
            userId: user.sub,
        });

        if (result.deletedCount === 1) {
            res.status(200).json({
                message: "Chat excluído com sucesso.",
            });
        } else {
            res.status(500).json({
                message: "Falha ao excluir o chat.",
            });
        }
    } catch (e) {
        console.error("Erro:", e);
        res.status(500).json({
            message: "Ocorreu um erro ao excluir o chat.",
        });
    }
}
