let estoquePastilhas = JSON.parse(localStorage.getItem('DDA_Estoque')) || [];

// Seleciona o formulário pelo ID do HTML
const formCadastro = document.querySelector('#form-cadastro');

// Capturar dados do registro 
if (formCadastro) {
    formCadastro.addEventListener('submit', function (event) {
        event.preventDefault();

        // Valores dos campos obtidos via 'value'
        const codigoIso = document.querySelector('#codigo-iso').value;
        const fabricante = document.querySelector('#fabricante').value;
        const classe = document.querySelector('#classe').value;
        const aplicacaoIso = document.querySelector('#aplicacao-iso').value;
        const quantidade = parseInt(document.querySelector('#arestas').value);
        const estoqueAtual = parseInt(document.querySelector('#estoque-atual').value);
        const estoqueMinimo = parseInt(document.querySelector('#estoque-minimo').value);
        const localizacao = document.querySelector('#localizacao').value;

        //Organiza as informações capturadas na estrutura
        const novaPastilha = {
            id: "p_" + Date.now(), // Gera um ID único em memória
            codigoIso: codigoIso,
            fabricante: fabricante,
            classe: classe,
            aplicacaoIso: aplicacaoIso,
            quantidadeArestas: quantidade,
            quantidade: estoqueAtual, // Quantidade inicial em estoque
            minimo: estoqueMinimo,    // Para o alerta de estoque mínimo
            localizacao: localizacao
        };

        estoquePastilhas.push(novaPastilha);

        // Salva o array (localStorage)
        localStorage.setItem('DDA_Estoque', JSON.stringify(estoquePastilhas));

        alert(`Pastilha ${codigoIso} cadastrada e salva com sucesso!`);
        formCadastro.reset();
    });
}
