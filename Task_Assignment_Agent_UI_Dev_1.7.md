# APM Task Assignment: Design System & Screen Implementation

## 1. Agent Role & APM Context

**Introduction:** You are activated as an Implementation Agent within the Agentic Project Management (APM) framework for the AI Headhunter project.

**Your Role:** As an Implementation Agent specializing in UI/UX development and design systems, your core function is to implement the comprehensive UI design system and create all application screens following established design patterns, component library, and responsive strategy. You will transform the functional foundation into a beautiful, intuitive, and accessible user interface.

**Workflow:** You interact directly with the User, who acts as the communication bridge with the Manager Agent. You will report your progress, results, or any issues back to the User, who relays updates to the Manager Agent for review and coordination.

**Memory Bank:** You must log your activities, outputs, and results to the designated Memory Bank file (`Memory/Phase_1_Foundation/Task_1.7_UI_Design_Implementation_Log.md`) upon completing tasks or reaching significant milestones, following the standard logging format.

## 2. Onboarding / Context from Prior Work

**Prerequisite Work Completed:** Previous agents have successfully completed comprehensive infrastructure:

- **Task 1.1 (Agent_Setup_Specialist):** Next.js App Router, TypeScript, Tailwind CSS, Shadcn UI components installed and configured, basic Tailwind config with design tokens established
- **Task 1.2 (Agent_Frontend_Dev):** Resume data input system with TypeScript interfaces, Zod validation schemas, react-hook-form integration, and dynamic form components for all resume sections
- **Task 1.3 (Agent_Auth_Dev):** Authentication system with Supabase Auth including login/signup pages, route protection, and user session management
- **Task 1.4 (Agent_Frontend_Dev):** HTML resume rendering engine with multiple professional templates, real-time preview, responsive design, and template switching functionality
- **Task 1.5 (Agent_Frontend_Dev):** PDF export system with high-quality generation, customizable options, download management, and performance optimization
- **Task 1.6 (Agent_Backend_Dev):** Data persistence layer with Supabase database, user authentication integration, resume storage, and auto-save functionality

**Available Infrastructure:**
- Tailwind CSS configured with design tokens (colors, typography, spacing, animations)
- Shadcn UI component library with base components (Button, Form, Input, Card, Select, etc.)
- TypeScript interfaces for all resume data structures with proper validation
- User authentication system with session management and protected routes
- Resume rendering system with template switching and customization
- PDF generation and data persistence systems ready for UI integration
- Existing CSS framework for resume templates and print optimization

**How This Task Integrates:** You will apply the comprehensive design system to create all application screens, integrate visual design with existing functional components, and ensure consistent UI patterns across the entire application. This serves as the final UI layer before testing and quality assurance.

## 3. Task Assignment

**Reference Implementation Plan:** This assignment corresponds to `Phase 1, Task 1.7 - Agent_UI_Dev: Design System & Screen Implementation` in the Implementation Plan.

**Objective:** Implement the comprehensive UI design system and create all application screens following the established design patterns, component library, and responsive strategy for a polished, professional user experience.

## 4. Detailed Action Steps

### Sub-Component 1: Establish design system foundation and layout components

**Your specific actions are:**

1. **Enhance design tokens in tailwind.config.js with comprehensive system**
   - Extend the existing color palette with application-specific tokens:
     ```javascript
     colors: {
       // Extend existing Shadcn colors
       brand: {
         50: '#eff6ff',
         100: '#dbeafe', 
         500: '#2563eb', // Primary brand color
         600: '#1d4ed8',
         900: '#1e3a8a'
       },
       success: {
         50: '#f0fdf4',
         500: '#16a34a',
         600: '#15803d'
       },
       warning: {
         50: '#fffbeb',
         500: '#ea580c', 
         600: '#dc2626'
       },
       // Resume-specific colors
       resume: {
         professional: '#1e3a8a',
         modern: '#2563eb',
         creative: '#0d9488'
       }
     }
     ```
   - Configure comprehensive typography scale with precise line heights:
     ```javascript
     fontSize: {
       'display': ['3.75rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
       'h1': ['1.875rem', { lineHeight: '2.25rem', fontWeight: '700' }],
       'h2': ['1.5rem', { lineHeight: '2rem', fontWeight: '700' }],
       'h3': ['1.25rem', { lineHeight: '1.75rem', fontWeight: '600' }],
       'body-lg': ['1.125rem', { lineHeight: '1.75rem' }],
       'body': ['1rem', { lineHeight: '1.5rem' }],
       'body-sm': ['0.875rem', { lineHeight: '1.25rem' }],
       'caption': ['0.75rem', { lineHeight: '1rem' }]
     }
     ```
   - Add component-specific spacing and radius values for consistency

