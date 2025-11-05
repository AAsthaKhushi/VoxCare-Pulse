# VoxCare Pulse Design Guidelines

## Design Approach
**Hybrid System Approach**: Material Design 3 foundation with Linear-inspired dashboard aesthetics for the admin interface, and WhatsApp-style conversational UI for customer chat.

**Rationale**: Enterprise-grade utility platform requiring clarity, information density, and real-time data presentation with emotional intelligence indicators.

---

## Typography System

### Font Families
- **Primary**: Inter (Google Fonts) - All UI text, data displays
- **Monospace**: JetBrains Mono - Vehicle IDs, booking codes, technical data

### Hierarchy
- **H1**: text-4xl font-bold (Dashboard titles)
- **H2**: text-2xl font-semibold (Section headers)
- **H3**: text-xl font-semibold (Card titles, modal headers)
- **Body Large**: text-base font-medium (Primary actions, chat messages)
- **Body**: text-sm (Standard UI text, descriptions)
- **Caption**: text-xs (Timestamps, metadata, helper text)
- **Code/Technical**: text-sm font-mono (VINs, booking IDs)

---

## Layout System

### Spacing Scale
Use Tailwind units: **2, 3, 4, 6, 8, 12, 16** for consistent rhythm
- Component padding: p-4, p-6
- Section spacing: gap-6, gap-8
- Card margins: space-y-4, space-y-6
- Tight groupings: gap-2, gap-3

### Grid Structures
**Admin Dashboard**: 12-column grid (grid-cols-12)
- Sidebar: col-span-2 (fixed 256px)
- Main content: col-span-10
- Metric cards: grid-cols-4 on desktop, cols-2 on tablet, cols-1 mobile

**Customer App**: Single-column focus (max-w-2xl mx-auto)
- Chat interface: Full viewport height
- Vehicle cards: Single column stack

---

## Component Library

### Navigation
**Admin Sidebar**
- Fixed left navigation (w-64)
- Logo at top (h-16)
- Navigation items: py-3 px-4 with icons (size-5)
- Active state: font-semibold with left border indicator (border-l-4)
- Grouped sections with text-xs uppercase labels

**Customer App Header**
- Sticky top bar (sticky top-0 z-50)
- Logo left, profile/settings right
- Height: h-14
- Language toggle and notification icon

### Chat Interface (WhatsApp-style)
**Message Bubbles**
- Sender (left): rounded-2xl rounded-tl-sm with tail effect
- Receiver (right): rounded-2xl rounded-tr-sm
- Max width: max-w-md
- Padding: px-4 py-3
- Timestamp: text-xs below bubble
- Spacing between messages: space-y-2

**Input Area**
- Fixed bottom (sticky bottom-0)
- Textarea with max-h-32
- Send button: rounded-full size-10
- Quick action chips above input: flex gap-2, pill-shaped (rounded-full px-4 py-2)

**Typing Indicator**
- Animated 3-dot loader
- Appears as message bubble
- Subtle pulse animation

### Sentiment Indicators
**Real-time Badge**
- Position: Absolute top-right of message bubbles or cards
- Size: size-3 (dot), size-6 (badge with label)
- Shapes: Circle for dot, rounded-full for badge
- Pulsing animation for active/urgent states
- Label format: text-xs font-medium px-2 py-1

**Sentiment Progress Bar**
- Height: h-2
- Segmented 5-section bar
- Rounded ends: rounded-full
- Positioned below chat header or in admin conversation cards

### Vehicle Health Cards
**Structure**
- Card container: rounded-xl border p-6
- Component icon: size-12 at top
- Health percentage: text-3xl font-bold
- Status label: text-sm font-medium
- Last checked: text-xs
- Progress bar: h-3 rounded-full
- Alert badge if critical: absolute top-4 right-4

**Grid Layout**
- Desktop: grid-cols-3 gap-6
- Tablet: grid-cols-2 gap-4
- Mobile: grid-cols-1 gap-4

### Dashboard Metrics Cards
**Stat Cards**
- Compact: p-4 rounded-lg border
- Icon + Label + Value stack
- Icon: size-8 in rounded-md container (p-2)
- Value: text-2xl font-bold
- Label: text-sm
- Optional trend indicator: text-xs with arrow icon

