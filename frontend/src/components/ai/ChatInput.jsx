// src/components/ai/ChatInput.jsx
import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { FiSend, FiPaperclip } from 'react-icons/fi';

// Maximum height (px) the textarea will auto-grow to before internal
// scrolling takes over. Matches the ~5-line cap used elsewhere in
// this app's chat placeholders (max-h-32 = 8rem = 128px), expressed
// here in pixels since auto-resize needs a concrete number to
// compare scrollHeight against.
const MAX_TEXTAREA_HEIGHT_PX = 160;

/**
 * Reusable chat message input for the AI Assistant.
 *
 * Manages only its own draft text and textarea height — no chat
 * history, no API calls, no mock responses. Sending is entirely
 * delegated to the parent via onSendMessage(message); this component
 * never decides what happens after a message is sent, only that one
 * was submitted.
 *
 * This is the extraction point ChatWindow.jsx marked as "TEMPORARY
 * INPUT AREA" — not wired into it here, per your instruction not to
 * modify ChatWindow.jsx. Ready to replace that block in a future
 * wiring pass via <ChatInput onSendMessage={...} disabled={isLoading} />.
 */
const ChatInput = ({ onSendMessage, disabled, placeholder }) => {
  const [value, setValue] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize: grow the textarea to fit its content, up to
  // MAX_TEXTAREA_HEIGHT_PX, then let the browser scroll internally.
  // Reset to 'auto' first so shrinking (e.g. after deleting lines or
  // sending) is measured correctly, not just growth.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, MAX_TEXTAREA_HEIGHT_PX)}px`;
  }, [value]);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return; // empty / whitespace-only / disabled -> no send
    onSendMessage(trimmed);
    setValue('');
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
    // Shift+Enter: no special handling needed — the textarea's
    // native behavior inserts a newline on its own.
  };

  // UI-only placeholder — no upload, no API call.
  const handleAttachmentClick = () => {
    console.log('Attach file clicked (UI only, not implemented)');
  };

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex items-end gap-2 rounded-2xl border border-gray-200 bg-gray-50 p-2 transition-colors focus-within:border-indigo-500 focus-within:bg-white dark:border-gray-700 dark:bg-gray-800 dark:focus-within:bg-gray-800">
        {/* Attachment button — UI only, per your instruction */}
        <button
          type="button"
          onClick={handleAttachmentClick}
          disabled={disabled}
          aria-label="Attach file"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-40 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-300"
        >
          <FiPaperclip className="h-4 w-4" />
        </button>

        {/* Textarea */}
        <label htmlFor="chat-input-textarea" className="sr-only">
          Message the AI Assistant
        </label>
        <textarea
          ref={textareaRef}
          id="chat-input-textarea"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          rows={1}
          placeholder={placeholder}
          style={{ maxHeight: `${MAX_TEXTAREA_HEIGHT_PX}px` }}
          className="flex-1 resize-none overflow-y-auto bg-transparent px-2 py-1.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:text-gray-100 dark:placeholder-gray-500"
        />

        {/* Send button */}
        <button
          type="submit"
          disabled={!canSend}
          aria-label="Send message"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white transition-colors hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 dark:focus-visible:ring-offset-gray-800"
        >
          <FiSend className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
};

ChatInput.propTypes = {
  onSendMessage: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
};

ChatInput.defaultProps = {
  disabled: false,
  placeholder: 'Ask anything about your organization...',
};

export default ChatInput;