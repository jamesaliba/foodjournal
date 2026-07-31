const storageKey = "foodJournal";
const settingsKey = "foodJournalSettings";

let weekOffset = 0;
let dayOffset = 0;

let selectedDate = null;
let selectedHour = null;

let viewMode =
    window.innerWidth < 768
        ? "day"
        : "week";

function getData() {
    return JSON.parse(
        localStorage.getItem(storageKey)
    ) || [];
}

function saveData(data) {
    localStorage.setItem(
        storageKey,
        JSON.stringify(data)
    );
}

function getSettings() {

    return JSON.parse(
        localStorage.getItem(settingsKey)
    ) || {
        calories: 2000,
        proteinPercent: 34,
        carbsPercent: 38,
        fatPercent: 28
    };
}

function saveSettings(settings) {

    localStorage.setItem(
        settingsKey,
        JSON.stringify(settings)
    );
}

function getSummaryClass(actual, target) {

    if (target <= 0) {
        return "";
    }

    let ratio = actual / target;

    if (ratio >= 0.9 && ratio <= 1.1) {
        return "target-good";
    }

    if (ratio > 1.1) {
        return "target-high";
    }

    return "target-low";
}

function startOfWeek(date) {

    let d = new Date(date);

    let day = d.getDay();

    let diff =
        day === 0
            ? -6
            : 1 - day;

    d.setDate(
        d.getDate() + diff
    );

    d.setHours(0, 0, 0, 0);

    return d;
}

function updateCalories() {

    let weight =
        Number(weightInput.value) || 0;

    let labelWeight =
        Number(labelWeightInput.value) || 0;

    let labelCalories =
        Number(labelCaloriesInput.value) || 0;

    let labelProtein =
        Number(labelProteinInput.value) || 0;

    let labelCarbs =
        Number(labelCarbsInput.value) || 0;

    let labelFat =
        Number(labelFatInput.value) || 0;

    if (labelWeight <= 0) {

        calculatedCalories.innerText =
            "Calories: 0";

        calculatedMacros.innerText =
            "Protein: 0g | Carbs: 0g | Fat: 0g";

        return;
    }

    let factor = weight / labelWeight;

    let calories =
        factor * labelCalories;

    let protein =
        factor * labelProtein;

    let carbs =
        factor * labelCarbs;

    let fat =
        factor * labelFat;

    calculatedCalories.innerText =
        `Calories: ${Math.round(calories)}`;

    calculatedMacros.innerText =
        `Protein: ${protein.toFixed(1)}g | Carbs: ${carbs.toFixed(1)}g | Fat: ${fat.toFixed(1)}g`;
}

weightInput.addEventListener(
    "input",
    updateCalories
);

labelWeightInput.addEventListener(
    "input",
    updateCalories
);

labelCaloriesInput.addEventListener(
    "input",
    updateCalories
);

labelProteinInput.addEventListener(
    "input",
    updateCalories
);

labelCarbsInput.addEventListener(
    "input",
    updateCalories
);

labelFatInput.addEventListener(
    "input",
    updateCalories
);

function deleteMeal(
    event,
    date,
    hour,
    dish,
    calories
) {

    event.stopPropagation();

    if (!confirm("Delete meal?")) {
        return;
    }

    let data = getData();

    let index =
        data.findIndex(m =>
            m.date === date &&
            m.hour === hour &&
            m.dish === dish &&
            m.calories === calories
        );

    if (index !== -1) {
        data.splice(index, 1);
    }

    saveData(data);

    render();
}

function selectCell(date, hour) {

    selectedDate = date;
    selectedHour = hour;

    selectedLabel.innerText =
        `${date} @ ${hour}:00`;

    render();
}

