// src/components/ai/PromptSuggestions.jsx
import PropTypes from 'prop-types';
import { FiMessageSquare, FiUsers, FiClock, FiCalendar, FiFileText, FiBriefcase, FiFolder } from 'react-icons/fi';

/**
 * Reusable prompt-suggestion grid for the AI Assistant's empty
 * state. Purely presentational — no chat state, no API calls, no
 * navigation, no auth, no localStorage. Rendering the six default
 * suggestions when none are supplied, and calling
 * onSelect(suggestion.text) on click, are this component's only two
 * responsibilities.
 *
 * Not wired into AIAssistant.jsx / ChatWindow.jsx here, per your
 * instruction not to modify any existing file — this is a
 * standalone building block, matching the same "build the piece,
 * wire up later" sequencing already used for every other
 * src/components/ai/ file in this feature.
 */

// Default suggestions, used only when the parent doesn't supply its
// own `suggestions` prop. Icons chosen to match the topic of each
// prompt, same icon choices already established in AIAssistant.jsx's
// own inline PROMPT_SUGGESTIONS constant.
const DEFAULT_SUGGESTIONS = [
  { id: 'prompt-001', text: 'How many employees are currently active?', icon: FiUsers },
  { id: 'prompt-002', text: 'Show pending leave requests.', icon: FiClock },
  { id: 'prompt-003', text: "Summarize today's attendance.", icon: FiCalendar },
  { id: 'prompt-004', text: 'Find the latest HR policy.', icon: FiFileText },
  { id: 'prompt-005', text: 'How many employees are in Engineering?', icon: FiBriefcase },
  { id: 'prompt-006', text: 'Show recently uploaded documents.', icon: FiFolder },
];

const PromptSuggestions = ({ suggestions, onSelect }) => {
  const items = suggestions && suggestions.length > 0 ? suggestions : DEFAULT_SUGGESTIONS;

  return (
    <div className="grid w-full grid-cols-1 gap-2.5 sm:grid-cols-2">
      {items.map((suggestion) => {
        // Falls back to FiMessageSquare when a suggestion omits an
        // icon, per your explicit default-icon requirement.
        const Icon = suggestion.icon || FiMessageSquare;

        return (
          <button
            key={suggestion.id}
            type="button"
            onClick={() => onSelect(suggestion.text)}
            aria-label={`Ask: ${suggestion.text}`}
            className="flex items-start gap-2.5 rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-left text-sm text-gray-700 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50/50 hover:shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:border-gray-800 dark:bg-gray-800/30 dark:text-gray-300 dark:hover:border-indigo-500/30 dark:hover:bg-indigo-500/5 dark:focus-visible:ring-offset-gray-900"
          >
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500 dark:text-indigo-400" aria-hidden="true" />
            <span>{suggestion.text}</span>
          </button>
        );
      })}
    </div>
  );
};

PromptSuggestions.propTypes = {
  suggestions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      text: PropTypes.string.isRequired,
      icon: PropTypes.elementType,
    })
  ),
  onSelect: PropTypes.func.isRequired,
};

PromptSuggestions.defaultProps = {
  suggestions: null,
};

export default PromptSuggestions;