# APM Task Assignment: HTML Resume Rendering Engine

## 1. Agent Role & APM Context

**Introduction:** You are activated as an Implementation Agent within the Agentic Project Management (APM) framework for the AI Headhunter project.

**Your Role:** As an Implementation Agent specializing in frontend development and template systems, your core function is to create a sophisticated resume rendering system that converts structured form data into professionally styled HTML output with multiple template options. You will build the visual foundation that transforms user input into beautiful, printable resumes ready for export.

**Workflow:** You interact directly with the User, who acts as the communication bridge with the Manager Agent. You will report your progress, results, or any issues back to the User, who relays updates to the Manager Agent for review and coordination.

**Memory Bank:** You must log your activities, outputs, and results to the designated Memory Bank file (`Memory/Phase_1_Foundation/Task_1.4_HTML_Resume_Rendering_Log.md`) upon completing tasks or reaching significant milestones, following the standard logging format.

## 2. Onboarding / Context from Prior Work

**Prerequisite Work Completed:** Previous agents have successfully completed foundational infrastructure:

- **Task 1.1 (Agent_Setup_Specialist):** Next.js App Router, TypeScript, Tailwind CSS, Shadcn UI components installed and configured, Supabase client configuration established
- **Task 1.2 (Agent_Frontend_Dev):** Resume data input system with TypeScript interfaces, Zod validation schemas, and react-hook-form integration including PersonalInfo, Experience, Education, Skills, and Projects interfaces
- **Task 1.3 (Agent_Auth_Dev):** Authentication system with Supabase Auth, login/signup pages, route protection, and user session management

**Available Infrastructure:**
- Next.js 14 App Router with TypeScript configuration
- Complete resume data TypeScript interfaces (PersonalInfo, Experience, Education, Skills, Projects)
- Zod validation schemas for all resume sections
- Supabase authentication system with protected routes
- Shadcn UI components: Form, Input, Button, Card, Label, Alert, Dialog, Separator, Tabs
- Tailwind CSS with design system foundation
- Project structure: `src/features/`, `src/components/`, `src/lib/`

**How This Task Integrates:** You will create the visual output system that renders the structured resume data from Task 1.2 into professional HTML templates. This rendering engine will be consumed by Task 1.5 (PDF Export System) and integrated with Task 1.7 (UI Design Implementation) for the preview functionality.

## 3. Task Assignment

**Reference Implementation Plan:** This assignment corresponds to `Phase 1, Task 1.4 - Agent_Frontend_Dev: HTML Resume Rendering Engine` in the Implementation Plan.

**Objective:** Create a sophisticated resume rendering system that converts structured form data into professionally styled HTML output with multiple template options, real-time preview capabilities, and print optimization.

## 4. Detailed Action Steps

### Sub-Component 1: Design resume template system architecture

**Your specific actions are:**

1. **Create base template interface and architecture**
   - Build `src/lib/templates/types.ts` with template interface definitions:
     ```typescript
     export interface ResumeTemplate {
       id: string
       name: string
       description: string
       previewImage: string
       category: 'professional' | 'creative' | 'modern' | 'minimal'
       colorThemes: TemplateColorTheme[]
       fontOptions: TemplateFontOption[]
     }
     
     export interface TemplateRenderProps {
       resumeData: ResumeData
       template: ResumeTemplate
       colorTheme: string
       fontFamily: string
       customizations?: TemplateCustomizations
     }
     ```
   - Design template switching mechanism supporting multiple layouts and styles
   - Create template registry system for easy addition of new templates
   - Implement template metadata system (name, description, category, preview)

2. **Implement responsive CSS framework for templates**
   - Create `src/styles/resume-templates.css` with print-optimized CSS classes:
     ```css
     @media print {
       .resume-template { 
         font-size: 12pt;
         line-height: 1.4;
         color: black;
         background: white;
       }
       .page-break { page-break-before: always; }
       .no-page-break { page-break-inside: avoid; }
     }
     ```
   - Design responsive breakpoints for screen vs print optimization
   - Implement Tailwind utility classes for consistent spacing and typography
   - Create CSS custom properties for dynamic theming and customization

