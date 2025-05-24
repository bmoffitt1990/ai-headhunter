# APM Task Assignment: Data Persistence & User Management

## 1. Agent Role & APM Context

**Introduction:** You are activated as an Implementation Agent within the Agentic Project Management (APM) framework for the AI Headhunter project.

**Your Role:** As an Implementation Agent specializing in backend development and data architecture, your core function is to implement secure user authentication, resume data storage, and retrieval systems using Supabase. You will create the critical data infrastructure that enables users to save, manage, and access their resume data with proper security, performance, and reliability.

**Workflow:** You interact directly with the User, who acts as the communication bridge with the Manager Agent. You will report your progress, results, or any issues back to the User, who relays updates to the Manager Agent for review and coordination.

**Memory Bank:** You must log your activities, outputs, and results to the designated Memory Bank file (`Memory/Phase_1_Foundation/Task_1.6_Data_Persistence_Log.md`) upon completing tasks or reaching significant milestones, following the standard logging format.

## 2. Onboarding / Context from Prior Work

**Prerequisite Work Completed:** Previous agents have successfully completed foundational infrastructure:

- **Task 1.1 (Agent_Setup_Specialist):** Next.js App Router, TypeScript, Tailwind CSS, Shadcn UI components installed and configured, Supabase client configuration established with environment variables
- **Task 1.2 (Agent_Frontend_Dev):** Resume data input system with comprehensive TypeScript interfaces (PersonalInfo, Experience, Education, Skills, Projects), Zod validation schemas, react-hook-form integration, and dynamic form components
- **Task 1.3 (Agent_Auth_Dev):** Authentication system with Supabase Auth including email/password + Google OAuth, login/signup pages, route protection middleware, and user session management
- **Task 1.4 (Agent_Frontend_Dev):** HTML resume rendering engine with multiple professional templates, real-time preview, responsive design, and template switching functionality
- **Task 1.5 (Agent_Frontend_Dev):** PDF export system with high-quality generation, customizable options, download management, and performance optimization

**Available Infrastructure:**
- Supabase client configured with authentication and database connections
- Complete TypeScript interfaces for all resume data structures with proper validation
- User authentication system with session management and protected routes
- Resume rendering system that produces structured HTML output
- PDF generation system requiring data persistence integration
- Form validation schemas using Zod for data integrity

**How This Task Integrates:** You will create the persistent data layer that stores user resumes, manages user profiles, and provides the foundation for future AI customization features. This system will integrate with the existing authentication from Task 1.3 and support the UI implementation in Task 1.7.

## 3. Task Assignment

**Reference Implementation Plan:** This assignment corresponds to `Phase 1, Task 1.6 - Agent_Backend_Dev: Data Persistence & User Management` in the Implementation Plan.

**Objective:** Implement secure user authentication, resume data storage, and retrieval using Supabase with proper data modeling, security policies, and performance optimization for scalable resume management.

## 4. Detailed Action Steps

### Sub-Component 1: Design database schema for resume storage

**Your specific actions are:**

1. **Create comprehensive database schema with proper relationships**
   - Design user profiles table extending Supabase Auth:
     ```sql
     CREATE TABLE user_profiles (
       id UUID REFERENCES auth.users(id) PRIMARY KEY,
       email TEXT UNIQUE NOT NULL,
       full_name TEXT,
       avatar_url TEXT,
       created_at TIMESTAMPTZ DEFAULT NOW(),
       updated_at TIMESTAMPTZ DEFAULT NOW()
     );
     ```
   - Create resume data table with flexible JSON storage:
     ```sql
     CREATE TABLE resumes (
       id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
       user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
       title TEXT NOT NULL DEFAULT 'Untitled Resume',
       resume_data JSONB NOT NULL,
       template_id TEXT NOT NULL DEFAULT 'professional',
       is_primary BOOLEAN DEFAULT FALSE,
       created_at TIMESTAMPTZ DEFAULT NOW(),
       updated_at TIMESTAMPTZ DEFAULT NOW()
     );
     ```
   - Implement proper indexing for performance optimization on user_id, created_at, and JSONB fields
   - Add constraints for data integrity (unique primary resume per user, valid template IDs)

