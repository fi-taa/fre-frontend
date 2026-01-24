# FitAA FRE - API & Database Schema Documentation

**Frontend Application Overview**: A comprehensive attendance tracking and member management system for church organizations with support for multiple member categories, event management, and attendance records.

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Data Models & Schema](#data-models--schema)
3. [Authentication Flow](#authentication-flow)
4. [Core Features & Workflows](#core-features--workflows)
5. [API Endpoints](#api-endpoints)
6. [Database Schema](#database-schema)
7. [Business Logic Requirements](#business-logic-requirements)
8. [Data Validation Rules](#data-validation-rules)

---

## System Overview

### Application Purpose
A web-based attendance and member management system designed for church organizations to:
- Manage member records across different categories
- Track attendance at various events
- Generate attendance statistics and reports
- Support multiple user accounts

### Key Features
1. **User Management**: Username/password-based authentication
2. **Member Records**: Create, edit, view, and delete member records
3. **Event Management**: Create and manage events per category
4. **Attendance Tracking**: Record attendance for events with status tracking
5. **Filtering & Search**: Search and filter records and attendance data
6. **Dashboard**: View overview of records and attendance

### Target Users
- Church staff or volunteers managing attendance
- Event organizers
- Administrative personnel

---

## Data Models & Schema

### 1. User Model

**Purpose**: Authentication and user account management

```typescript
interface User {
  id: string;                 // UUID (primary key)
  username: string;           // Unique, 3+ characters
  password: string;           // Hashed password (6+ characters required)
  createdAt: timestamp;
  updatedAt: timestamp;
}
```

**Constraints**:
- Username must be unique
- Username minimum 3 characters
- Password minimum 6 characters (should be hashed using bcrypt or similar)
- Username cannot be empty

---

### 2. Record Model (to be updated by `tezena`)

**Purpose**: Represents members/people in the system

```typescript
interface Record {
  id: string;                    // UUID (primary key)
  name: string;                  // Required, name of person
  church: string;                // Church/organization name
  age: number;                   // Required, age in years
  category: RecordCategory;      // Required, one of four categories
  
  // Personal Information
  phone?: string;
  email?: string;
  address?: string;
  dateOfBirth?: string;          // ISO date format
  gender?: string;               // 'Male' | 'Female'
  
  // Employment/Staff (ሰራተኛ category)
  position?: string;
  department?: string;
  startDate?: string;             // ISO date format
  salary?: number;
  workPhone?: string;
  workEmail?: string;
  supervisor?: string;
  workLocation?: string;
  
  // Additional Employment Info
  emergencyContact?: string;
  emergencyPhone?: string;
  skills?: string;
  certifications?: string;
  languages?: string;
  
  // Youth (ወጣት category)
  education?: string;
  occupation?: string;
  maritalStatus?: string;         // 'Single' | 'Married' | 'Divorced'
  programName?: string;           // Required for youth
  programRole?: string;
  participationDate?: string;     // ISO date format
  leadershipRole?: string;
  activities?: string;
  interests?: string;
  volunteerWork?: string;
  achievements?: string;
  goals?: string;
  
  // Adult (አዳጊ category)
  profession?: string;
  experience?: number;            // Years of experience
  specialization?: string;
  company?: string;
  businessType?: string;
  businessAddress?: string;
  businessPhone?: string;
  yearsInBusiness?: number;
  mentorship?: string;
  contributions?: string;
  network?: string;
  resources?: string;
  
  // Children (ህጻናት category)
  grade?: string;
  parentName?: string;            // Required for children
  parentPhone?: string;           // Required for children
  parentEmail?: string;
  parentAddress?: string;
  relationship?: string;
  enrollmentDate?: string;        // ISO date format
  schoolName?: string;
  specialNeeds?: string;
  
  // General
  notes?: string;
  createdAt: timestamp;
  updatedAt: timestamp;
}
```

**Record Categories** (RecordCategory):
- `ሰራተኛ` - Staff/Employees
- `ወጣት` - Youth
- `አዳጊ` - Adults
- `ህጻናት` - Children

**Constraints**:
- `name`, `church`, `age`, and `category` are required
- Fields are marked optional based on category requirements
- Age should be a positive integer
- Dates should be in ISO 8601 format (YYYY-MM-DD)
- Phone numbers should follow standard format
- Email should be valid email format

---

### 3. Event Model

**Purpose**: Represents events where attendance is tracked

```typescript
interface Event {
  id: string;                 // UUID (primary key)
  name: string;               // Event name (required)
  category: RecordCategory;   // Events are category-specific
  description?: string;       // Optional description
  isDefault: boolean;         // Is this a default system event?
  createdAt: timestamp;       // ISO 8601 timestamp
}
```

**Constraints**:
- Event name must be unique per category
- Cannot delete default events
- Event belongs to one category

**Default Events** (Pre-populated in system):

For **ሰራተኛ** (Staff):
- Staff Meeting
- Training Session
- Weekly Service
- Special Event

For **ወጣት** (Youth):
- Youth Meeting
- Bible Study
- Fellowship
- Outreach
- Sports Activity

For **አዳጊ** (Adults):
- Adult Bible Study
- Prayer Meeting
- Fellowship
- Workshop

For **ህጻናት** (Children):
- Sunday School
- Children's Service
- Activity Day
- Special Program

---

### 4. Attendance Model

**Purpose**: Tracks attendance records for events

```typescript
interface Attendance {
  id: string;                 // UUID (primary key)
  recordId: string;           // Foreign key to Record
  eventId: string;            // Foreign key to Event
  date: string;               // ISO date format (YYYY-MM-DD)
  time?: string;              // ISO time format (HH:MM) or null
  status: AttendanceStatus;   // Attendance status
  notes?: string;             // Optional notes about attendance
  createdAt: timestamp;       // ISO 8601 timestamp
}
```

**Attendance Status** (AttendanceStatus):
- `present` - Person was present
- `absent` - Person was absent
- `late` - Person arrived late
- `excused` - Person was excused from attendance

**Constraints**:
- `recordId` must reference valid Record
- `eventId` must reference valid Event
- `date` is required and must be valid date
- `status` is required
- Cannot have duplicate attendance records for same record/event/date combination

---

## Authentication Flow

### Sign Up Flow

1. **User enters registration details**:
   - Username (required, min 3 characters)
   - Password (required, min 6 characters)
   - Confirm Password

2. **Frontend validates**:
   - Username length >= 3
   - Password length >= 6
   - Passwords match

3. **Backend validates**:
   - Username is unique (not already in database)
   - Password strength requirements
   - Return success or specific error

4. **On success**:
   - User account created
   - Session created automatically
   - Redirect to dashboard

### Login Flow

1. **User enters credentials**:
   - Username
   - Password

2. **Frontend validates**:
   - Both fields are required
   - Not empty

3. **Backend validates**:
   - Username exists
   - Password matches (compare hashed values)
   - Return success or error: "Invalid username or password"

4. **On success**:
   - Session created
   - User stored in session storage (frontend)
   - Redirect to dashboard

### Logout Flow

1. User clicks logout
2. Session storage cleared (frontend)
3. Optional: Backend invalidates session
4. Redirect to login page

---

## Core Features & Workflows

### Feature 1: Record Management

#### 1.1 Create Record

**User Flow**:
1. Navigate to "Add Record" page
2. Select category (ሰራተኛ/ወጣት/አዳጊ/ህጻናት)
3. Fill dynamic form based on category
4. Submit form

**Required Fields by Category**:
- **All**: name, age, church, category
- **ሰራተኛ**: position
- **ወጣት**: programName
- **አዳጊ**: (all common fields optional)
- **ህጻናት**: parentName, parentPhone

**API Requirements**:
- Validate all required fields
- Auto-generate UUID for record
- Set timestamps
- Return created record with ID

#### 1.2 View Records

**User Flow**:
1. Dashboard shows paginated list of records
2. Can search by name or church
3. Can filter by category
4. Can sort by name, church, or age

**API Requirements**:
- Pagination: 10 items per page
- Search: name or church (case-insensitive)
- Filter by category
- Sort options: name, church, age (ascending/descending)
- Return paginated results with total count

#### 1.3 Edit Record

**User Flow**:
1. Click on record to view details
2. Click "Edit" button
3. Modify fields (all fields editable)
4. Save changes

**API Requirements**:
- Validate all fields
- Update record
- Set updatedAt timestamp
- Return updated record

#### 1.4 Delete Record

**User Flow**:
1. Click delete on record
2. Confirm deletion
3. Record removed from system

**API Requirements**:
- Hard delete (remove from database)
- Also delete associated attendance records
- Return success confirmation

---

### Feature 2: Event Management

#### 2.1 View Events

**User Flow**:
1. Navigate to "Manage Events" tab
2. Events organized by category
3. Shows default and custom events

**API Requirements**:
- Return all events grouped by category
- Include both default and custom events
- Sort by creation date

#### 2.2 Create Custom Event

**User Flow**:
1. In Events tab, click "Add Event"
2. Enter event name and category
3. Optional: Add description
4. Save event

**API Requirements**:
- Create new event
- Auto-generate UUID
- Set isDefault to false
- Set timestamps
- Ensure name is unique per category

#### 2.3 Delete Event

**User Flow**:
1. Click delete on event
2. Cannot delete default events (button disabled)

**API Requirements**:
- Only allow deletion of non-default events
- Return error if trying to delete default event
- Delete event and associated attendance records

---

### Feature 3: Attendance Tracking

#### 3.1 Take Attendance

**User Flow**:
1. Navigate to "Take Attendance" tab
2. Select an event (required)
3. Optional: Filter by category or search for records
4. Check/uncheck records and mark status (Present/Absent/Late/Excused)
5. Select status buttons for each person
6. Click "Save Attendance"
7. Option to add notes for all selected records
8. Confirm save

**API Requirements**:
- Create attendance record for each selected record
- Validate: eventId exists, recordId exists, date is today
- Set time as current time
- Allow multiple attendances per record (different events/dates)
- Return array of created attendance records

#### 3.2 View Attendance Records

**User Flow**:
1. Navigate to "View Records" tab
2. Can filter by:
   - Status (Present/Absent/Late/Excused)
   - Category
   - Event
   - Date (specific date or date range)
3. Can search by person name or event name
4. Shows table with columns: Date, Time, Record Name, Category, Event, Status, Notes
5. Click on person name to view their full record

**API Requirements**:
- Return attendance records with related record and event data
- Support multiple filters (apply as AND conditions)
- Support date range queries
- Sort by date (newest first)
- Include pagination (20 items per page)
- Search is case-insensitive

#### 3.3 View Individual Record Attendance History

**User Flow**:
1. Navigate to specific record detail page
2. View "Attendance History" section showing:
   - Statistics: Total, Present, Absent, Late, Excused
   - Attendance rate percentage
   - Table of attendance records for this person
3. Can filter by status, event, or date

**API Requirements**:
- Return all attendance records for specific recordId
- Include event names
- Calculate statistics:
  - Total count
  - Count per status
  - Attendance rate = (present / total) * 100
- Sort by date (newest first)

---

### Feature 4: Dashboard Overview

**User Flow**:
1. User sees dashboard with:
   - Total number of records by category
   - Recent records
   - Quick access to main features

**API Requirements**:
- Return records grouped by category with counts
- Return recent records (last 10)
- Return summary statistics

---

## API Endpoints

### Authentication Endpoints

#### POST /auth/signup
Create a new user account

**Request**:
```json
{
  "username": "string (3+ chars)",
  "password": "string (6+ chars)"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "user": {
    "username": "string"
  }
}
```

**Error** (400/409):
```json
{
  "success": false,
  "error": "Username already exists" | "Username must be at least 3 characters" | "Password must be at least 6 characters"
}
```

#### POST /auth/login
Authenticate user and create session

**Request**:
```json
{
  "username": "string",
  "password": "string"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "user": {
    "username": "string"
  },
  "token": "JWT or session token (optional)"
}
```

**Error** (401):
```json
{
  "success": false,
  "error": "Invalid username or password"
}
```

#### POST /auth/logout
Logout current user

**Response** (200):
```json
{
  "success": true
}
```

---

### Record Endpoints

#### GET /records
Get all records with filters and pagination

**Query Parameters**:
- `page`: number (default: 1)
- `limit`: number (default: 10)
- `category`: string (optional) - 'ሰራተኛ' | 'ወጣት' | 'አዳጊ' | 'ህጻናት'
- `search`: string (optional) - search in name or church
- `sortBy`: string (default: 'name') - 'name' | 'church' | 'age'
- `sortOrder`: string (default: 'asc') - 'asc' | 'desc'

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "string",
      "church": "string",
      "age": "number",
      "category": "string",
      ...other fields
    }
  ],
  "pagination": {
    "page": "number",
    "limit": "number",
    "total": "number",
    "totalPages": "number"
  }
}
```

#### POST /records
Create a new record

**Request**:
```json
{
  "name": "string (required)",
  "church": "string (required)",
  "age": "number (required)",
  "category": "string (required)",
  ...optional fields based on category
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "string",
    ...all fields
  }
}
```

**Error** (400):
```json
{
  "success": false,
  "error": "Field 'name' is required"
}
```

#### GET /records/:id
Get specific record

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    ...all record fields
  }
}
```

#### PUT /records/:id
Update record

**Request**:
```json
{
  // any fields to update
  "name": "string",
  "age": "number",
  ...etc
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    ...updated record
  }
}
```

#### DELETE /records/:id
Delete record (also deletes associated attendance)

**Response** (200):
```json
{
  "success": true,
  "message": "Record deleted"
}
```

---

### Event Endpoints

#### GET /events
Get all events

**Query Parameters**:
- `category`: string (optional) - filter by category

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "string",
      "category": "string",
      "description": "string",
      "isDefault": "boolean",
      "createdAt": "timestamp"
    }
  ]
}
```

#### POST /events
Create new event

**Request**:
```json
{
  "name": "string (required)",
  "category": "string (required)",
  "description": "string (optional)"
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    ...event data
  }
}
```

**Error** (409):
```json
{
  "success": false,
  "error": "Event name already exists in this category"
}
```

#### DELETE /events/:id
Delete event (only non-default events)

**Response** (200):
```json
{
  "success": true,
  "message": "Event deleted"
}
```

**Error** (400):
```json
{
  "success": false,
  "error": "Cannot delete default event"
}
```

---

### Attendance Endpoints

#### POST /attendance
Record attendance for multiple records at an event

**Request**:
```json
{
  "eventId": "uuid (required)",
  "date": "YYYY-MM-DD (required)",
  "time": "HH:MM (optional)",
  "records": [
    {
      "recordId": "uuid",
      "status": "present|absent|late|excused"
    }
  ],
  "notes": "string (optional, applies to all)"
}
```

**Response** (201):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "recordId": "uuid",
      "eventId": "uuid",
      "date": "YYYY-MM-DD",
      "time": "HH:MM",
      "status": "string",
      "notes": "string",
      "createdAt": "timestamp"
    }
  ],
  "count": "number"
}
```

