// Picker App - Main JavaScript File
// Data management and core functionality

// Data storage keys
const STORAGE_KEYS = {
    ENTRIES: 'picker_entries',
    EVALUATIONS: 'picker_evaluations',
    SETTINGS: 'picker_settings'
};

// Initialize app data
function initializeApp() {
    // Initialize storage if not exists
    if (!localStorage.getItem(STORAGE_KEYS.ENTRIES)) {
        localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.EVALUATIONS)) {
        localStorage.setItem(STORAGE_KEYS.EVALUATIONS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify({
            theme: 'light',
            notifications: true,
            dataRetention: 365 // days
        }));
    }
}

// Entry management functions
function saveEntry(entry) {
    const entries = getAllEntries();
    entries.push(entry);
    localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(entries));
    
    // Trigger data cleanup
    cleanupOldData();
}

function getAllEntries() {
    const entries = localStorage.getItem(STORAGE_KEYS.ENTRIES);
    return entries ? JSON.parse(entries) : [];
}

function getRecentEntries(limit = 5) {
    const entries = getAllEntries();
    return entries
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, limit);
}

function getEntryById(id) {
    const entries = getAllEntries();
    return entries.find(entry => entry.id === id);
}

function getPendingEvaluations() {
    const entries = getAllEntries();
    const evaluations = getAllEvaluations();
    const evaluatedEntryIds = new Set(evaluations.map(e => e.entryId));
    
    return entries
        .filter(entry => !evaluatedEntryIds.has(entry.id))
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

function markEntryAsEvaluated(entryId) {
    const entries = getAllEntries();
    const entryIndex = entries.findIndex(entry => entry.id === entryId);
    if (entryIndex !== -1) {
        entries[entryIndex].evaluated = true;
        localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(entries));
    }
}

// Evaluation management functions
function saveEvaluationData(evaluation) {
    const evaluations = getAllEvaluations();
    evaluations.push(evaluation);
    localStorage.setItem(STORAGE_KEYS.EVALUATIONS, JSON.stringify(evaluations));
}

function getAllEvaluations() {
    const evaluations = localStorage.getItem(STORAGE_KEYS.EVALUATIONS);
    return evaluations ? JSON.parse(evaluations) : [];
}

function getEvaluationsByEntryId(entryId) {
    const evaluations = getAllEvaluations();
    return evaluations.filter(evaluation => evaluation.entryId === entryId);
}

// Settings management
function getSettings() {
    const settings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return settings ? JSON.parse(settings) : {};
}

function updateSettings(newSettings) {
    const currentSettings = getSettings();
    const updatedSettings = { ...currentSettings, ...newSettings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updatedSettings));
}

// Data cleanup function
function cleanupOldData() {
    const settings = getSettings();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - settings.dataRetention);
    
    // Clean up old entries
    const entries = getAllEntries();
    const validEntries = entries.filter(entry => {
        const entryDate = new Date(entry.timestamp);
        return entryDate >= cutoffDate;
    });
    localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(validEntries));
    
    // Clean up evaluations for deleted entries
    const evaluations = getAllEvaluations();
    const validEvaluations = evaluations.filter(evaluation => {
        const evaluationDate = new Date(evaluation.timestamp);
        return evaluationDate >= cutoffDate && validEntries.some(entry => entry.id === evaluation.entryId);
    });
    localStorage.setItem(STORAGE_KEYS.EVALUATIONS, JSON.stringify(validEvaluations));
}

