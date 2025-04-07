document.addEventListener('DOMContentLoaded', () => {
    const moradorForm = document.getElementById('moradorForm');
    const doacaoForm = document.getElementById('doacaoForm');
    const moradoresList = document.getElementById('moradoresList');
    const doacoesList = document.getElementById('doacoesList');
    const moradorSelect = document.getElementById('doacaoMorador');

    async function listarMoradores() {
        try {
            const response = await fetch('https://chie-api.onrender.com/moradores');
            const moradores = await response.json();
            moradoresList.innerHTML = '';
            moradorSelect.innerHTML = '<option value="">Selecione um morador</option>';

            moradores.forEach(morador => {
                const li = document.createElement('li');
                const text = document.createTextNode(
                    `${morador.name} (${morador.apelido || 'Sem apelido'}) - Contato: ${morador.contato || 'Não informado'} `
                );
                li.appendChild(text);

                const editButton = document.createElement('button');
                editButton.textContent = 'Editar';
                editButton.style.backgroundColor = '#ff6666';
                editButton.style.marginLeft = '10px';
                editButton.style.padding = '5px 10px';
                editButton.addEventListener('click', () => editarMorador(morador._id));
                li.appendChild(editButton);

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Deletar';
                deleteButton.style.backgroundColor = '#ff3333';
                deleteButton.style.marginLeft = '5px';
                deleteButton.style.padding = '5px 10px';
                deleteButton.addEventListener('click', () => deletarMorador(morador._id));
                li.appendChild(deleteButton);

                moradoresList.appendChild(li);

                const option = document.createElement('option');
                option.value = morador._id;
                option.textContent = morador.name;
                moradorSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Erro ao listar moradores:', error);
            alert('Erro ao listar moradores.');
        }
    }

    async function listarDoacoes() {
        try {
            const response = await fetch('https://chie-api.onrender.com/doacoes');
            if (!response.ok) throw new Error(`Erro ao listar doações: Status ${response.status}`);

            const doacoes = await response.json();
            doacoesList.innerHTML = '';

            doacoes.forEach(doacao => {
                const moradorName = doacao.morador && doacao.morador.name ? doacao.morador.name : 'Morador não encontrado';
                const li = document.createElement('li');
                const text = document.createTextNode(
                    `Tipo: ${doacao.tipo}, Quantidade: ${doacao.quantidade}, Local: ${doacao.local}, Morador: ${moradorName}, Data: ${new Date(doacao.data).toLocaleDateString()} `
                );
                li.appendChild(text);

                const editButton = document.createElement('button');
                editButton.textContent = 'Editar';
                editButton.style.backgroundColor = '#ff6666';
                editButton.style.marginLeft = '10px';
                editButton.style.padding = '5px 10px';
                editButton.addEventListener('click', () => editarDoacao(doacao._id));
                li.appendChild(editButton);

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Deletar';
                deleteButton.style.backgroundColor = '#ff3333';
                deleteButton.style.marginLeft = '5px';
                deleteButton.style.padding = '5px 10px';
                deleteButton.addEventListener('click', () => deletarDoacao(doacao._id));
                li.appendChild(deleteButton);

                doacoesList.appendChild(li);
            });
        } catch (error) {
            console.error('Erro ao listar doações:', error);
            alert(`Erro ao listar doações: ${error.message}`);
        }
    }

    moradorForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const moradorId = moradorForm.dataset.id;
        const method = moradorId ? 'PUT' : 'POST';
        const url = moradorId
            ? `https://chie-api.onrender.com/moradores/${moradorId}`
            : 'https://chie-api.onrender.com/moradores';

        const moradorData = {
            name: document.getElementById('moradorName').value,
            apelido: document.getElementById('moradorApelido').value,
            contato: document.getElementById('moradorContato').value,
            endereco: {
                rua: document.getElementById('moradorRua').value,
                numero: parseInt(document.getElementById('moradorNumero').value) || 0,
                complemento: document.getElementById('moradorComplemento').value,
                bairro: document.getElementById('moradorBairro').value
            }
        };

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(moradorData)
            });

            if (response.ok) {
                alert(moradorId ? 'Morador atualizado com sucesso!' : 'Morador cadastrado com sucesso!');
                moradorForm.reset();
                delete moradorForm.dataset.id;
                listarMoradores();
            } else {
                const errorText = await response.text();
                throw new Error(`Erro ao processar morador: ${errorText}`);
            }
        } catch (error) {
            console.error('Erro:', error);
            alert(`Erro ao processar morador: ${error.message}`);
        }
    });

    doacaoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const doacaoId = doacaoForm.dataset.id;
        const method = doacaoId ? 'PUT' : 'POST';
        const url = doacaoId
            ? `https://chie-api.onrender.com/doacoes/${doacaoId}`
            : 'https://chie-api.onrender.com/doacoes';

        const doacaoData = {
            tipo: document.getElementById('doacaoTipo').value,
            quantidade: parseInt(document.getElementById('doacaoQuantidade').value),
            local: document.getElementById('doacaoLocal').value,
            morador: document.getElementById('doacaoMorador').value
        };

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(doacaoData)
            });

            if (response.ok) {
                alert(doacaoId ? 'Doação atualizada com sucesso!' : 'Doação cadastrada com sucesso!');
                doacaoForm.reset();
                delete doacaoForm.dataset.id;
                listarDoacoes();
            } else {
                const errorText = await response.text();
                throw new Error(`Erro ao processar doação: ${errorText}`);
            }
        } catch (error) {
            console.error('Erro:', error);
            alert(`Erro ao processar doação: ${error.message}`);
        }
    });

    async function editarMorador(id) {
        try {
            const response = await fetch(`https://chie-api.onrender.com/moradores/${id}`);
            if (!response.ok) throw new Error(`Erro ao carregar morador: Status ${response.status}`);
            const morador = await response.json();

            document.getElementById('moradorName').value = morador.name || '';
            document.getElementById('moradorApelido').value = morador.apelido || '';
            document.getElementById('moradorContato').value = morador.contato || '';
            document.getElementById('moradorRua').value = morador.endereco?.rua || '';
            document.getElementById('moradorNumero').value = morador.endereco?.numero || '';
            document.getElementById('moradorComplemento').value = morador.endereco?.complemento || '';
            document.getElementById('moradorBairro').value = morador.endereco?.bairro || '';

            moradorForm.dataset.id = id;
        } catch (error) {
            console.error('Erro ao carregar morador para edição:', error);
            alert(`Erro ao carregar morador para edição: ${error.message}`);
        }
    }

    async function deletarMorador(id) {
        if (confirm('Tem certeza que deseja deletar este morador?')) {
            try {
                const response = await fetch(`https://chie-api.onrender.com/moradores/${id}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    alert('Morador deletado com sucesso!');
                    listarMoradores();
                } else {
                    throw new Error('Erro ao deletar morador.');
                }
            } catch (error) {
                console.error('Erro:', error);
                alert('Erro ao deletar morador.');
            }
        }
    }

    async function editarDoacao(id) {
        try {
            const response = await fetch(`https://chie-api.onrender.com/doacoes/${id}`);
            if (!response.ok) throw new Error(`Erro ao carregar doação: Status ${response.status}`);
            const doacao = await response.json();

            document.getElementById('doacaoTipo').value = doacao.tipo;
            document.getElementById('doacaoQuantidade').value = doacao.quantidade;
            document.getElementById('doacaoLocal').value = doacao.local;

            if (doacao.morador) {
                const moradorId = typeof doacao.morador === 'object' ? doacao.morador._id : doacao.morador;
                document.getElementById('doacaoMorador').value = moradorId;
            }

            doacaoForm.dataset.id = id;
        } catch (error) {
            console.error('Erro ao carregar doação para edição:', error);
            alert(`Erro ao carregar doação para edição: ${error.message}`);
        }
    }

    async function deletarDoacao(id) {
        if (confirm('Tem certeza que deseja deletar esta doação?')) {
            try {
                const response = await fetch(`https://chie-api.onrender.com/doacoes/${id}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    alert('Doação deletada com sucesso!');
                    listarDoacoes();
                } else {
                    throw new Error('Erro ao deletar doação.');
                }
            } catch (error) {
                console.error('Erro:', error);
                alert('Erro ao deletar doação.');
            }
        }
    }

    window.editarMorador = editarMorador;
    window.deletarMorador = deletarMorador;
    window.editarDoacao = editarDoacao;
    window.deletarDoacao = deletarDoacao;

    listarMoradores();
    listarDoacoes();
});
