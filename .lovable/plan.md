

# Add Hotel and Office Space Agent Workflows

This plan adds two new command-specific animation workflows to the existing demo, making each of the three commands produce a unique, realistic agent experience.

## Overview

Currently, all commands use the same flight-booking animation. We need to make `AegeanBrowserView` and `CurrentToolsView` command-aware, so each command drives its own set of steps, sites, results, and terminal output.

## Changes

### 1. Update CommandSelection commands array

Replace the third command "Monitor 10 websites for price changes" with "Find office space in Manhattan under $50/sqft, 2000+ sqft". Update `commandToLabel` in `BrowserDemo.tsx` accordingly.

**Files:** `CommandSelection.tsx`, `BrowserDemo.tsx`, `NewTaskModal.tsx`

### 2. Refactor AegeanBrowserView to be data-driven

Instead of hardcoded `steps`, `sites`, and `results` arrays, define a configuration object per command type. The component will receive a `command` prop and select the matching config.

**Configuration per command:**

| | Flight | Hotel | Office |
|---|---|---|---|
| Duration | 12s | 14s | 15s |
| Steps | 4 steps (existing) | 6 steps (init params, then 4 analysis steps) | 6 steps (init params, then 4 analysis steps) |
| Sites appear at | 3s | 2s | 2s |
| Sites | 8 airlines | 5 hotel sites | 5 CRE sites |
| Results appear at | 6s | 9s | 10s |
| Results header | "Results" | "18 hotels matched, showing top 3" | "12 properties matched, showing top 3" |
| Completion text | "Completed in 12 seconds" | "Completed in 14 seconds" | "Completed in 15 seconds" |

**Hotel steps (with timing):**
- 0s: "Initializing search parameters..." (with sub-params: Location, Dates, Rating, Amenities)
- 2s: "Analyzing 1,243 properties..."
- 4s: "Checking availability..."
- 6s: "Comparing prices..."
- 8s: "Reading reviews..."

**Office steps:**
- 0s: "Initializing search parameters..." (with sub-params: Location, Price, Size, Type)
- 2s: "Analyzing 342 properties..."
- 4s: "Filtering by budget..."
- 6s: "Checking availability..."
- 8s: "Calculating match scores..."

**Hotel results** (with match badges):
- Park Hyatt Tokyo -- $285/night, 98% Match, Shinjuku, 4.8 stars, Pool/Spa, [View Details]
- The Peninsula Tokyo -- $310/night, 95% Match, Marunouchi, 4.9 stars, Luxury, [View Details]
- Andaz Tokyo -- $265/night, 92% Match, Toranomon, 4.7 stars, Rooftop Bar, [View Details]

**Office results** (with match badges):
- 250 Park Ave, Floor 14 -- $48/sqft, 97% Match, 2,400 sqft, Midtown, Corner Unit/Class A, [Schedule Tour]
- 123 William St, Suite 8A -- $45/sqft, 94% Match, 2,200 sqft, Financial District, Move-in Ready/City Views, [Schedule Tour]
- Hudson Yards Tower C -- $50/sqft, 91% Match, 3,100 sqft, West Side, Modern Fit-out/Amenities, [Schedule Tour]

**Flight results** stay exactly as-is (no match badges, existing card layout).

**New result card structure** for hotel/office commands includes:
- Match percentage badge (top-right): `rgba(95,113,227,0.1)` bg, `#5f71e3` text, bold, rounded-full
- Two detail lines (line 2 optional)
- Parameters sub-panel shown during the init step for hotel/office

### 3. Refactor CurrentToolsView to be data-driven

Add a `command` prop. Define terminal line sets per command:

**Hotel terminal output:**
- "$ Starting hotel search..."
- Navigation to booking.com, hotels.com, agoda
- Errors: "Connection refused: booking.com", "Timeout on Agoda API"
- Retries failing, ends with "Process failed after 5 minutes"
- Timer runs to 300s (5 min)

**Office terminal output:**
- "$ Starting property search..."
- Navigation to loopnet.com, costar.com
- Errors: "Query format invalid", "No API response from LoopNet", authentication failures
- Ends with "No results found - process failed after 6 minutes"
- Timer runs to 360s (6 min)

**Flight terminal output:** stays exactly as current.

### 4. Pass command prop through BrowserDemo

Update `BrowserDemo.tsx` to pass `activeAgent.command` to both `AegeanBrowserView` and `CurrentToolsView`.

## Technical Details

### Data structure approach

Define config objects in each component file (not separate files) to keep things simple:

```text
// In AegeanBrowserView.tsx
const agentConfigs: Record<string, AgentConfig> = {
  "Book a flight to Rome under $200": { steps, sites, results, duration, ... },
  "Find and compare hotel prices in Tokyo": { ... },
  "Find office space in Manhattan under $50/sqft, 2000+ sqft": { ... },
};
```

### Props changes

| Component | New/Changed Props |
|---|---|
| `AegeanBrowserView` | Add `command: string` prop |
| `CurrentToolsView` | Add `command: string` prop |
| `BrowserDemo` | Passes `activeAgent.command` to both views |

### File Changes Summary

| File | Change |
|---|---|
| `src/components/AegeanBrowserView.tsx` | Major -- add config-per-command, params panel, match badges, results header, variable duration |
| `src/components/CurrentToolsView.tsx` | Major -- add terminal-lines-per-command, variable fail time |
| `src/components/CommandSelection.tsx` | Minor -- update 3rd command text |
| `src/components/BrowserDemo.tsx` | Minor -- update commandToLabel, pass command prop to views |
| `src/components/NewTaskModal.tsx` | Minor -- update 3rd command text if it has its own commands list |