2. **Create the AppSidebar component using Shadcn Sidebar**
   - Build responsive sidebar: `src/components/layout/AppSidebar.tsx`:
     ```typescript
     interface AppSidebarProps {
       user?: User | null
       currentPath?: string
       onNavigate?: (path: string) => void
     }
     
     const navigationItems = [
       { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
       { icon: FileText, label: 'Resume Builder', path: '/resume' },
       { icon: MessageSquare, label: 'Application Questions', path: '/questions' },
       { icon: History, label: 'History', path: '/history' },
       { icon: Settings, label: 'Settings', path: '/settings' }
     ]
     ```
   - Implement collapsible navigation with active state indicators
   - Add user profile section with avatar, name, and logout functionality
   - Create mobile-optimized overlay behavior for small screens
   - Include proper ARIA labels and keyboard navigation support

3. **Build responsive header component with right-aligned actions**
   - Create TopHeader component: `src/components/layout/TopHeader.tsx`:
     ```typescript
     interface TopHeaderProps {
       title?: string
       showBreadcrumbs?: boolean
       actions?: React.ReactNode
       user?: User | null
     }
     ```
   - Implement breadcrumb navigation with dynamic page titles
   - Add header actions area for page-specific buttons (Save, Export, etc.)
   - Include notification bell and user dropdown menu
   - Create mobile hamburger menu trigger for sidebar toggle

4. **Implement main layout wrapper with proper responsive grid**
   - Build MainLayout component: `src/components/layout/MainLayout.tsx`:
     ```typescript
     interface MainLayoutProps {
       children: React.ReactNode
       sidebar?: boolean
       className?: string
     }
     ```
   - Create responsive grid layout: sidebar (280px) + main content (flex-1)
   - Implement proper mobile behavior: sidebar overlay, full-width content
   - Add loading states and error boundaries for layout stability
   - Include print-optimized styling that hides navigation during PDF generation

### Sub-Component 2: Build core application screens with design patterns

**Your specific actions are:**

1. **Create Dashboard screen with metrics cards and activity feed**
   - Build Dashboard page: `src/app/dashboard/page.tsx`:
     ```typescript
     interface DashboardMetrics {
       totalResumes: number
       applicationsSubmitted: number
       responseRate: number
       lastActivity: Date
     }
     ```
   - Design metrics cards with icons, values, and trend indicators
   - Implement recent activity feed showing resume edits, applications, and feedback
   - Add quick action buttons: "Create New Resume", "Import Resume", "View Applications"
   - Create data visualization components for application success rates and activity trends
   - Include empty states for new users with onboarding guidance

2. **Implement Onboarding flow with multi-step forms and progress indicators**
   - Create Onboarding components: `src/features/onboarding/`:
     ```typescript
     interface OnboardingStep {
       id: string
       title: string
       description: string
       component: React.ComponentType
       required: boolean
     }
     
     const onboardingSteps = [
       { id: 'welcome', title: 'Welcome', component: WelcomeStep },
       { id: 'profile', title: 'Profile Setup', component: ProfileStep },
       { id: 'preferences', title: 'Job Preferences', component: PreferencesStep },
       { id: 'first-resume', title: 'Create Resume', component: ResumeStep }
     ]
     ```
   - Build step navigation with progress bar and step completion indicators
   - Implement form validation and error handling for each step
   - Add save and continue functionality with localStorage backup
   - Create skip options for non-essential steps with clear consequences

3. **Build Application Questions screen with voice input integration**
   - Create ApplicationQuestions page: `src/app/questions/page.tsx`
   - Implement question management interface with categories and filtering
   - Design voice input components with microphone button and recording states:
     ```typescript
     interface VoiceInputProps {
       onTranscription: (text: string) => void
       placeholder?: string
       isRecording?: boolean
     }
     ```
   - Add question templates and AI-generated suggestions
   - Include practice mode with mock interview functionality
   - Create question bank organization with tags and difficulty levels

4. **Create Feedback/History screen with data tables and activity tracking**
   - Build History page: `src/app/history/page.tsx`
   - Implement data table with sorting, filtering, and pagination:
     ```typescript
     interface HistoryEntry {
       id: string
       type: 'resume_edit' | 'application' | 'feedback'
       title: string
       description: string
       status: 'pending' | 'completed' | 'failed'
       createdAt: Date
       metadata?: Record<string, any>
     }
     ```
   - Add activity timeline with expandable entries and action buttons
   - Create filtering by date range, activity type, and status
   - Include export functionality for activity data and analytics

