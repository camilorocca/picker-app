# Picker App - Project Outline

## File Structure
```
/mnt/okcomputer/output/
├── index.html              # Main substance logging interface
├── evaluation.html         # Substance evaluation and rating system
├── insights.html          # Analytics and pattern recognition dashboard
├── main.js               # Core application logic and data management
├── manifest.json         # PWA manifest for installation
├── sw.js                # Service worker for offline functionality
├── resources/           # Local assets and images
│   ├── hero-wellness.jpg    # Hero image for health/wellness theme
│   ├── safety-icons/        # Safety and harm reduction icons
│   ├── substance-categories/ # Educational images for substance types
│   └── patterns-bg.jpg      # Background texture for insights page
└── README.md            # App documentation and harm reduction resources
```

## Page Breakdown

### index.html - Substance Logger
**Purpose**: Primary interface for logging substance use with harm reduction focus
**Key Sections**:
- Hero area with wellness imagery and app introduction
- Quick substance selector with safety information
- Dosage input with range warnings and unit selection
- Method of consumption dropdown
- Time/date logging interface
- Batch/source identifier for quality tracking
- Immediate safety tips and harm reduction information
- Recent entries timeline with quick evaluation access

**Interactive Components**:
- Substance category selector with educational tooltips
- Dosage slider with color-coded safety zones
- Smart form validation with gentle error messages
- Quick-add buttons for common dosages
- Safety calculator showing dose ranges

### evaluation.html - Experience Evaluation
**Purpose**: Comprehensive post-experience assessment and rating system
**Key Sections**:
- Timeline of recent substance uses awaiting evaluation
- Multi-faceted rating system (effectiveness, side effects, duration)
- Mood tracking with emoji-based interface
- Quality assessment with star ratings
- Detailed notes with rich text editor
- Safety incident reporting
- Personal preference tracking

**Interactive Components**:
- Sliding scale ratings with visual feedback
- Multi-select side effects checklist
- Duration timers with start/stop/peak tracking
- Mood selector with before/during/after states
- Photo attachment for batch documentation

### insights.html - Analytics Dashboard
**Purpose**: Pattern recognition, safety monitoring, and educational insights
**Key Sections**:
- Usage calendar with visual pattern indicators
- Effectiveness trends and substance rankings
- Safety metrics and alert system
- Personal preferences and recommendations
- Harm reduction tips based on usage patterns
- Data export options for healthcare providers

**Interactive Components**:
- Interactive charts showing usage patterns
- Filterable timeline with substance/type/date ranges
- Safety alert system with actionable recommendations
- Educational content carousel
- Data visualization with drill-down capabilities

## Technical Implementation

### Data Management
- **Local Storage**: All data stored locally for privacy
- **Data Structure**: JSON-based entries with timestamps
- **Backup System**: Export/import functionality for data portability
- **Privacy**: No external data transmission or cloud sync

### PWA Features
- **Offline Functionality**: Works without internet connection
- **Install Prompt**: Add to home screen capability
- **Push Notifications**: Optional reminders for evaluations
- **Background Sync**: Data synchronization when connection restored
- **App Shell**: Fast loading with service worker caching

### Safety Features
- **Dose Range Warnings**: Visual indicators for common/strong/heavy doses
- **Interaction Alerts**: Warnings about potential substance combinations
- **Frequency Monitoring**: Pattern recognition for concerning usage
- **Emergency Resources**: Quick access to harm reduction organizations
- **Educational Content**: Contextual harm reduction information

### Visual Effects & Animation
- **Anime.js**: Smooth form transitions and micro-interactions
- **ECharts.js**: Medical-grade data visualization
- **p5.js**: Subtle wellness-themed background effects
- **Splide**: Educational content carousels
- **Custom CSS**: Medical minimalism with warm accents

## Harm Reduction Integration
- **Non-judgmental Language**: Person-first, stigma-free terminology
- **Educational Focus**: Contextual harm reduction information
- **Safety Prioritization**: Dose warnings and interaction alerts
- **Empowerment Approach**: User control over data and goals
- **Resource Connection**: Links to harm reduction organizations
- **Privacy Protection**: Local storage with user control

## Accessibility & Usability
- **WCAG AA Compliance**: High contrast and screen reader support
- **Mobile-first Design**: Optimized for phone use
- **Progressive Enhancement**: Core functionality without JavaScript
- **Clear Navigation**: Intuitive tab-based interface
- **Error Prevention**: Gentle validation and confirmation dialogs