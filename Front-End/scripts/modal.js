// função de excluir 

function excluirItem(id) {
  fetch(`http://localhost:3002/deletarTarefa/${id}`, {
    method: 'DELETE',
  })
  .then(response => {
    if (response.ok) {
      console.log('Item excluído com sucesso');
      buscarDadosHoje(date); // atualiza a lista
    } else {
      console.error('Erro ao excluir');
    }
  });
}

// função editir

function editarItem(idtarefas, dadosAtualizados) {
  fetch(`http://localhost:3002/editarTarefa/${idtarefas}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dadosAtualizados),
  })
    .then((response) => {
      if (response.ok) {
        alert("Tarefa editada com sucesso");
        buscarDadosHoje(date); // Atualiza a lista
      } else {
        alert("Erro ao editar tarefa");
      }
    })
    .catch((error) => {
      console.error("Erro na requisição:", error);
    });
}


let tarefaEditandoId = null;

ul.addEventListener("click", (e) => {
  const li = e.target.closest("li");
  const id = li?.getAttribute("data-id");

  if (e.target.closest(".editar-btn")) {
    tarefaEditandoId = id;

    // Preenche os campos com os dados da tarefa
    const descricao = li.querySelector(".tarefa-desc")?.textContent.trim();
    const horario = li.querySelector(".tarefa-horario")?.textContent.trim();
    const [start_time, end_time] = horario.split("-").map(h => h.trim());

    document.getElementById("descricao").value = descricao || "";
    document.getElementById("tempI").value = start_time || "";
    document.getElementById("tempF").value = end_time || "";

    // Exibe o modal
    document.getElementById("modalEditar").style.display = "flex";
  }

  if (e.target.closest(".excluir-btn")) {
    excluirItem(id);
  }
});

document.getElementById("formEditar").addEventListener("submit", (e) => {
  e.preventDefault();

  const descricao = document.getElementById("descricao").value;
  const start_time = document.getElementById("tempI").value;
  const end_time = document.getElementById("tempF").value;

  if (!descricao || !start_time || !end_time) {
    alert("Preencha todos os campos");
    return;
  }

  editarItem(tarefaEditandoId, { descricao, start_time, end_time });

  // Fecha o modal
  document.getElementById("modalEditar").style.display = "none";
});


