

# Multi-Agent Task Queuing for Browser Demo

This plan adds the ability to run multiple concurrent agents in the browser demo, with sidebar management, a task creation modal, and independent progress tracking per agent.

## What Changes

### New Components
- **NewTaskModal** -- A centered overlay modal reusing the command bubble design from CommandSelection. Appears when clicking "+ New Task", fades in/out smoothly, closes on backdrop click or command selection.

### Modified Components

#### BrowserDemo.tsx (major refactor)
- **State**: Replace single `command`/`isAegean` with an `agents` array and `activeAgentId`. Each agent object holds: `id`, `command`, `label`, `status` (active/complete), `isAegean` toggle state, and `startTime`.
- **Top Bar**: Add "+ New Task" button (Plus icon from lucide-react) next to Reset, styled with `rgba(95,113,227,0.15)` background and `#5f71e3` text.
- **Sidebar**: Render all agents as stacked cards. Each card shows agent number, task name, and a status dot (green=active, blue checkmark=complete). The selected agent gets a `2px solid #5f71e3` border and subtle box-shadow glow. Cards are clickable to switch the main view. Hover state adds slight lift.
- **Main View**: Cross-fade between agents using opacity transitions (500ms). Each agent's AegeanBrowserView/CurrentToolsView runs independently with its own `isActive` prop driven by whether it's the selected agent.
- **Reset**: Clears the entire agents array and calls `onReset()` to return to the CommandSelection screen.
- **Modal state**: A boolean `showNewTaskModal` controls the modal visibility.

#### AegeanBrowserView.tsx (minor update)
- Accept an optional `agentLabel` prop to display the correct task name in the header instead of hardcoded "Flight Booking Agent".
- Accept an optional `onComplete` callback so BrowserDemo can update the agent's status to "complete" when the 12-second timer finishes.

#### CurrentToolsView.tsx (no changes needed)
- Already accepts `isActive` and resets on deactivation, so it works as-is for multiple instances.

#### Index.tsx (minor update)
- `BrowserDemo` will receive the first command as before, but internally manages the multi-agent state. The `command` prop seeds the initial agent. No changes to the hero/commands/demo section flow.

### Agent Data Structure
```text
interface Agent {
  id: string
  command: string
  label: string          // e.g. "Flight Booking Agent"
  status: "active" | "complete"
  isAegean: boolean      // per-agent toggle state
  startTime: number      // Date.now() when created
}
```

### Command-to-Label Mapping
- "Book a flight to Rome under $200" -> "Flight Booking Agent"
- "Find and compare hotel prices in Tokyo" -> "Hotel Search Agent"  
- "Monitor 10 websites for price changes" -> "Price Monitor Agent"

## Technical Details

### BrowserDemo State Management
```text
agents: Agent[]              -- all queued agents
activeAgentId: string | null -- which agent's view is shown
showNewTaskModal: boolean    -- modal visibility
```

Adding a new agent: push to array, set as active, close modal.
Each AegeanBrowserView instance runs its own timer independently based on `isActive={agent.id === activeAgentId && agent.isAegean}`.

### Rendering Multiple Agent Views
Only the active agent's view is rendered (not all agents simultaneously) to avoid performance issues with multiple timers. When switching agents, a brief opacity transition handles the cross-fade. The elapsed time for non-active Aegean views will resume from where they left off since each view manages its own internal timer based on `isActive`.

### Modal Implementation
Built inline in BrowserDemo (no external library needed). Uses a fixed overlay div with:
- `background: rgba(0, 0, 0, 0.6)` and `backdropFilter: blur(4px)`
- Centered flex container with the 3 command buttons
- Click handler on backdrop to close
- 300ms opacity transition for open/close

### File Changes Summary
| File | Action |
|------|--------|
| `src/components/BrowserDemo.tsx` | Major refactor -- multi-agent state, sidebar, modal, top bar button |
| `src/components/AegeanBrowserView.tsx` | Add `agentLabel` and `onComplete` props |
| `src/components/NewTaskModal.tsx` | New file -- modal overlay with command bubbles |