function renderDay() {

    let data = getData();

    let dayDate = new Date();

    dayDate.setDate(
        dayDate.getDate() + dayOffset
    );

    selectedDate =
        dayDate
            .toISOString()
            .split("T")[0];

    weekTitle.innerText =
        dayDate.toLocaleDateString();

    let settings =
        getSettings();

    let targetProtein =
        Math.round(
            settings.calories *
            settings.proteinPercent /
            100 / 4
        );

    let targetCarbs =
        Math.round(
            settings.calories *
            settings.carbsPercent /
            100 / 4
        );

    let targetFat =
        Math.round(
            settings.calories *
            settings.fatPercent /
            100 / 9
        );

    let dayMeals =
        data.filter(
            m => m.date === selectedDate
        );

    let totalCalories =
        dayMeals.reduce(
            (s,m)=>s+(m.calories||0),
            0
        );

    let totalProtein =
        dayMeals.reduce(
            (s,m)=>s+(m.protein||0),
            0
        );

    let totalCarbs =
        dayMeals.reduce(
            (s,m)=>s+(m.carbs||0),
            0
        );

    let totalFat =
        dayMeals.reduce(
            (s,m)=>s+(m.fat||0),
            0
        );

    let html = `
    <div class="day-summary">

        <div class="${getSummaryClass(totalCalories, settings.calories)}">
            Calories<br>
            ${totalCalories}/${settings.calories}
        </div>

        <div class="${getSummaryClass(totalProtein, targetProtein)}">
            Protein<br>
            ${totalProtein}/${targetProtein}g
        </div>

        <div class="${getSummaryClass(totalCarbs, targetCarbs)}">
            Carbs<br>
            ${totalCarbs}/${targetCarbs}g
        </div>

        <div class="${getSummaryClass(totalFat, targetFat)}">
            Fat<br>
            ${totalFat}/${targetFat}g
        </div>

    </div>

    <div class="grid day">
    `;

    html +=
        '<div class="cell day-header">Time</div>';

    html +=
        `<div class="cell day-header">${selectedDate}</div>`;

    for(let hour = 0; hour < 24; hour++){

        html +=
            `<div class="cell time">${hour}:00</div>`;

        let meals =
            data.filter(m =>
                m.date === selectedDate &&
                m.hour === hour
            );

        html +=
            `<div class="cell ${selectedHour === hour ? "selected" : ""}"
            onclick="selectCell('${selectedDate}',${hour})">`;

        meals.forEach(meal => {

            html += `
            <div class="meal">
                <b>${meal.dish}</b><br>
                ${meal.weight}g<br>
                ${meal.calories} cal<br>
                P:${meal.protein || 0}g
                C:${meal.carbs || 0}g
                F:${meal.fat || 0}g<br>

                <button
                    class="delete-btn"
                    onclick="deleteMeal(
                        event,
                        '${meal.date}',
                        ${meal.hour},
                        '${meal.dish}',
                        ${meal.calories}
                    )">
                    Delete
                </button>
            </div>`;
        });

        html += "</div>";
    }

    html += "</div>";

    calendar.innerHTML = html;
}

function renderWeek() {

    let data = getData();

    let settings =
        getSettings();

    let targetProtein =
        Math.round(
            settings.calories *
            settings.proteinPercent /
            100 / 4
        );

    let targetCarbs =
        Math.round(
            settings.calories *
            settings.carbsPercent /
            100 / 4
        );

    let targetFat =
        Math.round(
            settings.calories *
            settings.fatPercent /
            100 / 9
        );

    let today = new Date();

    let weekStart =
        startOfWeek(today);

    weekStart.setDate(
        weekStart.getDate() +
        weekOffset * 7
    );

    let days = [];

    for (let i = 0; i < 7; i++) {

        let d =
            new Date(weekStart);

        d.setDate(
            weekStart.getDate() + i
        );

        days.push(d);
    }

    weekTitle.innerText =
        `${days[0].toLocaleDateString()} - ${days[6].toLocaleDateString()}`;

    let html =
        '<div class="grid">';

    html +=
        '<div class="cell day-header"></div>';

    days.forEach(day => {

        html += `
        <div class="cell day-header">
            ${day.toLocaleDateString()}
        </div>`;
    });

    for (let hour = 0; hour < 24; hour++) {

        html +=
            `<div class="cell time">${hour}:00</div>`;

        days.forEach(day => {

            let date =
                day.toISOString()
                    .split("T")[0];

            let meals =
                data.filter(m =>
                    m.date === date &&
                    m.hour === hour
                );

            html +=
                `<div class="cell"
                onclick="selectCell('${date}',${hour})">`;

           meals.forEach(meal => {

    html += `
    <div class="meal">
        <b>${meal.dish}</b><br>
        ${meal.weight}g<br>
        ${meal.calories} cal<br>
        P:${meal.protein || 0}g
        C:${meal.carbs || 0}g
        F:${meal.fat || 0}g<br>

        <button
            class="delete-btn"
            onclick="deleteMeal(
                event,
                '${meal.date}',
                ${meal.hour},
                '${meal.dish}',
                ${meal.calories}
            )">
            Delete
        </button>
    </div>`;
});

            html += "</div>";
        });
    }

    function addSummaryRow(
    label,
    getValue,
    target,
    suffix = ""
) {

    html +=
        `<div class="cell total">${label}</div>`;

    days.forEach(day => {

        let date =
            day.toISOString().split("T")[0];

        let total =
            data
                .filter(m => m.date === date)
                .reduce(
                    (sum, m) =>
                        sum + getValue(m),
                    0
                );

        html += `
<div class="cell total ${getSummaryClass(
    total,
    target
)}">
    ${total} / ${target}${suffix}
</div>`;
    });
}

    addSummaryRow(
    "Calories",
    m => m.calories || 0,
    settings.calories,
    " cal"
);

addSummaryRow(
    "Protein",
    m => m.protein || 0,
    targetProtein,
    " g"
);

addSummaryRow(
    "Carbs",
    m => m.carbs || 0,
    targetCarbs,
    " g"
);

addSummaryRow(
    "Fat",
    m => m.fat || 0,
    targetFat,
    " g"
);

    html += "</div>";

    calendar.innerHTML = html;
}