// Analytics functions
function getUsageStatistics(days = 30) {
    const entries = getAllEntries();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const recentEntries = entries.filter(entry => 
        new Date(entry.timestamp) >= cutoffDate
    );
    
    const statistics = {
        totalEntries: recentEntries.length,
        categoryBreakdown: {},
        methodBreakdown: {},
        averageDosageByCategory: {},
        usageFrequency: {},
        mostActiveDay: null,
        mostActiveHour: null
    };
    
    // Category breakdown
    recentEntries.forEach(entry => {
        statistics.categoryBreakdown[entry.category] = 
            (statistics.categoryBreakdown[entry.category] || 0) + 1;
        
        statistics.methodBreakdown[entry.method] = 
            (statistics.methodBreakdown[entry.method] || 0) + 1;
        
        // Average dosage by category
        if (!statistics.averageDosageByCategory[entry.category]) {
            statistics.averageDosageByCategory[entry.category] = {
                total: 0,
                count: 0,
                unit: entry.unit
            };
        }
        statistics.averageDosageByCategory[entry.category].total += entry.dosage;
        statistics.averageDosageByCategory[entry.category].count += 1;
    });
    
    // Calculate averages
    Object.keys(statistics.averageDosageByCategory).forEach(category => {
        const data = statistics.averageDosageByCategory[category];
        data.average = data.total / data.count;
    });
    
    // Most active day and hour
    const dayCounts = {};
    const hourCounts = {};
    
    recentEntries.forEach(entry => {
        const date = new Date(entry.timestamp);
        const day = date.toLocaleDateString('en-US', { weekday: 'long' });
        const hour = date.getHours();
        
        dayCounts[day] = (dayCounts[day] || 0) + 1;
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    
    statistics.mostActiveDay = Object.entries(dayCounts)
        .sort(([,a], [,b]) => b - a)[0]?.[0];
    
    statistics.mostActiveHour = Object.entries(hourCounts)
        .sort(([,a], [,b]) => b - a)[0]?.[0];
    
    return statistics;
}

function getEffectivenessAnalysis() {
    const evaluations = getAllEvaluations();
    const entries = getAllEntries();
    
    const analysis = {
        averageEffectiveness: 0,
        effectivenessByCategory: {},
        effectivenessByMethod: {},
        bestExperiences: [],
        worstExperiences: [],
        sideEffectFrequency: {},
        repeatIntentions: { yes: 0, no: 0 }
    };
    
    if (evaluations.length === 0) {
        return analysis;
    }
    
    // Overall effectiveness
    analysis.averageEffectiveness = evaluations.reduce((sum, e) => sum + e.effectiveness, 0) / evaluations.length;
    
    // Effectiveness by category and method
    evaluations.forEach(evaluation => {
        const entry = entries.find(entry => entry.id === evaluation.entryId);
        if (!entry) return;
        
        // By category
        if (!analysis.effectivenessByCategory[entry.category]) {
            analysis.effectivenessByCategory[entry.category] = { total: 0, count: 0 };
        }
        analysis.effectivenessByCategory[entry.category].total += evaluation.effectiveness;
        analysis.effectivenessByCategory[entry.category].count += 1;
        
        // By method
        if (!analysis.effectivenessByMethod[entry.method]) {
            analysis.effectivenessByMethod[entry.method] = { total: 0, count: 0 };
        }
        analysis.effectivenessByMethod[entry.method].total += evaluation.effectiveness;
        analysis.effectivenessByMethod[entry.method].count += 1;
        
        // Side effects
        evaluation.sideEffects.forEach(effect => {
            analysis.sideEffectFrequency[effect] = (analysis.sideEffectFrequency[effect] || 0) + 1;
        });
        
        // Repeat intentions
        if (evaluation.wouldRepeat) {
            analysis.repeatIntentions.yes += 1;
        } else {
            analysis.repeatIntentions.no += 1;
        }
    });
    
    // Calculate averages
    Object.keys(analysis.effectivenessByCategory).forEach(category => {
        const data = analysis.effectivenessByCategory[category];
        data.average = data.total / data.count;
    });
    
    Object.keys(analysis.effectivenessByMethod).forEach(method => {
        const data = analysis.effectivenessByMethod[method];
        data.average = data.total / data.count;
    });
    
    // Best and worst experiences
    const sortedEvaluations = evaluations
        .map(e => ({ ...e, entry: entries.find(entry => entry.id === e.entryId) }))
        .filter(e => e.entry)
        .sort((a, b) => b.effectiveness - a.effectiveness);
    
    analysis.bestExperiences = sortedEvaluations.slice(0, 3);
    analysis.worstExperiences = sortedEvaluations.slice(-3).reverse();
    
    return analysis;
}

// Safety monitoring functions
function getSafetyAlerts() {
    const entries = getAllEntries();
    const evaluations = getAllEvaluations();
    const alerts = [];
    
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // High frequency alert
    const recentEntries = entries.filter(entry => 
        new Date(entry.timestamp) >= sevenDaysAgo
    );
    
    if (recentEntries.length >= 5) {
        alerts.push({
            type: 'frequency',
            severity: 'warning',
            title: 'High Usage Frequency',
            message: `You've logged ${recentEntries.length} substances in the past week. Consider spacing out use for better harm reduction.`,
            timestamp: now.toISOString()
        });
    }
    
    // Low effectiveness trend
    const recentEvaluations = evaluations.filter(evaluation => 
        new Date(evaluation.timestamp) >= sevenDaysAgo
    );
    
    if (recentEvaluations.length >= 3) {
        const avgEffectiveness = recentEvaluations.reduce((sum, e) => sum + e.effectiveness, 0) / recentEvaluations.length;
        if (avgEffectiveness < 5) {
            alerts.push({
                type: 'effectiveness',
                severity: 'info',
                title: 'Low Effectiveness Trend',
                message: 'Recent experiences have been rated below average. Consider tolerance breaks or dosage adjustments.',
                timestamp: now.toISOString()
            });
        }
    }
    
    // Multiple substances in one day
    const entriesByDay = {};
    recentEntries.forEach(entry => {
        const day = new Date(entry.timestamp).toDateString();
        entriesByDay[day] = (entriesByDay[day] || 0) + 1;
    });
    
    Object.entries(entriesByDay).forEach(([day, count]) => {
        if (count >= 2) {
            alerts.push({
                type: 'combination',
                severity: 'warning',
                title: 'Multiple Substances in One Day',
                message: `You logged ${count} substances on ${day}. Be cautious about combining substances.`,
                timestamp: now.toISOString()
            });
        }
    });
    
    return alerts;
}

// Data export functions
function exportAllData() {
    const data = {
        entries: getAllEntries(),
        evaluations: getAllEvaluations(),
        settings: getSettings(),
        exportDate: new Date().toISOString(),
        version: '1.0.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `picker-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function importData(jsonData) {
    try {
        const data = JSON.parse(jsonData);
        
        if (data.entries) {
            localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(data.entries));
        }
        if (data.evaluations) {
            localStorage.setItem(STORAGE_KEYS.EVALUATIONS, JSON.stringify(data.evaluations));
        }
        if (data.settings) {
            localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings));
        }
        
        return true;
    } catch (error) {
        console.error('Error importing data:', error);
        return false;
    }
}

