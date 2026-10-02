const API_URL = "https://6abaf0395b549d818d62ba15.mockapi.io/ddametalurgica/pastilhas";

// Guardar os dados vindos da API em vez do localStorage
let estoquePastilhas = [];


// CARREGAR ESTOQUE (GET Geral)

async function carregarEstoque() {
    try {
        const response = await fetch(API_URL);
        
        
        if (!response.ok) throw new Error("Erro ao buscar dados da API");
        
        estoquePastilhas = await response.json();
        atualizarTabela(); // Atualiza a tela com os dados reais
    } catch (error) {
        console.error("Erro ao carregar estoque:", error);
    }
}

// Atualizar Tabela

function atualizarTabela() {
    const corpoTabela = document.querySelector('#corpo-tabela');
    if (!corpoTabela) return;

    corpoTabela.innerHTML = '';

    if (estoquePastilhas.length === 0) {
        corpoTabela.innerHTML = `<tr><td colspan="9" style="text-align:center; padding: 15px;">Nenhuma pastilha cadastrada no estoque.</td></tr>`;
        return;
    }

    // Agora usamos o id vindo do mockAPI (pastilha.id) para deletar/editar
    estoquePastilhas.forEach(function (pastilha) {
        const linha = document.createElement('tr');

        linha.innerHTML = `
            <td>${pastilha.codigoIso}</td>
            <td>${pastilha.fabricante}</td>
            <td>${pastilha.classe}</td>
            <td>${pastilha.aplicacaoIso}</td>
            <td>${pastilha.quantidadeArestas}</td>
            <td>${pastilha.quantidade}</td>
            <td>${pastilha.minimo}</td>
            <td>${pastilha.localizacao}</td>
            <td>
                <!-- Passamos pastilha.id em vez do index do array -->
                <button onclick="deletarItem('${pastilha.id}')" style="background-color: #d9534f; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 3px;">
                    Excluir
                </button>
            </td>
        `;
        
        corpoTabela.appendChild(linha);
    });
}

// DELETAR ITEM (DELETE)

async function deletarItem(id) {
    if (confirm("Tem certeza que deseja apagar este item do estoque?")) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE"
            });

            if (!response.ok) throw new Error("Erro ao deletar item na API");

            // Recarrega os dados atualizados direto da API
            carregarEstoque();
        } catch (error) {
            console.error("Erro ao deletar:", error);
            alert("Não foi possível excluir o item.");
        }
    }
}

// Inicializa buscando os dados da API 
carregarEstoque();