function render() {

    if (viewMode === "day") {
        renderDay();
    } else {
        renderWeek();
    }
}

saveButton.onclick = () => {

    if (selectedDate === null) {
        return;
    }

    let weight =
        Number(weightInput.value);

    let labelWeight =
        Number(labelWeightInput.value);

    if (labelWeight <= 0) {
        alert("Label Weight must be greater than 0");
        return;
    }

    let factor =
        weight / labelWeight;

    let data = getData();

    data.push({

        date: selectedDate,
        hour: selectedHour,

        dish: dishInput.value,

        weight: weight,

        calories: Math.round(
            factor *
            Number(labelCaloriesInput.value)
        ),

        protein: Math.round(
            factor *
            Number(labelProteinInput.value)
        ),

        carbs: Math.round(
            factor *
            Number(labelCarbsInput.value)
        ),

        fat: Math.round(
            factor *
            Number(labelFatInput.value)
        )
    });

    saveData(data);

    render();
};

saveTargetsBtn.onclick = () => {

    saveSettings({

        calories:
            Number(targetCalories.value),

        proteinPercent:
            Number(targetProteinPercent.value),

        carbsPercent:
            Number(targetCarbsPercent.value),

        fatPercent:
            Number(targetFatPercent.value)
    });

    render();
};

dayViewBtn.onclick = () => {

    viewMode = "day";
    render();
};

weekViewBtn.onclick = () => {

    viewMode = "week";
    render();
};

prevWeek.onclick = () => {

    if (viewMode === "day") {
        dayOffset--;
    } else {
        weekOffset--;
    }

    render();
};

nextWeek.onclick = () => {

    if (viewMode === "day") {
        dayOffset++;
    } else {
        weekOffset++;
    }

    render();
};

exportBtn.onclick = () => {

    const blob =
        new Blob(
            [JSON.stringify(getData(), null, 2)],
            {
                type: "application/json"
            }
        );

    const a =
        document.createElement("a");

    a.href =
        URL.createObjectURL(blob);

    a.download =
        "foodjournal-backup.json";

    a.click();
};

importFile.onchange = (e) => {

    const file =
        e.target.files[0];

    if (!file) {
        return;
    }

    const reader =
        new FileReader();

    reader.onload = () => {

        localStorage.setItem(
            storageKey,
            reader.result
        );

        render();
    };

    reader.readAsText(file);
};

const settings =
    getSettings();

targetCalories.value =
    settings.calories;

targetProteinPercent.value =
    settings.proteinPercent;

targetCarbsPercent.value =
    settings.carbsPercent;

targetFatPercent.value =
    settings.fatPercent;

const now = new Date();

selectedDate =
    now.toISOString()
        .split("T")[0];

selectedHour =
    now.getHours();

selectedLabel.innerText =
    `${selectedDate} @ ${selectedHour}:00`;

render();

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js");
}