// Utility functions
function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(timestamp);
}

function getCategoryEmoji(category) {
    const emojis = {
        'cannabis': '🌿',
        'psychedelics': '🍄',
        'dissociatives': '💫',
        'stimulants': '⚡',
        'opioids': '💊',
        'benzodiazepines': '💊',
        'alcohol': '🍺',
        'tobacco': '🚬'
    };
    return emojis[category] || '💊';
}

function validateEntry(entry) {
    const errors = [];
    
    if (!entry.category) {
        errors.push('Category is required');
    }
    
    if (!entry.dosage || entry.dosage <= 0) {
        errors.push('Valid dosage is required');
    }
    
    if (!entry.method) {
        errors.push('Method of consumption is required');
    }
    
    if (!entry.timestamp) {
        errors.push('Timestamp is required');
    }
    
    return errors;
}

function validateEvaluation(evaluation) {
    const errors = [];
    
    if (!evaluation.entryId) {
        errors.push('Entry ID is required');
    }
    
    if (!evaluation.effectiveness || evaluation.effectiveness < 1 || evaluation.effectiveness > 10) {
        errors.push('Effectiveness rating must be between 1 and 10');
    }
    
    return errors;
}

// Harm reduction helper functions
function getDosageWarning(category, dosage, unit) {
    // This is a simplified example - in a real app, this would use comprehensive dosage databases
    const dosageRanges = {
        'cannabis': { light: 5, common: 15, strong: 25 }, // mg THC
        'psychedelics': { light: 50, common: 150, strong: 300 }, // µg LSD equivalent
        'stimulants': { light: 20, common: 50, strong: 100 } // mg amphetamine equivalent
    };
    
    const ranges = dosageRanges[category];
    if (!ranges) return null;
    
    if (dosage <= ranges.light) {
        return { level: 'light', message: 'Light dose - effects may be subtle' };
    } else if (dosage <= ranges.common) {
        return { level: 'common', message: 'Common dose - typical effects expected' };
    } else if (dosage <= ranges.strong) {
        return { level: 'strong', message: 'Strong dose - intense effects possible' };
    } else {
        return { level: 'heavy', message: 'Heavy dose - caution advised', warning: true };
    }
}

