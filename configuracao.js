document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formConfiguracao');
    const btnSair = document.getElementById('btnSair');

    // 1. CARREGAR CONFIGURAÇÕES SALVAS (Comunicação JS -> HTML ao abrir a página)
    const carregarConfiguracoes = () => {
        const dadosSalvos = localStorage.getItem('cepad_configuracoes');
        
        // Se não houver nada salvo ainda, ignora e usa o padrão do HTML
        if (!dadosSalvos) return; 

        const config = JSON.parse(dadosSalvos);

        // Restaura os menus suspensos (Selects)
        if (config.unidadeMedida) document.getElementById('unidade').value = config.unidadeMedida;
        if (config.estoqueMinimo) document.getElementById('estoqueMinimo').value = config.estoqueMinimo;
        if (config.tema) document.getElementById('tema').value = config.tema;
        if (config.tamanhoInterface) document.getElementById('interface').value = config.tamanhoInterface;
        if (config.idioma) document.getElementById('idioma').value = config.idioma;
        if (config.formatoData) document.getElementById('formatoData').value = config.formatoData;

        // Restaura os grupos de checkboxes (Múltipla escolha)
        marcarCheckboxesDoGrupo('regrasEstoque', config.regrasEstoque);
        marcarCheckboxesDoGrupo('regrasMovimentacao', config.regrasMovimentacao);
        marcarCheckboxesDoGrupo('notificacoes', config.notificacoesAtivas);

        // Restaura os checkboxes individuais isolados
        document.getElementById('interfaceCompacta').checked = config.interfaceCompacta;
        document.getElementById('confirmarExclusao').checked = config.confirmarExclusao;

        console.log('Configurações recuperadas e aplicadas ao HTML:', config);
    };

    // Função auxiliar para marcar os itens que estavam salvos no array
    const marcarCheckboxesDoGrupo = (nomeGrupo, valoresSalvos) => {
        if (!valoresSalvos) return;
        const checkboxes = document.querySelectorAll(`input[name="${nomeGrupo}"]`);
        checkboxes.forEach(cb => {
            cb.checked = valoresSalvos.includes(cb.value);
        });
    };


    // 2. SALVAR CONFIGURAÇÕES (Comunicação HTML -> JS ao clicar em Salvar)
    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault(); // Evita que a página recarregue

            // Função auxiliar para pegar os valores de múltiplos checkboxes marcados
            const obterMarcados = (nomeGrupo) => {
                const checkboxes = document.querySelectorAll(`input[name="${nomeGrupo}"]:checked`);
                return Array.from(checkboxes).map(cb => cb.value);
            };

            // Captura o estado atual do formulário HTML
            const configuracoesAtuais = {
                unidadeMedida: document.getElementById('unidade').value,
                estoqueMinimo: document.getElementById('estoqueMinimo').value,
                tema: document.getElementById('tema').value,
                tamanhoInterface: document.getElementById('interface').value,
                idioma: document.getElementById('idioma').value,
                formatoData: document.getElementById('formatoData').value,
                regrasEstoque: obterMarcados('regrasEstoque'),
                regrasMovimentacao: obterMarcados('regrasMovimentacao'),
                notificacoesAtivas: obterMarcados('notificacoes'),
                interfaceCompacta: document.getElementById('interfaceCompacta').checked,
                confirmarExclusao: document.getElementById('confirmarExclusao').checked
            };

            // Grava os dados na memória do navegador (convertido em texto JSON)
            localStorage.setItem('cepad_configuracoes', JSON.stringify(configuracoesAtuais));

            console.log('Novas configurações guardadas no LocalStorage:', configuracoesAtuais);
            alert('Configurações aplicadas e salvas com sucesso!');
        });
    }

    // 3. EVENTO DO BOTÃO SAIR
    if (btnSair) {
        btnSair.addEventListener('click', () => {
            if (confirm('Deseja realmente sair do sistema?')) {
                console.log('Usuário escolheu sair.');
                // window.location.href = 'login.html';
            }
        });
    }

    // Executa a função de leitura assim que a página termina de carregar
    carregarConfiguracoes();
});
