# Ridecast Scoring Logic

## Overview

The Ridecast score (0-100) is calculated using a gradual penalty system that weighs different weather factors based on their impact on cycling safety and comfort.

## Weighting Priority

1. **Wind Gusts** (highest impact) - Max 50 points deduction - **Weighted 1.5x normal wind**
2. **Rain Intensity** (second highest) - Max 40 points deduction - **Weighted MORE than probability**
3. **Wind Speed** - Max 30 points deduction
4. **Rain Probability** (lowest impact) - Max 25 points deduction

## Penalty Calculation

All penalties use **gradual scaling** with exponential curves and tiered thresholds:

### Wind Speed
- **Formula**: `points = min(excess^1.4 × 1.5, 30)`
- **Rationale**: Moderate penalty that increases as wind gets stronger
- **Example**: 5 km/h over threshold = ~8 points, 10 km/h over = ~24 points

### Wind Gusts (Highest Weight - 1.5x Multiplier)
Gusts use a **tiered penalty system** based on absolute wind speed:

#### 60+ km/h - SEVERE
- **Base penalty**: 45 points
- **Additional**: `(excess - (60 - threshold))^2 × 2`
- **Severity**: HIGH
- **Message**: "SEVERE gusts - extremely dangerous"

#### 45-59 km/h - STRONG
- **Base penalty**: 25 points
- **Additional**: `(windGust - 45)^1.8 × 1.5`
- **Severity**: HIGH
- **Message**: "STRONG gusts - dangerous conditions"

#### 35-44 km/h - MODERATE
- **Base penalty**: 15 points
- **Additional**: `(windGust - 35)^1.6 × 1.2`
- **Severity**: MEDIUM
- **Message**: "MODERATE gusts - challenging ride"

#### Below 35 km/h
- **Formula**: `excess^1.5 × 2.25` (1.5x multiplier)
- **Severity**: LOW

**Example penalties**:
- 35 km/h gusts = 15 points (moderate)
- 45 km/h gusts = 25 points (strong)
- 60 km/h gusts = 45+ points (severe)

### Rain Probability
- **Formula**: `points = min(excess^1.2 × 0.5, 25)`
- **Rationale**: Probability alone is less critical - gentle curve
- **Example**: 20% over threshold = ~6 points, 40% over = ~17 points

### Rain Intensity (Second Highest Weight)
- **Formula**: `points = min(excess^1.5 × 12, 40)`
- **Rationale**: Actual rainfall matters MORE than probability - steep curve with high multiplier
- **Example**: 1mm over threshold = ~12 points, 2mm over = ~28 points, 3mm over = ~39 points

## Severity Levels

Each deduction is categorized by severity for UI display:

- **Low**: Minor concern, typically < 10-15 points
- **Medium**: Moderate concern, 15-30 points
- **High**: Major concern, > 30 points

For gusts specifically, severity is determined by absolute speed thresholds (35, 45, 60 km/h).

## Verdict Thresholds

- **YES** (80-100): Safe and comfortable riding conditions
- **MAYBE** (50-79): Rideable but challenging - rider discretion advised
- **NO** (0-49): Not recommended for commuting

## Example Calculations

### Scenario 1: Severe Wind Day
- Wind: 30 km/h (threshold: 25) → 8 points
- **Gusts: 62 km/h** (threshold: 40) → **48 points** (SEVERE)
- Rain probability: 20% (threshold: 30) → 0 points
- Rain intensity: 0.5mm (threshold: 2.0) → 0 points

**Total deductions**: 56 points
**Final score**: 44
**Verdict**: NO (extremely dangerous gusts)

### Scenario 2: Heavy Rain Day
- Wind: 22 km/h (threshold: 25) → 0 points
- Gusts: 38 km/h (threshold: 40) → 0 points
- Rain probability: 80% (threshold: 30) → 17 points
- **Rain intensity: 5.0mm** (threshold: 2.0) → **39 points** (heavy rain)

**Total deductions**: 56 points
**Final score**: 44
**Verdict**: NO (heavy rainfall)

### Scenario 3: Moderate Challenge
- Wind: 28 km/h (threshold: 25) → 6 points
- **Gusts: 38 km/h** (threshold: 35) → **16 points** (MODERATE)
- Rain probability: 40% (threshold: 30) → 6 points
- Rain intensity: 1.5mm (threshold: 1.0) → 9 points

**Total deductions**: 37 points
**Final score**: 63
**Verdict**: MAYBE (challenging but manageable)

## Why This Approach?

1. **Tiered gust penalties** reflect real-world cycling danger - 60 km/h gusts are exponentially more dangerous than 35 km/h
2. **Heavy gust weighting (1.5x)** prioritizes the most dangerous factor for cyclists - sudden wind gusts cause crashes
3. **Rain intensity > probability** - actual heavy rain is worse than just a chance of light rain
4. **Transparent breakdown** - users see exactly which factors are causing deductions with clear severity labels
5. **Structured deductions** - returned as a detailed breakdown object for precise UI feedback
