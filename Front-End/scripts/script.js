//Datas

const diaAtual = document.getElementById("diaAtual");

const diaDaSemana = document.getElementById("dds");
let dia = new Date().getDate();
const mes = new Date().getMonth() + 1;
const ano = new Date().getFullYear();
const diaSemana = new Intl.DateTimeFormat("PT-BR", { weekday: "long" }).format(
  new Date()
);
let date = `${ano}-${mes}-${dia}`;

if (diaAtual) {
  diaAtual.textContent += `${dia}/${mes}/${ano}`;
}

if (diaDaSemana) {
  diaDaSemana.textContent += diaSemana;
}

console.log(date);

// Adcionar a Tarefas a tabela

const ul = document.getElementById("ul");

// BUSCAR DADOS DA API

async function buscarDadosHoje(data) {
  try {
    response = await fetch(`http://localhost:3002/tarefasHoje/${data}`);
    dados = await response.json();
    ul.innerHTML = "";
    dados.forEach((item) => {
      ul.innerHTML += `<li>
     <div class="tarefa-desc">${item.descricao}</div>
          <div class="tarefa-horario">${item.start_time}-${item.end_time}</div>
          <div class="tarefa-actions">
            <button class="btns" title="Editar" aria-label="Editar"><i class='bx bx-edit'></i></button>
            <button class="btns" title="Excluir" aria-label="Excluir"><i class='bx bx-trash'></i></button>
          </div>
    </li>
    <hr>
    `;
    });
  } catch (error) {}
}

buscarDadosHoje(date);

//MOSTRAR TABELA SEMANAL

let statusWeek = false;
function openWeek() {
  const sectionWeek = document.getElementById("sectionWeek");
  if (statusWeek == false) {
    sectionWeek.classList.remove("hideen");
    statusWeek = true;
  } else {
    sectionWeek.classList.add("hideen");
    statusWeek = false;
  }
}

function week() {}

// ADICIONAR TAREFAS NO BANCO DE DADOS

async function adicionarTarefa() {
  const descricao = document.getElementById("descricao").value;
  const start_time = document.getElementById("tempI").value;
  const end_time = document.getElementById("tempF").value;
  console.log(date, descricao, start_time, end_time);

  if (!descricao && !start_time && !end_time) {
    alert("Digite seu compromisso e o horario");
    return;
  }
  console.log(diaSemana, descricao, start_time, end_time);
  const response = await fetch("http://localhost:3002/adicionar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      descricao: descricao,
      start_time: start_time,
      end_time: end_time,
    }),
  });
  if (response.ok) {
    alert("Compromisso adicionada com sucesso");

    document.getElementById("descricao").value = "";
    document.getElementById("tempI").value = "";
    document.getElementById("tempF").value = "";

    buscarDadosHoje();
  } else {
    alert("Erro ao salvar o seu compromisso");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const formWeek = document.getElementById("formWeek");
  if (formWeek) {
    formWeek.addEventListener("submit", (e) => {
      e.preventDefault();
      adicionarTarefa();
    });
  }
});

// Data de referência: usa o dia atual
const dataReferencia = new Date();

// Array com os nomes dos dias da semana
const nomesDias = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];

// Calcula o domingo da semana da data de referência
const domingo = new Date(dataReferencia);
domingo.setDate(dataReferencia.getDate() - dataReferencia.getDay());

// Cria o array com a semana completa
const semana = [];

for (let i = 0; i < 7; i++) {
  const dia = new Date(domingo);
  dia.setDate(domingo.getDate() + i);
  semana.push({
    data: dia.toLocaleDateString("pt-BR"),
    nomeDia: nomesDias[dia.getDay()],
    dataISO: dia.toISOString().split("T")[0]
  });
}
console.log(semana)
const select_diaSemana = document.getElementById("diaSemana");
console.log(select_diaSemana);
select_diaSemana.innerHTML = semana.map((item) => { 
  return ` <option value="1">Domingo</option>`
})

