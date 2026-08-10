// src/components/ai/ChatWindow.jsx
import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { FiCpu, FiUser, FiMenu, FiPlus, FiSend } from 'react-icons/fi';

/**
 * Main chat conversation area for the AI Assistant.
 *
 * Purely presentational + a temporary local input state — does not
 * manage the messages array itself, makes no API calls, and contains
 * no mock data. `messages` and `isLoading` are supplied entirely by
 * the parent; every user action is reported upward via callback
 * props (onSendMessage / onNewChat / onOpenSidebar).
 *
 * The input area below is intentionally temporary and clearly
 * isolated (see the marked region) — it exists only so this
 * component is independently functional/testable before
 * ChatInput.jsx exists. The eventual structure is:
 *   ChatWindow
 *     ├── ChatMessage   (replaces the inline message-row JSX below)
 *     └── ChatInput      (replaces the TEMPORARY INPUT AREA block)
 * Both extraction points are commented accordingly so swapping them
 * in later is a small, obvious change rather than a rewrite.
 *
 * Message shape expected: { id, role: 'user' | 'assistant', content,
 * timestamp }. Note this uses `content` (not `text`), per this
 * spec's example — a different field name than AIAssistant.jsx's
 * current internal message shape, which is expected and unresolved
 * until a future wiring pass, same situation already flagged for
 * ChatSidebar.jsx's conversation shape.
 */
const ChatWindow = ({ messages, isLoading, onSendMessage, onNewChat, onOpenSidebar }) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const hasMessages = messages.length > 0;

  // Keep the latest message (or the typing indicator) visible
  // whenever the conversation changes.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = () => {
    const text = inputValue.trim();
    if (!text || isLoading) return;
    onSendMessage(text);
    setInputValue('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSend();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* ---------------- Chat Header ---------------- */}
      <div className="flex items-center justify-between gap-2 border-b border-gray-100 px-4 py-3.5 sm:px-6 dark:border-gray-800">
        <div className="flex items-center gap-2">
          {/* Mobile-only menu button — opens the conversation sidebar drawer */}
          <button
            type="button"
            onClick={onOpenSidebar}
            aria-label="Open conversations panel"
            className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 lg:hidden dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
          >
            <FiMenu className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              AI Assistant
            </h2>
            <p className="hidden text-xs text-gray-400 sm:block dark:text-gray-600">
              Enterprise HR Assistant
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onNewChat}
          aria-label="Start a new chat"
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200 dark:focus-visible:ring-offset-gray-900"
        >
          <FiPlus className="h-3.5 w-3.5" />
          New Chat
        </button>
      </div>

      {/* ---------------- Message Area ---------------- */}
      <div
        className="flex-1 overflow-y-auto px-4 py-6 sm:px-8"
        role="log"
        aria-live="polite"
        aria-label="Conversation messages"
      >
        {!hasMessages ? (
          // ---------------- Empty State ----------------
          <div className="mx-auto flex h-full max-w-md flex-col items-center justify-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-sm">
              <FiCpu className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
              How can I help you?
            </h3>
            <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
              Ask me about employees, attendance, leave, documents, or HR policies.
            </p>
          </div>
        ) : (
          <div className="mx-auto flex max-w-2xl flex-col gap-5">
            {/* ---------------- Message list ----------------
                TODO(ChatMessage.jsx): each message row below should
                be replaced with <ChatMessage message={message} />
                once that component exists. Kept inline for now so
                this component works standalone. */}
            {messages.map((message) => {
              const isUser = message.role === 'user';
              return (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
                >
                  {/* Avatar */}
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      isUser
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white'
                    }`}
                  >
                    {isUser ? <FiUser className="h-4 w-4" /> : <FiCpu className="h-4 w-4" />}
                  </div>

                  {/* Bubble + timestamp */}
                  <div className={`flex max-w-[80%] flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        isUser
                          ? 'rounded-tr-sm bg-indigo-600 text-white'
                          : 'rounded-tl-sm bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                      }`}
                    >
                      {message.content}
                    </div>
                    {message.timestamp && (
                      <span className="px-1 text-xs text-gray-400 dark:text-gray-600">
                        {message.timestamp}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {/* ---------------- Loading / typing indicator ---------------- */}
            {isLoading && (
              <div className="flex items-start gap-3" aria-label="Assistant is typing">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
                  <FiCpu className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-gray-100 px-4 py-3 dark:bg-gray-800">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s] dark:bg-gray-500" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s] dark:bg-gray-500" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 dark:bg-gray-500" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* ---------------- TEMPORARY INPUT AREA ----------------
          Placeholder only. This entire block will be replaced by
          <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} />
          once ChatInput.jsx is generated — kept minimal and isolated
          here purely so ChatWindow is usable/testable on its own in
          the meantime. */}
      <form
        onSubmit={handleSubmit}
        className="border-t border-gray-200 p-4 sm:px-8 dark:border-gray-800"
      >
        <div className="mx-auto flex max-w-2xl items-end gap-2 rounded-2xl border border-gray-200 bg-gray-50 p-2 transition-colors focus-within:border-indigo-500 focus-within:bg-white dark:border-gray-700 dark:bg-gray-800 dark:focus-within:bg-gray-800">
          <label htmlFor="chat-window-temp-input" className="sr-only">
            Message the AI Assistant
          </label>
          <textarea
            id="chat-window-temp-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            rows={1}
            placeholder="Ask about employees, attendance, leave, documents, or policies..."
            className="max-h-32 flex-1 resize-none bg-transparent px-2 py-1.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:text-gray-100 dark:placeholder-gray-500"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            aria-label="Send message"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white transition-colors hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 dark:focus-visible:ring-offset-gray-800"
          >
            <FiSend className="h-4 w-4" />
          </button>
        </div>
      </form>
      {/* ---------------- END TEMPORARY INPUT AREA ---------------- */}
    </div>
  );
};

ChatWindow.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      role: PropTypes.oneOf(['user', 'assistant']).isRequired,
      content: PropTypes.string.isRequired,
      timestamp: PropTypes.string,
    })
  ),
  isLoading: PropTypes.bool,
  onSendMessage: PropTypes.func.isRequired,
  onNewChat: PropTypes.func.isRequired,
  onOpenSidebar: PropTypes.func.isRequired,
};

ChatWindow.defaultProps = {
  messages: [],
  isLoading: false,
};

export default ChatWindow;