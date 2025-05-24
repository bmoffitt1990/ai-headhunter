# APM Task Assignment: Resume Data Input System

## 1. Agent Role & APM Context

**Introduction:** You are activated as an Implementation Agent within the Agentic Project Management (APM) framework for the AI Headhunter project.

**Your Role:** As an Implementation Agent, your core function is to execute specific tasks assigned to you based on our detailed project plan. This involves understanding the requirements provided, performing the necessary actions (e.g., writing code, building components, implementing forms), and meticulously documenting your work.

**Workflow:** You interact directly with the User, who acts as the communication bridge with the Manager Agent. You will report your progress, results, or any issues back to the User, who relays updates to the Manager Agent for review and coordination.

**Memory Bank:** You must log your activities, outputs, and results to the designated Memory Bank file (`Memory/Phase_1_Foundation/Task_1.2_Resume_Input_System_Log.md`) upon completing tasks or reaching significant milestones, following the standard logging format defined in `prompts/02_Utility_Prompts_And_Format_Definitions/Memory_Bank_Log_Format.md`.

## 2. Onboarding / Context from Prior Work

**Prerequisite Work Completed:** Agent_Setup_Specialist has successfully completed Task 1.1 - Project Architecture & Environment Setup. The following foundational infrastructure is now in place:

- **Project Structure:** Feature-based directory structure with `src/features/resume/`, `src/components/`, `src/lib/` properly configured
- **Technology Stack:** Next.js App Router with TypeScript, Tailwind CSS, and Shadcn UI components installed
- **Backend Integration:** Supabase client configured with authentication context and database schema
- **Development Environment:** ESLint, Prettier, and Vercel deployment pipeline configured

**Key Infrastructure Available:**
- Shadcn UI components: Form, Input, Button, Card, Select, Label, Textarea
- TypeScript configuration with strict mode and path aliases
- Supabase database with `profiles` and `resumes` tables configured
- Authentication context and providers ready for use

**How This Task Builds Upon Prior Work:** You will now create the resume input system using the configured Shadcn UI components, TypeScript interfaces, and Supabase backend integration to store resume data as structured JSON.

## 3. Task Assignment

**Reference Implementation Plan:** This assignment corresponds to `Phase 1, Task 1.2 - Agent_Frontend_Dev: Resume Data Input System` in the Implementation Plan.

**Objective:** Create a comprehensive, validated form system for users to input all resume components with proper structure and validation.

## 4. Detailed Action Steps

### Sub-Component 1: Design resume data schema and TypeScript interfaces

**Your specific actions are:**

1. **Define interfaces for all resume sections**
   - Create `src/features/resume/types/resume.ts` with comprehensive TypeScript interfaces
   - Define the following interfaces:
     ```typescript
     interface PersonalInfo {
       fullName: string;
       email: string;
       phone: string;
       location: string;
       summary?: string;
       linkedIn?: string;
       portfolio?: string;
     }
     
     interface Experience {
       id: string;
       company: string;
       position: string;
       location: string;
       startDate: string;
       endDate?: string;
       current: boolean;
       description: string[];
       achievements: string[];
     }
     
     interface Education {
       id: string;
       institution: string;
       degree: string;
       field: string;
       location: string;
       startDate: string;
       endDate?: string;
       gpa?: number;
       coursework?: string[];
     }
     
     interface Skill {
       id: string;
       name: string;
       category: 'technical' | 'soft' | 'certification';
       level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
     }
     
     interface Project {
       id: string;
       name: string;
       description: string;
       technologies: string[];
       startDate: string;
       endDate?: string;
       githubUrl?: string;
       demoUrl?: string;
     }
     
     interface ResumeData {
       personalInfo: PersonalInfo;
       experience: Experience[];
       education: Education[];
       skills: Skill[];
       projects: Project[];
     }
     ```

2. **Create comprehensive validation schemas using Zod**
   - Create `src/lib/validations/resume-schema.ts`
   - **Critical Requirement:** Use Zod library for all form validation to ensure type safety and runtime validation
   - Define validation schemas that mirror the TypeScript interfaces exactly
   - Include proper validation rules (email format, phone format, required fields, date validation)
   - Ensure schema supports array validation for experience, education, skills, and projects

3. **Ensure schema supports future AI customization requirements**
   - Design the JSON structure to be easily parseable by AI systems
   - Include metadata fields that AI can use for customization decisions
   - Structure descriptions and achievements as arrays for easy AI manipulation
   - Add optional fields for AI-generated content tracking

4. **Define proper data relationships and field specifications**
   - Mark required vs optional fields clearly in both TypeScript and Zod schemas
   - Implement proper date validation ensuring end dates are after start dates
   - Create utility types for form states and validation errors
   - Define default values for new entries

### Sub-Component 2: Implement multi-section resume input form

**Your specific actions are:**

1. **Create tabbed or accordion-based form layout**
   - Build the main form component in `src/features/resume/components/ResumeForm.tsx`
   - Use Shadcn UI Tabs or Accordion component for section navigation
   - Implement responsive design that works on mobile and desktop
   - Create clear visual indicators for form completion status per section

2. **Implement dynamic array fields for all sections**
   - Create reusable `ArrayField` component for managing dynamic lists
   - Implement add/remove functionality with proper state management
   - Ensure proper form validation when adding/removing items
   - Add drag-and-drop reordering capability for experience and education entries

