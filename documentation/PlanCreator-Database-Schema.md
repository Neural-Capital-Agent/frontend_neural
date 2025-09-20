# Plan Creator Database Schema Documentation

## Overview

This document provides comprehensive information about the database schema used by the Plan Creator system, including table structures, relationships, indexes, and data management practices.

## Table of Contents

1. [Database Architecture](#database-architecture)
2. [Main Table: investment_plans](#main-table-investment_plans)
3. [Data Types & Constraints](#data-types--constraints)
4. [Indexes & Performance](#indexes--performance)
5. [Relationships & Foreign Keys](#relationships--foreign-keys)
6. [Data Storage Patterns](#data-storage-patterns)
7. [Triggers & Functions](#triggers--functions)
8. [Migration & Maintenance](#migration--maintenance)
9. [Backup & Recovery](#backup--recovery)
10. [Performance Optimization](#performance-optimization)

---

## Database Architecture

### Platform: Supabase (PostgreSQL)

The Plan Creator uses **Supabase** as its database platform, which provides:
- PostgreSQL 14+ with extensions
- Real-time subscriptions (future use)
- Row Level Security (RLS) support
- JSON/JSONB support for complex data
- UUID generation capabilities
- Automatic timestamps

### Schema Design Principles

1. **Single Source of Truth**: Each plan is stored once with complete data
2. **Immutable History**: Plans preserve creation state for audit trails
3. **Flexible JSON Storage**: Agent outputs stored as JSONB for flexibility
4. **User Isolation**: All data partitioned by user_id
5. **Soft Deletes**: Plans are deactivated, not physically deleted

---

## Main Table: investment_plans

### Table Structure

```sql
CREATE TABLE investment_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id_user) ON DELETE CASCADE,

    -- User Input Data (from frontend form)
    financial_goals TEXT,
    investment_preferences TEXT,

    -- Generated Plan Data (from agents)
    plan_data JSONB,

    -- Plan Metadata
    plan_name VARCHAR(255),
    plan_type VARCHAR(50) DEFAULT 'GENERAL',
    risk_level VARCHAR(20),
    time_horizon INTEGER,
    target_amount DECIMAL(15,2),

    -- Agent Processing Data
    agent_2_data JSONB,
    agent_3_data JSONB,
    processing_status VARCHAR(20) DEFAULT 'PENDING',

    -- Plan Status
    is_active BOOLEAN DEFAULT true,
    is_favorite BOOLEAN DEFAULT false,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_reviewed_at TIMESTAMPTZ,

    -- Performance Tracking (for future use)
    expected_return DECIMAL(8,4),
    actual_return DECIMAL(8,4),
    performance_notes TEXT
);
```

### Column Specifications

#### Primary Key & Identification

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique plan identifier |
| `user_id` | UUID | NOT NULL, FOREIGN KEY | Links to users table |

#### User Input Columns

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `financial_goals` | TEXT | NULLABLE | User's financial goals in natural language |
| `investment_preferences` | TEXT | NULLABLE | User's investment strategy preferences |

#### Plan Configuration

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `plan_name` | VARCHAR(255) | NULLABLE | User-defined or auto-generated plan name |
| `plan_type` | VARCHAR(50) | DEFAULT 'GENERAL' | RETIREMENT, HOUSE, EDUCATION, GENERAL |
| `risk_level` | VARCHAR(20) | NULLABLE | CONSERVATIVE, BALANCED, AGGRESSIVE |
| `time_horizon` | INTEGER | NULLABLE | Investment time horizon in years |
| `target_amount` | DECIMAL(15,2) | NULLABLE | Target investment amount in USD |

#### Agent & Plan Data

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `plan_data` | JSONB | NULLABLE | Complete investment plan from LLM |
| `agent_2_data` | JSONB | NULLABLE | Portfolio Agent output (portfolio optimization) |
| `agent_3_data` | JSONB | NULLABLE | Planner Agent output (goal interpretation) |
| `processing_status` | VARCHAR(20) | DEFAULT 'PENDING' | PENDING, PROCESSING, COMPLETED, FAILED |

#### Status & Metadata

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `is_active` | BOOLEAN | DEFAULT true | Whether plan is currently active |
| `is_favorite` | BOOLEAN | DEFAULT false | Whether plan is marked as favorite |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Plan creation timestamp |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Last update timestamp |
| `last_reviewed_at` | TIMESTAMPTZ | NULLABLE | When plan was last reviewed by user |

#### Performance Tracking

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `expected_return` | DECIMAL(8,4) | NULLABLE | Expected annual return (as decimal, e.g., 0.075 = 7.5%) |
| `actual_return` | DECIMAL(8,4) | NULLABLE | Actual return if plan is implemented |
| `performance_notes` | TEXT | NULLABLE | Notes on plan performance and adjustments |

---

## Data Types & Constraints

### UUID Type Usage

```sql
-- UUID columns use PostgreSQL's gen_random_uuid()
id UUID DEFAULT gen_random_uuid() PRIMARY KEY

-- Example UUID: 550e8400-e29b-41d4-a716-446655440000
```

**Benefits**:
- Globally unique across systems
- No sequential prediction vulnerability
- Supports distributed systems
- 128-bit random generation

### JSONB Storage

The table uses JSONB for complex data structures:

#### plan_data Structure
```json
{
  "plan_id": "ef530167-89b9-4379-8693-17367688f813",
  "user_input": {
    "financial_goals": "Save for retirement in 30 years",
    "investment_preferences": "Moderate risk, prefer ETFs",
    "goal_type": "RETIREMENT",
    "risk_level": "BALANCED",
    "time_horizon": 30,
    "target_amount": 500000
  },
  "agent_outputs": {
    "agent_2_portfolio": { /* Portfolio Agent data */ },
    "agent_3_planner": { /* Planner Agent data */ }
  },
  "investment_plan": {
    "investment_plan": {
      "monthly_contribution": 856,
      "asset_allocation": {
        "stocks": 70,
        "bonds": 25,
        "alternatives": 5
      },
      "milestones": [...],
      "risk_considerations": {...}
    }
  },
  "created_at": "2024-01-15T10:30:00Z",
  "processing_status": "COMPLETED"
}
```

#### agent_2_data Structure (Portfolio Agent)
```json
{
  "portfolio": {
    "allocations": {
      "stocks": 0.70,
      "bonds": 0.25,
      "alternatives": 0.05
    },
    "expected_return": 0.075,
    "risk_metrics": {
      "volatility": 0.12,
      "sharpe_ratio": 0.63
    }
  },
  "risk_level": 3,
  "goal_type": "retirement",
  "timestamp": "2024-01-15T10:30:00Z",
  "agent": "portfolio_agent",
  "status": "success"
}
```

#### agent_3_data Structure (Planner Agent)
```json
{
  "parsed_goal": {
    "goal_type": "RETIREMENT",
    "target_amount": 500000,
    "time_horizon": 30,
    "confidence_score": 0.92,
    "extracted_keywords": ["retirement", "save", "$500,000", "30 years"]
  },
  "goal_text": "Save for retirement in 30 years",
  "timestamp": "2024-01-15T10:30:00Z",
  "agent": "planner_agent",
  "status": "success"
}
```

### Enumerated Values

#### plan_type Values
- `RETIREMENT`: Retirement planning
- `HOUSE`: House down payment
- `EDUCATION`: Education funding
- `GENERAL`: General investment goals

#### risk_level Values
- `CONSERVATIVE`: Low risk tolerance
- `BALANCED`: Moderate risk tolerance
- `AGGRESSIVE`: High risk tolerance

#### processing_status Values
- `PENDING`: Plan creation queued
- `PROCESSING`: Agents are running
- `COMPLETED`: Plan successfully created
- `FAILED`: Plan creation failed

### Decimal Precision

```sql
-- Monetary amounts: Up to 999,999,999,999,999.99
target_amount DECIMAL(15,2)

-- Return percentages: Up to 9999.9999% (stored as decimal)
expected_return DECIMAL(8,4)  -- e.g., 0.0750 = 7.50%
actual_return DECIMAL(8,4)
```

---

## Indexes & Performance

### Primary Indexes

```sql
-- Primary key index (automatic)
CREATE UNIQUE INDEX investment_plans_pkey ON investment_plans(id);

-- Foreign key index for user lookups
CREATE INDEX idx_investment_plans_user_id ON investment_plans(user_id);
```

### Performance Indexes

```sql
-- Chronological ordering (most common query pattern)
CREATE INDEX idx_investment_plans_created_at ON investment_plans(created_at DESC);

-- Plan type filtering
CREATE INDEX idx_investment_plans_plan_type ON investment_plans(plan_type);

-- Active plans only (partial index for efficiency)
CREATE INDEX idx_investment_plans_active
ON investment_plans(is_active)
WHERE is_active = true;

-- Processing status queries
CREATE INDEX idx_investment_plans_status ON investment_plans(processing_status);

-- Composite index for user + status queries
CREATE INDEX idx_investment_plans_user_status
ON investment_plans(user_id, processing_status);

-- Favorite plans lookup
CREATE INDEX idx_investment_plans_favorites
ON investment_plans(user_id, is_favorite)
WHERE is_favorite = true;
```

### JSONB Indexes

```sql
-- Index specific JSONB fields for faster queries
CREATE INDEX idx_investment_plans_plan_data_type
ON investment_plans USING GIN ((plan_data->'user_input'->>'goal_type'));

-- Index agent status fields
CREATE INDEX idx_investment_plans_agent_status
ON investment_plans USING GIN (
  (agent_2_data->>'status'),
  (agent_3_data->>'status')
);
```

### Index Usage Patterns

```sql
-- Fast user plan lookups
SELECT * FROM investment_plans
WHERE user_id = $1 AND is_active = true
ORDER BY created_at DESC;
-- Uses: idx_investment_plans_user_id + idx_investment_plans_active

-- Status-based queries
SELECT count(*) FROM investment_plans
WHERE processing_status = 'COMPLETED';
-- Uses: idx_investment_plans_status

-- Plan type analytics
SELECT plan_type, count(*), avg(target_amount)
FROM investment_plans
WHERE is_active = true
GROUP BY plan_type;
-- Uses: idx_investment_plans_active
```

---

## Relationships & Foreign Keys

### User Relationship

```sql
-- Foreign key to users table
user_id UUID NOT NULL REFERENCES users(id_user) ON DELETE CASCADE
```

**Cascade Behavior**:
- When a user is deleted, all their investment plans are automatically deleted
- Ensures data integrity and GDPR compliance
- Prevents orphaned plan records

### Referential Integrity

```sql
-- Check constraint examples (could be added)
ALTER TABLE investment_plans
ADD CONSTRAINT check_target_amount_positive
CHECK (target_amount IS NULL OR target_amount > 0);

ALTER TABLE investment_plans
ADD CONSTRAINT check_time_horizon_positive
CHECK (time_horizon IS NULL OR time_horizon > 0);

ALTER TABLE investment_plans
ADD CONSTRAINT check_valid_plan_type
CHECK (plan_type IN ('RETIREMENT', 'HOUSE', 'EDUCATION', 'GENERAL'));

ALTER TABLE investment_plans
ADD CONSTRAINT check_valid_risk_level
CHECK (risk_level IS NULL OR risk_level IN ('CONSERVATIVE', 'BALANCED', 'AGGRESSIVE'));

ALTER TABLE investment_plans
ADD CONSTRAINT check_valid_processing_status
CHECK (processing_status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'));
```

---

## Data Storage Patterns

### Plan Creation Workflow

1. **Initial Insert**
   ```sql
   INSERT INTO investment_plans (
     id, user_id, financial_goals, investment_preferences,
     plan_type, risk_level, time_horizon, target_amount,
     processing_status
   ) VALUES (
     gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, 'PROCESSING'
   );
   ```

2. **Agent Data Updates**
   ```sql
   UPDATE investment_plans
   SET agent_2_data = $1, agent_3_data = $2, updated_at = NOW()
   WHERE id = $3;
   ```

3. **Final Plan Completion**
   ```sql
   UPDATE investment_plans
   SET plan_data = $1, processing_status = 'COMPLETED', updated_at = NOW()
   WHERE id = $2;
   ```

### Query Patterns

#### User Plans Dashboard
```sql
-- Get user's active plans with summary info
SELECT
  id, plan_name, plan_type, target_amount,
  is_favorite, created_at, processing_status
FROM investment_plans
WHERE user_id = $1 AND is_active = true
ORDER BY is_favorite DESC, created_at DESC
LIMIT 20;
```

#### Plan Details View
```sql
-- Get complete plan data
SELECT * FROM investment_plans WHERE id = $1;
```

#### Analytics Queries
```sql
-- Plan type distribution
SELECT
  plan_type,
  COUNT(*) as total_plans,
  COUNT(*) FILTER (WHERE processing_status = 'COMPLETED') as completed_plans,
  AVG(target_amount) as avg_target_amount
FROM investment_plans
WHERE is_active = true
GROUP BY plan_type;

-- User engagement metrics
SELECT
  user_id,
  COUNT(*) as total_plans,
  COUNT(*) FILTER (WHERE is_favorite = true) as favorite_plans,
  MAX(created_at) as last_plan_created
FROM investment_plans
WHERE is_active = true
GROUP BY user_id
HAVING COUNT(*) > 1
ORDER BY total_plans DESC;
```

### Data Archival Strategy

```sql
-- Soft delete pattern
UPDATE investment_plans
SET is_active = false, updated_at = NOW()
WHERE id = $1;

-- Hard delete after retention period (example)
DELETE FROM investment_plans
WHERE is_active = false
  AND updated_at < NOW() - INTERVAL '7 years';
```

---

## Triggers & Functions

### Automatic Timestamp Updates

```sql
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_investment_plans_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function
CREATE TRIGGER trigger_investment_plans_updated_at
    BEFORE UPDATE ON investment_plans
    FOR EACH ROW EXECUTE FUNCTION update_investment_plans_updated_at();
```

### Data Validation Functions

```sql
-- Function to validate JSONB structure
CREATE OR REPLACE FUNCTION validate_plan_data(data JSONB)
RETURNS BOOLEAN AS $$
BEGIN
    -- Check required fields in plan_data
    IF data IS NULL THEN
        RETURN true; -- Allow NULL during processing
    END IF;

    -- Validate structure has required keys
    IF NOT (data ? 'investment_plan' OR data ? 'user_input') THEN
        RETURN false;
    END IF;

    RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Add check constraint using the function
ALTER TABLE investment_plans
ADD CONSTRAINT check_valid_plan_data
CHECK (validate_plan_data(plan_data));
```

### Audit Log Trigger (Optional)

```sql
-- Audit table for plan changes
CREATE TABLE investment_plans_audit (
    audit_id SERIAL PRIMARY KEY,
    plan_id UUID,
    operation VARCHAR(10),
    old_data JSONB,
    new_data JSONB,
    changed_by TEXT,
    changed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit trigger function
CREATE OR REPLACE FUNCTION audit_investment_plans()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO investment_plans_audit (plan_id, operation, new_data)
        VALUES (NEW.id, 'INSERT', to_jsonb(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO investment_plans_audit (plan_id, operation, old_data, new_data)
        VALUES (NEW.id, 'UPDATE', to_jsonb(OLD), to_jsonb(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO investment_plans_audit (plan_id, operation, old_data)
        VALUES (OLD.id, 'DELETE', to_jsonb(OLD));
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create audit trigger
CREATE TRIGGER trigger_audit_investment_plans
    AFTER INSERT OR UPDATE OR DELETE ON investment_plans
    FOR EACH ROW EXECUTE FUNCTION audit_investment_plans();
```

---

## Migration & Maintenance

### Initial Table Creation

```sql
-- File: investment_plans_table.sql
-- Run in Supabase SQL Editor

-- Investment Plans Table for storing user-generated investment plans
CREATE TABLE IF NOT EXISTS investment_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id_user) ON DELETE CASCADE,

    -- [Complete table definition as shown above]
);

-- Create all indexes
CREATE INDEX IF NOT EXISTS idx_investment_plans_user_id ON investment_plans(user_id);
-- [All other indexes as shown above]

-- Create triggers
CREATE OR REPLACE FUNCTION update_investment_plans_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_investment_plans_updated_at
    BEFORE UPDATE ON investment_plans
    FOR EACH ROW EXECUTE FUNCTION update_investment_plans_updated_at();

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON investment_plans TO PUBLIC;

COMMIT;
```

### Schema Migrations

#### Adding New Columns

```sql
-- Migration: Add plan_category column
ALTER TABLE investment_plans
ADD COLUMN plan_category VARCHAR(50);

-- Update existing records
UPDATE investment_plans
SET plan_category =
  CASE plan_type
    WHEN 'RETIREMENT' THEN 'LONG_TERM'
    WHEN 'HOUSE' THEN 'MEDIUM_TERM'
    WHEN 'EDUCATION' THEN 'MEDIUM_TERM'
    ELSE 'GENERAL'
  END;

-- Add constraint
ALTER TABLE investment_plans
ADD CONSTRAINT check_valid_plan_category
CHECK (plan_category IN ('SHORT_TERM', 'MEDIUM_TERM', 'LONG_TERM', 'GENERAL'));
```

#### Modifying JSONB Structure

```sql
-- Migration: Update agent_2_data structure
UPDATE investment_plans
SET agent_2_data = agent_2_data || '{"version": "2.0"}'
WHERE agent_2_data IS NOT NULL
  AND NOT (agent_2_data ? 'version');
```

### Data Cleanup Scripts

```sql
-- Remove test plans
DELETE FROM investment_plans
WHERE user_id = 'test-user-id'
  OR financial_goals ILIKE '%test%';

-- Fix incomplete plans older than 1 hour
UPDATE investment_plans
SET processing_status = 'FAILED'
WHERE processing_status = 'PROCESSING'
  AND created_at < NOW() - INTERVAL '1 hour';

-- Archive old failed plans
UPDATE investment_plans
SET is_active = false
WHERE processing_status = 'FAILED'
  AND created_at < NOW() - INTERVAL '30 days';
```

---

## Backup & Recovery

### Backup Strategy

```sql
-- Full table backup
COPY investment_plans TO '/path/to/backup/investment_plans_backup.csv' CSV HEADER;

-- Incremental backup (last 24 hours)
COPY (
  SELECT * FROM investment_plans
  WHERE updated_at > NOW() - INTERVAL '24 hours'
) TO '/path/to/backup/investment_plans_incremental.csv' CSV HEADER;

-- JSON export for specific user
COPY (
  SELECT id, user_id, plan_data, agent_2_data, agent_3_data, created_at
  FROM investment_plans
  WHERE user_id = 'specific-user-id'
) TO '/path/to/backup/user_plans.json';
```

### Recovery Procedures

```sql
-- Restore from backup
COPY investment_plans FROM '/path/to/backup/investment_plans_backup.csv' CSV HEADER;

-- Restore specific user's plans
INSERT INTO investment_plans (id, user_id, plan_data, agent_2_data, agent_3_data, created_at)
SELECT id, user_id, plan_data, agent_2_data, agent_3_data, created_at
FROM temp_restore_table;
```

### Point-in-Time Recovery

Supabase provides automatic point-in-time recovery. For custom recovery:

```sql
-- Create recovery point
SELECT pg_start_backup('investment_plans_recovery');

-- Restore to specific timestamp
-- (This would be done through Supabase dashboard)
```

---

## Performance Optimization

### Query Optimization

```sql
-- Use EXPLAIN ANALYZE to monitor query performance
EXPLAIN ANALYZE
SELECT * FROM investment_plans
WHERE user_id = 'user-uuid' AND is_active = true
ORDER BY created_at DESC;

-- Optimize JSONB queries
EXPLAIN ANALYZE
SELECT * FROM investment_plans
WHERE plan_data->>'processing_status' = 'COMPLETED'
  AND agent_2_data->>'status' = 'success';
```

### Index Monitoring

```sql
-- Check index usage
SELECT
  schemaname, tablename, indexname, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes
WHERE tablename = 'investment_plans'
ORDER BY idx_tup_read DESC;

-- Identify unused indexes
SELECT
  schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
WHERE tablename = 'investment_plans' AND idx_scan = 0;
```

### Maintenance Tasks

```sql
-- Update table statistics
ANALYZE investment_plans;

-- Rebuild indexes if needed
REINDEX TABLE investment_plans;

-- Vacuum to reclaim space
VACUUM ANALYZE investment_plans;
```

### Connection Optimization

For the application level:

```python
# Connection pooling configuration
DATABASE_CONFIG = {
    "pool_size": 20,
    "max_overflow": 0,
    "pool_recycle": 3600,
    "pool_pre_ping": True
}

# Query optimization
async def get_user_plans_optimized(user_id: str, limit: int = 20):
    query = """
    SELECT id, plan_name, plan_type, target_amount,
           is_favorite, created_at, processing_status
    FROM investment_plans
    WHERE user_id = $1 AND is_active = true
    ORDER BY is_favorite DESC, created_at DESC
    LIMIT $2
    """
    return await db.fetch(query, user_id, limit)
```

---

## Conclusion

The Plan Creator database schema is designed for:

- **Scalability**: Efficient indexes and query patterns
- **Flexibility**: JSONB storage for evolving data structures
- **Reliability**: Foreign key constraints and cascade deletes
- **Performance**: Optimized indexes for common access patterns
- **Maintainability**: Clear structure with comprehensive documentation

This schema supports the multi-agent AI system while maintaining data integrity and providing excellent query performance for the Plan Creator application.

For database administration tasks, monitoring, or schema modifications, refer to the Supabase documentation and follow the migration patterns outlined in this document.