# APM Task Assignment: Authentication System Setup

## 1. Agent Role & APM Context

**Introduction:** You are activated as an Implementation Agent within the Agentic Project Management (APM) framework for the AI Headhunter project.

**Your Role:** As an Implementation Agent specializing in authentication and security, your core function is to implement user authentication using Supabase with both email/password and Google OAuth integration. You will create secure login flows, route protection, and session management that serves as the foundation for all user-specific features in the application.

**Workflow:** You interact directly with the User, who acts as the communication bridge with the Manager Agent. You will report your progress, results, or any issues back to the User, who relays updates to the Manager Agent for review and coordination.

**Memory Bank:** You must log your activities, outputs, and results to the designated Memory Bank file (`Memory/Phase_1_Foundation/Task_1.3_Authentication_System_Log.md`) upon completing tasks or reaching significant milestones, following the standard logging format.

## 2. Onboarding / Context from Prior Work

**Prerequisite Work Completed:** Previous agents have successfully completed foundational infrastructure:

- **Task 1.1 (Agent_Setup_Specialist):** Next.js App Router, TypeScript, Tailwind CSS, Shadcn UI components installed and configured, Supabase client configuration established
- **Task 1.2 (Agent_Frontend_Dev):** Resume data input system with TypeScript interfaces, Zod validation schemas, and react-hook-form integration

**Available Infrastructure:**
- Next.js 14 App Router with TypeScript configuration
- Supabase client configuration and environment variables
- Shadcn UI components: Form, Input, Button, Card, Label, Alert, Dialog, Separator
- Tailwind CSS with design system foundation
- Zod validation library and react-hook-form integration
- Project structure: `src/features/`, `src/components/`, `src/lib/`

**How This Task Integrates:** You will create the authentication layer that protects all user-specific features. Subsequent tasks (HTML rendering, PDF export, data persistence) will depend on the user session management and route protection you implement.

## 3. Task Assignment

**Reference Implementation Plan:** This assignment corresponds to `Phase 1, Task 1.3 - Agent_Auth_Dev: Authentication System Setup` in the Implementation Plan.

**Objective:** Implement user authentication using Supabase with both email/password and Google login, including secure route protection and comprehensive session management.

## 4. Detailed Action Steps

### Sub-Component 1: Configure Supabase Auth with email/password and Google OAuth

**Your specific actions are:**

1. **Set up Supabase authentication configuration**
   - Verify Supabase client configuration from Task 1.1 in `src/lib/supabase.ts`
   - Configure authentication settings in Supabase dashboard (enable email/password provider)
   - Set up email templates for sign-up confirmation and password reset
   - Configure site URL and redirect URLs for development and production environments
   - Test basic email/password authentication flow

2. **Configure Google OAuth provider**
   - Set up Google OAuth 2.0 credentials in Google Cloud Console
   - Configure OAuth consent screen with appropriate scopes (email, profile)
   - Add Google OAuth provider in Supabase dashboard with client ID and secret
   - Configure redirect URLs for OAuth flow (`/auth/callback`)
   - Add environment variables for Google OAuth credentials:
     ```
     NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
     GOOGLE_CLIENT_SECRET=your_google_client_secret
     ```

3. **Create authentication utility functions**
   - Build `src/lib/auth.ts` with authentication helper functions:
     ```typescript
     export const signUp = async (email: string, password: string)
     export const signIn = async (email: string, password: string) 
     export const signInWithGoogle = async ()
     export const signOut = async ()
     export const resetPassword = async (email: string)
     export const updatePassword = async (newPassword: string)
     ```
   - Implement proper error handling and type safety for all auth functions
   - Add password strength validation and email format validation

### Sub-Component 2: Create login and sign-up pages using Shadcn UI components

**Your specific actions are:**

1. **Build login page with comprehensive functionality**
   - Create `src/app/login/page.tsx` with responsive design
   - Implement login form using Shadcn Form components with Zod validation:
     ```typescript
     const loginSchema = z.object({
       email: z.string().email("Invalid email address"),
       password: z.string().min(6, "Password must be at least 6 characters")
     })
     ```
   - Add Google sign-in button with proper OAuth flow initialization
   - Include "Remember me" functionality using localStorage preferences
   - Add "Forgot password?" link with modal or separate page
   - Implement loading states, error handling, and success feedback

