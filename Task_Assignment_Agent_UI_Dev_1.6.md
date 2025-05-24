# APM Task Assignment: Design System & Screen Implementation

## 1. Agent Role & APM Context

**Introduction:** You are activated as an Implementation Agent within the Agentic Project Management (APM) framework for the AI Headhunter project.

**Your Role:** As an Implementation Agent specializing in UI/UX development, your core function is to implement the comprehensive design system and create all application screens following established design patterns, component libraries, and responsive strategies. You will translate detailed design specifications into production-ready React components.

**Workflow:** You interact directly with the User, who acts as the communication bridge with the Manager Agent. You will report your progress, results, or any issues back to the User, who relays updates to the Manager Agent for review and coordination.

**Memory Bank:** You must log your activities, outputs, and results to the designated Memory Bank file (`Memory/Phase_1_Foundation/Task_1.6_UI_Design_Implementation_Log.md`) upon completing tasks or reaching significant milestones, following the standard logging format.

## 2. Onboarding / Context from Prior Work

**Prerequisite Work Completed:** Previous agents have successfully completed foundational infrastructure:

- **Task 1.1 (Agent_Setup_Specialist):** Next.js App Router, TypeScript, Tailwind CSS, Shadcn UI components installed and configured
- **Task 1.2 (Agent_Frontend_Dev):** Resume data input system with TypeScript interfaces, Zod validation, and react-hook-form integration
- **Task 1.3 (Agent_Frontend_Dev):** HTML resume rendering components and template system
- **Task 1.4 (Agent_Frontend_Dev):** PDF export functionality with react-to-print
- **Task 1.5 (Agent_Backend_Dev):** Supabase authentication, data persistence, and user management

**Available Infrastructure:**
- Shadcn UI components: Form, Input, Button, Card, Select, Label, Textarea, Tabs, Dialog, Table, Progress, Badge, Avatar, Dropdown Menu
- TypeScript interfaces for resume data (PersonalInfo, Experience, Education, Skills, Projects)
- Zod validation schemas and react-hook-form integration
- Supabase authentication context and database schema
- PDF generation and export capabilities

**How This Task Integrates:** You will apply the comprehensive design system to create all application screens, integrate visual design with existing functional components, and ensure consistent UI patterns across the entire application.

## 3. Task Assignment

**Reference Implementation Plan:** This assignment corresponds to `Phase 1, Task 1.6 - Agent_UI_Dev: Design System & Screen Implementation` in the Implementation Plan.

**Objective:** Implement the comprehensive UI design system and create all application screens following the established design patterns, component library, and responsive strategy.

## 4. Detailed Action Steps

### Sub-Component 1: Establish design system foundation and layout components

**Your specific actions are:**

1. **Implement design tokens in tailwind.config.js**
   - Configure the exact color palette specified:
     ```javascript
     primary: '#2563eb', // Blue - Actions, links, primary buttons
     secondary: 'gray', // Gray scale - Text hierarchy and backgrounds  
     success: '#16a34a', // Green - Positive states
     warning: '#ea580c', // Orange - Attention states
     danger: '#dc2626', // Red - Errors and negative states
     ```
   - Set up typography hierarchy:
     ```javascript
     fontSize: {
       'h1': ['1.875rem', { fontWeight: '700' }], // text-3xl font-bold
       'h2': ['1.125rem', { fontWeight: '700' }], // text-lg font-bold  
       'h3': ['1.125rem', { fontWeight: '600' }], // text-lg font-semibold
       'body': ['0.875rem'], // text-sm
       'caption': ['0.75rem'] // text-xs
     }
     ```
   - Configure spacing system: p-6 (24px) for cards, space-y-6 for sections, space-y-4 for form elements

2. **Create the AppSidebar component using Shadcn Sidebar**
   - Build `src/components/shared/AppSidebar.tsx` with custom navigation menu items
   - Implement responsive sidebar that collapses to overlay on mobile
   - Add proper logo area in SidebarHeader
   - Create navigation items for: Dashboard, Resume Builder, Application Questions, History/Feedback
   - Include current view highlighting and hover states: `hover:bg-sidebar-accent hover:text-sidebar-accent-foreground`