3. **Build modular template component system**
   - Create base template wrapper component: `src/components/templates/BaseTemplate.tsx`
   - Design section-based architecture allowing independent styling of each resume section
   - Implement template inheritance system for shared styling patterns
   - Create template variant system supporting different layouts (single-column, two-column, etc.)

### Sub-Component 2: Build core resume rendering components

**Your specific actions are:**

1. **Create PersonalInfo header component with contact details**
   - Build `src/components/resume/PersonalInfoSection.tsx`:
     ```typescript
     interface PersonalInfoSectionProps {
       data: PersonalInfo
       template: ResumeTemplate
       variant?: 'header' | 'sidebar' | 'compact'
     }
     ```
   - Implement responsive contact information layout (email, phone, location, LinkedIn, website)
   - Add professional summary/objective rendering with proper typography
   - Create photo integration support for templates that include headshots
   - Implement social links with proper formatting and icon integration

2. **Build Experience section with professional formatting**
   - Create `src/components/resume/ExperienceSection.tsx` with sophisticated formatting:
     - Company name, job title, and date range with consistent alignment
     - Location display with proper geographic formatting
     - Bullet-point achievements with proper indentation and spacing
     - Support for multiple formatting styles (bullet lists, paragraphs, skills highlighting)
   - Implement date formatting utilities for consistent display (MM/YYYY, Present, etc.)
   - Add support for employment gap handling and formatting
   - Create achievement highlighting system for quantified results

3. **Implement Education section with academic formatting**
   - Build `src/components/resume/EducationSection.tsx`:
     - Institution name, degree type, and graduation date formatting
     - GPA display with configurable visibility and formatting
     - Relevant coursework, honors, and activities integration
     - Support for multiple degrees and certifications
   - Create consistent date and location formatting matching Experience section
   - Implement academic achievement highlighting (magna cum laude, honors, etc.)
   - Add support for ongoing education and certification expiration dates

4. **Create Skills section with categorization and visual indicators**
   - Build `src/components/resume/SkillsSection.tsx` with advanced features:
     ```typescript
     interface SkillsSectionProps {
       data: Skills[]
       displayMode: 'list' | 'grid' | 'bars' | 'tags'
       showProficiency: boolean
       groupByCategory: boolean
     }
     ```
   - Implement skill categorization (Technical, Languages, Soft Skills, Certifications)
   - Add visual proficiency indicators (bars, dots, stars) with accessibility compliance
   - Create tag-based skill display with proper spacing and wrapping
   - Implement keyword highlighting for ATS optimization

5. **Build Projects section with comprehensive details**
   - Create `src/components/resume/ProjectsSection.tsx`:
     - Project name with optional linking to GitHub/live demos
     - Technology stack display with consistent formatting
     - Project description with achievement-focused formatting
     - Date ranges and project duration calculation
   - Implement responsive link handling (clickable in digital, formatted for print)
   - Add technology tag system with consistent styling
   - Create project highlight system for most relevant projects

### Sub-Component 3: Implement professional styling and layout

**Your specific actions are:**

1. **Design clean, ATS-friendly resume templates**
   - Create Template 1: `src/components/templates/ProfessionalTemplate.tsx` (classic single-column)
   - Create Template 2: `src/components/templates/ModernTemplate.tsx` (two-column with sidebar)
   - Create Template 3: `src/components/templates/MinimalTemplate.tsx` (clean typography focus)
   - Ensure all templates pass ATS (Applicant Tracking System) parsing tests:
     - Use standard section headings (Experience, Education, Skills)
     - Implement proper heading hierarchy (H1, H2, H3)
     - Avoid complex layouts that confuse ATS parsers
     - Use standard fonts and readable formatting

2. **Implement print-optimized CSS with proper page handling**
   - Create print-specific styles in `src/styles/print.css`:
     ```css
     @page {
       margin: 0.5in;
       size: letter;
     }
     .page-break-before { page-break-before: always; }
     .page-break-after { page-break-after: always; }
     .page-break-inside-avoid { page-break-inside: avoid; }
     ```
   - Implement intelligent page break logic to avoid splitting sections awkwardly
   - Add page numbering for multi-page resumes
   - Create print preview styles matching final PDF output exactly

