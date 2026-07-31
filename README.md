# Food Journal

A lightweight nutrition tracking Progressive Web App (PWA) for logging meals, tracking calories and macros, and comparing daily intake against personalized nutrition targets.

## Features

### Meal Tracking
- Log meals by day and hour
- Record:
  - Meal name
  - Weight consumed
  - Calories
  - Protein
  - Carbohydrates
  - Fat
- Automatic scaling from nutrition label values

### Daily Dashboard
- Daily calorie summary
- Daily protein summary
- Daily carbohydrate summary
- Daily fat summary
- Color-coded progress indicators:
  - 🟢 On target
  - 🟡 Below target
  - 🔴 Above target

### Weekly View
- Hourly calendar layout
- Full week meal history
- Daily nutrition totals
- Target comparison for each day

### Nutrition Targets
Set personalized daily goals:
- Calories
- Protein (% of calories)
- Carbohydrates (% of calories)
- Fat (% of calories)

Macro percentages are automatically converted into gram targets.

### Data Management
- Export all journal data to JSON
- Import previous backups
- Local storage persistence
- No account required

### Mobile Friendly
- Day view optimized for phones
- Week view optimized for tablets and desktop
- Swipe-free date navigation using arrows

### Progressive Web App
- Installable on mobile devices
- Offline-capable architecture
- Works like a native app when installed

---

## Default Targets

The application starts with:

| Target | Value |
|----------|----------|
| Calories | 2000 kcal |
| Protein | 34% |
| Carbs | 38% |
| Fat | 28% |

Equivalent macro targets:

- Protein: ~170g
- Carbs: ~190g
- Fat: ~62g

---

## How Logging Works

Enter:

- Weight eaten
- Nutrition label serving weight
- Calories per serving
- Protein per serving
- Carbs per serving
- Fat per serving

The app automatically calculates nutrition values for the consumed portion.

Example:

Nutrition label:

- 100g serving
- 250 calories
- 10g protein
- 20g carbs
- 5g fat

Consumed:

- 150g

Calculated result:

- 375 calories
- 15g protein
- 30g carbs
- 7.5g fat

---

## Data Storage

All information is stored locally in your browser using Local Storage.

No information is transmitted to:

- Servers
- Third-party services
- Analytics providers

Your data remains entirely on your device unless exported manually.

---

## Backup

To create a backup:

1. Press **Export**
2. Save the generated JSON file

To restore:

1. Press **Import**
2. Select a previously exported backup file

---

## Technologies

- HTML5
- CSS3
- JavaScript (Vanilla)
- Local Storage
- Progressive Web App (PWA)

---

## Future Ideas

Potential future improvements:

- Barcode scanning
- Searchable food database
- Weight tracking
- Body composition tracking
- Daily averages
- Weekly trend charts
- Calorie deficit/surplus calculations
- Macro presets (Cutting / Maintenance / Bulking)

---

## License

Personal use project.

Feel free to modify and extend for your own needs.