2. **Create sign-up page with validation and verification**
   - Build `src/app/signup/page.tsx` with complete registration flow
   - Implement sign-up form with comprehensive validation:
     ```typescript
     const signupSchema = z.object({
       email: z.string().email("Invalid email address"),
       password: z.string().min(8, "Password must be at least 8 characters")
         .regex(/[A-Z]/, "Password must contain uppercase letter")
         .regex(/[0-9]/, "Password must contain a number"),
       confirmPassword: z.string()
     }).refine((data) => data.password === data.confirmPassword, {
       message: "Passwords don't match",
       path: ["confirmPassword"]
     })
     ```
   - Add password strength indicator and real-time validation feedback
   - Include terms of service and privacy policy acceptance checkboxes
   - Implement email verification flow with confirmation instructions

3. **Build password reset and recovery flows**
   - Create `src/app/reset-password/page.tsx` for password reset requests
   - Build `src/app/update-password/page.tsx` for password updates via email link
   - Implement secure token validation and expiration handling
   - Add comprehensive error states and user guidance
   - Include redirect logic back to login after successful password reset

4. **Create authentication callback handler**
   - Build `src/app/auth/callback/route.ts` for OAuth and email confirmation handling
   - Implement proper session establishment after OAuth authentication
   - Add error handling for failed OAuth attempts and invalid tokens
   - Ensure proper redirect to intended destination after authentication

### Sub-Component 3: Redirect unauthenticated users to login screen on root route

**Your specific actions are:**

1. **Implement route protection middleware**
   - Create `src/middleware.ts` with authentication checks:
     ```typescript
     export async function middleware(request: NextRequest) {
       const session = await getSession(request)
       const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                         request.nextUrl.pathname.startsWith('/signup')
       
       if (!session && !isAuthPage) {
         return NextResponse.redirect(new URL('/login', request.url))
       }
       if (session && isAuthPage) {
         return NextResponse.redirect(new URL('/dashboard', request.url))
       }
     }
     ```
   - Configure middleware matcher for protected routes
   - Implement session validation and token refresh logic

2. **Configure automatic redirects and route definitions**
   - Define public routes (login, signup, password reset, landing page)
   - Define protected routes (dashboard, resume builder, profile, settings)
   - Implement redirect logic to intended destination after login
   - Store intended destination in session storage for post-login redirect
   - Add proper handling for expired sessions and token refresh

3. **Create route protection utilities**
   - Build `src/lib/route-protection.ts` with helper functions:
     ```typescript
     export const requireAuth = (Component: React.ComponentType) => { ... }
     export const redirectIfAuthenticated = (Component: React.ComponentType) => { ... }
     export const getAuthenticatedUser = () => { ... }
     ```
   - Implement higher-order components for route protection
   - Add loading states for authentication checks

### Sub-Component 4: Add authentication context provider to app layout

**Your specific actions are:**

1. **Implement authentication context and provider**
   - Create `src/contexts/AuthContext.tsx` with comprehensive state management:
     ```typescript
     interface AuthContextType {
       user: User | null
       loading: boolean
       signIn: (email: string, password: string) => Promise<void>
       signUp: (email: string, password: string) => Promise<void>
       signOut: () => Promise<void>
       resetPassword: (email: string) => Promise<void>
     }
     ```
   - Implement user session monitoring and automatic token refresh
   - Add real-time authentication state updates using Supabase listeners
   - Include user profile data management and updates

2. **Create authentication provider component**
   - Build comprehensive provider with session handling:
     ```typescript
     export function AuthProvider({ children }: { children: React.ReactNode }) {
       const [user, setUser] = useState<User | null>(null)
       const [loading, setLoading] = useState(true)
       
       useEffect(() => {
         // Set up auth state listener
         // Handle session refresh
         // Manage user data updates
       }, [])
     }
     ```
   - Implement proper cleanup and memory management
   - Add error recovery and retry logic for network failures

3. **Integrate provider with app layout**
   - Update `src/app/layout.tsx` to include AuthProvider
   - Ensure provider wraps all components that need authentication
   - Add proper TypeScript integration and context typing
   - Implement server-side authentication checks where applicable

### Sub-Component 5: Implement error handling, loading states, and session management

**Your specific actions are:**

1. **Create comprehensive error handling system**
   - Build `src/lib/auth-errors.ts` with error type definitions and handling:
     ```typescript
     export enum AuthErrorType {
       INVALID_CREDENTIALS = 'invalid_credentials',
       EMAIL_NOT_CONFIRMED = 'email_not_confirmed',
       RATE_LIMIT_EXCEEDED = 'rate_limit_exceeded',
       NETWORK_ERROR = 'network_error'
     }
     ```
   - Implement user-friendly error messages and recovery suggestions
   - Add error logging and monitoring integration
   - Create error boundary components for authentication failures