3. **Build responsive header component**
   - Create `src/components/shared/TopHeader.tsx` with clean border styling: `border-b bg-white px-6 py-4`
   - Implement right-aligned actions: `flex items-center justify-between`
   - Add user avatar, notifications, and settings dropdown
   - Ensure mobile-responsive behavior

4. **Implement main layout wrapper**
   - Create `src/components/shared/MainLayout.tsx` with proper responsive grid
   - Use mobile-first breakpoints: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`
   - Implement responsive spacing: `px-4 md:px-6 lg:px-8`
   - Add proper semantic HTML structure (header, main, footer)

5. **Set up print-optimized CSS classes**
   - Create print-specific CSS in global styles for resume rendering
   - Configure serif fonts and proper sizing: `fontFamily: "serif", fontSize: "12px", lineHeight: "1.4"`
   - Set up print margins and page break handling

### Sub-Component 2: Build core application screens with design patterns

**Your specific actions are:**

1. **Create Dashboard screen with metrics cards and activity feed**
   - Build `src/features/dashboard/components/Dashboard.tsx`
   - Implement metrics cards pattern:
     ```typescript
     <Card>
       <CardContent className="p-6">
         <div className="flex items-center justify-between">
           <div> // Metric text
           <Icon /> // Visual indicator
     ```
   - Create activity feed with status dots: `w-2 h-2 bg-color rounded-full`
   - Add data visualization patterns for application statistics
   - Use consistent card spacing: `space-y-6` and `gap-6`

2. **Implement Onboarding flow with multi-step forms**
   - Build `src/features/onboarding/components/OnboardingFlow.tsx`
   - Create progress indicator: `<Progress value={progress} />`
   - Implement step navigation with proper button patterns
   - Use Card containers for step content: `<Card><CardHeader><CardContent>`
   - Add step validation and completion indicators

3. **Build Application Questions screen**
   - Create `src/features/questions/components/ApplicationQuestions.tsx`
   - Implement consistent form patterns with voice input integration
   - Add microphone buttons: `absolute bottom-4 right-4 text-gray-400`
   - Include character count indicators and validation feedback
   - Use proper spacing: `space-y-4` for form elements

4. **Create Feedback/History screen**
   - Build `src/features/history/components/FeedbackHistory.tsx`
   - Implement data table pattern using Shadcn Table components
   - Add filtering and search functionality
   - Create activity tracking displays with status indicators
   - Include pagination and sorting capabilities

5. **Implement consistent micro-interactions and animations**
   - Add hover states: `transition-[width,height,padding]`
   - Implement loading states: `animate-spin rounded-full h-32 w-32 border-t-2`
   - Create smooth transitions for interactive elements
   - Add touch-friendly sizing: minimum 44px for buttons

### Sub-Component 3: Integrate UI design with existing form components

**Your specific actions are:**

1. **Apply design system styling to Task 1.2 resume form components**
   - Update existing `ResumeForm.tsx` with tabbed interface design
   - Apply Card styling: `<Card className="p-6">`
   - Implement completion indicators per section
   - Add consistent form field styling and spacing
   - Integrate proper error message display patterns

2. **Implement split-view layout for resume preview**
   - Create responsive grid layout: `grid-cols-1 lg:grid-cols-2 gap-8`
   - Build form section container with proper spacing
   - Create preview section with zoom and print controls
   - Ensure mobile-responsive behavior (stack vertically on small screens)
   - Add real-time preview updates with smooth transitions

3. **Create responsive tabbed interface for resume sections**
   - Update resume form to use Shadcn Tabs component
   - Implement proper tab navigation with keyboard support
   - Add visual completion indicators for each tab
   - Create consistent styling across all form sections
   - Include mobile-optimized tab behavior

4. **Add consistent styling for dynamic list components**
   - Style experience, education, skills, and projects arrays
   - Implement add/remove button patterns with consistent styling
   - Add drag-and-drop visual indicators
   - Create confirmation dialogs using Shadcn Dialog components
   - Include proper focus management and animations

5. **Integrate voice input UI patterns**
   - Add microphone buttons to relevant form fields
   - Implement recording state indicators
   - Create voice command feedback UI
   - Add visual indicators for voice processing states
   - Ensure accessibility for voice features

### Sub-Component 4: Implement responsive design and accessibility features

**Your specific actions are:**

1. **Ensure mobile-first responsive breakpoints work across all screens**
   - Test and optimize all screens at: mobile (default), md (768px+), lg (1024px+)
   - Implement proper responsive navigation patterns
   - Ensure form usability on mobile devices
   - Test touch interactions and scrolling behavior

2. **Implement touch-friendly interface elements**
   - Ensure all buttons meet minimum 44px size requirement
   - Add proper touch target spacing
   - Implement mobile-optimized form controls
   - Test gesture interactions (swipe, pinch, etc.)

3. **Add proper ARIA labels and semantic HTML structure**
   - Implement proper heading hierarchy (h1, h2, h3)
   - Add ARIA labels for all interactive elements
   - Ensure proper focus management and keyboard navigation
   - Create screen reader friendly content structure

4. **Create consistent modal patterns using Shadcn Dialog**
   - Implement standard modal structure: `<Dialog><DialogTrigger><DialogContent><DialogHeader>`
   - Add proper modal accessibility (focus trapping, escape key handling)
   - Create reusable modal components for common patterns
   - Ensure mobile-responsive modal behavior

5. **Test and optimize responsive sidebar behavior**
   - Implement proper sidebar collapse/expand on mobile
   - Test overlay behavior and backdrop interactions
   - Ensure proper navigation state management
   - Add smooth animations for sidebar transitions

## 5. Design Pattern References

**Component Patterns to Follow:**
- **Sidebar Pattern:** Shadcn Sidebar with SidebarHeader, SidebarContent, SidebarGroup, SidebarMenu structure
- **Form Patterns:** Multi-step with Progress, Tabbed with Tabs component, Dynamic lists with add/remove
- **Data Display:** Metrics cards, data tables, activity feeds with status indicators
- **Interactive Elements:** Hover states, loading animations, voice input indicators
- **Modal Patterns:** Consistent Dialog usage with proper header/content structure

**Responsive Strategy:**
- Mobile-first approach with proper breakpoint usage
- Sidebar collapses to overlay on mobile
- Cards stack vertically on small screens
- Touch-friendly interface elements
- Simplified navigation on mobile

## 6. Expected Output & Deliverables

**Define Success:** Successful completion means:
- Complete design system implementation with all specified tokens and patterns
- All application screens built with consistent styling and responsive behavior
- Integration of visual design with existing functional components
- Proper accessibility implementation with ARIA labels and keyboard navigation
- Mobile-optimized interface with touch-friendly interactions

**Specify Deliverables:**
- Updated `tailwind.config.js` with complete design token system
- AppSidebar, TopHeader, and MainLayout components
- Dashboard, Onboarding, Application Questions, and History screens
- Integrated styling for all existing form components
- Split-view resume preview layout
- Responsive design implementation across all screens
- Accessibility features and proper semantic structure

**Format:**
- All components must follow TypeScript and ESLint/Prettier standards
- Components should be under 150 lines each, splitting into smaller components as needed
- Proper use of Shadcn UI components with consistent patterns
- Mobile-first responsive design using Tailwind CSS breakpoints

## 7. Memory Bank Logging Instructions

Upon successful completion of this task, you **must** log your work comprehensively to the project's `Memory/Phase_1_Foundation/Task_1.6_UI_Design_Implementation_Log.md` file.

**Format Adherence:** Ensure your log includes:
- A reference to the assigned task in the Implementation Plan
- A clear description of the actions taken for each sub-component
- Screenshots or descriptions of implemented screens and components
- Code snippets for key design system configurations (tailwind.config.js, component patterns)
- Any key design decisions made or challenges encountered
- Confirmation of successful execution (responsive design working, accessibility features tested)
- Documentation of the complete component structure and reusable patterns

## 8. Clarification Instruction

If any part of this task assignment is unclear, please state your specific questions before proceeding. This includes questions about:
- Specific design pattern implementations or component structure
- Responsive behavior expectations for complex layouts
- Accessibility requirements beyond standard WCAG guidelines
- Integration approach with existing functional components
- Any mobile-specific interaction patterns or touch behavior 