# Plan Creator User Guide & Troubleshooting

## Table of Contents

1. [Getting Started](#getting-started)
2. [User Interface Guide](#user-interface-guide)
3. [Creating Your First Plan](#creating-your-first-plan)
4. [Managing Existing Plans](#managing-existing-plans)
5. [Understanding Your Investment Plan](#understanding-your-investment-plan)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)
8. [FAQ](#frequently-asked-questions)
9. [Support & Contact](#support--contact)

---

## Getting Started

### Prerequisites

Before using the Plan Creator, ensure you have:

1. **User Account**: You must be registered and logged into the Neural Capital platform
2. **Browser Compatibility**: Modern web browser (Chrome, Firefox, Safari, Edge)
3. **Internet Connection**: Stable connection for real-time plan generation
4. **JavaScript Enabled**: Required for the interactive interface

### Accessing Plan Creator

1. **Log into** your Neural Capital account
2. **Navigate to** the Dashboard
3. **Click on** "Plan Creator" tile
4. **Wait for** the component to load your existing plans

---

## User Interface Guide

### Main Interface States

The Plan Creator interface adapts based on your plan history:

#### First-Time Users (No Existing Plans)
```
┌─────────────────────────────────────┐
│        Create Your Investment Plan   │
│   Get personalized strategy based   │
│         on your financial goals     │
├─────────────────────────────────────┤
│                                     │
│  📊 Your Financial Goals            │
│  [Text input field]                 │
│                                     │
│  💼 Your Investment Preferences     │
│  [Text input field]                 │
│                                     │
│  [Create Investment Plan]           │
│                                     │
└─────────────────────────────────────┘
```

#### Returning Users (With Existing Plans)
```
┌─────────────────────────────────────┐
│          Your Investment Plans      │
│     View existing plans or create   │
│              a new one              │
├─────────────────────────────────────┤
│  Your Existing Plans                │
│                                     │
│  📋 Retirement Plan 2055      ⭐    │
│  RETIREMENT • $500,000         →    │
│  Created: Jan 15, 2024              │
│                                     │
│  🏠 House Down Payment              │
│  HOUSE • $100,000              →    │
│  Created: Jan 10, 2024              │
│                                     │
│  [Create New Plan]                  │
│                                     │
└─────────────────────────────────────┘
```

### Form Fields Explained

#### Financial Goals (Optional but Recommended)
- **Purpose**: Describe what you're saving/investing for
- **Format**: Free text, natural language
- **Examples**:
  - "Save $500,000 for retirement in 30 years"
  - "Build emergency fund of 6 months expenses"
  - "Save for house down payment in 5 years"
  - "Fund my children's college education"

#### Investment Preferences (Optional)
- **Purpose**: Specify your investment style and preferences
- **Format**: Free text describing preferences
- **Examples**:
  - "Conservative approach, minimal risk"
  - "ESG investments only, sustainable focus"
  - "High growth potential, can handle volatility"
  - "Diversified ETFs, low fees preferred"

### Visual Elements

#### Loading States
- **Spinner Animation**: Indicates plan generation in progress
- **Progress Messages**: Shows current processing step
- **Estimated Time**: Typically 15-45 seconds for plan generation

#### Success Indicators
- **Green Checkmarks**: Successful plan creation
- **Plan Display**: Comprehensive investment strategy shown
- **Confirmation Message**: Plan saved successfully

#### Error Indicators
- **Red Alert Boxes**: Error messages with details
- **Retry Options**: Clear instructions for resolving issues
- **Support Links**: Contact information for help

---

## Creating Your First Plan

### Step-by-Step Process

#### Step 1: Enter Your Information
1. **Click** in the "Financial Goals" field
2. **Describe** your primary financial objective
   ```
   Example: "I want to save $500,000 for retirement. I'm 35 years old and plan to retire at 65."
   ```

3. **Click** in the "Investment Preferences" field (optional)
4. **Describe** your investment style
   ```
   Example: "I prefer moderate risk with diversified ETFs. I want sustainable investments when possible."
   ```

#### Step 2: Generate Your Plan
1. **Click** "Create Investment Plan" button
2. **Wait** for processing (15-45 seconds)
3. **Watch** the loading indicator
4. **Review** your generated plan

#### Step 3: Review Your Results
Your plan will include:
- **Monthly Contribution**: Recommended monthly investment amount
- **Asset Allocation**: Percentage breakdown by investment type
- **Investment Milestones**: Key checkpoints and timeline
- **Risk Considerations**: Important risks to understand

### What Happens Behind the Scenes

When you create a plan, the system:

1. **Stores** your inputs in the database
2. **Runs Agent 3** (Planner Agent) to interpret your goals
3. **Runs Agent 2** (Portfolio Agent) to optimize allocation
4. **Generates** final plan using AI language model
5. **Saves** complete plan for future access
6. **Displays** results in user-friendly format

---

## Managing Existing Plans

### Viewing Existing Plans

When you have existing plans, the interface shows:

#### Plan List View
Each plan displays:
- **Plan Name**: Auto-generated or custom name
- **Plan Type**: RETIREMENT, HOUSE, EDUCATION, GENERAL
- **Target Amount**: Financial goal amount
- **Creation Date**: When the plan was created
- **Favorite Star**: If marked as favorite

#### Interacting with Plans

**Click on any plan** to:
- View complete plan details
- See asset allocation breakdown
- Review milestones and timeline
- Check risk considerations

**Plan Actions**:
- **⭐ Favorite**: Mark important plans (shows star icon)
- **👁️ View Details**: See complete plan information
- **🗑️ Archive**: Deactivate plans you no longer need

### Creating Additional Plans

You can create multiple plans for different goals:

1. **From Plan List**: Click "Create New Plan" button
2. **Fill New Form**: Enter details for new goal
3. **Generate**: Create additional plan
4. **Switch Between**: Easily access all your plans

### Plan Organization

Plans are organized by:
- **Favorites First**: Starred plans appear at top
- **Most Recent**: Newest plans shown first
- **Active Only**: Only shows active (non-archived) plans

---

## Understanding Your Investment Plan

### Plan Components Explained

#### Monthly Contribution
```
💰 $856/month
```
- **What it means**: Recommended monthly investment amount
- **How calculated**: Based on your goal amount, timeline, and expected returns
- **Flexibility**: You can invest more or less based on your capacity

#### Asset Allocation
```
📊 Asset Allocation
• Stocks: 70%
• Bonds: 25%
• Alternatives: 5%
```
- **Stocks**: Growth-focused investments (higher risk/return)
- **Bonds**: Stability-focused investments (lower risk/return)
- **Alternatives**: REITs, commodities, other diversifiers

#### Investment Milestones
```
📅 Milestones
• Year 5: Review allocation, consider reducing equity to 75%
• Year 15: Mid-career review, adjust for income changes
• Year 25: Pre-retirement, shift to conservative allocation
```
- **Purpose**: Key checkpoints for plan review
- **Actions**: Suggested adjustments over time
- **Timing**: When to make changes

#### Risk Considerations
```
⚠️ Risk Considerations
• Market Volatility: Portfolio may experience fluctuations
• Inflation Risk: Consider inflation impact on purchasing power
• Sequence Risk: Risk of poor returns early in retirement
```
- **Awareness**: Potential challenges to understand
- **Mitigation**: Strategies to manage risks
- **Monitoring**: What to watch for

### Interpreting Recommendations

#### Conservative Allocation (Low Risk)
- **Stocks**: 30-50%
- **Bonds**: 50-70%
- **Best For**: Short-term goals, risk-averse investors
- **Expected Return**: 4-6% annually

#### Balanced Allocation (Moderate Risk)
- **Stocks**: 60-70%
- **Bonds**: 25-35%
- **Alternatives**: 5-10%
- **Best For**: Medium-term goals, balanced approach
- **Expected Return**: 6-8% annually

#### Aggressive Allocation (High Risk)
- **Stocks**: 80-90%
- **Bonds**: 5-15%
- **Alternatives**: 5-10%
- **Best For**: Long-term goals, growth-focused
- **Expected Return**: 8-12% annually

---

## Best Practices

### Writing Effective Financial Goals

#### ✅ Good Examples
```
"Save $500,000 for retirement in 30 years. I'm 35 years old."
"Build a $25,000 emergency fund within 2 years."
"Save $100,000 for a house down payment in 5 years."
"Fund my child's college education starting in 15 years."
```

#### ❌ Avoid These
```
"Make money" (too vague)
"Get rich quick" (unrealistic timeframe)
"Invest in crypto" (too specific)
"Whatever you recommend" (no personal context)
```

### Investment Preference Guidelines

#### Be Specific About
- **Risk Tolerance**: Conservative, moderate, or aggressive
- **Investment Types**: ETFs, individual stocks, bonds
- **Values**: ESG, sustainable, ethical investing
- **Restrictions**: Assets to avoid, religious considerations

#### Example Preferences
```
"Moderate risk tolerance with focus on low-cost index funds and ETFs.
Prefer sustainable investing when possible. Want international diversification."
```

### Plan Management Tips

1. **Create Multiple Plans**: Different goals need different strategies
2. **Regular Reviews**: Check plans annually or when circumstances change
3. **Mark Favorites**: Star your most important plans
4. **Update Goals**: Modify plans when life changes occur
5. **Track Progress**: Monitor actual vs. projected performance

### When to Create New Plans

Create separate plans for:
- **Different Time Horizons**: Retirement vs. house purchase
- **Different Risk Levels**: Conservative emergency fund vs. aggressive growth
- **Different Purposes**: Personal vs. children's goals
- **Major Life Changes**: Marriage, job change, inheritance

---

## Troubleshooting

### Common Issues and Solutions

#### Issue: "Table not found" Error
```
Error: Could not find the table 'public.investment_plans'
```
**Cause**: Database table hasn't been created
**Solution**: Contact support to initialize the database table

#### Issue: Plan Creation Fails
```
Error: Failed to create plan: API Error 500
```
**Possible Causes**:
- Server overload
- Network connectivity
- Invalid user session

**Solutions**:
1. **Refresh** the page and try again
2. **Check** your internet connection
3. **Re-login** to refresh your session
4. **Contact support** if issue persists

#### Issue: Plans Not Loading
```
No existing plans shown, but you know you have some
```
**Troubleshooting Steps**:
1. **Check User ID**: Ensure you're logged in correctly
2. **Refresh Page**: Reload the Plan Creator
3. **Check Browser Console**: Look for JavaScript errors
4. **Try Different Browser**: Test in incognito mode

#### Issue: Plan Display Errors
```
Plan loads but shows incorrectly or incomplete
```
**Solutions**:
1. **Clear Browser Cache**: Remove stored data
2. **Disable Extensions**: Test with ad blockers off
3. **Check Internet Speed**: Ensure stable connection
4. **Try Mobile View**: Test on different screen size

### Technical Debugging

#### Browser Console Errors

If you're comfortable with technical debugging:

1. **Open Developer Tools** (F12 in most browsers)
2. **Go to Console tab**
3. **Look for red error messages**
4. **Copy error details** for support

Common error patterns:
```javascript
// Network errors
"Failed to fetch" - Check internet connection

// Authentication errors
"User ID is required" - Re-login to platform

// Data errors
"Invalid response format" - Contact support
```

#### Network Issues

Check network connectivity:
1. **Test Other Websites**: Ensure internet works
2. **Check Firewall**: Corporate networks may block API calls
3. **Try Different Network**: Test on mobile data
4. **VPN Issues**: Disable VPN if using one

### Performance Issues

#### Slow Plan Generation

If plans take longer than 60 seconds:

**Possible Causes**:
- High server load
- Complex goal interpretation
- Agent processing delays

**Solutions**:
1. **Wait Patiently**: Allow up to 2 minutes
2. **Simplify Goals**: Use clearer, shorter descriptions
3. **Try Off-Peak Hours**: Avoid high-traffic times
4. **Contact Support**: If consistently slow

#### Browser Performance

For better performance:
1. **Close Other Tabs**: Free up browser memory
2. **Update Browser**: Use latest version
3. **Restart Browser**: Clear temporary issues
4. **Check System Resources**: Ensure adequate RAM/CPU

---

## Frequently Asked Questions

### General Questions

**Q: How many plans can I create?**
A: There's no limit. Create as many plans as you need for different goals.

**Q: Can I modify a plan after creation?**
A: Currently, you create new plans rather than editing existing ones. This preserves the original analysis for reference.

**Q: Are my plans private?**
A: Yes, your plans are completely private and only visible to you.

**Q: How accurate are the recommendations?**
A: Recommendations are based on modern portfolio theory and historical data, but market performance can vary. Plans are educational tools, not guaranteed outcomes.

### Technical Questions

**Q: What browsers are supported?**
A: Modern browsers including Chrome, Firefox, Safari, and Edge. JavaScript must be enabled.

**Q: Can I use this on mobile?**
A: Yes, the interface is responsive and works on mobile devices, though desktop provides the best experience.

**Q: Is my data backed up?**
A: Yes, all plan data is stored securely in the cloud with automatic backups.

**Q: Can I export my plans?**
A: Currently, plans are viewed within the platform. Export functionality may be added in future updates.

### Investment Questions

**Q: Should I follow the allocation exactly?**
A: The allocation is a guideline. Consider it alongside advice from qualified financial advisors.

**Q: How often should I review my plans?**
A: Review annually or when major life changes occur (job change, marriage, etc.).

**Q: What if my risk tolerance changes?**
A: Create a new plan with updated preferences to see how recommendations change.

**Q: Can the AI predict market crashes?**
A: No, the AI cannot predict market timing. Plans are based on long-term historical patterns and diversification principles.

---

## Support & Contact

### Getting Help

#### Self-Service Options
1. **Check this Documentation**: Most questions answered here
2. **Browser Console**: Check for technical error messages
3. **Try Different Browser**: Rule out browser-specific issues
4. **Clear Cache**: Resolve display problems

#### Contact Support

When contacting support, please provide:

**Required Information**:
- Your user ID or email
- Detailed description of the issue
- Steps you took before the problem occurred
- Any error messages (exact text)
- Browser and operating system

**Helpful Information**:
- Screenshots of errors
- Browser console logs
- Time when issue occurred
- Whether issue is reproducible

#### Support Channels

- **Email**: support@neural-capital.com
- **Documentation**: Full technical docs available
- **Community Forum**: User discussions and tips
- **FAQ**: Common questions and solutions

### Escalation Process

1. **First Contact**: Basic troubleshooting support
2. **Technical Team**: Complex technical issues
3. **Development Team**: Bug reports and feature requests
4. **Product Team**: Feature improvements and feedback

### Response Times

- **Critical Issues**: 2-4 hours (during business hours)
- **Standard Issues**: 24-48 hours
- **Feature Requests**: 1-2 weeks for evaluation
- **General Questions**: 24 hours

---

## Conclusion

The Plan Creator is designed to make investment planning accessible and personalized. By following this guide, you should be able to:

- Create comprehensive investment plans
- Understand and interpret recommendations
- Manage multiple plans effectively
- Troubleshoot common issues
- Get help when needed

Remember that investment plans are educational tools to help you understand potential strategies. Always consider consulting with qualified financial advisors for personalized advice based on your complete financial situation.

### Next Steps

1. **Create Your First Plan**: Start with your primary financial goal
2. **Explore Different Scenarios**: Try various risk levels and timelines
3. **Review Regularly**: Check plans as your situation evolves
4. **Learn More**: Explore other Neural Capital platform features
5. **Share Feedback**: Help us improve the Plan Creator experience

---

*This guide is updated regularly. For the latest version, check the documentation folder or contact support.*