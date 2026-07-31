const storageKey = "foodJournal";

let weekOffset = 0;

let selectedDate = null;
let selectedHour = null;

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

    const d = new Date(date);

    const day = d.getDay();

    const diff = day === 0 ? -6 : 1 - day;

    d.setDate(d.getDate() + diff);

    d.setHours(0, 0, 0, 0);

    return d;
}

function updateCalories() {

    const eaten =
        Number(
            document.getElementById("weightInput").value
        ) || 0;

    const labelWeight =
        Number(
            document.getElementById("labelWeightInput").value
        ) || 0;

    const labelCalories =
        Number(
            document.getElementById("labelCaloriesInput").value
        ) || 0;

    let calories = 0;

    if (labelWeight > 0) {
        calories =
            (eaten / labelWeight)
            * labelCalories;
    }

    document.getElementById(
        "calculatedCalories"
    ).innerText =
        "Calories: " +
        calories.toFixed(0);
}

document
.getElementById("weightInput")
.addEventListener("input", updateCalories);

document
.getElementById("labelWeightInput")
.addEventListener("input", updateCalories);

document
.getElementById("labelCaloriesInput")
.addEventListener("input", updateCalories);

function deleteMeal(
    event,
    date,
    hour,
    dish,
    calories
) {

    event.stopPropagation();

    if (!confirm("Delete this meal?")) {
        return;
    }

    let data = getData();

    const index = data.findIndex(m =>
        m.date === date &&
        m.hour === hour &&
        m.dish === dish &&
        m.calories === calories
    );

    if (index !== -1) {
        data.splice(index, 1);
    }

    saveData(data);

    renderWeek();
}

function selectCell(date, hour) {

    selectedDate = date;
    selectedHour = hour;

    document.getElementById(
        "selectedLabel"
    ).innerText =
        `${date} @ ${hour}:00`;

    renderWeek();
}

function renderWeek() {

    const today = new Date();

    const weekStart = startOfWeek(today);

    weekStart.setDate(
        weekStart.getDate() +
        weekOffset * 7
    );

    const days = [];

    for (let i = 0; i < 7; i++) {

        const d = new Date(weekStart);

        d.setDate(
            weekStart.getDate() + i
        );

        days.push(d);
    }

    document.getElementById(
        "weekTitle"
    ).innerText =
        days[0].toLocaleDateString()
        + " - " +
        days[6].toLocaleDateString();

    const data = getData();

    let html = '<div class="grid">';

    html += '<div class="cell day-header"></div>';

    days.forEach(day => {

        const isToday =
            day.toDateString() ===
            today.toDateString();

        html += `
        <div class="cell day-header ${isToday ? 'today' : ''}">
            ${day.toLocaleDateString('en-CA', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
            })}
        </div>`;
    });

    for (let hour = 0; hour < 24; hour++) {

        html += `
        <div class="cell time">
            ${hour}:00
        </div>`;

        days.forEach(day => {

            const date =
                day.toISOString().split("T")[0];

            const meals =
                data.filter(m =>
                    m.date === date &&
                    m.hour === hour
                );

            const current =
                day.toDateString() ===
                today.toDateString() &&
                hour === today.getHours();

            const selected =
                selectedDate === date &&
                selectedHour === hour;

            html += `
            <div
                class="cell ${current ? 'current-hour' : ''} ${selected ? 'selected' : ''}"
                onclick="selectCell('${date}', ${hour})"
            >`;

            meals.forEach(meal => {

                html += `
                <div class="meal">
                    <b>${meal.dish}</b><br>
                    ${meal.weight}g<br>
                    ${meal.calories} cal<br>

                    <button
                        class="delete-btn"
                        onclick="deleteMeal(event,'${meal.date}',${meal.hour},'${meal.dish}',${meal.calories})">
                        Delete
                    </button>
                </div>`;
            });

            html += `</div>`;
        });
    }

    html += `
    <div class="cell total">
        Total
    </div>`;

    days.forEach(day => {

        const date =
            day.toISOString().split("T")[0];

        const total =
            data
                .filter(m => m.date === date)
                .reduce(
                    (a, b) => a + b.calories,
                    0
                );

        html += `
        <div class="cell total">
            ${total} cal
        </div>`;
    });

    html += '</div>';

    document.getElementById(
        "calendar"
    ).innerHTML = html;
}

document
.getElementById("saveButton")
.addEventListener("click", () => {

    if (
        selectedDate === null ||
        selectedHour === null
    ) {
        alert("Select a time slot first");
        return;
    }

    const dish =
        document.getElementById(
            "dishInput"
        ).value;

    const weight =
        Number(
            document.getElementById(
                "weightInput"
            ).value
        );

    const labelWeight =
        Number(
            document.getElementById(
                "labelWeightInput"
            ).value
        );

    const labelCalories =
        Number(
            document.getElementById(
                "labelCaloriesInput"
            ).value
        );

    const calories =
        Math.round(
            (weight / labelWeight)
            * labelCalories
        );

    const data = getData();

    data.push({
        date: selectedDate,
        hour: selectedHour,
        dish,
        weight,
        labelWeight,
        labelCalories,
        calories
    });

    saveData(data);

    document.getElementById("dishInput").value = "";
    document.getElementById("weightInput").value = "";
    document.getElementById("labelWeightInput").value = "";
    document.getElementById("labelCaloriesInput").value = "";

    updateCalories();

    renderWeek();
});

document
.getElementById("prevWeek")
.onclick = () => {

    weekOffset--;

    renderWeek();
};

document
.getElementById("nextWeek")
.onclick = () => {

    weekOffset++;

    renderWeek();
};

const now = new Date();

selectedDate =
    now.toISOString().split("T")[0];

selectedHour =
    now.getHours();

document.getElementById(
    "selectedLabel"
).innerText =
    `${selectedDate} @ ${selectedHour}:00`;

renderWeek();
