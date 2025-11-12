const daysContainer = document.getElementById("daysContainer");
const monthYear = document.getElementById("monthYear");
const data = new Date();
const monthNames = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];
const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

monthYear.textContent = `${monthNames[data.getMonth()]} ${data.getFullYear()}`;

// Adiciona os dias da semana
daysOfWeek.forEach((day) => {
  const dayElem = document.createElement("div");
  dayElem.className = "day";
  dayElem.textContent = day;
  daysContainer.appendChild(dayElem);
});

// Primeiro dia do mês
const firstDay = new Date(data.getFullYear(), data.getMonth(), 1).getDay();
const totalDays = new Date(
  data.getFullYear(),
  data.getMonth() + 1,
  0
).getDate();

// Espaços vazios antes do primeiro dia
for (let i = 0; i < firstDay; i++) {
  const empty = document.createElement("div");
  daysContainer.appendChild(empty);
}

// Dias do mês
for (let i = 1; i <= totalDays; i++) {
  const dayElem = document.createElement("div");
  dayElem.className = "day";
  dayElem.textContent = i;
  if (i === data.getDate()) {
    dayElem.classList.add("today");
  }
  daysContainer.appendChild(dayElem);
}
