// Lógica do Tema Escuro
const themeBtn = document.getElementById('themeBtn');
const themeIcon = document.getElementById('themeIcon');
const body = document.body;

themeBtn.addEventListener('click', () => {
    if (body.getAttribute('data-theme') === 'dark') {
        body.removeAttribute('data-theme');
        themeIcon.className = 'ri-moon-line';
    } else {
        body.setAttribute('data-theme', 'dark');
        themeIcon.className = 'ri-sun-line';
    }
});




const el = {
    nome: document.getElementById("nome"),
    sugestoes: document.getElementById("sugestoes_box"),
    peso: document.getElementById("peso"),
    pesoCampo: document.getElementById("campo_de_peso"),
    idade: document.getElementById("idade"),
    idadeCampo: document.getElementById("campo_de_idade"),
    idadeUnidade: document.getElementById("unidade_de_idade"),
    dosagem: document.getElementById("dosagem"),
    dosagemCampo: document.getElementById("campo_de_dosagem"),
    dosagemUnidade: document.getElementById("unidade_de_dosagem"),
    intervalo: document.getElementById("intervalo"),
    dose: document.getElementById("dose"),
    via: document.getElementById("via"),
    resultado: document.getElementById("resultado"),
    pais: document.getElementById("pais"),
};
 





function buscarMedicamento(nome) {
    const paisSelecionado = document.getElementById("pais").value;
    
    // Mapeamento dos objetos que vêm dos teus ficheiros externos
    const mapasPorPais = {
        "universal": medicamentos,        // Teu arquivo global
        "portugal": medPortugal,       // medPortugal deve estar no seu arquivo de PT
        "angola": medAngola,           // medAngola deve estar no seu arquivo de AO
        "brazil": medBrazil            // medBrazil deve estar no seu arquivo de BR
    };

    const bancoDoPais = mapasPorPais[paisSelecionado];

    // 1º Tenta no arquivo do País
    if (bancoDoPais && bancoDoPais[nome]) {
        return bancoDoPais[nome];
    }

    // 2º Se não achou, tenta no arquivo Global
    if (medicamentos[nome]) {
        return medicamentos[nome];
    }

    return null;
}





function atualizarSugestoes() {
    const termo = el.nome.value.trim().toLowerCase();
    const paisValor = el.pais.value; // Usando o el.pais que já definiste
    el.sugestoes.innerHTML = "";

    if (termo === "") {
        el.sugestoes.style.display = "none";
        return;
    }

    const mapasPorPais = { "global": medicamentos, "portugal": medPortugal, "angola": medAngola, "brazil": medBrazil };
    
    const chavesPais = mapasPorPais[paisValor] ? Object.keys(mapasPorPais[paisValor]) : [];
    const chavesGlobal = Object.keys(medicamentos);
    
    // Junta tudo e remove duplicados
    const todasAsChaves = [...new Set([...chavesPais, ...chavesGlobal])];

    // CORREÇÃO: Filtrar sobre 'todasAsChaves' e não apenas 'medicamentos'
    const filtrados = todasAsChaves.filter(m => m.includes(termo));

    // Se o usuário digitou o nome exato que existe na lista fundida, esconde as sugestões
    if (todasAsChaves.includes(termo)) {
        el.sugestoes.style.display = "none";
        return;
    }

    if (filtrados.length > 0) {
        filtrados.forEach(med => {
            const div = document.createElement("div");
            div.className = "sugestao_item";
            div.textContent = med;
            div.onclick = () => {
                el.nome.value = med;
                el.sugestoes.style.display = "none";
                mostrar_campos();
            };
            el.sugestoes.appendChild(div);
        });
        el.sugestoes.style.display = "block";
    } else {
        el.sugestoes.style.display = "none";
    }
}

function mostrar_campos() {
    const pesquisa = el.nome.value.trim().toLowerCase();
    const doseAtual = el.dose.value;
    const viaAtual = el.via.value;
    const mult = parseFloat(el.idadeUnidade.value);
    const idadeDias = (parseFloat(el.idade.value) || 0) * mult;
    const pesoAtual = parseFloat(el.peso.value) || 0;

    const dadosLista = buscarMedicamento(pesquisa); 


    if (!dadosLista) {
        [el.dose, el.intervalo, el.pesoCampo, el.idadeCampo, el.dosagemCampo, el.via].forEach(c => c.style.display = "none");
        [el.peso, el.idade, el.dosagem].forEach(i => i.value = "");
        el.resultado.textContent = "";
        resultado.style.background = "var(--primary)";
        return;
    }

    const dados = dadosLista.find(item => item.check(doseAtual, idadeDias, pesoAtual, viaAtual)) || dadosLista[0];

    const gerir = (container, condicao, inputInterno) => {
        const deveMostrar = !!condicao;
        container.style.display = deveMostrar ? (container.tagName === 'SELECT' ? "block" : "flex") : "none";
        if (!deveMostrar && inputInterno && document.activeElement !== inputInterno) {
            inputInterno.value = "";
        }
    };
    
    gerir(el.via, dados.campos.via)
    gerir(el.dose, dados.campos.dose);
    gerir(el.pesoCampo, dados.campos.peso, el.peso);
    gerir(el.idadeCampo, dados.campos.idade, el.idade);
    gerir(el.dosagemCampo, dados.campos.dosagem, el.dosagem);

    if (dados.campos.intervalo) {
        const textoHoras = dados.campos.intervalo.join(',');
        if (el.intervalo.dataset.last !== textoHoras) {
            el.intervalo.innerHTML = "";
            dados.campos.intervalo.forEach(h => el.intervalo.add(new Option(`De ${h} em ${h}h`, 24 / h)));
            el.intervalo.dataset.last = textoHoras;
        }
        el.intervalo.style.display = "block";
    } else {
        el.intervalo.style.display = "none";
        el.intervalo.dataset.last = "";
    }

    if (dados.campos.dosagem) {
        el.dosagemUnidade.textContent = dados.campos.dosagem[3];
        if (dados.campos.dosagem[2] && el.dosagem.value === "") {
            el.dosagem.value = dados.campos.dosagem[2];
        }
    }
}




