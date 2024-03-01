 $(document).ready(function() {
    // Adicionar Anexo
        $('#adicionarAnexo').click(function() {
            const newRow = `
                <tr>
                    <td><input type="file" class="form-control documento" required></td>
                    <td>
                        <button type="button" class="btn btn-primary visualizarAnexo">Visualizar</button>
                        <button type="button" class="btn btn-danger excluirAnexo">Excluir</button>
                    </td>
                </tr>`;
            $('#tabelaAnexos tbody').append(newRow);
        });
       
      // Função para adicionar um novo produto à tabela
      function adicionarProduto() {
        const newRow = `
        <div class="row">
        <div class="col-md-2">
          <button type="button" class="btn btn-danger excluirProduto">Excluir</button>
        </div>
        <div class="col-md-8">
          <div class="form-group">
            <label for="descricao">Descrição:</label>
            <input type="text" class="form-control" id="descricao" required>
          </div>
          <div class="row">
          <div class="col-md-2">                           
            <div class="form-group">
              <label for="unidadeMedida">Unidade de Medida:</label>
              <input type="text" class="form-control" id="unidadeMedida"  required>
            </div>
          </div>
            <div class="col-md-2">
              <div class="form-group">
                <label for="quantidadeEstoque">Quantidade em Estoque:</label>
                <input type="number" class="form-control" id="quantidadeEstoque"  required>
              </div>     
            </div>
            <div class="col-md-2">                              
              <div class="form-group">
                <label for="valorUnitario">Valor Unitário:</label>
                <input type="number" class="form-control" id="valorUnitario"  required>
              </div>
            </div>
            <div class="col-md-2">
              <div class="form-group">
                <label for="valorTotal">Valor Total:</label>
                <input type="number" class="form-control" id="valorTotal" readonly>
              </div>
            </div>
        </div>
      </div>                              
            </div>`;
        
          $('#tabelaProdutos').append(newRow);
        }
        
        // Adicionar produto quando o botão for clicado
        $('.btn-adicionar-produto').click(adicionarProduto);
        $(document).on('click', '.excluirProduto', function() {
            const row = $(this).closest('.row');
            row.remove();
            
            // Remover o documento da memória (Session Storage)
            removerDocumentoMemoria(row.index());
        });
       
            // Evento de clique no botão "Salvar Fornecedor"
            $('#salvarFornecedor').click(function() {
             
                $('#loadingModal').modal('show');
        
             
                const formDataJSON = JSON.stringify(formatarFormData());;
        
               
                console.log(formDataJSON);
        
               
                setTimeout(function() {
                  
                    $('#loadingModal').modal('hide');
                }, 3000);
            });
     
  

            
            $('#cep').change(function() {
            const cep = $(this).val();
            $.getJSON(`https://viacep.com.br/ws/${cep}/json/`, function(data) {
                if (!data.erro) {
                    $('#endereco').val(`${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`);
                } else {
                    alert('CEP não encontrado.');
                }
            });  

        });


        // Excluir Anexo
        $(document).on('click', '.excluirAnexo', function() {
            const row = $(this).closest('tr');
            row.remove();
            
            // Remover o documento da memória (Session Storage)
            removerDocumentoMemoria(row.index());
        });

        // Visualizar Anexo (Download)
        $(document).on('click', '.visualizarAnexo', function() {
            const input = $(this).closest('tr').find('.documento');
            const file = input[0].files[0];
            if (file) {
                const url = URL.createObjectURL(file);
                const a = document.createElement('a');
                a.href = url;
                a.download = file.name;
                document.body.appendChild(a);
                a.click();
                URL.revokeObjectURL(url);
                document.body.removeChild(a);
            } else {
                alert('Nenhum documento selecionado.');
            }
        });
        // Função para remover o documento da memória (Session Storage)
        function removerDocumentoMemoria(index) {
            let documentos = JSON.parse(sessionStorage.getItem('documentos_anexados'));
            documentos.splice(index, 1);
            sessionStorage.setItem('documentos_anexados', JSON.stringify(documentos));
        }


    
        

        // Calcular Valor Total
        $(document).on('input', '#valorUnitario, #quantidadeEstoque', function() {
            const row = $(this).closest('div');
            const valorUnitario = parseFloat(row.find('#valorUnitario').val()) || 0;
            const quantidadeEstoque = parseFloat(row.find('#quantidadeEstoque').val()) || 0;
            const valorTotal = valorUnitario * quantidadeEstoque;
            row.find('#valorTotal').val(valorTotal.toFixed(2));
        });

            // Coletar os dados do formulário
            const formData = {
                razaoSocial: $('#razaoSocial').val(),
                nomeFantasia: $('#nomeFantasia').val(),
                cnpj: $('#cnpj').val(),
                cep: $('#cep').val(),
                endereco: $('#endereco').val(),
                inscricaoEstadual: $('#inscricaoEstadual').val(),
                inscricaoMunicipal: $('#inscricaoMunicipal').val(),
                numero: $('#numero').val(),
                complemento: $('#complemento').val(),
                bairro: $('#bairro').val(),
                municipio: $('#bairro').val(),
                estado: $('#estado').val(),
                nomeContato: $('#nomeContato').val(),
                telefone: $('#telefone').val(),
                email: $('#email').val(),
                produtos: [],
                anexos: [],
            };

            document.querySelector('form').addEventListener('input', function (e) {
    const quantidadeEstoque = parseFloat(document.getElementById('quantidadeEstoque').value);
    const valorUnitario = parseFloat(document.getElementById('valorUnitario').value);

    if (!isNaN(quantidadeEstoque) && !isNaN(valorUnitario)) {
      document.getElementById('valorTotal').value = (quantidadeEstoque * valorUnitario).toFixed(2);
    }
  });

            // Coletar os dados da tabela de produtos
            $('#tabelaProdutos').each(function() {
                const produto = {
                    descricao: $(this).find('#descricao').val(),
                    unidadeMedida: $(this).find('#unidadeMedida').val(),
                    quantidadeEstoque: parseFloat($(this).find('#quantidadeEstoque').val()),
                    valorUnitario: parseFloat($(this).find('#valorUnitario').val()),
                    valorTotal: parseFloat($(this).find('#valorTotal').val())
                };
                formData.produtos.push(produto);
            });

            $('#tabelaAnexos tbody tr').each(function(index) {
                const anexo = {
                    indice: index + 1,
                    nomeArquivo: $(this).find('.documento').val(),
                    blobArquivo: 'blobArquivo' // Coloque aqui a lógica para obter o arquivo em blob, se necessário
                };
                formData.anexos.push(anexo);
            });

            $('#cadastroForm').submit(function(event) {
            event.preventDefault();

            // Verificar se pelo menos um anexo foi adicionado à tabela de anexos
            const anexos = $('#tabelaAnexos').find('tr').length - 1; // -1 para descontar o cabeçalho da tabela
            if (anexos < 1) {
                alert('Adicione pelo menos um anexo à tabela de anexos.');
                return;
            }

            // Armazenar documentos anexados em memória (Session Storage)
            const documentos = [];
            $('#tabelaAnexos .documento').each(function() {
                const file = this.files[0];
                documentos.push(file);
            });
            sessionStorage.setItem('documentos_anexados', JSON.stringify(documentos));

            // Enviar os dados do formulário para o servidor
            enviarFormulario();
        });

        // Função para enviar o formulário
        function enviarFormulario() {
            // Aqui você pode obter os documentos anexados da sessionStorage e enviá-los para o servidor
            const documentos = JSON.parse(sessionStorage.getItem('documentos_anexados'));
            console.log('Documentos anexados:', documentos); 

            // Enviar os dados como JSON para o console do navegador
            console.log(JSON.stringify(formData));

        }
        return formData;
    });
