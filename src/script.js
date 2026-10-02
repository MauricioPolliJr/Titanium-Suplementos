let produtos = [];

async function carregarProdutos() {
  const resposta = await fetch("src/produtos.json");
  produtos = await resposta.json();
  mostrarProdutos(produtos);
}

function mostrarProdutos(lista) {
  let areaProdutos = document.getElementById("produtos");
  areaProdutos.innerHTML = "";

  lista.forEach(function (produto) {
    areaProdutos.innerHTML += `
        <div class="produto">
            <img src="${produto.imagem}">
            <h3>${produto.nome}</h3>
            <p>${produto.categoria}</p>
            <p>${produto.descricao}</p>
            <span class="preco">${produto.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
            <button onclick="adicionarAoCarrinho(${produto.id})">Comprar</button>
        </div>
        `;
  });
}

function pesquisar() {
  let texto = document.getElementById("pesquisa").value.toLowerCase();

  let resultado = produtos.filter(function (produto) {
    return produto.nome.toLowerCase().includes(texto) ||
      produto.descricao.toLowerCase().includes(texto) ||
      produto.categoria.toLowerCase().includes(texto);
  });

  mostrarProdutos(resultado);
}

document.getElementById("pesquisa").addEventListener("keyup", pesquisar);

carregarProdutos();

function alternarCarrinho() {
  document.getElementById("painel-carrinho").classList.toggle("escondido");
}

let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

function adicionarAoCarrinho(id) {
  let produto = produtos.find(function (p) {
    return p.id === id;
  });

  let item = carrinho.find(function (i) {
    return i.id === id;
  });

  if (item) {
    item.quantidade++;
  } else {
    carrinho.push({ id: produto.id, nome: produto.nome, preco: produto.preco, quantidade: 1 });
  }

  salvarCarrinho();
  mostrarCarrinho();
}

function removerDoCarrinho(id) {
  carrinho = carrinho.filter(function (i) {
    return i.id !== id;
  });
  salvarCarrinho();
  mostrarCarrinho();
}

function salvarCarrinho() {
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

function mostrarCarrinho() {
  let area = document.getElementById("carrinho");
  let total = 0;
  area.innerHTML = "";

  carrinho.forEach(function (item) {
    total += item.preco * item.quantidade;
    area.innerHTML += `
        <div class="item-carrinho">
            <span>${item.nome} x${item.quantidade}</span>
            <span>${(item.preco * item.quantidade).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
            <button onclick="removerDoCarrinho(${item.id})">Remover</button>
        </div>
        `;
  });

  document.getElementById("total").textContent =
    total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  let quantidadeTotal = carrinho.reduce(function (soma, item) {
    return soma + item.quantidade;
  }, 0);

  document.getElementById("contador").textContent = quantidadeTotal;
}

mostrarCarrinho();

