// src/components/ai/ChatMessage.jsx
import PropTypes from 'prop-types';
import { FiUser, FiCpu } from 'react-icons/fi';

/**
 * Renders a single chat message bubble — user or assistant.
 *
 * Pure and stateless: takes one `message` object and renders it.
 * No local state, no API calls, no navigation, no mock data. This is
 * the extraction point ChatWindow.jsx already marked with a
 * TODO(ChatMessage.jsx) comment around its inline message-row JSX —
 * this component reproduces that same visual output, plus the
 * accessibility and empty-content safeguards this spec explicitly
 * requires (which the inline version didn't yet have).
 *
 * Not wired into ChatWindow.jsx here, per your instruction not to
 * modify it — this file exists standalone, ready to replace that
 * inline block in a future wiring pass.
 */
const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';
  const roleLabel = isUser ? 'You' : 'AI Assistant';

  // Defensive fallback — never crash on empty/missing content, per
  // your "Optional behavior" requirement.
  const content =
    typeof message.content === 'string' && message.content.trim().length > 0
      ? message.content
      : 'No message content.';

  return (
    <div
      className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
      role="group"
      aria-label={`${roleLabel} message`}
    >
      {/* Avatar — icon shape differs between roles so meaning isn't
          conveyed by color alone (satisfies "Do not rely only on
          color to distinguish roles"). */}
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          isUser
            ? 'bg-indigo-600 text-white dark:bg-indigo-500'
            : 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white'
        }`}
        aria-hidden="true"
      >
        {isUser ? <FiUser className="h-4 w-4" /> : <FiCpu className="h-4 w-4" />}
      </div>

      {/* Bubble + role label + timestamp */}
      <div className={`flex max-w-[80%] min-w-0 flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Visually-hidden role label — screen readers get an
            explicit "You said" / "AI Assistant said" cue rather than
            relying on bubble position/color, which is not announced. */}
        <span className="sr-only">{roleLabel} said:</span>

        <div
          className={`max-w-full whitespace-pre-wrap break-words rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
            isUser
              ? 'rounded-tr-sm bg-indigo-600 text-white dark:bg-indigo-500'
              : 'rounded-tl-sm bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
          }`}
        >
          {content}
        </div>

        {message.timestamp && (
          <span className="px-1 text-xs text-gray-400 dark:text-gray-600">
            {message.timestamp}
          </span>
        )}
      </div>
    </div>
  );
};

ChatMessage.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    role: PropTypes.oneOf(['user', 'assistant']).isRequired,
    content: PropTypes.string,
    timestamp: PropTypes.string,
  }).isRequired,
};

export default ChatMessage;