#### GET /attendance
Get attendance records with filters

**Query Parameters**:
- `page`: number (default: 1)
- `limit`: number (default: 20)
- `recordId`: string (optional)
- `eventId`: string (optional)
- `status`: string (optional) - 'present' | 'absent' | 'late' | 'excused'
- `category`: string (optional) - filter by record category
- `date`: string (optional) - specific date (YYYY-MM-DD)
- `dateFrom`: string (optional) - date range start
- `dateTo`: string (optional) - date range end
- `search`: string (optional) - search in record name or event name

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "recordId": "uuid",
      "record": {
        "id": "uuid",
        "name": "string",
        "church": "string",
        "category": "string"
      },
      "eventId": "uuid",
      "event": {
        "id": "uuid",
        "name": "string",
        "category": "string"
      },
      "date": "YYYY-MM-DD",
      "time": "HH:MM",
      "status": "string",
      "notes": "string",
      "createdAt": "timestamp"
    }
  ],
  "pagination": {
    "page": "number",
    "limit": "number",
    "total": "number",
    "totalPages": "number"
  }
}
```

#### GET /attendance/record/:recordId
Get attendance history for specific record

**Query Parameters**:
- `status`: string (optional)
- `eventId`: string (optional)
- `date`: string (optional)

**Response** (200):
```json
{
  "success": true,
  "statistics": {
    "total": "number",
    "present": "number",
    "absent": "number",
    "late": "number",
    "excused": "number",
    "attendanceRate": "number (percentage)"
  },
  "data": [
    // attendance records
  ]
}
```

---

## Database Schema

### SQL Implementation (PostgreSQL Example)

```sql
-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_username (username)
);