3. **Add form state management using react-hook-form with zodResolver**
   - **Critical Requirement:** Use react-hook-form library with zodResolver for form management
   - Configure the form with proper TypeScript typing using the defined interfaces
   - Implement nested form validation for array fields
   - Set up proper error handling and display for all form fields

4. **Include proper field validation with real-time error feedback**
   - Implement real-time validation that shows errors as user types
   - Create user-friendly error messages for all validation rules
   - Add visual indicators (colors, icons) for field validation states
   - Implement form-level validation summary

5. **Implement form persistence in browser localStorage**
   - Create auto-save functionality that saves form data every 30 seconds
   - Implement draft recovery when user returns to the form
   - Add manual save/load functionality for user control
   - Clear localStorage when form is successfully submitted

### Sub-Component 3: Build experience and education entry components

**Your specific actions are:**

1. **Create reusable job experience entry components**
   - Build `ExperienceEntry.tsx` component in `src/features/resume/components/`
   - Include fields: company, position, location, start/end dates, current position toggle
   - Implement proper date picker components using Shadcn UI
   - Add validation for date ranges and required fields

2. **Build education entry components**
   - Create `EducationEntry.tsx` component with fields: institution, degree, field of study, location, dates, GPA
   - Implement conditional fields (GPA optional, coursework array)
   - Add proper validation for academic date ranges
   - Include support for ongoing education (current student toggle)

3. **Implement dynamic add/remove functionality**
   - Create consistent add/remove button styling and behavior
   - Implement confirmation dialogs for entry deletion
   - Add keyboard shortcuts for common actions (Ctrl+Enter to add, Delete to remove)
   - Ensure proper focus management when adding/removing entries

4. **Add rich text support for descriptions and achievements**
   - Implement structured bullet point input for job descriptions
   - Create achievement input with quantification prompts (numbers, percentages, metrics)
   - Add character count indicators for optimal resume length
   - **Technical Note:** Use simple markdown support or structured bullet arrays rather than full rich text editor

5. **Include proper date validation and formatting**
   - Implement date picker with month/year selection
   - Add validation ensuring end dates are after start dates
   - Format dates consistently for display (MM/YYYY format)
   - Handle "Present" or "Current" states for ongoing positions

### Sub-Component 4: Implement skills and projects sections

**Your specific actions are:**

1. **Create categorized skills input system**
   - Build `SkillsSection.tsx` component with three categories: technical, soft skills, certifications
   - Implement tagging interface for easy skill addition
   - Add skill level indicators (beginner, intermediate, advanced, expert)
   - Create search/autocomplete functionality for common skills

2. **Build project entry components**
   - Create `ProjectEntry.tsx` with fields: name, description, technologies, dates, links
   - Implement technology tagging system with autocomplete
   - Add URL validation for GitHub and demo links
   - Include project duration calculation and display

3. **Add skill level indicators and proficiency ratings**
   - Implement visual skill level indicators (progress bars, stars, or badges)
   - Allow users to rate their proficiency in each skill
   - Create skill grouping by proficiency level for better organization
   - Add tooltips explaining each proficiency level

4. **Implement tagging system for easy categorization**
   - Create reusable `TagInput` component for skills and technologies
   - Implement autocomplete with common skills/technologies database
   - Add color coding for different skill categories
   - Allow custom tag creation with validation

5. **Include project showcase with links**
   - Add preview functionality for project links (when possible)
   - Implement proper URL validation and formatting
   - Create visual indicators for different link types (GitHub, demo, documentation)
   - Add optional project image upload capability

## 5. Expected Output & Deliverables

**Define Success:** Successful completion means:
- Complete resume input form with all sections (Personal Info, Experience, Education, Skills, Projects)
- Working validation using Zod schemas with real-time error feedback
- Form persistence in localStorage with auto-save functionality
- Responsive design that works across all device sizes
- Integration with Supabase for data storage when user is authenticated

**Specify Deliverables:**
- TypeScript interfaces and Zod validation schemas for all resume sections
- Complete form components using react-hook-form and Shadcn UI
- Reusable components for experience, education, and project entries
- Skills input system with categorization and proficiency levels
- Form persistence system with localStorage integration
- Comprehensive form validation with user-friendly error messages

**Format:**
- All components must follow the established TypeScript and ESLint/Prettier standards
- Components should be under 150 lines each, splitting into smaller components as needed
- Proper accessibility attributes (ARIA labels, keyboard navigation)
- Mobile-first responsive design using Tailwind CSS

## 6. Memory Bank Logging Instructions

Upon successful completion of this task, you **must** log your work comprehensively to the project's `Memory/Phase_1_Foundation/Task_1.2_Resume_Input_System_Log.md` file.

**Format Adherence:** Adhere strictly to the established logging format defined in `prompts/02_Utility_Prompts_And_Format_Definitions/Memory_Bank_Log_Format.md`. Ensure your log includes:
- A reference to the assigned task in the Implementation Plan
- A clear description of the actions taken for each sub-component
- Code snippets for key TypeScript interfaces and Zod schemas
- Any key design decisions made for form architecture
- Confirmation of successful execution (form validation working, data persistence functional)
- Any challenges encountered with react-hook-form or Zod integration
- Documentation of the complete form component structure and usage

## 7. Clarification Instruction

If any part of this task assignment is unclear, please state your specific questions before proceeding. This includes questions about:
- Specific form layout preferences (tabs vs accordion)
- Validation requirements or error message styling
- Data persistence strategy or localStorage structure
- Integration approach with the existing Supabase authentication system
- Any specific accessibility requirements beyond standard WCAG guidelines 