function calcular() {
    
    resultado.classList.remove("vibrar");
    // 2. Forçar um "re-flow" (truque para o browser perceber que removemos a classe)
    void resultado.offsetWidth; 
    resultado.classList.add("vibrar");

    const pesquisa = el.nome.value.trim().toLowerCase();
    const doseAtual = el.dose.value;
    const viaAtual = el.via.value
    const multIdade = parseFloat(el.idadeUnidade.value);
    const idadeDias = (parseFloat(el.idade.value) || 0) * multIdade;
    const pesoAtual = parseFloat(el.peso.value) || 0;

    const dadosLista = buscarMedicamento(pesquisa);
    if (!dadosLista) {
        el.resultado.innerHTML = "Medicamento não Encontrado!";
        resultado.style.background = "red";
        resultado.style.textAlign = "center";
        return;
    }

    const dados = dadosLista.find(item => item.check(doseAtual, idadeDias, pesoAtual, viaAtual)) || dadosLista[0];

    let vPeso = pesoAtual;
    let vDoseDigitada = parseFloat(el.dosagem.value) || 0;
    let vIdadeFinalInput = (parseFloat(el.idade.value) || 0); // Valor digitado no input
    let vIntervalo = parseFloat(el.intervalo.value) || 2;

    if (dados.campos.peso) {
        if (vPeso < dados.campos.peso[0] || vPeso > dados.campos.peso[1]) {
            vPeso = vPeso < dados.campos.peso[0] ? dados.campos.peso[0] : dados.campos.peso[1];
            alert(`Peso corrigido para ${vPeso} kg.\nDeve estar entre ${dados.campos.peso[0]}-${dados.campos.peso[1]} kg.`);
            el.peso.value = vPeso;
        }
    }

    if (dados.campos.idade) {
        const minD = dados.campos.idade[0];
        const maxD = dados.campos.idade[1];
        const unidadeTexto = el.idadeUnidade.options[el.idadeUnidade.selectedIndex].text;

        // A verificação deve ser feita estritamente sobre idadeDias
        if (idadeDias < minD || idadeDias > maxD) {
            const novaIdadeDias = idadeDias < minD ? minD : maxD;
            vIdadeFinalInput = (novaIdadeDias / multIdade).toFixed(1);

            const minNaUnidade = (minD / multIdade).toFixed(1);
            const maxNaUnidade = (maxD / multIdade).toFixed(1);

            alert(`Idade corrigida para ${vIdadeFinalInput} ${unidadeTexto}.\nDeve estar entre ${minNaUnidade} e ${maxNaUnidade} ${unidadeTexto}.\n\nPode mudar a unidade da idade para uma outra para facilitar o seu calculo.`);
            el.idade.value = vIdadeFinalInput;
        }
    }

    if (dados.campos.dosagem) {
        const [min, max, padrao, uni] = dados.campos.dosagem;
        if (vDoseDigitada < min || vDoseDigitada > max) {
            vDoseDigitada = padrao || min;
            alert(`Dosagem corrigida para ${vDoseDigitada} ${uni}.\nDeve estar entre ${dados.campos.dosagem[0]}-${dados.campos.dosagem[1]} ${uni}.`);
            el.dosagem.value = vDoseDigitada;
        }
    }

    // O cálculo final usa a idade convertida em dias correta (vIdadeFinalInput * multIdade)
    const textoResultado = dados.formula(vPeso, parseFloat(vIdadeFinalInput) * multIdade, vDoseDigitada, vIntervalo);
    el.resultado.innerHTML = textoResultado;
    resultado.style.background = "var(--primary)";
    resultado.style.textAlign = "center";
}



// Evento para sugestões e mostrar campos
el.nome.addEventListener("input", () => {
    atualizarSugestoes();
    mostrar_campos();
});

// Fechar sugestões ao clicar fora
document.addEventListener("click", (e) => {
    if (e.target !== el.nome && e.target !== el.sugestoes) {
        el.sugestoes.style.display = "none";
    }
});

el.dose.addEventListener("change", mostrar_campos);
el.idade.addEventListener("input", mostrar_campos);
el.idadeUnidade.addEventListener("change", mostrar_campos);
el.peso.addEventListener("input", mostrar_campos);
el.via.addEventListener("change", mostrar_campos);




// Evento para detetar mudança de país
document.getElementById('pais').addEventListener('change', () => {
    
    
    el.resultado.innerHTML = "A carregar...";
    el.resultado.style.background = "orange";
    el.resultado.style.display = "block";
    el.resultado.style.textAlign = "left";
    
    // --- Atualização em Tempo Real --- 
    
    // Se o medicamento já estiver preenchido, limpa o cálculo antigo por segurança
        setTimeout(() => {
            limpar();
            el.resultado.innerHTML = `Padrões de ${pais.value} carregados. <br> Tudo Pronto.`;
            el.resultado.style.background = "var(--primary)";
        }, 1500);

});



function limpar(){
    el.nome.value = "";
    el.peso.value = "";
    el.idade.value = "";
    el.dosagem.value = "";
    resultado.innerHTML = "";
    resultado.style.background = "var(--primary)";
    resultado.classList.remove("vibrar");
    void resultado.offsetWidth; 
    // 2. Forçar um "re-flow" (truque para o browser perceber que removemos a classe)    
    resultado.classList.add("vibrar");

    mostrar_campos()
}