-- Records Table
CREATE TABLE records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  church VARCHAR(255) NOT NULL,
  age INT NOT NULL,
  category VARCHAR(50) NOT NULL,
  
  -- Personal Info
  phone VARCHAR(20),
  email VARCHAR(255),
  address TEXT,
  date_of_birth DATE,
  gender VARCHAR(20),
  
  -- Employment (ሰራተኛ)
  position VARCHAR(255),
  department VARCHAR(255),
  start_date DATE,
  salary DECIMAL(12, 2),
  work_phone VARCHAR(20),
  work_email VARCHAR(255),
  supervisor VARCHAR(255),
  work_location VARCHAR(255),
  emergency_contact VARCHAR(255),
  emergency_phone VARCHAR(20),
  skills TEXT,
  certifications TEXT,
  languages VARCHAR(255),
  
  -- Youth (ወጣት)
  education VARCHAR(255),
  occupation VARCHAR(255),
  marital_status VARCHAR(50),
  program_name VARCHAR(255),
  program_role VARCHAR(255),
  participation_date DATE,
  leadership_role VARCHAR(255),
  activities TEXT,
  interests TEXT,
  volunteer_work TEXT,
  achievements TEXT,
  goals TEXT,
  
  -- Adult (አዳጊ)
  profession VARCHAR(255),
  experience INT,
  specialization VARCHAR(255),
  company VARCHAR(255),
  business_type VARCHAR(255),
  business_address TEXT,
  business_phone VARCHAR(20),
  years_in_business INT,
  mentorship TEXT,
  contributions TEXT,
  network TEXT,
  resources TEXT,
  
  -- Children (ህጻናት)
  grade VARCHAR(50),
  parent_name VARCHAR(255),
  parent_phone VARCHAR(20),
  parent_email VARCHAR(255),
  parent_address TEXT,
  relationship VARCHAR(50),
  enrollment_date DATE,
  school_name VARCHAR(255),
  special_needs TEXT,
  
  -- General
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT category_check CHECK (category IN ('ሰራተኛ', 'ወጣት', 'አዳጊ', 'ህጻናት')),
  INDEX idx_category (category),
  INDEX idx_name (name),
  INDEX idx_church (church)
);

