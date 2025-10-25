const btnSalvar = document.getElementById("btnSalvar");
const formWeek = document.getElementById('form-week');

async function adicionarTarefa() {
  const diaSemana = document.getElementById("diaSemana").value;
  const descricao = document.getElementById("descricao").value;
  const start_time = document.getElementById("tempoI").value;
  const end_time = document.getElementById("tempoF").value;
 
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
      diaSemana: diaSemana,
      descricao: descricao,
      start_time: start_time,
      end_time: end_time,
    }),
    
  });
  if (response.ok) {
    alert("Compromisso adicionada com sucesso");
    document.getElementById("diaSemana").value = "";
    document.getElementById("descricao").value = "";
    document.getElementById("tempI").value = "";
    document.getElementById("tempF").value = "";

    buscarDadosHoje();
  } else {
    alert("Erro ao salvar o seu compromisso");
  }
}

formWeek.addEventListener("submit", (e) => {
  e.preventDefault();
  adicionarTarefa();
});


// const formWeek = document.getElementById('formWeek');

// formWeek.addEventListener("submit", (e) => {
//   e.preventDefault();
//   adicionarTarefa();
// });

// TABELA SEMANAL

// // Data de referência: usa o dia atual
// const dataReferencia = new Date();

// // Array com os nomes dos dias da semana
// const nomesDias = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];

// // Calcula o domingo da semana da data de referência
// const domingo = new Date(dataReferencia);
// domingo.setDate(dataReferencia.getDate() - dataReferencia.getDay());

// // Cria o array com a semana completa
// const semana = [];
// for (let i = 0; i < 7; i++) {
//     const dia = new Date(domingo);
//     dia.setDate(domingo.getDate() + i);
//     semana.push({
//         data: dia.toLocaleDateString('pt-BR'),
//         nomeDia: nomesDias[dia.getDay()]
//     });
// }

// console.log(semana);

// // Converte 'dd/mm/aaaa' para 'aaaa-mm-dd'
// function formateDate(datePtBR) {
//     const [dd, mm, yyyy] = datePtBR.split('/');
//     return `${yyyy}-${mm}-${dd}`;
// }

// // Busca tarefas na API para uma data ISO 'aaaa-mm-dd'
// async function buscarTarefasDate(dateISO) {
//     try {
//         const response = await fetch(`http://localhost:3002/tarefas/${dateISO}`);
//         if (!response.ok) throw new Error(HTTP `${response.status}`);
//         const data = await response.json();
//         return Array.isArray(data) ? data : [];
//     } catch (error) {
//         console.error('Erro ao buscar tarefas:', error);
//         return [];
//     }
// }

// // Formata 'HH:MM:SS' para 'HH:MM'
// function formatHora(hora) {
//     if (!hora) return '';
//     const [h, m] = hora.split(':');
//     return `${h}:${m}`;
// }

// // Converte hora em minutos para ordenação
// function horaParaMinutos(hora) {
//     if (!hora) return Number.POSITIVE_INFINITY;
//     const [h, m] = hora.split(':').map(Number);
//     return h * 60 + m;
// }

// // Carrega todas as tarefas da semana e renderiza colunas por dia
// async function carregarSemana() {
//     const semanaComTarefas = await Promise.all(
//         semana.map(async (dia) => {
//             const dateISO = formateDate(dia.data);
//             const tarefas = await buscarTarefasDate(dateISO);
//             // Ordena por início e, em seguida, por término
//             const tarefasOrdenadas = [...tarefas].sort((a, b) => {
//                 const diffInicio = horaParaMinutos(a.start_time) - horaParaMinutos(b.start_time);
//                 if (diffInicio !== 0) return diffInicio;
//                 return horaParaMinutos(a.end_time) - horaParaMinutos(b.end_time);
//             });
//             return { ...dia, tarefas: tarefasOrdenadas };
//         })
//     );
//     renderTabelaSemana(semanaComTarefas);
// }

// // Renderiza uma linha com 7 colunas (Domingo a Sábado),
// // cada célula lista descrição e horários das tarefas do dia
// function renderTabelaSemana(semanaComTarefas) {
//     const tbody = document.getElementById('tableBodySemana');
//     if (!tbody) return;
//     tbody.innerHTML = '';

//     const row = document.createElement('tr');

//     semanaComTarefas.forEach((dia) => {
//         const td = document.createElement('td');

//         if (dia.tarefas && dia.tarefas.length > 0) {
//             const list = document.createElement('ul');
//             dia.tarefas.forEach((tarefa) => {
//                 const li = document.createElement('li');
//                 const inicio = formatHora(tarefa.start_time);
//                 const fim = formatHora(tarefa.end_time);
//                 const horarios = inicio && fim ? ` (${inicio}–${fim})` : '';
//                 li.textContent = `${tarefa.descricao} ${horarios}`;
//                 list.appendChild(li);
//             });
//             td.appendChild(list);
//         } else {
//             td.textContent = '—';
//         }

//         row.appendChild(td);
//     });

//     tbody.appendChild(row);
// }

// // Inicializa renderização da semana
// carregarSemana();

// function renderTabelaSemana(semanaComTarefas) {
//   const tbody = document.getElementById('tableBodySemana');
//   if (!tbody) return;
//   tbody.innerHTML = '';

//   // Header com nomes dos dias (usa nomeDia e, opcionalmente, dataISO)
//   const headerRow = document.createElement('tr');
//   semanaComTarefas.forEach(dia => {
//     const th = document.createElement('th');
//     th.textContent = dia.nomeDia + (dia.dataISO ? ` (${dia.dataISO})` : (dia.data ? ` (${dia.data})` : ''));
//     headerRow.appendChild(th);
//   });
//   tbody.appendChild(headerRow);

//   // calcula a maior quantidade de tarefas entre os dias
//   const maxLen = Math.max(...semanaComTarefas.map(d => (d.tarefas ? d.tarefas.length : 0)), 0);

//   // Se não houver tarefas, adiciona uma linha com '—' em cada coluna
//   if (maxLen === 0) {
//     const emptyRow = document.createElement('tr');
//     semanaComTarefas.forEach(() => {
//       const td = document.createElement('td');
//       td.textContent = '—';
//       emptyRow.appendChild(td);
//     });
//     tbody.appendChild(emptyRow);
//     return;
//   }

//   // cria linhas onde cada coluna corresponde ao dia e cada linha ao índice da tarefa
//   for (let i = 0; i < maxLen; i++) {
//     const tr = document.createElement('tr');

//     semanaComTarefas.forEach(dia => {
//       const td = document.createElement('td');
//       const tarefa = dia.tarefas && dia.tarefas[i];

//       if (tarefa) {
//         const inicio = formatHora(tarefa.start_time);
//         const fim = formatHora(tarefa.end_time);
//         const horarios = inicio && fim ? ` (${inicio}–${fim})` : inicio || fim || '';

//         td.innerHTML = `
//   <div class="tarefa-list">
//     <div class="tarefa-desc">${tarefa.descricao}</div>
//     <div class="tarefa-horario">${horarios}</div>
//     <div class="tarefa-actions">
//       <button class="btns" title="Editar" aria-label="Editar"><i class='bx bx-edit'></i></button>
//       <button class="btns" title="Excluir" aria-label="Excluir"><i class='bx bx-trash'></i></button>
//     </div>
//   </div>
// `;
//       } else {
//         td.textContent = '—';
//       }

//       tr.appendChild(td);
//     });

//     tbody.appendChild(tr);
//   }
// }

// ...existing code...