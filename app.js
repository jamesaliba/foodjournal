const storageKey = "foodJournal";

let weekOffset = 0;
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

    let factor =
        weight / labelWeight;

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

    let html =
        '<div class="grid day">';

    html +=
        '<div class="cell day-header">Time</div>';

    html +=
        `<div class="cell day-header">${selectedDate}</div>`;

    for (let hour = 0; hour < 24; hour++) {

        html +=
            `<div class="cell time">${hour}:00</div>`;

        let meals =
            data.filter(m =>
                m.date === selectedDate &&
                m.hour === hour
            );

        let selected =
            selectedHour === hour;

        html +=
            `<div class="cell ${selected ? 'selected' : ''}"
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
                        onclick="deleteMeal(event,'${meal.date}',${meal.hour},'${meal.dish}',${meal.calories})">
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
                            onclick="deleteMeal(event,'${meal.date}',${meal.hour},'${meal.dish}',${meal.calories})">
                            Delete
                        </button>
                    </div>`;
            });

            html += "</div>";
        });
    }

    html += `<div class="cell total">Calories</div>`;

    days.forEach(day => {

        let date =
            day.toISOString().split("T")[0];

        let total =
            data
                .filter(m => m.date === date)
                .reduce(
                    (a, b) => a + b.calories,
                    0
                );

        html +=
            `<div class="cell total">${total} cal</div>`;
    });

    html += `<div class="cell total">Weight</div>`;

    days.forEach(day => {

        let date =
            day.toISOString().split("T")[0];

        let totalWeight =
            data
                .filter(m => m.date === date)
                .reduce(
                    (a, b) => a + b.weight,
                    0
                );

        html +=
            `<div class="cell total">${totalWeight} g</div>`;
    });

    html += `<div class="cell total">Protein</div>`;

    days.forEach(day => {

        let date =
            day.toISOString().split("T")[0];

        let total =
            data
                .filter(m => m.date === date)
                .reduce(
                    (sum, m) => sum + (m.protein || 0),
                    0
                );

        html +=
            `<div class="cell total">${total} g</div>`;
    });

    html += `<div class="cell total">Carbs</div>`;

    days.forEach(day => {

        let date =
            day.toISOString().split("T")[0];

        let total =
            data
                .filter(m => m.date === date)
                .reduce(
                    (sum, m) => sum + (m.carbs || 0),
                    0
                );

        html +=
            `<div class="cell total">${total} g</div>`;
    });

    html += `<div class="cell total">Fat</div>`;

    days.forEach(day => {

        let date =
            day.toISOString().split("T")[0];

        let total =
            data
                .filter(m => m.date === date)
                .reduce(
                    (sum, m) => sum + (m.fat || 0),
                    0
                );

        html +=
            `<div class="cell total">${total} g</div>`;
    });

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

    let labelCalories =
        Number(labelCaloriesInput.value);

    let labelProtein =
        Number(labelProteinInput.value);

    let labelCarbs =
        Number(labelCarbsInput.value);

    let labelFat =
        Number(labelFatInput.value);

    let factor =
        weight / labelWeight;

    let data = getData();

    data.push({

        date: selectedDate,
        hour: selectedHour,

        dish: dishInput.value,

        weight: weight,

        labelWeight: labelWeight,

        labelCalories: labelCalories,

        protein: Math.round(
            factor * labelProtein
        ),

        carbs: Math.round(
            factor * labelCarbs
        ),

        fat: Math.round(
            factor * labelFat
        ),

        calories: Math.round(
            factor * labelCalories
        )
    });

    saveData(data);

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

    weekOffset--;
    render();
};

nextWeek.onclick = () => {

    weekOffset++;
    render();
};

exportBtn.onclick = () => {

    const blob =
        new Blob(
            [
                JSON.stringify(
                    getData(),
                    null,
                    2
                )
            ],
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

const now =
    new Date();

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