-- Events Table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  description TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT category_check CHECK (category IN ('ሰራተኛ', 'ወጣት', 'አዳጊ', 'ህጻናት')),
  UNIQUE(name, category),
  INDEX idx_category (category),
  INDEX idx_is_default (is_default)
);

-- Attendance Table
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  record_id UUID NOT NULL REFERENCES records(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TIME,
  status VARCHAR(50) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT status_check CHECK (status IN ('present', 'absent', 'late', 'excused')),
  UNIQUE(record_id, event_id, date),
  INDEX idx_record_id (record_id),
  INDEX idx_event_id (event_id),
  INDEX idx_date (date),
  INDEX idx_status (status)
);
```

### NoSQL Implementation (MongoDB Example)

```javascript
// Users Collection
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["username", "password_hash"],
      properties: {
        _id: { bsonType: "objectId" },
        username: { bsonType: "string", minLength: 3 },
        password_hash: { bsonType: "string" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});

db.users.createIndex({ username: 1 }, { unique: true });

// Records Collection
db.createCollection("records", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "church", "age", "category"],
      properties: {
        _id: { bsonType: "objectId" },
        name: { bsonType: "string" },
        church: { bsonType: "string" },
        age: { bsonType: "int" },
        category: { 
          enum: ["ሰራተኛ", "ወጣት", "አዳጊ", "ህጻናት"]
        },
        // All optional fields...
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});

