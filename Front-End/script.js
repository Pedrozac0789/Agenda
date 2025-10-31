

const diaAtual = document.getElementById("diaAtual");
const diaDaSemana = document.getElementById("dds");

let dia = new Date().getDate();
const mes = new Date().getMonth() + 1;
const ano = new Date().getFullYear();
const nomeDiaSemana = new Intl.DateTimeFormat("PT-BR", { weekday: "long" }).format(
    new Date()
);
let date = `${ano}-${mes}-${dia}`;

if (diaAtual) {
    diaAtual.textContent += `${dia}/${mes}/${ano}`;
}

if (diaDaSemana) {
    diaDaSemana.textContent += nomeDiaSemana;
}


// seleciona a lista de tarefas (ul) pelo id
const listaTarefas = document.querySelector("#listaTarefas");

// BUSCAR DADOS DA API HOJE

async function buscarDadosHoje(data) {
    try {
        response = await fetch(`http://localhost:3002/tarefasHoje/${data}`);
        dados = await response.json();
        console.log(dados);
        listaTarefas.innerHTML = "";
        dados.forEach((item) => {
            listaTarefas.innerHTML += `<li data-id="${item.idtarefas}">
      <div class="tarefa-desc">${item.descricao}</div>
      <div class="tarefa-horario">${item.start_time}-${item.end_time}</div>
      <div class="tarefa-actions">
      <button class="btns editar-btn" title="Editar" aria-label="Editar" onclick="editarTarefa(${item.idtarefas})"><i class='bx bx-edit'></i></button>
      <button class="btns excluir-btn" title="Excluir" aria-label="Excluir" onclick="excluirTarefa(${item.idtarefas})"><i class='bx bx-trash'></i></button>
      </div>
      </li>
      <hr>`;
        });
    } catch (error) { }
}

buscarDadosHoje(date);



async function buscarDadosTarefa(id) {
    try {
        response = await fetch(`http://localhost:3002/tarefa/${id}`);
        dados = await response.json();
        console.log(dados);
        return dados;
    } catch (error) {
        console.log(error);
    }
}








async function editarTarefa(id) {
    document.getElementById("modalEditar").style.display = "flex";
    console.log(id)
    const tarefa = await buscarDadosTarefa(id);
    console.log(tarefa);
    const start_time = tarefa[0].start_time
    console.log(start_time);
    const end_time = tarefa[0].end_time
    console.log(end_time);
    document.getElementById("descricao").value = tarefa[0].descricao;
    document.getElementById("tempI").value = start_time;
    document.getElementById("tempF").value = end_time;
    // guarda o id atual para o submit único
    window.currentEditId = id;
}


// function para cancelar a edição
document.getElementById("btnCancelar").addEventListener("click", () => {
    document.getElementById("modalEditar").style.display = "none";
    window.currentEditId = null;
});
// função de excluir 

// listener único de submit do formulário de edição
const formEditarEl = document.getElementById('formEditar');
if (formEditarEl) {
    formEditarEl.addEventListener('submit', async (e) => {
        e.preventDefault();
        const editId = window.currentEditId;
        if (!editId) {
            console.warn('Nenhum ID de edição definido.');
            return;
        }

        const formData = new FormData(e.target);
        const descricao = formData.get("descricao");
        const start_time = String(formData.get("tempI")).slice(0, 5);
        const end_time = String(formData.get("tempF")).slice(0, 5);
        console.log('Editando:', editId, descricao, start_time, end_time);

        try {
            const res = await fetch(`http://localhost:3002/editarTarefas/${editId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    descricao,
                    start_time,
                    end_time,
                }),
            });
            const data = await res.json();
            console.log(data);

            if (res.status === 200) {
                alert("Tarefa editada com sucesso!");
                document.getElementById("modalEditar").style.display = "none";
                window.currentEditId = null;
            } else {
                alert("Erro ao editar tarefa!");
            }
        } catch (error) {
            console.error('Erro ao editar tarefa:', error);
            alert("Erro ao editar tarefa!");
        }
        buscarDadosHoje(date);
    });
}