5. **Implement consistent micro-interactions and loading animations**
   - Create loading skeleton components for each major screen section
   - Add hover states and focus indicators for all interactive elements
   - Implement smooth transitions using Tailwind animation classes
   - Create success/error toast notifications with proper positioning
   - Add subtle parallax effects and entrance animations for enhanced UX

### Sub-Component 3: Integrate UI design with existing form components

**Your specific actions are:**

1. **Apply design system styling to Task 1.2 resume form components**
   - Enhance existing form components: `src/features/resume/components/forms/`
   - Apply consistent styling to PersonalInfoForm, ExperienceForm, EducationForm, SkillsForm, ProjectsForm
   - Implement tabbed interface with completion indicators:
     ```typescript
     interface FormTabProps {
       label: string
       isComplete: boolean
       hasErrors: boolean
       isActive: boolean
       onClick: () => void
     }
     ```
   - Add form section navigation with scroll-to-section functionality
   - Create progress indicators showing completion percentage for each section

2. **Implement split-view layout for resume preview integration**
   - Create ResumeBuilder layout: `src/features/resume/components/ResumeBuilder.tsx`:
     ```typescript
     interface ResumeBuilderProps {
       resumeData: ResumeData
       onDataChange: (data: ResumeData) => void
       template: ResumeTemplate
       onTemplateChange: (template: ResumeTemplate) => void
     }
     ```
   - Implement responsive split-view: form (40%) + preview (60%) on desktop
   - Add collapsible panels with resize handles for user preference
   - Create mobile stacked layout with form/preview toggle
   - Include zoom controls and full-screen preview mode

3. **Create responsive tabbed interface with completion indicators**
   - Build enhanced TabNavigation component with visual completion status
   - Implement smart tab switching with unsaved changes warnings
   - Add keyboard navigation (Tab, Arrow keys) for accessibility
   - Create tab overflow handling for mobile devices with horizontal scroll

4. **Add consistent styling for dynamic list components**
   - Enhance experience entries, education items, skills, and projects with consistent patterns:
     ```typescript
     interface DynamicListItemProps {
       item: any
       index: number
       onEdit: (index: number) => void
       onDelete: (index: number) => void
       onReorder: (fromIndex: number, toIndex: number) => void
     }
     ```
   - Implement drag-and-drop reordering with visual feedback
   - Add expand/collapse functionality for detailed editing
   - Create consistent add/edit/delete button patterns with confirmation modals

### Sub-Component 4: Implement responsive design and accessibility features

**Your specific actions are:**

1. **Ensure mobile-first responsive breakpoints work across all screens**
   - Test and optimize all components for mobile (320px+), tablet (768px+), and desktop (1024px+)
   - Implement touch-friendly interface elements (minimum 44px touch targets)
   - Create adaptive navigation: sidebar → hamburger menu → tab bar on small screens
   - Optimize form layouts for mobile with stacked inputs and simplified interactions

2. **Implement comprehensive accessibility features**
   - Add proper ARIA labels, roles, and semantic HTML structure to all components:
     ```typescript
     <button
       aria-label="Add new work experience"
       aria-describedby="experience-help-text"
       role="button"
       tabIndex={0}
     >
     ```
   - Implement keyboard navigation support (Tab, Enter, Escape, Arrow keys)
   - Add focus management with focus traps in modals and proper focus restoration
   - Create high contrast mode support and screen reader optimization
   - Include skip links and proper heading hierarchy (h1 → h2 → h3)

3. **Create consistent modal patterns using Shadcn Dialog components**
   - Build reusable modal components for confirmations, forms, and content display
   - Implement proper modal behavior: focus trap, backdrop click, ESC key handling
   - Add modal size variants (sm, md, lg, xl, fullscreen) with responsive behavior
   - Create loading states and error handling within modals

4. **Test and optimize responsive sidebar behavior**
   - Implement collapsible sidebar with smooth animations
   - Create overlay behavior on mobile with proper z-index management
   - Add gesture support for swipe-to-open/close on mobile devices
   - Optimize sidebar content for different screen sizes with appropriate scrolling

## 5. Technical Implementation Guidelines

**Design System Standards:**
- Follow existing Shadcn UI component patterns and styling conventions
- Use CSS custom properties for dynamic theming and template customization
- Implement consistent spacing using Tailwind's spacing scale (space-y-4, p-6, etc.)
- Create reusable component patterns that can be easily maintained and extended

**Responsive Design Principles:**
- Mobile-first approach with progressive enhancement for larger screens
- Use CSS Grid and Flexbox for layout with proper fallbacks
- Implement touch-friendly interactions with appropriate sizing and spacing
- Optimize images and fonts for different screen densities and connection speeds

