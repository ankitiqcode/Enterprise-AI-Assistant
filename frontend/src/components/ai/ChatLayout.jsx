// src/components/ai/ChatLayout.jsx
import PropTypes from 'prop-types';

/**
 * Reusable two-pane layout wrapper for the AI Assistant.
 *
 * Purely structural — takes `sidebar` and `chat` as render props
 * (JSX nodes) and arranges them responsively. Owns no chat/message
 * state itself; `sidebarOpen`/`onCloseSidebar` are the only pieces
 * of behavior it's responsible for (the mobile drawer's open/close
 * visual state and backdrop dismissal), fully controlled from
 * outside — consistent with every other layout-only component in
 * this app (DashboardLayout.jsx's relationship to Sidebar/Navbar).
 *
 * Not yet wired into AIAssistant.jsx — that page still renders its
 * own inline conversation panel and chat area directly. This is a
 * standalone, generic building block per Feature 11's file list,
 * ready to be composed in a later wiring pass.
 */
const ChatLayout = ({ sidebar, chat, sidebarOpen, onCloseSidebar }) => {
  return (
    <div className="relative flex h-full min-h-0 gap-4 overflow-hidden">
      {/* Mobile backdrop — only rendered while the drawer is open,
          dismisses the sidebar on click/tap. Hidden on lg+ since the
          sidebar is permanently docked there instead of overlaying. */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden"
          onClick={onCloseSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar — fixed ~280px width and permanently visible on
          desktop; an off-canvas drawer that slides in/out on mobile,
          controlled entirely by `sidebarOpen`. */}
      <aside
        className={`
          z-50 flex h-full w-[280px] shrink-0 flex-col overflow-hidden
          rounded-2xl border border-gray-200 bg-white shadow-sm
          transition-transform duration-300 ease-in-out
          dark:border-gray-800 dark:bg-gray-900
          lg:relative lg:translate-x-0
          fixed inset-y-0 left-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        aria-label="Chat conversations"
      >
        {sidebar}
      </aside>

      {/* Main chat area — takes all remaining width, full available
          height. */}
      <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        {chat}
      </div>
    </div>
  );
};

ChatLayout.propTypes = {
  sidebar: PropTypes.node.isRequired,
  chat: PropTypes.node.isRequired,
  sidebarOpen: PropTypes.bool,
  onCloseSidebar: PropTypes.func,
};

ChatLayout.defaultProps = {
  sidebarOpen: false,
  onCloseSidebar: () => {},
};

export default ChatLayout;