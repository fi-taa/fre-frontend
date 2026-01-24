# FitAA FRE - Quick Reference Guide for Backend Development

## System At A Glance

### Four Core Entities

| Entity | Purpose | Key Fields | Category-Aware |
|--------|---------|-----------|---|
| **User** | Authentication | username, password | No |
| **Record** | Member data | name, age, category, dynamic fields | Yes - 4 types |
| **Event** | Trackable events | name, category, isDefault | Yes - 4 categories |
| **Attendance** | Tracking | recordId, eventId, date, status | No - but linked to categories |

### Four Member Categories

| Amharic | English | Key Fields | Required Fields |
|---------|---------|-----------|---|
| **ሰራተኛ** | Staff | position, department, salary | name, age, church, position |
| **ወጣት** | Youth | education, programName, goals | name, age, church, programName |
| **አዳጊ** | Adults | profession, company, experience | name, age, church |
| **ህጻናት** | Children | parentName, grade, schoolName | name, age, church, parentName, parentPhone |

---

## Data Flow Diagram

```
┌─────────────┐
│   User      │ (Login/Signup)
│  username   │
│  password   │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│ Dashboard   │
└──────┬──────┘
       ├─ Records Management ──→ ┌────────────┐
       │                         │   Record   │
       │                         │  (Member)  │
       │                         └──────┬─────┘
       │                                │
       ├─ Event Management ───→ ┌────────────┐
       │                        │   Event    │
       │                        │  Category  │
       │                        └──────┬─────┘
       │                               │
       └─ Attendance Tracking ─→ ┌─────────────┬────────────┐
                                 │ Attendance  │  Date/Time │
                                 │  Record Ref │  Status    │
                                 │  Event Ref  │  Notes     │
                                 └─────────────┴────────────┘
```

---

## API Endpoint Quick Reference

### Authentication
```
POST   /auth/signup         → Create account
POST   /auth/login          → Login user
POST   /auth/logout         → Logout user
```

### Records
```
GET    /records             → List all (paginated)
POST   /records             → Create new
GET    /records/:id         → Get specific
PUT    /records/:id         → Update
DELETE /records/:id         → Delete + cascade attendance
```

### Events
```
GET    /events              → List all
POST   /events              → Create new (non-default)
DELETE /events/:id          → Delete (non-default only)
```

### Attendance
```
POST   /attendance          → Record for multiple
GET    /attendance          → List with filters
GET    /attendance/record/:recordId → History for person
```

---

## Database Schema Summary

### Key Relationships

```
users (1) ─── (M) records
events (1) ─── (M) attendance
records (1) ─── (M) attendance

Cascade: Delete record → Delete attendance
Cascade: Delete event → Delete attendance
```

### Critical Indices

```
users:          username (UNIQUE)
records:        category, name, church
events:         category, (name, category) UNIQUE
attendance:     record_id, event_id, date, status
                (record_id, event_id, date) UNIQUE
```

---

## Key Business Rules

### Record Creation
- ✅ Requires: name, church, age, category
- ✅ Category determines required fields
- ✅ Auto-generate UUID

### Event Creation
- ✅ Name must be unique per category
- ✅ Cannot modify after creation
- ✅ Cannot delete default events

### Attendance Recording
- ✅ One record per person-event-date
- ✅ Date cannot be future date
- ✅ Must reference valid record and event
- ✅ Auto-timestamp creation

### Category Requirements

| Category | Must Have | Optional |
|----------|-----------|----------|
| ሰራተኛ | position | dept, salary, supervisor |
| ወጣት | programName | education, goals, achievements |
| አዳጊ | (none) | profession, company, experience |
| ህጻናት | parentName, parentPhone | grade, schoolName, special needs |

---

## Common Query Patterns

### Filtering Records
```
GET /records?category=ወጣት&search=john&sortBy=age&sortOrder=desc
```

### Attendance with Range
```
GET /attendance?dateFrom=2024-01-01&dateTo=2024-01-31&status=present
```