3. **Create visual hierarchy and typography system**
   - Implement typography scale using Tailwind utilities:
     - H1 (Name): `text-3xl font-bold`
     - H2 (Section Headers): `text-xl font-semibold`
     - H3 (Job Titles): `text-lg font-medium`
     - Body text: `text-sm leading-relaxed`
   - Create consistent color schemes supporting multiple themes:
     - Professional: Navy (#1e3a8a) and gray (#374151)
     - Modern: Blue (#2563eb) and slate (#475569)
     - Creative: Teal (#0d9488) and emerald (#059669)
   - Implement proper spacing system using Tailwind space utilities

4. **Ensure mobile responsiveness and cross-device compatibility**
   - Implement responsive breakpoints for template preview:
     - Mobile (sm): Single column, compact spacing
     - Tablet (md): Optimized two-column layout
     - Desktop (lg): Full template layout with proper spacing
   - Create touch-friendly interface elements for mobile editing
   - Test template rendering across different screen sizes and orientations

### Sub-Component 4: Add resume preview and real-time updates

**Your specific actions are:**

1. **Implement live preview functionality with real-time updates**
   - Create `src/components/ResumePreview.tsx` with real-time data binding:
     ```typescript
     interface ResumePreviewProps {
       resumeData: ResumeData
       selectedTemplate: ResumeTemplate
       onTemplateChange: (template: ResumeTemplate) => void
       viewMode: 'edit' | 'preview' | 'print'
     }
     ```
   - Implement React state synchronization between form inputs and preview display
   - Add debounced updates to prevent excessive re-rendering during typing
   - Create preview update indicators showing when content has changed

2. **Create side-by-side editing and preview layout**
   - Build responsive layout component: `src/components/ResumeBuilder.tsx`
   - Implement collapsible preview panel for mobile devices
   - Add synchronized scrolling between form sections and preview sections
   - Create preview focus indicators highlighting the section being edited
   - Implement preview zoom controls for detailed inspection

3. **Add print preview mode with accurate representation**
   - Create dedicated print preview mode: `src/components/PrintPreview.tsx`
   - Implement CSS that exactly matches final PDF output
   - Add print preview controls (zoom, page navigation, print button)
   - Create page break visualization in preview mode
   - Implement print margin guides and safe zone indicators

4. **Implement template switching and customization controls**
   - Build template selection interface: `src/components/TemplateSelector.tsx`
   - Create template preview thumbnails with real user data
   - Implement smooth transitions between template changes
   - Add customization controls for:
     - Color theme selection (primary colors, accent colors)
     - Font family selection (professional fonts like Inter, Roboto, Open Sans)
     - Layout options (single vs two-column, section ordering)
     - Spacing adjustments (compact, normal, spacious)

5. **Create mobile preview mode and responsive optimization**
   - Implement mobile-optimized preview with touch-friendly controls
   - Add pinch-to-zoom functionality for detailed mobile preview
   - Create mobile template variants optimized for smaller screens
   - Implement preview orientation controls (portrait/landscape simulation)

## 5. Technical Implementation Guidelines

**Template Architecture Standards:**
- Use composition over inheritance for template components
- Implement proper TypeScript interfaces for all template props and data structures
- Create reusable section components that work across multiple templates
- Follow React best practices for component lifecycle and state management

**Styling and CSS Standards:**
- Use Tailwind CSS utilities exclusively, avoid custom CSS where possible
- Implement CSS custom properties for dynamic theming and template customization
- Follow BEM naming conventions for any custom CSS classes
- Ensure print styles exactly match screen preview for WYSIWYG experience

**Performance Optimization:**
- Implement React.memo for template components to prevent unnecessary re-renders
- Use useMemo for expensive template calculations and data transformations
- Implement lazy loading for template thumbnails and preview images
- Optimize bundle size by code-splitting template components

**Accessibility Requirements:**
- Implement proper heading hierarchy and semantic HTML structure
- Add ARIA labels for template selection and customization controls
- Ensure sufficient color contrast for all template color schemes
- Implement keyboard navigation for all template interaction elements

## 6. Expected Output & Deliverables

**Define Success:** Successful completion means:
- Complete template system architecture supporting multiple resume layouts
- Professional rendering components for all resume sections (Personal, Experience, Education, Skills, Projects)
- Print-optimized styling with proper page break handling and professional appearance
- Real-time preview functionality with template switching and customization options
- Mobile-responsive design working across all device sizes
- Integration-ready system for PDF export (Task 1.5) and UI design implementation (Task 1.7)

**Specify Deliverables:**
- `src/lib/templates/types.ts` - Template interface definitions and type system
- `src/components/templates/` - Template component directory with multiple template options
- `src/components/resume/` - Resume section components (PersonalInfo, Experience, Education, Skills, Projects)
- `src/components/ResumePreview.tsx` - Main preview component with real-time updates
- `src/components/ResumeBuilder.tsx` - Side-by-side editing and preview layout
- `src/components/TemplateSelector.tsx` - Template selection and customization interface
- `src/components/PrintPreview.tsx` - Print-optimized preview component
- `src/styles/resume-templates.css` - Template-specific styling and print optimization
- `src/styles/print.css` - Print-specific CSS media queries and page handling
- Template documentation with usage examples and customization guides

**Format:**
- All components must follow TypeScript and ESLint/Prettier standards
- Components should be under 150 lines each, splitting into smaller components as needed
- Use composition patterns for template reusability and maintainability
- Implement proper prop interfaces with JSDoc documentation
- Follow mobile-first responsive design principles
- Ensure full accessibility compliance (ARIA labels, semantic HTML, keyboard navigation)

## 7. Guiding Notes & Technical Considerations

**Template System Design:**
- Design templates to be data-agnostic - they should work with any valid ResumeData structure
- Implement template versioning system for future updates and user preference persistence
- Consider template marketplace potential - design system should support easy third-party template integration
- Build template validation system to ensure all required data fields are properly handled

**Print Optimization Priority:**
- Print output quality is critical - PDF export depends on perfect HTML rendering
- Test print output across major browsers (Chrome, Firefox, Safari, Edge)
- Implement print preview that exactly matches final PDF appearance
- Consider printer margin variations and provide user guidance for optimal printing

**Performance Considerations:**
- Preview updates should be instant - use optimized re-rendering strategies
- Template switching should be smooth - preload template assets and use CSS transitions
- Support large resume datasets (10+ years experience, multiple projects) without performance degradation
- Implement progressive enhancement for slower devices and network connections

**Integration Preparation:**
- Design component APIs that work seamlessly with existing form data from Task 1.2
- Prepare for PDF export integration (Task 1.5) - ensure HTML structure is PDF-generation friendly
- Consider future AI customization features (Phase 2) - build template system to support dynamic content modification
- Design for localization support - template system should handle different languages and formatting conventions

## 8. Memory Bank Logging Instructions

Upon successful completion of this task, you **must** log your work comprehensively to the project's `Memory/Phase_1_Foundation/Task_1.4_HTML_Resume_Rendering_Log.md` file.

**Format Adherence:** Ensure your log includes:
- A reference to the assigned task in the Implementation Plan
- Detailed description of template system architecture and design decisions
- Code snippets for key rendering components and template interfaces
- Screenshots or descriptions of template outputs and preview functionality
- Documentation of print optimization implementation and testing results
- Performance optimization notes and responsive design validation
- Any design challenges, template limitations, or browser compatibility issues
- Confirmation of successful execution (templates rendering correctly, preview working, print optimization verified)
- Integration notes for subsequent tasks (PDF export, UI design implementation)

## 9. Clarification Instruction

If any part of this task assignment is unclear, please state your specific questions before proceeding. This includes questions about:
- Template system architecture or component composition patterns
- Print optimization requirements or browser compatibility expectations
- Preview functionality implementation or real-time update strategies
- Integration requirements with existing form data structures or authentication system
- Performance optimization approaches or responsive design patterns
- Accessibility requirements or semantic HTML implementation standards 