db.records.createIndex({ category: 1 });
db.records.createIndex({ name: "text", church: "text" });

// Events Collection
db.createCollection("events");
db.events.createIndex({ name: 1, category: 1 }, { unique: true });
db.events.createIndex({ category: 1 });

// Attendance Collection
db.createCollection("attendance");
db.attendance.createIndex({ record_id: 1 });
db.attendance.createIndex({ event_id: 1 });
db.attendance.createIndex({ date: 1 });
db.attendance.createIndex({ status: 1 });
db.attendance.createIndex({ record_id: 1, event_id: 1, date: 1 }, { unique: true });
```

---

## Business Logic Requirements

### 1. Record Validation Rules

- **name**: Required, non-empty string, max 255 characters
- **church**: Required, non-empty string, max 255 characters
- **age**: Required, positive integer, typically between 0-150
- **category**: Required, must be one of the four valid categories
- **Email fields**: If provided, must be valid email format
- **Phone fields**: If provided, should follow standard phone format
- **Numeric fields**: Must be positive numbers
- **Date fields**: Must be valid ISO 8601 dates (YYYY-MM-DD)

### 2. Attendance Rules

- Only one attendance record per record-event-date combination
- Cannot record attendance for future dates (today or past only)
- Event must exist and be in same category as record
- Cannot delete attendance older than 30 days (configurable)
- When status changes, maintain audit trail

### 3. Event Rules

- Event name must be unique per category (same name allowed in different categories)
- Cannot delete default events
- Events are immutable after creation (no edit)
- Cannot delete events that have attendance records (soft delete or check)

### 4. Category-Specific Rules

**ሰራተኛ (Staff)**:
- Position is required

**ወጣት (Youth)**:
- Program Name is required

**አዳጊ (Adults)**:
- All fields optional except basics

**ህጻናት (Children)**:
- Parent Name is required
- Parent Phone is required

### 5. Data Integrity

- Cascading deletes: Deleting a record should delete all its attendance records
- Referential integrity: Cannot create attendance for non-existent records/events
- No orphaned data: Ensure consistency during updates

---

## Data Validation Rules

### Frontend Pre-Validation

The frontend performs these validations before sending to API:

1. **Required Fields**: Checked against category requirements
2. **Length Validation**: Min/max characters
3. **Type Validation**: Numeric fields must be numbers
4. **Format Validation**: Email, phone, date formats
5. **Unique Validation**: Username uniqueness (optional, if checking during signup)

### Backend Post-Validation (REQUIRED)

Backend must perform all validations regardless of frontend:

1. **User Input Sanitization**: Remove malicious code, SQL injection attempts
2. **Type Coercion**: Ensure types match schema
3. **Business Logic**: 
   - Username exists check during login
   - Event name uniqueness per category
   - Attendance record uniqueness
4. **Authorization**: Verify user owns the data they're requesting
5. **Range Checks**: Age between valid range, future date blocking

### Error Handling

**HTTP Status Codes**:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict (unique constraint)
- `500` - Server Error

**Error Response Format**:
```json
{
  "success": false,
  "error": "Human-readable error message",
  "field": "fieldName (optional, for validation errors)"
}
```

---

## Session & Security Requirements

### Session Management

- Sessions should expire after 24 hours of inactivity
- Store session token in HTTP-only cookie (CSRF protection)
- Validate session on every API request
- Implement logout to invalidate session

### Password Security

- Hash passwords using bcrypt with salt (cost factor 10+)
- Never store plain text passwords
- Implement password reset functionality (future)
- Require strong passwords (6+ chars minimum)

### API Security

- Implement CORS for frontend domain only
- Use HTTPS/TLS for all communication
- Validate JWT/session tokens
- Rate limiting on auth endpoints
- Sanitize all user inputs

---

## Implementation Recommendations

### Technology Stack

**Suggested Backend Stack**:
- Language: Node.js/Express, Python/Django, Java/Spring Boot
- Database: PostgreSQL (recommended) or MongoDB
- Authentication: JWT + HTTP-only cookies
- Password Hashing: bcrypt or Argon2

### API Documentation

- Use OpenAPI/Swagger for API documentation
- Keep endpoint documentation updated
- Include error codes and examples

### Testing

- Unit tests for business logic (80% coverage)
- Integration tests for API endpoints
- Validation test cases for each field type
- Test edge cases and error scenarios

### Performance

- Add database indices on foreign keys and frequently searched fields
- Implement caching for events list (rarely changes)
- Use pagination to limit data transfer
- Monitor query performance

---

## Future Enhancements

1. **Bulk Operations**: Import/export records as CSV
2. **Reports**: Generate attendance reports by date range
3. **Notifications**: Email/SMS notifications for events
4. **User Roles**: Admin, Staff, Viewer roles
5. **Audit Logs**: Track who modified what and when
6. **Mobile App**: Native mobile application
7. **Calendar View**: Visual calendar of events and attendance
8. **Analytics**: Charts and graphs of attendance trends
9. **API Rate Limiting**: Prevent abuse
10. **Two-Factor Authentication**: Enhanced security

---

## Support & Questions

When implementing the backend, please clarify:

1. Database choice (SQL vs NoSQL)?
2. Authentication token preference (JWT vs session)?
3. File upload requirements (photo for records)?
4. Bulk operations support needed?
5. Real-time synchronization requirements?
6. Data retention policies?
7. Multi-tenancy support needed?
8. API versioning strategy?

---

**Document Version**: 1.0
**Last Updated**: January 2026
**Frontend Framework**: Next.js 14 (React)
**Frontend State**: LocalStorage for data persistence
