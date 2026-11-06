// Armazena os dados no LocalStorage do navegador
let fabricantes = JSON.parse(localStorage.getItem('fabricantes')) || [];
let modoEdicaoId = null;

// Elementos do Formulário
const form = document.getElementById('form-fabricante');
const inputId = document.getElementById('fabricante-id');
const inputCnpj = document.getElementById('cnpj');
const inputRazaoSocial = document.getElementById('razao-social');
const inputNomeFantasia = document.getElementById('nome-fantasia');
const inputContato = document.getElementById('contato');
const inputCep = document.getElementById('cep');
const inputLogradouro = document.getElementById('logradouro');
const inputNumero = document.getElementById('numero');
const inputBairro = document.getElementById('bairro');
const inputCidade = document.getElementById('cidade');
const inputEstado = document.getElementById('estado');

// Elementos de Controle e Tabela
const btnBuscarCep = document.getElementById('btn-buscar-cep');
const btnCancelar = document.getElementById('btn-cancelar');
const tituloForm = document.getElementById('titulo-form');
const cnpjErro = document.getElementById('cnpj-erro');
const buscaTermo = document.getElementById('busca-termo');
const filtroStatus = document.getElementById('filtro-status');
const corpoTabela = document.getElementById('corpo-tabela-fabricantes');

// BUSCA DE CEP
btnBuscarCep.addEventListener('click', async () => {
    const cep = inputCep.value.replace(/\D/g, ''); // Remove tudo que não for número
    if (cep.length !== 8) return alert('Digite um CEP válido com 8 dígitos.');

    try {
        const resposta = await fetch(`https://viacep.com.br{cep}/json/`);
        const dados = await resposta.json();

        if (dados.erro) return alert('CEP não encontrado.');

        inputLogradouro.value = dados.logradouro;
        inputBairro.value = dados.bairro;
        inputCidade.value = dados.localidade;
        inputEstado.value = dados.uf;
    } catch {
        alert('Erro ao buscar o CEP.');
    }
});

form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validação de CNPJ duplicado
    const cnpjExiste = fabricantes.some(f => f.cnpj === inputCnpj.value && f.id !== modoEdicaoId);
    if (cnpjExiste) {
        cnpjErro.style.display = 'block';
        return;
    }
    cnpjErro.style.display = 'none';

    const dados = {
        id: modoEdicaoId || Date.now().toString(),
        cnpj: inputCnpj.value,
        razaoSocial: inputRazaoSocial.value,
        nomeFantasia: inputNomeFantasia.value,
        contato: inputContato.value,
        cidade: inputCidade.value,
        estado: inputEstado.value,
        ativo: modoEdicaoId !== null ? fabricantes.find(f => f.id === modoEdicaoId).ativo : true
    };

    if (modoEdicaoId) {
        fabricantes = fabricantes.map(f => f.id === modoEdicaoId ? dados : f);
    } else {
        fabricantes.push(dados);
    }

    localStorage.setItem('fabricantes', JSON.stringify(fabricantes));
    resetarFormulario();
    renderizar();
});

window.editarFabricante = (id) => {
    const f = fabricantes.find(fabricante => fabricante.id === id);
    modoEdicaoId = id;
    tituloForm.textContent = 'Editar Fabricante';
    btnCancelar.style.display = 'inline-block';

    inputCnpj.value = f.cnpj;
    inputRazaoSocial.value = f.razaoSocial;
    inputNomeFantasia.value = f.nomeFantasia;
    inputContato.value = f.contato;
    inputCidade.value = f.cidade;
    inputEstado.value = f.estado;
};

// Ativar / Inativar
window.alternarStatus = (id) => {
    fabricantes = fabricantes.map(f => {
        if (f.id === id) f.ativo = !f.ativo;
        return f;
    });
    localStorage.setItem('fabricantes', JSON.stringify(fabricantes));
    renderizar();
};

// Mostrar dados da Tabela
function renderizar() {
    corpoTabela.innerHTML = '';

    // Filtragem por termo e status
    const termo = buscaTermo.value.toLowerCase();
    const status = filtroStatus.value;

    const filtrados = fabricantes.filter(f => {
        const bateStatus = (status === 'todos') || (status === 'ativos' && f.ativo) || (status === 'inativos' && !f.ativo);
        const bateTermo = f.cnpj.includes(termo) || f.razaoSocial.toLowerCase().includes(termo) || f.nomeFantasia.toLowerCase().includes(termo);
        return bateStatus && bateTermo;
    });

    // Ordenação Alfabética
    filtrados.sort((a, b) => a.nomeFantasia.localeCompare(b.nomeFantasia));

    // Monta as linhas da tabela
    filtrados.forEach(f => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="padding: 8px;">${f.cnpj}</td>
            <td style="padding: 8px;"><b>${f.nomeFantasia}</b><br><small>${f.razaoSocial}</small></td>
            <td style="padding: 8px;">${f.contato}</td>
            <td style="padding: 8px;">${f.cidade}/${f.estado}</td>
            <td style="padding: 8px; color: ${f.ativo ? 'green' : 'red'}; font-weight: bold;">${f.ativo ? 'Ativo' : 'Inativo'}</td>
            <td style="padding: 8px; text-align: center;">
                <button onclick="editarFabricante('${f.id}')">Editar</button>
                <button onclick="alternarStatus('${f.id}')">${f.ativo ? 'Inativar' : 'Ativar'}</button>
            </td>
        `;
        corpoTabela.appendChild(tr);
    });
}

function resetarFormulario() {
    form.reset();
    modoEdicaoId = null;
    tituloForm.textContent = 'Cadastro de Fabricante';
    btnCancelar.style.display = 'none';
    cnpjErro.style.display = 'none';
}

// Eventos para busca em tempo real
btnCancelar.addEventListener('click', resetarFormulario);
buscaTermo.addEventListener('input', renderizar);
filtroStatus.addEventListener('change', renderizar);

renderizar();