**Performance Optimization:**
- Use React.memo() for expensive components to prevent unnecessary re-renders
- Implement lazy loading for non-critical components and images
- Optimize bundle size by importing only necessary Shadcn components
- Use CSS containment and will-change properties for smooth animations

**Accessibility Compliance:**
- Follow WCAG 2.1 guidelines for AA compliance level
- Test with screen readers and keyboard-only navigation
- Implement proper color contrast ratios (minimum 4.5:1 for normal text)
- Create clear focus indicators and logical tab order throughout the application

## 6. Expected Output & Deliverables

**Define Success:** Successful completion means:
- Complete design system implementation with comprehensive design tokens
- All core application screens built with consistent styling and responsive behavior
- Seamless integration of visual design with existing functional components
- Full accessibility compliance with proper ARIA labels and keyboard navigation
- Mobile-optimized interface with touch-friendly interactions and adaptive layouts
- Professional, polished UI that reflects the AI Headhunter brand and user experience goals

**Specify Deliverables:**
- Enhanced `tailwind.config.js` with complete design token system and component variants
- Layout components: `src/components/layout/` (AppSidebar, TopHeader, MainLayout)
- Core application screens: Dashboard, Onboarding, Application Questions, History
- Enhanced form components with integrated design system styling
- Split-view resume builder layout with responsive behavior
- Accessibility features implementation with proper semantic structure
- Responsive design testing documentation and mobile optimization notes
- Component documentation with usage examples and design patterns

**Format:**
- All components must follow TypeScript with proper interface definitions
- Components should be under 150 lines each, splitting into smaller components as needed
- Use Shadcn UI patterns and component variants consistently
- Implement proper error boundaries and loading states
- Follow mobile-first responsive design with Tailwind CSS breakpoints
- Include comprehensive JSDoc comments for component props and usage

## 7. Guiding Notes & Technical Considerations

**Visual Design Priority:**
- Create a professional, modern interface that builds trust with users
- Implement subtle animations and micro-interactions for enhanced user experience
- Use consistent visual hierarchy with proper typography and spacing
- Ensure brand consistency across all screens and components

**User Experience Focus:**
- Prioritize intuitive navigation and clear information architecture
- Implement progressive disclosure to avoid overwhelming new users
- Create helpful empty states and onboarding guidance
- Provide clear feedback for all user actions with appropriate loading and success states

**Integration Considerations:**
- Design components to work seamlessly with existing data persistence from Task 1.6
- Ensure PDF generation integration doesn't interfere with UI layout and styling
- Prepare design system for future AI features and voice input integration
- Create extensible patterns that can accommodate additional features in Phase 2

**Performance and Scalability:**
- Implement efficient rendering patterns to handle large resume datasets
- Optimize image loading and component mounting for fast initial page loads
- Create sustainable CSS architecture that can be maintained as the application grows
- Design for accessibility and internationalization from the beginning

**Brand and Professional Appeal:**
- Create a cohesive visual identity that appeals to job seekers and professionals
- Implement sophisticated color schemes and typography that convey expertise
- Design templates and layouts that produce impressive, employer-ready outputs
- Ensure the interface inspires confidence in the AI headhunter capabilities

## 8. Memory Bank Logging Instructions

Upon successful completion of this task, you **must** log your work comprehensively to the project's `Memory/Phase_1_Foundation/Task_1.7_UI_Design_Implementation_Log.md` file.

**Format Adherence:** Ensure your log includes:
- A reference to the assigned task in the Implementation Plan
- Complete design system documentation including color tokens, typography scale, and spacing system
- Screenshots or descriptions of all implemented screens with responsive behavior notes
- Component architecture documentation with reusable patterns and integration points
- Code snippets for key layout components (AppSidebar, TopHeader, MainLayout) and design system configurations
- Accessibility implementation details including ARIA labels, keyboard navigation, and screen reader optimization
- Mobile optimization notes and responsive design testing results across different devices
- Integration documentation with existing form components and data persistence systems
- Any design decisions made, user experience considerations, or technical challenges encountered
- Performance optimization notes and bundle size impact analysis
- Confirmation of successful execution (all screens implemented, responsive design working, accessibility tested)
- Preparation notes for Task 1.8 (Testing & Quality Assurance) including areas requiring thorough testing

## 9. Clarification Instruction

If any part of this task assignment is unclear, please state your specific questions before proceeding. This includes questions about:
- Design system specifications or visual design requirements
- Responsive design breakpoints or mobile optimization priorities
- Accessibility requirements or WCAG compliance expectations
- Component integration specifics or layout architecture decisions
- Performance optimization targets or bundle size constraints
- Brand guidelines or visual identity requirements for the AI Headhunter application 