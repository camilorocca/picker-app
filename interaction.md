# Picker App - Interaction Design

## Core Philosophy
A harm reduction focused application that empowers users to make informed decisions about psychotropic substance use through education, tracking, and self-awareness.

## Main Features

### 1. Substance Logger (Index Page)
**Primary Interface**: Clean substance entry system
- **Substance Selection**: Dropdown with common psychotropic categories (Cannabis, Psychedelics, Dissociatives, etc.)
- **Dosage Tracker**: Input field with unit selection (mg, g, tabs, etc.)
- **Method Selector**: Dropdown for consumption method (oral, inhalation, etc.)
- **Time Logger**: Date/time picker for when taken
- **Batch Quality**: Optional batch/source identifier for tracking consistency
- **Quick Notes**: Short text field for immediate observations
- **Safety Check**: Pre-entry harm reduction prompts and warnings

**Interaction Flow**:
1. User selects substance category
2. App displays relevant harm reduction information
3. User enters dosage and method
4. Safety calculator shows if dosage is within common ranges
5. Entry is saved with timestamp
6. Immediate feedback on logging success

### 2. Evaluation System (Evaluation Page)
**Rating Interface**: Comprehensive post-experience assessment
- **Effectiveness Scale**: 1-10 slider for desired effects achieved
- **Side Effects**: Multi-select checklist of common effects
- **Duration Tracker**: Time picker for onset, peak, and total duration
- **Mood Assessment**: Emoji-based mood rating before/during/after
- **Quality Rating**: Overall substance quality 1-5 stars
- **Detailed Notes**: Rich text area for comprehensive experience description
- **Would Repeat**: Boolean toggle for future use consideration

**Interaction Flow**:
1. User selects logged substance from timeline
2. Evaluation form appears with substance-specific metrics
3. User completes multi-faceted rating
4. App calculates overall satisfaction score
5. Data is saved and integrated into insights

### 3. Insights Dashboard (Insights Page)
**Analytics Interface**: Pattern recognition and safety tracking
- **Usage Timeline**: Visual calendar showing substance use patterns
- **Effectiveness Trends**: Graph showing which substances work best
- **Safety Metrics**: Alerts for concerning patterns (frequency, dosage)
- **Personal Preferences**: Ranked list of best-performing substances
- **Harm Reduction Tips**: Contextual advice based on usage patterns
- **Export Data**: Option to download personal data for healthcare providers

**Interaction Flow**:
1. Dashboard loads with personalized analytics
2. User can filter by date range, substance type, or effectiveness
3. Interactive charts show usage patterns
4. Safety alerts appear if concerning trends detected
5. Educational content appears based on user's substance history

## Safety Features
- **Dose Range Warnings**: Visual indicators for common, strong, and heavy doses
- **Interaction Alerts**: Warnings about potential substance combinations
- **Frequency Monitoring**: Gentle reminders about usage patterns
- **Educational Tooltips**: Contextual harm reduction information
- **Emergency Resources**: Quick access to harm reduction organizations

## Data Privacy
- **Local Storage**: All data stored locally on device
- **No Cloud Sync**: No external data transmission for privacy
- **Export Control**: User controls all data sharing
- **Anonymous Mode**: Option to use without personal identifiers

## Progressive Web App Features
- **Offline Functionality**: Works without internet connection
- **Home Screen Install**: Add to phone like native app
- **Push Notifications**: Optional reminders for evaluation timing
- **Background Sync**: Data syncs when connection restored