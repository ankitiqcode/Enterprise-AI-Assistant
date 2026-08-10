// src/components/ai/ChatSidebar.jsx
import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { FiPlus, FiSearch, FiTrash2, FiMessageSquare, FiX } from 'react-icons/fi';

/**
 * Conversation sidebar for the AI Assistant.
 *
 * Purely presentational + local search state — does not manage chat
 * messages, does not call any API, does not use localStorage, and
 * does not contain mock conversation data. The parent supplies
 * `conversations` as an array shaped exactly like the spec's example
 * ({ id, title, preview, updatedAt }); this component only filters
 * and renders what it's given.
 *
 * Note: this shape differs from AIAssistant.jsx's current internal
 * conversation state ({ id, title, messages }), which has no
 * `preview`/`updatedAt` fields. This component is not yet wired into
 * AIAssistant.jsx (per your instruction not to modify it), so that
 * mismatch is expected and unresolved until a future wiring step.
 *
 * Designed to sit inside ChatLayout's `sidebar` slot — it renders
 * its own header/search/list/empty-state content, not the outer
 * <aside> shell (ChatLayout owns that).
 */
const ChatSidebar = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
  onCloseMobile,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredConversations = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return conversations;
    return conversations.filter((conversation) => conversation.title.toLowerCase().includes(query));
  }, [conversations, searchTerm]);

  const isEmpty = filteredConversations.length === 0;

  return (
    <div className="flex h-full flex-col">
      {/* ---------------- Header ---------------- */}
      <div className="flex items-center justify-between gap-2 border-b border-gray-100 px-4 py-3.5 dark:border-gray-800">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">AI Assistant</h2>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onNewChat}
            aria-label="Start a new chat"
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
          >
            <FiPlus className="h-3.5 w-3.5" />
            New Chat
          </button>
          {/* Mobile-only close button — sidebar is a drawer here */}
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close conversations panel"
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 lg:hidden dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-200"
          >
            <FiX className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ---------------- Search ---------------- */}
      <div className="border-b border-gray-100 p-3 dark:border-gray-800">
        <label htmlFor="chat-sidebar-search" className="sr-only">
          Search conversations by title
        </label>
        <div className="relative">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
          <input
            id="chat-sidebar-search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search conversations..."
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
          />
        </div>
      </div>

      {/* ---------------- Conversation List ---------------- */}
      <div className="flex-1 overflow-y-auto p-2">
        {isEmpty ? (
          // ---------------- Empty State ----------------
          <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <FiMessageSquare className="h-5 w-5 text-gray-400 dark:text-gray-600" />
            </div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              No conversations
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-600">Start a new conversation.</p>
          </div>
        ) : (
          <ul className="space-y-1">
            {filteredConversations.map((conversation) => {
              const isActive = conversation.id === activeConversationId;
              return (
                <li key={conversation.id} className="group relative">
                  <button
                    type="button"
                    onClick={() => onSelectConversation(conversation.id)}
                    aria-current={isActive ? 'true' : undefined}
                    aria-label={`Open conversation: ${conversation.title}`}
                    className={`w-full rounded-xl px-3 py-2.5 pr-9 text-left transition-colors ${
                      isActive
                        ? 'bg-indigo-50 dark:bg-indigo-500/10'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800/60'
                    }`}
                  >
                    <p
                      className={`truncate text-sm font-medium ${
                        isActive
                          ? 'text-indigo-700 dark:text-indigo-400'
                          : 'text-gray-800 dark:text-gray-200'
                      }`}
                    >
                      {conversation.title}
                    </p>
                    {conversation.preview && (
                      <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">
                        {conversation.preview}
                      </p>
                    )}
                    {conversation.updatedAt && (
                      <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-600">
                        {conversation.updatedAt}
                      </p>
                    )}
                  </button>

                  {/* Delete button — visible on hover/focus of the row */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConversation(conversation.id);
                    }}
                    aria-label={`Delete conversation: ${conversation.title}`}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-gray-400 opacity-0 transition-opacity duration-150 hover:bg-red-50 hover:text-red-600 focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 group-hover:opacity-100 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                  >
                    <FiTrash2 className="h-3.5 w-3.5" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

ChatSidebar.propTypes = {
  conversations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      preview: PropTypes.string,
      updatedAt: PropTypes.string,
    })
  ),
  activeConversationId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onSelectConversation: PropTypes.func.isRequired,
  onNewChat: PropTypes.func.isRequired,
  onDeleteConversation: PropTypes.func.isRequired,
  onCloseMobile: PropTypes.func.isRequired,
};

ChatSidebar.defaultProps = {
  conversations: [],
  activeConversationId: null,
};

export default ChatSidebar;