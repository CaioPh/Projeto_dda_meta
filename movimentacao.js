// Inicializa o estoque no localStorage se ainda não existir
const estoqueInicial = {
  CNMG120408: { nome: "Pastilha Mtl Duro (ISO: CNMG 120408)", saldo: 50 },
  TNMG160404: { nome: "Pastilha Soldável (ISO: TNMG 160404)", saldo: 30 },
  CCMT09T304: { nome: "Pastilha Cerâmica (ISO: CCMT 09T304)", saldo: 20 },
  WNGM080408: { nome: "Pastilha Dim PCD (ISO: WNGM 080408)", saldo: 15 },
  RNGN120400: { nome: "Pastilha CBN (ISO: RNGN 120400)", saldo: 10 }
};

let estoque = JSON.parse(localStorage.getItem("cepad_estoque")) || estoqueInicial;
let historico = JSON.parse(localStorage.getItem("cepad_historico")) || [];

// Seleciona os elementos do HTML
const form = document.getElementById("form-movimentacao");
const selectProduto = document.getElementById("produto");
const selectTipo = document.getElementById("tipo");
const inputQtd = document.getElementById("quantidade");
const divMensagem = document.getElementById("mensagem");
const tbodyHistorico = document.getElementById("tabela-historico");

// Atualiza os textos do <select> para mostrar o saldo atual de cada pastilha
function atualizarOpcoesSelect() {
  Array.from(selectProduto.options).forEach(option => {
    const codigo = option.value;
    if (codigo && estoque[codigo]) {
      option.textContent = `${estoque[codigo].nome} — [Estoque: ${estoque[codigo].saldo}]`;
    }
  });
}

function renderizarHistorico() {
  tbodyHistorico.innerHTML = "";
  
  historico.slice().reverse().forEach(item => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.data}</td>
      <td>${item.produto}</td>
      <td style="color: ${item.tipo === 'entrada' ? 'green' : 'red'};">
        ${item.tipo === 'entrada' ? 'Entrada (+)' : 'Saída (-)'}
      </td>
      <td>${item.quantidade}</td>
      <td><strong>${item.saldoApos}</strong></td>
    `;
    tbodyHistorico.appendChild(tr);
  });
}

// Exibe alertas visuais de sucesso ou erro
function exibirMensagem(texto, erro = false) {
  divMensagem.textContent = texto;
  divMensagem.style.color = erro ? "red" : "green";
  setTimeout(() => { divMensagem.textContent = ""; }, 4000);
}

// Captura o envio do formulário
form.addEventListener("submit", function (event) {
  event.preventDefault(); // Impede a página de recarregar e dar erro de POST

  const codigo = selectProduto.value;
  const tipo = selectTipo.value;
  const qtd = parseInt(inputQtd.value, 10);

  if (!codigo || isNaN(qtd) || qtd <= 0) {
    exibirMensagem("Preencha todos os campos corretamente.", true);
    return;
  }

  const itemEstoque = estoque[codigo];

  // Validação para não deixar o estoque ficar negativo
  if (tipo === "saida" && qtd > itemEstoque.saldo) {
    exibirMensagem(`Saldo insuficiente! Você tem apenas ${itemEstoque.saldo} unidades.`, true);
    return;
  }

  // Atualiza o saldo
  if (tipo === "entrada") {
    itemEstoque.saldo += qtd;
  } else {
    itemEstoque.saldo -= qtd;
  }

  // Registra no histórico
  const registro = {
    data: new Date().toLocaleString("pt-BR"),
    produto: itemEstoque.nome,
    tipo: tipo,
    quantidade: qtd,
    saldoApos: itemEstoque.saldo
  };
  historico.push(registro);

  localStorage.setItem("cepad_estoque", JSON.stringify(estoque));
  localStorage.setItem("cepad_historico", JSON.stringify(historico));

  atualizarOpcoesSelect();
  renderizarHistorico();
  form.reset();
  exibirMensagem("Movimentação registrada com sucesso!");
});

// Inicializa a tela ao carregar
atualizarOpcoesSelect();
renderizarHistorico();
