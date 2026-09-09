// Carrega o estoque existente da memória
let estoquePastilhas = JSON.parse(localStorage.getItem('DDA_Estoque')) || [];

function atualizarTabela() {
    const corpoTabela = document.querySelector('#corpo-tabela');
    
    if (!corpoTabela) return;

    corpoTabela.innerHTML = '';

    if (estoquePastilhas.length === 0) {
        corpoTabela.innerHTML = `<tr><td colspan="9" style="text-align:center; padding: 15px;">Nenhuma pastilha cadastrada no estoque.</td></tr>`;
        return;
    }

    estoquePastilhas.forEach(function (pastilha, index) {
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
                <button onclick="deletarItem(${index})" style="background-color: #d9534f; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 3px;">
                    Excluir
                </button>
            </td>
        `;

        corpoTabela.appendChild(linha);
    });
}

// Funçao para deletar o item selecionado
function deletarItem(index) {
    
    if (confirm("Tem certeza que deseja apagar este item do estoque?")) {
        // Remove 1 item a partir da posição (index) clicada
        estoquePastilhas.splice(index, 1);
        
        // Atualiza o banco de dados (localStorage) 
        localStorage.setItem('DDA_Estoque', JSON.stringify(estoquePastilhas));
        
        // Mostrar tabela atualizada na tela
        atualizarTabela();
    }
}

// Execução rápida 
atualizarTabela();
