import {
    faMessage,
    faPlus,
    faRightFromBracket,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export const ChatSideBar = ({ chatId }) => {
    const [chatList, setChatList] = useState([]);

    useEffect(() => {
        loadChatList();
    }, [chatId]);

    const loadChatList = async () => {
        try {
            const response = await fetch(`/api/chat/getChatList`, {
                method: "POST",
            });
            const json = await response.json();
            setChatList(json?.chats || []);
        } catch (error) {
            console.error("Erro ao realizar a requisição:", error);
        }
    };
    const handleDeleteChat = async (chatId) => {
        try {
            const response = await fetch("/api/chat/deleteChat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    chatId: chatId,
                }),
            });

            await loadChatList();
        } catch (error) {
            console.error("Erro ao realizar a requisição:", error);
        }
    };

    return (
        <div className="flex flex-col overflow-hidden bg-gray-900 text-white">
            <Link
                href="/chat"
                className="side-menu-item bg-emerald-500 hover:bg-emerald-600"
            >
                <FontAwesomeIcon icon={faPlus} /> New Chat
            </Link>
            <div className="flex-1 overflow-auto bg-gray-950">
                {chatList.map((chat) => (
                    <Link
                        key={chat._id}
                        href={`/chat/${chat._id}`}
                        className={`side-menu-item justify-between ${
                            chatId === chat._id ? "bg-gray-700" : ""
                        }`}
                    >
                        <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                            <FontAwesomeIcon
                                icon={faMessage}
                                className="mr-1.5"
                            />
                            <span
                                title={chat.title}
                                className="overflow-hidden text-ellipsis whitespace-nowrap"
                            >
                                {chat.title}
                            </span>
                        </div>
                        <button
                            onClick={() => handleDeleteChat(chat._id)}
                            className="rounded-md p-1.5 hover:bg-slate-600 hover:text-red-600"
                        >
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                    </Link>
                ))}
            </div>
            <Link href="/api/auth/logout" className="side-menu-item">
                <FontAwesomeIcon icon={faRightFromBracket} />
                Logout
            </Link>
        </div>
    );
};
