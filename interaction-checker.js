// Picker App - Substance Interaction Checker
// Provides warnings about potentially dangerous substance combinations

class InteractionChecker {
    constructor() {
        // Comprehensive interaction database based on scientific research
        this.interactions = {
            // Depressant combinations (high risk)
            'alcohol+opioids': {
                severity: 'dangerous',
                risk: 'Respiratory depression, coma, death',
                mechanism: 'Additive CNS depression',
                description: 'Extremely dangerous combination with high risk of fatal respiratory depression'
            },
            'alcohol+benzodiazepines': {
                severity: 'dangerous',
                risk: 'Severe respiratory depression, memory loss, coma',
                mechanism: 'Synergistic GABA enhancement',
                description: 'Highly dangerous - both substances enhance GABA activity'
            },
            'opioids+benzodiazepines': {
                severity: 'dangerous',
                risk: 'Profound respiratory depression, high overdose risk',
                mechanism: 'Combined CNS depression',
                description: 'Major cause of opioid overdose deaths'
            },
            
            // Stimulant combinations (moderate to high risk)
            'cocaine+alcohol': {
                severity: 'dangerous',
                risk: 'Cardiotoxicity, liver damage, cocaethylene formation',
                mechanism: 'Creates toxic cocaethylene metabolite',
                description: 'Forms dangerous cocaethylene in the liver'
            },
            'mdma+alcohol': {
                severity: 'unsafe',
                risk: 'Dehydration, overheating, reduced MDMA effects',
                mechanism: 'Alcohol masks MDMA effects, increases dehydration',
                description: 'Alcohol can mask MDMA effects and increase overheating risk'
            },
            'amphetamines+caffeine': {
                severity: 'unsafe',
                risk: 'Excessive stimulation, anxiety, cardiovascular stress',
                mechanism: 'Additive stimulant effects',
                description: 'Can lead to overstimulation and cardiovascular issues'
            },
            
            // Serotonin syndrome risk
            'mdma+ssris': {
                severity: 'dangerous',
                risk: 'Serotonin syndrome, reduced MDMA effects',
                mechanism: 'Excessive serotonin activity',
                description: 'Risk of life-threatening serotonin syndrome'
            },
            'mdma+maois': {
                severity: 'dangerous',
                risk: 'Severe serotonin syndrome, hypertensive crisis',
                mechanism: 'Extreme serotonin elevation',
                description: 'Extremely dangerous - can be fatal'
            },
            'lsd+lithium': {
                severity: 'dangerous',
                risk: 'Seizures, psychotic episodes',
                mechanism: 'Unknown mechanism',
                description: 'Reports of seizures and psychotic reactions'
            },
            
            // Cannabis interactions
            'cannabis+alcohol': {
                severity: 'caution',
                risk: 'Increased impairment, nausea, dizziness',
                mechanism: 'Additive CNS depression',
                description: 'Can cause severe nausea and increased impairment'
            },
            'cannabis+stimulants': {
                severity: 'caution',
                risk: 'Anxiety, paranoia, cardiovascular stress',
                mechanism: 'Cannabis can amplify stimulant anxiety',
                description: 'May increase anxiety and paranoia from stimulants'
            },
            
            // Psychedelic interactions
            'lsd+mdma': {
                severity: 'caution',
                risk: 'Intense experience, potential for overwhelming effects',
                mechanism: 'Combined serotonergic activity',
                description: 'Can be overwhelming for inexperienced users'
            },
            'psilocybin+mdma': {
                severity: 'caution',
                risk: 'Intensified psychedelic experience',
                mechanism: 'Combined serotonergic effects',
                description: 'Significantly intensifies the psychedelic experience'
            }
        };
        
        // Substance categories for broader matching
        this.substanceCategories = {
            'opioids': ['heroin', 'oxycodone', 'morphine', 'fentanyl', 'codeine', 'tramadol'],
            'benzodiazepines': ['alprazolam', 'clonazepam', 'diazepam', 'lorazepam', 'etizolam'],
            'stimulants': ['cocaine', 'amphetamine', 'methamphetamine', 'mdma', 'mephedrone'],
            'psychedelics': ['lsd', 'psilocybin', 'dmt', 'mescaline'],
            'cannabis': ['marijuana', 'thc', 'cbd', 'cannabis'],
            'alcohol': ['ethanol', 'alcohol', 'beer', 'wine', 'liquor'],
            'dissociatives': ['ketamine', 'pcp', 'dxm', 'nitrous'],
            'deliriants': ['datura', 'diphenhydramine', 'scopolamine']
        };
    }
    
    checkInteraction(substance1, substance2, dosage1 = null, dosage2 = null) {
        const key1 = this.normalizeInteractionKey(substance1, substance2);
        const key2 = this.normalizeInteractionKey(substance2, substance1);
        
        const interaction = this.interactions[key1] || this.interactions[key2];
        
        if (interaction) {
            return {
                found: true,
                ...interaction,
                substances: [substance1, substance2],
                timestamp: new Date().toISOString()
            };
        }
        
        return {
            found: false,
            substances: [substance1, substance2],
            message: 'No known dangerous interactions between these substances',
            timestamp: new Date().toISOString()
        };
    }
    
