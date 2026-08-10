// ==========================================================
// Enterprise AI Assistant
// File: src/pages/AIAssistant/AIAssistant.jsx
// ==========================================================

import { useState } from "react";
import { FiTrash2 } from "react-icons/fi";

import ChatLayout from "../../components/ai/ChatLayout";
import ChatSidebar from "../../components/ai/ChatSidebar";
import ChatWindow from "../../components/ai/ChatWindow";

import axiosInstance from "../../api/axiosInstance";
import { ENDPOINTS } from "../../utils/constants";

// ==========================================================
// Helpers
// ==========================================================

const formatTimestamp = (date) =>
  date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

const truncatePreview = (
  text,
  max = 60
) =>
  text.length > max
    ? `${text.slice(0, max)}…`
    : text;

const createMessage = (
  role,
  content
) => ({
  id: `msg-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`,
  role,
  content,
  timestamp: formatTimestamp(
    new Date()
  ),
});

const createConversation = () => ({
  id: `conv-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`,
  title: "New chat",
  preview: "",
  updatedAt: "Just now",
  messages: [],
});

// ==========================================================
// Conversation Title
// ==========================================================

const deriveConversationTitle = (
  userText
) => {
  const text =
    userText.toLowerCase();

  if (text.includes("employee")) {
    return "Employee question";
  }

  if (text.includes("leave")) {
    return "Leave question";
  }

  if (
    text.includes("attendance")
  ) {
    return "Attendance question";
  }

  if (
    text.includes("document") ||
    text.includes("policy")
  ) {
    return "Document search";
  }

  return userText.length > 30
    ? `${userText.slice(0, 30)}…`
    : userText;
};

// ==========================================================
// Component
// ==========================================================