**Large Metric Panels**
- Full-width sections: p-6 rounded-xl border
- Header with title + action button
- Content area with chart or data table
- Footer with summary stats

### Data Tables
**Queue/List Views**
- Sticky header: sticky top-0
- Row height: h-16 (comfortable clicking)
- Zebra striping with hover states
- Priority column with visual badges
- Action buttons: size-8 icon buttons at row end
- Sentiment indicator column: size-6 badges

### Modals & Drawers
**Modal**
- Max width: max-w-2xl
- Padding: p-6
- Header: pb-4 border-b with close button (absolute top-4 right-4)
- Content: py-6
- Footer: pt-4 border-t with action buttons (justify-end gap-3)

**Side Drawer** (Chat takeover, details)
- Width: w-96 (fixed)
- Slide from right
- Full height
- Header: h-16 sticky top-0
- Scrollable content area
- Close button: absolute top-4 right-4

### Buttons & Actions
**Primary Action**: px-6 py-3 rounded-lg font-medium
**Secondary Action**: px-6 py-3 rounded-lg border font-medium
**Icon Button**: size-10 rounded-lg
**Floating Action**: size-14 rounded-full fixed bottom-6 right-6 with shadow-lg
**Quick Action Chips**: rounded-full px-4 py-2 text-sm font-medium

### Alerts & Notifications
**Toast Notifications**
- Position: fixed top-4 right-4
- Width: w-80
- Padding: p-4
- Rounded: rounded-lg
- Icon left: size-5
- Dismiss button right: size-4
- Auto-dismiss after 5s
- Stack vertically with gap-2

**Alert Banners**
- Full-width strips
- Height: h-12
- Icon + Message + Action button
- Dismissible
- Types: Info, Warning, Critical

### Forms & Inputs
**Text Input**
- Height: h-12
- Padding: px-4
- Rounded: rounded-lg border
- Focus: ring-2 offset-2

**Textarea**
- Padding: p-4
- Min height: min-h-24
- Rounded: rounded-lg border

**Select/Dropdown**
- Height: h-12
- Chevron icon right
- Rounded: rounded-lg border

**Date/Time Picker**
- Calendar popup: w-80 p-4 rounded-xl shadow-2xl
- Time slots: grid-cols-3 gap-2, rounded-lg buttons

### Charts & Visualizations (Recharts)
**Area Charts** (Sentiment over time)
- Height: h-64
- Smooth curves
- Grid lines: subtle
- Tooltip: rounded-lg p-3 shadow-lg

**Bar Charts** (Service bookings)
- Height: h-80
- Bar radius: rounded-t-md
- Spacing: gap between bars

**Heatmap** (Sentiment distribution)
- Cell size: size-8
- Rounded: rounded
- Intensity levels: 5 gradations
- Tooltip on hover

---

## Images

### Hero Section (Landing Page)
**Large Hero Image**: Full-width background showcasing Volkswagen service center with technician and vehicle
- Height: h-[600px] on desktop, h-[400px] mobile
- Overlay gradient for text readability
- CTA buttons with backdrop-blur-sm

### Dashboard Placeholder Images
**Empty States**: Illustrated icons for "No active chats", "All vehicles healthy"
- Size: size-32, centered with text-center

### Vehicle Health Icons
Use Lucide React icons (size-8 to size-12):
- Battery, Droplet, Disc, Gauge, ThermometerSun, AlertTriangle

### Profile Avatars
- Circular: rounded-full
- Sizes: size-8 (small), size-10 (medium), size-12 (large)
- Fallback: Initials on solid background

---

## Responsive Behavior

**Breakpoints**
- Mobile: < 768px (single column, collapsible nav)
- Tablet: 768px - 1024px (2-column grids, persistent nav)
- Desktop: > 1024px (full layouts, sidebars)

**Mobile Adaptations**
- Bottom tab navigation instead of sidebar
- Full-screen modals instead of dialogs
- Stacked metric cards
- Horizontal scroll for data tables (overflow-x-auto)

---

## Accessibility

- All interactive elements: min h-11 touch target
- Focus visible states: ring-2 ring-offset-2
- ARIA labels on icon-only buttons
- Color-independent status indicators (icons + text)
- Keyboard navigation throughout
- Screen reader announcements for real-time updates