### Single Person History
```
GET /attendance/record/UUID?status=present
Returns: statistics + attendance records
```

---

## Status Codes to Return

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | Get, Update |
| 201 | Created | Post new record |
| 400 | Validation error | Invalid email |
| 401 | Auth failed | Wrong password |
| 409 | Conflict | Username exists |
| 404 | Not found | Record doesn't exist |

---

## Field Validations

### Username
- Min 3 characters
- Unique (not existing in DB)
- Alphanumeric + underscore allowed

### Password
- Min 6 characters
- Hash with bcrypt (salt 10+)
- Never store plain text

### Age
- Positive integer
- Reasonable range (0-150)

### Email
- Valid email format
- Optional field

### Phone
- Format: +XXX or (XXX)XXX-XXXX
- Optional field

### Date Fields
- ISO 8601 format: YYYY-MM-DD
- Cannot be future date (attendance)

### Numeric Fields
- Must be positive for most fields
- Salary/experience can be 0

---

## Default Events to Seed

### ሰራተኛ (Staff) - 4 events
1. Staff Meeting
2. Training Session
3. Weekly Service
4. Special Event

### ወጣት (Youth) - 5 events
1. Youth Meeting
2. Bible Study
3. Fellowship
4. Outreach
5. Sports Activity

### አዳጊ (Adults) - 4 events
1. Adult Bible Study
2. Prayer Meeting
3. Fellowship
4. Workshop

### ህጻናት (Children) - 4 events
1. Sunday School
2. Children's Service
3. Activity Day
4. Special Program

---

## Error Response Examples

### Validation Error
```json
{
  "success": false,
  "error": "Username must be at least 3 characters",
  "field": "username"
}
```

### Conflict Error
```json
{
  "success": false,
  "error": "Username already exists"
}
```

### Auth Error
```json
{
  "success": false,
  "error": "Invalid username or password"
}
```

---

## Important Notes for Backend Team

1. **User Lookup**: Always lookup by username (unique constraint)
2. **Record Deletion**: Must cascade delete all attendance records
3. **Event Immutability**: Events cannot be edited, only deleted if non-default
4. **Attendance Uniqueness**: Enforce unique constraint on (recordId, eventId, date)
5. **Timezone**: Store dates in UTC, let frontend handle timezone
6. **Pagination**: Default 10 items per page for records, 20 for attendance
7. **Search**: Case-insensitive search on name and church
8. **Sorting**: Support asc/desc for name, church, age fields
9. **Statistics**: Pre-calculate attendance rate on query
10. **Performance**: Index foreign keys and filter columns

---

## Testing Checklist

- [ ] Create user flow
- [ ] Login/logout flow
- [ ] Create record for each category
- [ ] Update record
- [ ] Delete record (verify cascade)
- [ ] Create custom event
- [ ] Record attendance for multiple
- [ ] Filter attendance by all parameters
- [ ] Get person's attendance history
- [ ] Validate all required fields
- [ ] Test duplicate constraints
- [ ] Test date validations
- [ ] Test pagination
- [ ] Test search and sorting

---

## Frontend Integration Points

Frontend uses localStorage for temporary data persistence:
- User session stored in sessionStorage
- Records, events, attendance in localStorage
- Backend should be source of truth

**Migration needed**: Replace localStorage with API calls

---

## Recommended Implementation Order

1. **Phase 1**: User management (signup/login/logout)
2. **Phase 2**: Record CRUD operations
3. **Phase 3**: Event management
4. **Phase 4**: Attendance tracking and queries
5. **Phase 5**: Complex filtering and search
6. **Phase 6**: Performance optimization and caching

---

## Contact Information

For questions about:
- **Frontend implementation**: Check src/ directory
- **Type definitions**: Check src/types.ts
- **Business logic**: Check src/lib/ directory
- **Components**: Check src/components/ directory

---

**Version**: 1.0 | **Created**: January 2026 | **For**: Backend Development Team