    checkMultipleInteractions(substances) {
        const interactions = [];
        const warnings = [];
        
        // Check all pairwise combinations
        for (let i = 0; i < substances.length; i++) {
            for (let j = i + 1; j < substances.length; j++) {
                const interaction = this.checkInteraction(substances[i], substances[j]);
                if (interaction.found) {
                    interactions.push(interaction);
                    
                    if (interaction.severity === 'dangerous') {
                        warnings.push(`DANGEROUS: ${interaction.description}`);
                    } else if (interaction.severity === 'unsafe') {
                        warnings.push(`UNSAFE: ${interaction.description}`);
                    }
                }
            }
        }
        
        // Check for dangerous combinations with multiple substances
        const depressantCount = substances.filter(s => this.isDepressant(s)).length;
        const stimulantCount = substances.filter(s => this.isStimulant(s)).length;
        
        if (depressantCount >= 2) {
            warnings.push('Multiple depressants increase risk of respiratory depression and overdose');
        }
        
        if (stimulantCount >= 2) {
            warnings.push('Multiple stimulants increase risk of cardiovascular stress and overstimulation');
        }
        
        return {
            interactions,
            warnings,
            riskLevel: this.calculateRiskLevel(interactions),
            timestamp: new Date().toISOString()
        };
    }
    
    getRecentSubstances(days = 7) {
        const entries = getAllEntries();
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        
        const recentEntries = entries.filter(entry => 
            new Date(entry.timestamp) >= cutoff
        );
        
        return [...new Set(recentEntries.map(entry => entry.category))];
    }
    
    checkRecentInteractions(newSubstance) {
        const recentSubstances = this.getRecentSubstances();
        return this.checkMultipleInteractions([...recentSubstances, newSubstance]);
    }
    
    normalizeInteractionKey(substance1, substance2) {
        // Normalize substance names to match interaction database
        const norm1 = this.normalizeSubstanceName(substance1);
        const norm2 = this.normalizeSubstanceName(substance2);
        
        // Sort alphabetically to ensure consistent keys
        return [norm1, norm2].sort().join('+');
    }
    
    normalizeSubstanceName(substance) {
        const lower = substance.toLowerCase().trim();
        
        // Check if it's in a category
        for (const [category, substances] of Object.entries(this.substanceCategories)) {
            if (substances.includes(lower)) {
                return category;
            }
        }
        
        return lower;
    }
    
    isDepressant(substance) {
        const depressants = ['alcohol', 'benzodiazepines', 'opioids', 'gabapentin', 'phenibut'];
        return depressants.includes(this.normalizeSubstanceName(substance));
    }
    
    isStimulant(substance) {
        const stimulants = ['amphetamines', 'cocaine', 'mdma', 'caffeine', 'nicotine'];
        return stimulants.includes(this.normalizeSubstanceName(substance));
    }
    
    calculateRiskLevel(interactions) {
        if (interactions.some(i => i.severity === 'dangerous')) {
            return 'high';
        } else if (interactions.some(i => i.severity === 'unsafe')) {
            return 'moderate';
        } else if (interactions.some(i => i.severity === 'caution')) {
            return 'low';
        }
        return 'minimal';
    }
    
    getHarmReductionAdvice(interactionResult) {
        const advice = [];
        
        if (interactionResult.riskLevel === 'high') {
            advice.push(
                'DO NOT combine these substances - high risk of serious harm or death',
                'If already combined, seek immediate medical attention if experiencing difficulty breathing',
                'Have naloxone available if opioids are involved'
            );
        } else if (interactionResult.riskLevel === 'moderate') {
            advice.push(
                'Strongly consider avoiding this combination',
                'If combining, use much lower doses than usual',
                'Have a sober sitter present',
                'Avoid redosing'
            );
        } else if (interactionResult.riskLevel === 'low') {
            advice.push(
                'Be cautious with dosing - start lower than usual',
                'Pay attention to how you feel',
                'Stay hydrated and in a safe environment'
            );
        }
        
        // General harm reduction advice
        advice.push(
            'Test your substances when possible',
            'Avoid using alone',
            'Start with lower doses',
            'Stay hydrated'
        );
        
        return advice;
    }
    
    formatInteractionWarning(result) {
        if (!result.interactions || result.interactions.length === 0) {
            return {
                icon: '✅',
                color: '#81B366',
                title: 'No Dangerous Interactions',
                message: 'No known dangerous interactions found',
                advice: ['Always start with lower doses when combining substances']
            };
        }
        
        const dangerousInteractions = result.interactions.filter(i => i.severity === 'dangerous');
        const unsafeInteractions = result.interactions.filter(i => i.severity === 'unsafe');
        const cautionInteractions = result.interactions.filter(i => i.severity === 'caution');
        
        if (dangerousInteractions.length > 0) {
            return {
                icon: '⚠️',
                color: '#E07A5F',
                title: 'DANGEROUS COMBINATION',
                message: dangerousInteractions[0].description,
                advice: this.getHarmReductionAdvice(result)
            };
        } else if (unsafeInteractions.length > 0) {
            return {
                icon: '⚠️',
                color: '#F2CC8F',
                title: 'Unsafe Combination',
                message: unsafeInteractions[0].description,
                advice: this.getHarmReductionAdvice(result)
            };
        } else {
            return {
                icon: 'ℹ️',
                color: '#1E4D4B',
                title: 'Caution Advised',
                message: cautionInteractions[0].description,
                advice: this.getHarmReductionAdvice(result)
            };
        }
    }
}

// Create global instance
const interactionChecker = new InteractionChecker();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InteractionChecker;
}