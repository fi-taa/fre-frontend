# Backend Developer: Schema Update Instructions

## Action Required

The Record model needs to be updated in the **API_SCHEMA_DOCUMENTATION.md** based on the Google Form structure.

## Google Form Reference
**Form URL**: https://docs.google.com/forms/d/e/1FAIpQLSdkt2sOlXvFc8U8NHD5Bj74-XhdXRvAJtVecSRQO83tPHVKFA/formResponse?pli=1

## Update Requirements

### Overview
- **Type of Update**: Schema modification (REPLACE existing fields)
- **Scope**: Category-specific fields
- **Impact Level**: Affects all 4 categories (ሰራተኛ, ወጣት, አዳጊ, ህጻናት)
- **Do NOT update**: Frontend code (only API documentation)

### What Needs to be Updated

1. **API_SCHEMA_DOCUMENTATION.md**
   - Section: "2. Record Model"
   - Update the Record interface with new fields from Google Form
   - Replace existing fields with Google Form fields
   - Organize by category

2. **Database Schema (SQL & NoSQL)**
   - Update field definitions
   - Update data types
   - Update constraints

3. **Quick Reference Guide**
   - Update category requirements table if needed
   - Update field validation rules

### Category-Specific Implementation

Review the Google Form and categorize fields by:
- **ሰራተኛ** (Staff) - Fields specific to staff
- **ወጣት** (Youth) - Fields specific to youth  
- **አዳጊ** (Adults) - Fields specific to adults
- **ህጻናት** (Children) - Fields specific to children

### Steps to Update

1. **Copy the API Schema Document**
   - Download `API_SCHEMA_DOCUMENTATION.md` from frontend repo
   - Copy it to your backend repository
   - Work on the copy in your backend repo

2. **Review Google Form structure**
   - Open the form linked above
   - Document all fields and their types

3. **Identify all fields and their properties**:
   - Field name
   - Field type (text, number, select, textarea, email, phone, date)
   - Required vs Optional
   - Category assignment

4. **Update the Record Model interface** in the copied documentation

5. **Update SQL schema** in the copied documentation

6. **Update NoSQL schema** in the copied documentation

7. **Update validation rules section** in the copied documentation

8. **Update database constraints section** in the copied documentation

9. **Share the updated document**
   - Create a pull request or share the updated file
   - Send it back to frontend team for review

### Workflow

**Step 1: Prepare**
```
1. Go to frontend repository: https://github.com/fi-taa/fre-frontend.git
2. Find: API_SCHEMA_DOCUMENTATION.md
3. Download/Copy this file to your backend repository
4. Create a new branch: git checkout -b update/schema-from-google-form
```

**Step 2: Update the Schema Document**
- Work on the copy in your backend repo (NOT the frontend repo)
- Make all changes to Record Model based on Google Form
- Update SQL and MongoDB schemas
- Update validation rules

**Step 3: Complete & Share**
- Commit your changes in backend repo
- Push to your branch
- Share the updated `API_SCHEMA_DOCUMENTATION.md` file with frontend team
- Request feedback/review

---

### Important: Do NOT Modify Frontend Repo

⚠️ **Keep changes isolated to backend repo**:
- Download the file, don't edit directly in frontend repo
- Make changes only in backend repository copy
- Frontend team will be notified when schema is finalized

### Important Notes

⚠️ **When replacing fields**:
- Remove old fields that are no longer needed
- Ensure all required fields are clearly marked
- Update constraints (UNIQUE, CHECK, etc.)
- Update indices for searchable fields
- Maintain referential integrity

✅ **Validation Requirements**:
- Add validation rules for each new field
- Specify data types clearly
- Define constraints (min/max length, format, etc.)
- Note which fields are required per category

### Output Expected

After update, share the updated `API_SCHEMA_DOCUMENTATION.md` with frontend team including:
1. ✅ Updated Record Model interface with all Google Form fields
2. ✅ Updated SQL schema with new columns
3. ✅ Updated MongoDB schema validation
4. ✅ Updated validation rules section
5. ✅ Updated category-specific requirements table
6. ✅ All examples and endpoints reflect new structure

**Delivery Method**:
- Share the file directly with frontend team
- Include a summary of what changed
- Request review and approval

### Questions to Answer When Updating

For each field in the Google Form, document:
1. **Field ID**: Unique identifier (lowercase, underscore-separated)
2. **Field Name**: Display name
3. **Data Type**: text, number, select, textarea, email, phone, date, etc.
4. **Required**: yes/no per category
5. **Validation**: Min/max length, format, constraints
6. **Category**: Which category/categories use this field
7. **Description**: Purpose of the field

### Timeline
- Backend dev downloads API_SCHEMA_DOCUMENTATION.md to their repo
- Completes schema updates in their backend repo copy
- Shares updated file with frontend team
- Frontend team reviews and approves
- Database migration can proceed

---

**Status**: Waiting for schema update in API_SCHEMA_DOCUMENTATION.md
**Prepared by**: Frontend Team
**Date**: January 2026