// Busca tarefas de uma data específica
async function buscarTarefasDate(dateISO) {
  try {
    const response = await fetch(`http://localhost:3002/tarefas/${dateISO}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(`Erro ao buscar tarefas para ${dateISO}:`, error);
    return [];
  }
}

// Converte hora em minutos para ordenação
function horaParaMinutos(hora) {
  if (!hora) return Number.POSITIVE_INFINITY;
  const [h, m] = hora.split(":").map(Number);
  return h * 60 + m;
}

// Formata hora para exibição
function formatHora(hora) {
  if (!hora) return "";
  const [h, m] = hora.split(":");
  return `${h}:${m}`;
}

// Carrega tarefas da semana e renderiza a tabela
async function carregarSemana() {
  const semanaComTarefas = await Promise.all(
    semana.map(async (dia) => {
      const tarefas = await buscarTarefasDate(dia.dataISO);
      const tarefasOrdenadas = [...tarefas].sort((a, b) => {
        const diffInicio =
          horaParaMinutos(a.start_time) - horaParaMinutos(b.start_time);
        if (diffInicio !== 0) return diffInicio;
        return horaParaMinutos(a.end_time) - horaParaMinutos(b.end_time);
      });
      return { ...dia, tarefas: tarefasOrdenadas };
    })
  );
  renderTabelaSemana(semanaComTarefas);
}

function renderTabelaSemana(semanaComTarefas) {
  const tbody = document.getElementById("tableBodySemana");
  if (!tbody) return;
  const table = tbody.closest("table");
  if (!table) return;

  // remove thead existente (se houver) e cria novo thead com os nomes dos dias
  const oldThead = table.querySelector("thead");
  if (oldThead) oldThead.remove();

  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  semanaComTarefas.forEach((dia) => {
    const th = document.createElement("th");
    th.textContent =
      dia.nomeDia +
      (dia.dataISO ? ` (${dia.dataISO})` : dia.data ? ` (${dia.data})` : "");
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.insertBefore(thead, tbody);

  // limpa tbody e monta linhas de tarefas (cada linha representa o índice da tarefa)
  tbody.innerHTML = "";

  const maxLen = Math.max(
    ...semanaComTarefas.map((d) => (d.tarefas ? d.tarefas.length : 0)),
    0
  );

  if (maxLen === 0) {
    const emptyRow = document.createElement("tr");
    semanaComTarefas.forEach(() => {
      const td = document.createElement("td");
      td.textContent = "—";
      emptyRow.appendChild(td);
    });
    tbody.appendChild(emptyRow);
    return;
  }

  for (let i = 0; i < maxLen; i++) {
    const tr = document.createElement("tr");

    semanaComTarefas.forEach((dia) => {
      const td = document.createElement("td");

      // wrapper interno (pode ser usado se quiser scroll interno também)
      const wrapper = document.createElement("div");
      wrapper.className = "tarefa-cell-wrapper";

      const tarefa = dia.tarefas && dia.tarefas[i];
      if (tarefa) {
        const inicio = formatHora(tarefa.start_time);
        const fim = formatHora(tarefa.end_time);
        const horarios =
          inicio && fim ? ` (${inicio}–${fim})` : inicio || fim || "";

        const desc = document.createElement("div");
        desc.className = "tarefa-desc";
        desc.textContent = tarefa.descricao;
        wrapper.appendChild(desc);

        if (horarios) {
          const hrElem = document.createElement("div");
          hrElem.className = "tarefa-horario";
          hrElem.textContent = horarios;
          wrapper.appendChild(hrElem);
        }

        const actions = document.createElement("div");
        actions.className = "tarefa-actions";
        actions.innerHTML = `
          <button class="btns" title="Editar" aria-label="Editar"><i class='bx bx-edit'></i></button>
          <button class="btns" title="Excluir" aria-label="Excluir"><i class='bx bx-trash'></i></button>
        `;
        wrapper.appendChild(actions);
      } else {
        wrapper.textContent = "—";
        wrapper.style.textAlign = "center";
      }

      td.appendChild(wrapper);
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  }
}

// Inicia a renderização ao carregar a página
document.addEventListener("DOMContentLoaded", carregarSemana);