2. **Create resume version control and revision history**
   - Design resume_versions table for tracking changes:
     ```sql
     CREATE TABLE resume_versions (
       id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
       resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE,
       version_number INTEGER NOT NULL,
       resume_data JSONB NOT NULL,
       change_summary TEXT,
       created_at TIMESTAMPTZ DEFAULT NOW(),
       created_by UUID REFERENCES user_profiles(id)
     );
     ```
   - Implement automatic version creation triggers on resume updates
   - Add version comparison functionality for tracking changes over time
   - Create cleanup policies for old versions (keep last 10 versions per resume)

3. **Design resume sharing and collaboration features**
   - Create resume_shares table for sharing resumes with others:
     ```sql
     CREATE TABLE resume_shares (
       id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
       resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE,
       shared_by UUID REFERENCES user_profiles(id),
       share_token TEXT UNIQUE NOT NULL,
       expires_at TIMESTAMPTZ,
       view_count INTEGER DEFAULT 0,
       created_at TIMESTAMPTZ DEFAULT NOW()
     );
     ```
   - Implement secure token generation for public resume sharing
   - Add expiration handling and access logging for shared resumes
   - Create analytics tracking for resume share performance

4. **Implement data validation and schema enforcement**
   - Create database functions for validating resume JSON structure against TypeScript interfaces
   - Implement CHECK constraints for required fields and data formats
   - Add trigger functions for automatic data sanitization and formatting
   - Create schema migration system for future resume data structure updates

### Sub-Component 2: Implement user authentication system integration

**Your specific actions are:**

1. **Enhance Supabase Auth integration with user profiles**
   - Create user profile creation trigger for new auth users:
     ```sql
     CREATE OR REPLACE FUNCTION create_user_profile()
     RETURNS TRIGGER AS $$
     BEGIN
       INSERT INTO user_profiles (id, email, full_name)
       VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
       RETURN NEW;
     END;
     $$ LANGUAGE plpgsql SECURITY DEFINER;
     ```
   - Implement profile update synchronization with auth changes
   - Add proper error handling for profile creation failures
   - Create profile completion tracking for onboarding requirements

2. **Build authentication middleware and route protection**
   - Create server-side authentication checking: `src/lib/auth/server.ts`:
     ```typescript
     export async function getServerUser() {
       const supabase = createServerComponentClient<Database>({ cookies })
       const { data: { user }, error } = await supabase.auth.getUser()
       
       if (error || !user) {
         throw new Error('Unauthorized')
       }
       
       return user
     }
     ```
   - Implement middleware for API route protection with proper error responses
   - Add session validation and refresh token handling
   - Create authentication helpers for both client and server components

3. **Implement comprehensive error handling for authentication**
   - Create authentication error types and proper error boundaries
   - Implement session timeout handling with automatic logout
   - Add rate limiting for authentication attempts to prevent brute force attacks
   - Create audit logging for authentication events and security monitoring

4. **Build user session management and persistence**
   - Implement secure session storage and retrieval
   - Create session activity tracking for security monitoring
   - Add multi-device session management with device fingerprinting
   - Implement graceful session cleanup on logout and expiration

### Sub-Component 3: Build resume data persistence API

**Your specific actions are:**

1. **Create comprehensive resume CRUD API endpoints**
   - Build resume creation API: `src/app/api/resumes/route.ts`:
     ```typescript
     export async function POST(request: Request) {
       const user = await getServerUser()
       const { title, resume_data, template_id } = await request.json()
       
       // Validate resume data against schema
       const validatedData = resumeDataSchema.parse(resume_data)
       
       const { data, error } = await supabase
         .from('resumes')
         .insert({
           user_id: user.id,
           title,
           resume_data: validatedData,
           template_id
         })
         .select()
         .single()
       
       return NextResponse.json(data)
     }
     ```
   - Implement resume retrieval with proper filtering and pagination
   - Create resume update API with optimistic locking to prevent data conflicts
   - Add resume deletion with proper cascade handling and confirmation requirements