const AIAssistant = () => {
  const initialConversation =
    createConversation();

  const [
    conversations,
    setConversations,
  ] = useState([
    initialConversation,
  ]);

  const [
    activeConversationId,
    setActiveConversationId,
  ] = useState(
    initialConversation.id
  );

  const [isLoading, setIsLoading] =
    useState(false);

  const [
    isSidebarOpen,
    setIsSidebarOpen,
  ] = useState(false);

  // ========================================================
  // Active Conversation
  // ========================================================

  const activeConversation =
    conversations.find(
      (conversation) =>
        conversation.id ===
        activeConversationId
    ) ||
    conversations[0];

  // ========================================================
  // Update Conversation
  // ========================================================

  const patchConversation = (
    conversationId,
    patch
  ) => {
    setConversations((prev) =>
      prev.map((conversation) =>
        conversation.id ===
        conversationId
          ? {
              ...conversation,
              ...patch,
            }
          : conversation
      )
    );
  };

  // ========================================================
  // Add Message
  // ========================================================

  const appendMessage = (
    conversationId,
    message
  ) => {
    setConversations((prev) =>
      prev.map((conversation) =>
        conversation.id ===
        conversationId
          ? {
              ...conversation,
              messages: [
                ...conversation.messages,
                message,
              ],
            }
          : conversation
      )
    );
  };

  // ========================================================
  // Send Message
  // REAL BACKEND API
  // POST /ai/chat
  // ========================================================

  const handleSendMessage = async (
    rawText
  ) => {
    const text =
      rawText.trim();

    if (
      !text ||
      isLoading ||
      !activeConversation
    ) {
      return;
    }

    const conversationId =
      activeConversation.id;

    const isFirstMessage =
      activeConversation.messages
        .length === 0;

    // ------------------------------------------------------
    // Add user message immediately
    // ------------------------------------------------------

    const userMessage =
      createMessage(
        "user",
        text
      );

    appendMessage(
      conversationId,
      userMessage
    );

    patchConversation(
      conversationId,
      {
        title: isFirstMessage
          ? deriveConversationTitle(
              text
            )
          : activeConversation.title,

        preview:
          truncatePreview(text),

        updatedAt: "Just now",
      }
    );

    setIsLoading(true);

    try {
      // ----------------------------------------------------
      // Call FastAPI
      // POST /ai/chat
      // ----------------------------------------------------

      const response =
        await axiosInstance.post(
          ENDPOINTS.AI.CHAT,
          {
            question: text,
          }
        );

      const answer =
        response.data?.answer;

      // ----------------------------------------------------
      // Validate response
      // ----------------------------------------------------

      const finalAnswer =
        answer ||
        "No response was generated.";

      // ----------------------------------------------------
      // Add AI response
      // ----------------------------------------------------

      const aiMessage =
        createMessage(
          "assistant",
          finalAnswer
        );

      appendMessage(
        conversationId,
        aiMessage
      );

      patchConversation(
        conversationId,
        {
          preview:
            truncatePreview(
              finalAnswer
            ),

          updatedAt: "Just now",
        }
      );
    } catch (error) {
      console.error(
        "AI Chat Error:",
        error
      );

      const errorMessage =
        error?.friendlyMessage ||
        error?.response?.data
          ?.detail ||
        "Unable to get a response from the AI Assistant. Please try again.";

      const aiErrorMessage =
        createMessage(
          "assistant",
          errorMessage
        );

      appendMessage(
        conversationId,
        aiErrorMessage
      );

      patchConversation(
        conversationId,
        {
          preview:
            truncatePreview(
              errorMessage
            ),

          updatedAt: "Just now",
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ========================================================
  // New Chat
  // ========================================================

  const handleNewChat = () => {
    const fresh =
      createConversation();

    setConversations((prev) => [
      fresh,
      ...prev,
    ]);

    setActiveConversationId(
      fresh.id
    );

    setIsSidebarOpen(false);
  };

  // ========================================================
  // Select Conversation
  // ========================================================

  const handleSelectConversation = (
    conversationId
  ) => {
    setActiveConversationId(
      conversationId
    );

    setIsSidebarOpen(false);
  };

  // ========================================================
  // Delete Conversation
  // ========================================================

  const handleDeleteConversation = (
    conversationId
  ) => {
    setConversations((prev) => {
      const remaining =
        prev.filter(
          (conversation) =>
            conversation.id !==
            conversationId
        );

      if (
        conversationId ===
        activeConversationId
      ) {
        if (
          remaining.length > 0
        ) {
          setActiveConversationId(
            remaining[0].id
          );

          return remaining;
        }

        const fresh =
          createConversation();

        setActiveConversationId(
          fresh.id
        );

        return [fresh];
      }

      return remaining;
    });
  };

  // ========================================================
  // Sidebar
  // ========================================================

  const handleOpenSidebar = () =>
    setIsSidebarOpen(true);

  const handleCloseSidebar = () =>
    setIsSidebarOpen(false);

  // ========================================================
  // Clear Current Conversation
  // ========================================================

  const handleClearConversation = () => {
    if (!activeConversation) {
      return;
    }

    patchConversation(
      activeConversation.id,
      {
        messages: [],
        title: "New chat",
        preview: "",
        updatedAt: "Just now",
      }
    );
  };

  // ========================================================
  // Render
  // ========================================================

  if (!activeConversation) {
    return null;
  }

  const hasActiveMessages =
    activeConversation.messages
      .length > 0;

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-4">

      {/* ==================================================
          Page Header
      ================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl dark:text-gray-100">
            AI Assistant
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Ask questions about your organization,
            employees, documents, and HR policies.
          </p>
        </div>

        <button
          type="button"
          onClick={
            handleClearConversation
          }
          disabled={
            !hasActiveMessages ||
            isLoading
          }
          aria-label="Clear current conversation"
          className="inline-flex items-center gap-2 self-start rounded-lg border border-gray-200 px-3.5 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
        >
          <FiTrash2 className="h-4 w-4" />

          <span className="hidden sm:inline">
            Clear conversation
          </span>
        </button>
      </div>

      {/* ==================================================
          Chat
      ================================================== */}

      <div className="flex-1 overflow-hidden">

        <ChatLayout
          sidebarOpen={
            isSidebarOpen
          }
          onCloseSidebar={
            handleCloseSidebar
          }

          sidebar={
            <ChatSidebar
              conversations={
                conversations
              }
              activeConversationId={
                activeConversation.id
              }
              onSelectConversation={
                handleSelectConversation
              }
              onNewChat={
                handleNewChat
              }
              onDeleteConversation={
                handleDeleteConversation
              }
              onCloseMobile={
                handleCloseSidebar
              }
            />
          }

          chat={
            <ChatWindow
              messages={
                activeConversation.messages
              }
              isLoading={
                isLoading
              }
              onSendMessage={
                handleSendMessage
              }
              onNewChat={
                handleNewChat
              }
              onOpenSidebar={
                handleOpenSidebar
              }
            />
          }
        />

      </div>
    </div>
  );
};

export default AIAssistant;