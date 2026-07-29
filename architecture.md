# Enterprise Portfolio Architecture

## 1. Overview
This document outlines the architecture for the robust, context-aware Headless CMS, CRM, and Telemetry engine of the portfolio platform. The system dictates frontend behavior based on the visitor's inferred persona (e.g., Hiring Manager, Founder, Senior Dev).

## 2. Core Modules

### 2.1 Context-Aware Content Engine (Headless CMS)
*   **Persona Management:** Definitions of target audiences.
*   **Rule Engine:** Mapping specific Projects, Skills, or Experience blocks to specific Personas.
*   **Content Blocks:** Toggling and reordering content sections based on the active Persona.

### 2.2 Telemetry, CRM & Progressive Profiling
*   **Session Tracking:** Logging visitor sessions, page views, and dwell times.
*   **Message CRM:** Connecting user messages to their session history to provide rich context.

### 2.3 The Journey Engine (Personal Changelog)
*   **Changelog:** Publishing "Releases" (new projects), "Patches" (skills learned), and "Post-Mortems" (lessons learned).

### 2.4 Automation & Integration
*   **Webhooks:** Outbound webhooks triggered on high-value actions (e.g., Slack notifications for new messages).

### 2.5 System Observability & Audit Logs
*   **Audit Logging:** Recording every write/update/delete action performed in the admin panel.

## 3. Database Schema Design (MongoDB / Mongoose)

### 3.1 New Schemas

**Persona**
```typescript
interface IPersona extends Document {
  name: string; // e.g., "Founder", "Recruiter", "Senior Dev"
  description: string;
  isDefault: boolean;
  sectionOrder: string[]; // e.g., ['experience', 'projects', 'skills']
}
```

**Session (Telemetry)**
```typescript
interface ISession extends Document {
  sessionId: string;
  ipAddress?: string;
  userAgent: string;
  inferredPersona?: Types.ObjectId; // Ref: Persona
  pageViews: { path: string; duration: number; timestamp: Date }[];
  clickedProjects: Types.ObjectId[]; // Ref: Project
  startTime: Date;
  lastActiveAt: Date;
}
```

**Changelog**
```typescript
interface IChangelog extends Document {
  title: string;
  type: 'Release' | 'Patch' | 'Post-Mortem';
  content: string; // Markdown
  relatedProjects: Types.ObjectId[]; // Ref: Project
  relatedSkills: Types.ObjectId[]; // Ref: Skill
  publishDate: Date;
}
```

**Webhook**
```typescript
interface IWebhook extends Document {
  name: string;
  url: string;
  events: string[]; // e.g., ['MESSAGE_RECEIVED', 'SESSION_STARTED']
  isActive: boolean;
  secret: string;
}
```

**AuditLog**
```typescript
interface IAuditLog extends Document {
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  entityType: string; // e.g., 'Project', 'Webhook'
  entityId: Types.ObjectId;
  changes: Record<string, any>; // Diff of changes
  adminId: string; // Clerk User ID
  timestamp: Date;
}
```

### 3.2 Updates to Existing Schemas

*   **Project, Skill, Experience:** Add an `allowedPersonas` array (`Types.ObjectId[]` referencing `Persona`) to control visibility based on the inferred persona.
*   **Message:** Add a `sessionId` field (`Types.ObjectId` referencing `Session`) to connect the CRM message to the user's browsing history.

## 4. Frontend Admin Shell & Navigation

The Admin Dashboard is built as an enterprise-grade UI using Next.js App Router, Shadcn UI, and Tailwind CSS.
The layout (`app/admin/layout.tsx`) features a responsive sidebar (`AdminSidebar`) and a top sticky header (`AdminHeader`) with dynamic breadcrumbs.

### Navigation Groups
- **Overview:** Dashboard
- **Content Management:** Profile, Projects, Experience, Skills, Links
- **CMS & Journey:** Personas, Content Rules (Planned), Changelog
- **CRM & Telemetry:** Messages, Visitor Sessions
- **System:** Webhooks, Audit Log

## 5. API Endpoints (CRUD)

We follow RESTful conventions for the Headless CMS operations under the `/api` route.

### Context-Aware Entities
- **Personas**: `GET /api/personas`, `POST /api/personas`, `PUT /api/personas/[id]`, `DELETE /api/personas/[id]`
- **Projects**: `GET /api/projects`, `POST /api/projects`, `PUT /api/projects/[id]`, `DELETE /api/projects/[id]` (Supports Persona Tagging)
- **Experience**: `GET /api/experience`, `POST /api/experience`, `PUT /api/experience/[id]`, `DELETE /api/experience/[id]` (Supports Persona Tagging)

### Journey & System Entities
- **Changelog**: `GET /api/changelog`, `POST /api/changelog`, `PUT /api/changelog/[id]`, `DELETE /api/changelog/[id]`
- **Webhooks**: `GET /api/webhooks`, `POST /api/webhooks`, `PUT /api/webhooks/[id]`, `DELETE /api/webhooks/[id]`