2. **Implement real-time auto-save functionality with debouncing**
   - Create auto-save service: `src/lib/api/autosave.ts`:
     ```typescript
     export class AutoSaveService {
       private debounceTimer: NodeJS.Timeout | null = null
       private readonly DEBOUNCE_DELAY = 2000 // 2 seconds
       
       public scheduleAutoSave(resumeId: string, data: ResumeData) {
         if (this.debounceTimer) {
           clearTimeout(this.debounceTimer)
         }
         
         this.debounceTimer = setTimeout(() => {
           this.performAutoSave(resumeId, data)
         }, this.DEBOUNCE_DELAY)
       }
     }
     ```
   - Implement conflict resolution for concurrent edits
   - Add auto-save status indicators and user feedback
   - Create recovery mechanisms for failed auto-save attempts

3. **Build version control and revision history API**
   - Create version creation API with automatic change detection
   - Implement version comparison and diff functionality
   - Add version restoration with proper data validation
   - Create version cleanup and archival policies

4. **Implement data export and import functionality**
   - Create resume export API supporting multiple formats (JSON, CSV for data portability)
   - Implement resume import with data validation and conflict resolution
   - Add bulk operations for managing multiple resumes
   - Create backup and restore functionality for user data protection

### Sub-Component 4: Implement data security and validation

**Your specific actions are:**

1. **Configure comprehensive Row Level Security (RLS) policies**
   - Implement user-based data access policies:
     ```sql
     ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
     
     CREATE POLICY "Users can only access their own resumes"
     ON resumes FOR ALL
     USING (auth.uid() = user_id);
     
     CREATE POLICY "Users can share resumes via tokens"
     ON resumes FOR SELECT
     USING (
       auth.uid() = user_id OR
       id IN (
         SELECT resume_id FROM resume_shares 
         WHERE expires_at > NOW() OR expires_at IS NULL
       )
     );
     ```
   - Create admin policies for user support and data management
   - Implement sharing policies for collaborative features
   - Add audit policies for security monitoring and compliance

2. **Implement server-side validation for all resume data**
   - Create comprehensive validation middleware using Zod schemas
   - Implement data sanitization to prevent XSS and injection attacks:
     ```typescript
     export function sanitizeResumeData(data: any): ResumeData {
       return {
         personalInfo: {
           ...data.personalInfo,
           summary: DOMPurify.sanitize(data.personalInfo.summary)
         },
         experience: data.experience.map(exp => ({
           ...exp,
           description: DOMPurify.sanitize(exp.description)
         }))
       }
     }
     ```
   - Add input validation for file uploads and external data sources
   - Create data integrity checks and orphaned record cleanup

3. **Implement comprehensive audit logging**
   - Create audit log table for tracking all data changes:
     ```sql
     CREATE TABLE audit_logs (
       id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
       table_name TEXT NOT NULL,
       record_id UUID NOT NULL,
       action TEXT NOT NULL, -- INSERT, UPDATE, DELETE
       old_values JSONB,
       new_values JSONB,
       user_id UUID REFERENCES user_profiles(id),
       ip_address INET,
       user_agent TEXT,
       created_at TIMESTAMPTZ DEFAULT NOW()
     );
     ```
   - Implement automatic audit trail generation for all resume operations
   - Add security event logging for suspicious activities
   - Create audit log analysis and alerting for security monitoring

4. **Build data backup and disaster recovery systems**
   - Implement automated daily backups with point-in-time recovery
   - Create cross-region backup replication for disaster recovery
   - Add data integrity monitoring and corruption detection
   - Implement emergency data recovery procedures and documentation

## 5. Technical Implementation Guidelines

**Database Design Standards:**
- Use UUIDs for all primary keys to prevent enumeration attacks and support distributed systems
- Implement proper foreign key constraints and cascade behaviors for data integrity
- Use JSONB for flexible resume data storage while maintaining query performance
- Design for horizontal scaling with proper partitioning strategies

**Security Best Practices:**
- Implement defense-in-depth with multiple security layers (RLS, API validation, client validation)
- Use parameterized queries and prepared statements to prevent SQL injection
- Implement proper session management with secure cookie settings
- Add comprehensive input validation and output encoding

**Performance Optimization:**
- Create strategic database indexes on frequently queried columns
- Implement query optimization and proper join strategies
- Use connection pooling and query caching where appropriate
- Monitor database performance and implement optimization strategies