function generateHarmReductionTips(entries, evaluations) {
    const tips = [];
    
    // Analyze usage patterns
    const recentEntries = entries.filter(entry => {
        const daysSince = (new Date() - new Date(entry.timestamp)) / (1000 * 60 * 60 * 24);
        return daysSince <= 30;
    });
    
    // Category-specific tips
    const categoryCounts = {};
    recentEntries.forEach(entry => {
        categoryCounts[entry.category] = (categoryCounts[entry.category] || 0) + 1;
    });
    
    const mostUsedCategory = Object.entries(categoryCounts)
        .sort(([,a], [,b]) => b - a)[0];
    
    if (mostUsedCategory) {
        tips.push({
            title: `${mostUsedCategory[0]} Usage Pattern`,
            content: `You've used ${mostUsedCategory[0]} ${mostUsedCategory[1]} times recently. Consider tracking batch consistency and tolerance levels.`
        });
    }
    
    // Effectiveness-based tips
    if (evaluations.length > 0) {
        const recentEvaluations = evaluations.filter(e => {
            const daysSince = (new Date() - new Date(e.timestamp)) / (1000 * 60 * 60 * 24);
            return daysSince <= 14;
        });
        
        if (recentEvaluations.length >= 3) {
            const avgEffectiveness = recentEvaluations.reduce((sum, e) => sum + e.effectiveness, 0) / recentEvaluations.length;
            
            if (avgEffectiveness < 5) {
                tips.push({
                    title: 'Effectiveness Optimization',
                    content: 'Recent experiences rated below 5/10. Consider tolerance breaks or dosage adjustments for better harm reduction.'
                });
            }
        }
    }
    
    // Default safety tips
    if (tips.length === 0) {
        tips.push(
            {
                title: 'Start Low, Go Slow',
                content: 'Always begin with lower doses, especially with new substances or batches. You can take more, but you can\'t take less.'
            },
            {
                title: 'Set and Setting',
                content: 'Your environment and mental state greatly impact your experience. Choose safe, comfortable settings.'
            },
            {
                title: 'Have a Plan',
                content: 'Know your dose, have water available, and consider having a trusted friend aware of your plans.'
            }
        );
    }
    
    return tips;
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        // Entry functions
        saveEntry,
        getAllEntries,
        getRecentEntries,
        getEntryById,
        getPendingEvaluations,
        markEntryAsEvaluated,
        
        // Evaluation functions
        saveEvaluationData,
        getAllEvaluations,
        getEvaluationsByEntryId,
        
        // Settings functions
        getSettings,
        updateSettings,
        
        // Analytics functions
        getUsageStatistics,
        getEffectivenessAnalysis,
        getSafetyAlerts,
        
        // Export/Import functions
        exportAllData,
        importData,
        
        // Utility functions
        formatDate,
        formatTime,
        getCategoryEmoji,
        validateEntry,
        validateEvaluation,
        getDosageWarning,
        generateHarmReductionTips
    };
}