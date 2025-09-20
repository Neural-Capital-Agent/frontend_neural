# Plan Creator Documentation

## Overview

This documentation covers the **Plan Creator** system - a comprehensive investment planning tool that leverages multiple AI agents to create personalized investment strategies for users.

## Documentation Structure

### 📖 [Plan Creator Overview](./PlanCreator-Overview.md)
**Complete system documentation covering:**
- System architecture and AI agent integration
- User interface components and functionality
- Data flow and processing pipeline
- Database storage and plan management
- Developer guide and API specifications

### 🔌 [API Integration Guide](./PlanCreator-API-Integration.md)
**Detailed API documentation including:**
- Endpoint specifications and request/response formats
- Authentication and security patterns
- Error handling and recovery strategies
- Integration patterns for frontend and backend
- Rate limiting and performance optimization

### 🗄️ [Database Schema Documentation](./PlanCreator-Database-Schema.md)
**Comprehensive database documentation covering:**
- Table structures and relationships
- Data types, constraints, and indexes
- JSONB storage patterns for agent data
- Migration scripts and maintenance procedures
- Performance optimization and monitoring

### 👤 [User Guide & Troubleshooting](./PlanCreator-User-Guide.md)
**User-focused documentation including:**
- Step-by-step usage instructions
- Interface explanations and best practices
- Common issues and troubleshooting steps
- FAQ and support information

## Quick Start

### For Users
1. **Access**: Navigate to Dashboard → Plan Creator
2. **Create**: Enter financial goals and preferences
3. **Generate**: Click "Create Investment Plan"
4. **Review**: Examine your personalized investment strategy

### For Developers
1. **Database**: Run `investment_plans_table.sql` in Supabase
2. **Backend**: Ensure plan_creator routes are registered
3. **Frontend**: PlanCreator component handles UI and API calls
4. **Testing**: Verify agent integration and data storage

## Key Features

### 🤖 Multi-Agent AI System
- **Agent 2 (Portfolio Agent)**: Portfolio optimization and asset allocation
- **Agent 3 (Planner Agent)**: Natural language goal interpretation
- **LLM Integration (Mistral)**: Final plan synthesis and recommendations

### 💾 Persistent Storage
- Complete plan data stored in `investment_plans` table
- User inputs (financial goals, preferences) preserved
- Individual agent outputs stored separately
- Plan versioning and audit trails

### 🎯 Personalized Recommendations
- Risk-adjusted asset allocations
- Timeline-based investment strategies
- Goal-specific optimization
- Regular rebalancing recommendations

### 📊 Comprehensive Planning
- Monthly contribution calculations
- Investment milestone tracking
- Risk consideration analysis
- Performance projection modeling

## Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend UI   │───▶│   Backend API    │───▶│   Supabase DB   │
│  (PlanCreator)  │    │ (/plan-creator)  │    │(investment_plans)│
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                    ┌────────────────────┐
                    │    AI Agents       │
                    │ ┌────────────────┐ │
                    │ │  Agent 2       │ │
                    │ │ (Portfolio)    │ │
                    │ └────────────────┘ │
                    │ ┌────────────────┐ │
                    │ │  Agent 3       │ │
                    │ │ (Planner)      │ │
                    │ └────────────────┘ │
                    │ ┌────────────────┐ │
                    │ │  LLM Service   │ │
                    │ │ (Mistral)      │ │
                    │ └────────────────┘ │
                    └────────────────────┘