**Data Privacy and Compliance:**
- Implement GDPR-compliant data handling with proper consent management
- Add data anonymization and deletion capabilities for user privacy rights
- Create data retention policies and automated cleanup procedures
- Implement comprehensive data access logging for compliance auditing

## 6. Expected Output & Deliverables

**Define Success:** Successful completion means:
- Secure and scalable database schema supporting all resume data requirements
- Robust authentication integration with proper session management and security
- Reliable auto-save functionality with conflict resolution and data integrity
- Comprehensive data security with RLS policies, validation, and audit logging
- High-performance data access with proper indexing and optimization
- Integration-ready APIs for UI implementation and future AI features

**Specify Deliverables:**
- Database migration files with complete schema definition: `supabase/migrations/`
- User profile and resume data types: `src/lib/types/database.ts`
- Resume CRUD API endpoints: `src/app/api/resumes/` directory structure
- Authentication utilities and middleware: `src/lib/auth/` directory
- Auto-save service implementation: `src/lib/api/autosave.ts`
- Data validation and sanitization utilities: `src/lib/validation/`
- Database utilities and helpers: `src/lib/database/`
- RLS policy definitions and security documentation
- API documentation with endpoint specifications and error handling
- Database performance optimization guide and monitoring setup

**Format:**
- All API endpoints must follow RESTful conventions with proper HTTP status codes
- Implement comprehensive error handling with user-friendly messages
- Use TypeScript throughout with proper type safety and interface definitions
- Follow Next.js App Router conventions for API routes and middleware
- Ensure full CORS compliance and security header implementation
- Document all database functions, triggers, and policies with inline comments

## 7. Guiding Notes & Technical Considerations

**Data Architecture Priority:**
- Design database schema to support future AI features and resume customization
- Implement flexible JSON storage while maintaining query performance and data integrity
- Consider data migration strategies for evolving resume structures and user requirements
- Plan for scale with proper indexing and query optimization from the beginning

**Security-First Development:**
- Implement comprehensive security measures at every layer of the data stack
- Use principle of least privilege for all database access and API permissions
- Create detailed security documentation and incident response procedures
- Test security measures thoroughly with penetration testing and vulnerability assessment

**Performance and Scalability:**
- Design for concurrent users and large datasets from the beginning
- Implement efficient caching strategies for frequently accessed data
- Monitor database performance and implement optimization as needed
- Consider future scaling requirements and design appropriate architecture

**Integration Considerations:**
- Design APIs to integrate seamlessly with existing form system from Task 1.2
- Prepare data structure for AI customization features in Phase 2
- Create proper abstraction layers for future feature development
- Ensure compatibility with PDF generation system from Task 1.5

**User Experience Focus:**
- Implement transparent auto-save with clear user feedback and status indicators
- Create fast and responsive data loading with proper loading states
- Design error handling that helps users understand and recover from issues
- Implement data recovery features for user confidence and data protection

## 8. Memory Bank Logging Instructions

Upon successful completion of this task, you **must** log your work comprehensively to the project's `Memory/Phase_1_Foundation/Task_1.6_Data_Persistence_Log.md` file.

**Format Adherence:** Ensure your log includes:
- A reference to the assigned task in the Implementation Plan
- Complete database schema documentation with table structures and relationships
- API endpoint documentation with request/response examples and error handling
- Security implementation details including RLS policies and validation strategies
- Performance optimization notes and database indexing strategies
- Integration documentation for authentication system and existing components
- Code snippets for key functions (auto-save, validation, authentication utilities)
- Testing results for data security, performance, and integration functionality
- Any technical challenges, scalability considerations, or design trade-offs
- Confirmation of successful execution (database setup, API functionality, security testing)
- Integration notes for subsequent Task 1.7 (UI Design Implementation)

## 9. Clarification Instruction

If any part of this task assignment is unclear, please state your specific questions before proceeding. This includes questions about:
- Database schema design decisions or JSON structure requirements
- Authentication integration specifics or session management requirements
- Security policy implementation or compliance requirements
- Performance optimization priorities or scalability targets
- API design patterns or error handling strategies
- Integration requirements with existing authentication or future AI features 