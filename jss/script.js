let transactions = JSON.parse(localStorage.getItem("data")) || [];
const LIMIT = 50;

const list = document.getElementById("list");
const balanceEl = document.getElementById("balance");
const ctx = document.getElementById("chart");

let chart;

// ADD TRANSACTION
function addTransaction() {
  const name = document.getElementById("name").value;
  const amount = document.getElementById("amount").value;
  const category = document.getElementById("category").value;

  if (!name || !amount) {
    alert("Isi semua field!");
    return;
  }

  transactions.push({
    name,
    amount: +amount,
    category
  });

  save();
  updateUI();
}

// DELETE
function deleteTransaction(index) {
  transactions.splice(index, 1);
  save();
  updateUI();
}

// UPDATE UI
function updateUI() {
  list.innerHTML = "";

  let total = 0;
  let food = 0, transport = 0, fun = 0;

  transactions.forEach((t, i) => {
    total += t.amount;

    if (t.category === "Food") food += t.amount;
    if (t.category === "Transport") transport += t.amount;
    if (t.category === "Fun") fun += t.amount;

    const div = document.createElement("div");
    div.classList.add("item");

    if (t.amount > LIMIT) div.classList.add("high");

    div.innerHTML = `
      <div class="left">
        <p class="name">${t.name}</p>
        <p class="amount">$${t.amount}</p>
        <span class="category">${t.category}</span>
      </div>

      <button class="delete" onclick="deleteTransaction(${i})">Delete</button>
    `;

    list.appendChild(div);
  });

  balanceEl.innerText = "$" + total.toFixed(2);

  updateChart(food, transport, fun);
}

// CHART
function updateChart(food, transport, fun) {
  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Food", "Transport", "Fun"],
      datasets: [{
        data: [food, transport, fun]
      }]
    }
  });
}

// SORT
document.getElementById("sort").addEventListener("change", function() {
  if (this.value === "amount") {
    transactions.sort((a, b) => b.amount - a.amount);
  } else if (this.value === "category") {
    transactions.sort((a, b) => a.category.localeCompare(b.category));
  }
  updateUI();
});

// DARK MODE
document.getElementById("toggleMode").onclick = () => {
  document.body.classList.toggle("dark");
};

// SAVE
function save() {
  localStorage.setItem("data", JSON.stringify(transactions));
}

// INIT
updateUI();