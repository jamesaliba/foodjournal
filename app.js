const now = new Date();

document.getElementById("currentHour").innerText =
    "Current Hour: " + now.getHours() + ":00";

function getTodayKey() {
    return new Date().toISOString().split("T")[0];
}

function loadMeals() {

    const data =
        JSON.parse(localStorage.getItem(getTodayKey())) || [];

    let html = "";
    let total = 0;

    data.forEach(meal => {

        total += Number(meal.calories);

        html += `
            <div class="meal">
                <strong>${meal.hour}:00</strong><br>
                Dish: ${meal.dish}<br>
                Amount: ${meal.amount}<br>
                Calories: ${meal.calories}
            </div>
        `;
    });

    document.getElementById("mealList").innerHTML = html;

    document.getElementById("totalCalories").innerText =
        `Total: ${total} Calories`;
}

function saveMeal() {

    const dish =
        document.getElementById("dish").value;

    const amount =
        document.getElementById("amount").value;

    const calories =
        document.getElementById("calories").value;

    if (!dish || !calories) {
        alert("Enter dish and calories");
        return;
    }

    const data =
        JSON.parse(localStorage.getItem(getTodayKey())) || [];

    data.push({
        hour: new Date().getHours(),
        dish,
        amount,
        calories
    });

    localStorage.setItem(
        getTodayKey(),
        JSON.stringify(data)
    );

    document.getElementById("dish").value = "";
    document.getElementById("amount").value = "";
    document.getElementById("calories").value = "";

    loadMeals();
}

loadMeals();