2. **Implement loading states and user feedback**
   - Create loading components for authentication operations:
     - Login/signup form submission states
     - OAuth redirect loading screens
     - Session validation loading states
     - Password reset confirmation states
   - Add progress indicators and user feedback messaging
   - Implement skeleton loading for user profile data

3. **Build session persistence and management**
   - Configure session storage strategy (localStorage vs sessionStorage vs cookies)
   - Implement automatic session refresh before token expiration
   - Add session timeout warnings and auto-logout functionality
   - Create "Remember me" functionality with extended session duration
   - Implement secure session cleanup on logout

4. **Create logout functionality with proper cleanup**
   - Build comprehensive logout function:
     ```typescript
     const handleLogout = async () => {
       await supabase.auth.signOut()
       // Clear local storage
       // Reset application state
       // Redirect to login page
       // Clear sensitive data from memory
     }
     ```
   - Implement global logout (sign out from all devices) option
   - Add logout confirmation dialog for accidental logouts
   - Ensure proper cleanup of user data and sensitive information

5. **Implement authentication guards and utilities**
   - Create protected route components and hooks:
     ```typescript
     export const useAuthRequired = () => { ... }
     export const useUser = () => { ... }
     export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => { ... }
     ```
   - Build authentication status checking utilities
   - Add role-based access control foundation for future features
   - Implement proper TypeScript integration throughout authentication system

## 5. Technical Implementation Guidelines

**Security Best Practices:**
- Never store sensitive authentication data in localStorage
- Implement proper CSRF protection
- Use secure, HttpOnly cookies for session management where applicable
- Validate all authentication inputs on both client and server side
- Implement rate limiting for authentication attempts

**User Experience Standards:**
- Provide clear, actionable error messages
- Implement progressive enhancement for JavaScript-disabled environments
- Add proper loading states for all authentication operations
- Ensure mobile-responsive design for all authentication screens
- Include accessibility features (ARIA labels, keyboard navigation, screen reader support)

**Integration Requirements:**
- Ensure compatibility with existing Supabase client configuration
- Follow established TypeScript interfaces and naming conventions
- Use existing Shadcn UI component patterns and styling
- Integrate with existing Zod validation schemas and react-hook-form patterns

## 6. Expected Output & Deliverables

**Define Success:** Successful completion means:
- Complete Supabase authentication configuration with email/password and Google OAuth
- Functional login and sign-up pages with comprehensive validation
- Working route protection that redirects unauthenticated users
- Integrated authentication context provider with proper session management
- Comprehensive error handling and loading states for all authentication flows
- Secure logout functionality with proper cleanup
- Authentication system ready for integration with subsequent tasks

**Specify Deliverables:**
- `src/lib/auth.ts` - Authentication utility functions
- `src/contexts/AuthContext.tsx` - Authentication context provider
- `src/middleware.ts` - Route protection middleware
- `src/app/login/page.tsx` - Login page with validation
- `src/app/signup/page.tsx` - Sign-up page with verification
- `src/app/reset-password/page.tsx` - Password reset functionality
- `src/app/update-password/page.tsx` - Password update flow
- `src/app/auth/callback/route.ts` - OAuth callback handler
- `src/lib/route-protection.ts` - Route protection utilities
- `src/lib/auth-errors.ts` - Error handling system
- Updated environment variables and configuration documentation

**Format:**
- All components must follow TypeScript and ESLint/Prettier standards
- Components should be under 150 lines each, splitting into smaller components as needed
- Proper use of Shadcn UI components with consistent patterns
- Mobile-first responsive design using Tailwind CSS
- Comprehensive error handling and loading states
- Full accessibility compliance (ARIA labels, keyboard navigation)

## 7. Memory Bank Logging Instructions

Upon successful completion of this task, you **must** log your work comprehensively to the project's `Memory/Phase_1_Foundation/Task_1.3_Authentication_System_Log.md` file.

**Format Adherence:** Ensure your log includes:
- A reference to the assigned task in the Implementation Plan
- Detailed description of Supabase configuration and OAuth setup process
- Code snippets for key authentication functions and context implementation
- Screenshots or descriptions of login/signup pages and user flows
- Documentation of route protection implementation and testing results
- Any security considerations, design decisions, or implementation challenges
- Confirmation of successful execution (authentication flows working, route protection active)
- Integration notes for subsequent tasks that will use the authentication system

## 8. Clarification Instruction

If any part of this task assignment is unclear, please state your specific questions before proceeding. This includes questions about:
- Specific Supabase configuration steps or OAuth provider setup
- Route protection implementation strategy or middleware configuration
- Authentication context integration with existing project structure
- Error handling approaches or user experience requirements
- Security best practices or session management strategies
- Integration requirements with existing TypeScript interfaces and validation schemas 