```

## Data Flow

1. **User Input**: Financial goals and investment preferences
2. **Agent Processing**:
   - Agent 3 interprets goals and creates strategy
   - Agent 2 optimizes portfolio allocation
3. **Plan Synthesis**: LLM combines agent outputs into comprehensive plan
4. **Storage**: Complete plan data saved to database
5. **Display**: User-friendly presentation of investment strategy

## Database Schema

### Primary Table: `investment_plans`

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | User identifier |
| `financial_goals` | TEXT | User's goals input |
| `investment_preferences` | TEXT | User's preferences |
| `plan_data` | JSONB | Complete plan from LLM |
| `agent_2_data` | JSONB | Portfolio agent output |
| `agent_3_data` | JSONB | Planner agent output |
| `processing_status` | VARCHAR | PENDING/PROCESSING/COMPLETED/FAILED |
| `is_active` | BOOLEAN | Plan status |
| `created_at` | TIMESTAMPTZ | Creation timestamp |

## API Endpoints

### Primary Endpoint
- **POST** `/api/v1/plan-creator/create-comprehensive-plan`
  - Creates new investment plan using all agents
  - Stores user input and agent outputs
  - Returns complete investment strategy

### Management Endpoints
- **GET** `/api/v1/plan-creator/plans/{user_id}` - List user plans
- **GET** `/api/v1/plan-creator/plan/{plan_id}` - Get plan details
- **PATCH** `/api/v1/plan-creator/plan/{plan_id}/favorite` - Toggle favorite
- **DELETE** `/api/v1/plan-creator/plan/{plan_id}` - Deactivate plan

## Recent Updates

### Enhanced Plan Management (Latest)
- **Existing Plan Display**: Shows user's previous plans on load
- **Plan Selection**: Click any existing plan to view details
- **Create New Option**: Easy access to create additional plans
- **Favorite System**: Mark important plans with star indicator
- **Auto-refresh**: Plans list updates after creating new plan

### Frontend Improvements
- **Loading States**: Clear indicators during plan generation
- **Error Handling**: Detailed error messages with troubleshooting info
- **Responsive Design**: Works on desktop and mobile devices
- **State Management**: Proper handling of multiple UI states

### Backend Enhancements
- **Agent Integration**: Proper orchestration of multiple AI agents
- **Data Persistence**: Complete plan data storage with agent outputs
- **Error Recovery**: Graceful handling of agent failures
- **Performance**: Optimized database queries and indexes

## Troubleshooting

### Common Issues

1. **"Table not found" Error**
   - Run `investment_plans_table.sql` in Supabase SQL Editor

2. **Plans Not Loading**
   - Check user login status
   - Verify browser console for errors
   - Try refreshing the page

3. **Plan Creation Fails**
   - Check internet connection
   - Verify backend server is running
   - Look for rate limiting errors

### Getting Help

1. **Check Documentation**: Start with relevant section above
2. **Browser Console**: Look for JavaScript errors (F12)
3. **Network Tab**: Check for failed API requests
4. **Contact Support**: Provide error details and steps to reproduce

## Development

### Setup Requirements
- **Frontend**: React, modern browser
- **Backend**: FastAPI with agent dependencies
- **Database**: Supabase (PostgreSQL)
- **AI Services**: Mistral LLM integration

### Testing
- **Unit Tests**: Component and API endpoint testing
- **Integration Tests**: End-to-end plan creation flow
- **Database Tests**: Schema validation and data integrity
- **Agent Tests**: AI agent response validation

### Deployment
- **Frontend**: Static deployment (Vercel, Netlify)
- **Backend**: Container deployment with agent services
- **Database**: Managed Supabase instance
- **Monitoring**: API performance and error tracking

## Contributing

### Documentation Updates
- Keep documentation current with code changes
- Update examples when API changes
- Add troubleshooting for new issues
- Include version information

### Code Changes
- Follow existing patterns and conventions
- Update tests for new functionality
- Document new features thoroughly
- Ensure backward compatibility

## Version History

- **v1.3** (Current): Enhanced plan management with existing plan display
- **v1.2**: Added comprehensive database schema and agent integration
- **v1.1**: Implemented multi-agent AI system with proper data storage
- **v1.0**: Initial Plan Creator with basic LLM integration

---

For specific implementation details, refer to the individual documentation files linked above. For support or questions, contact the development team or create an issue in the project repository.