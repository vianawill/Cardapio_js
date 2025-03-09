// Referências do HTML
const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressIput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")
const cartWarn = document.getElementById("cart-warn")


// Lista de pedidos
let cart = [];

// Abrir o modal do carrinho 
cartBtn.addEventListener("click", function() {

    // Ao clicar no cartBtn, o modal que antes estava oculto (Hidden) recebe a propriedade (Flex) e aparece na tela
    cartModal.style.display = "flex"

    // Chama a função update, para que cada vez que o carrinho for aberto, ele atualize os pedidos
    updateCartModal();

});

// Fechar o modal quando clicar fora 
cartModal.addEventListener("click", function(event) {

    // Se o click for fora do cartModal, o modal e fechado
    if (event.target === cartModal){
        cartModal.style.display = "none"
    }
});

// Fechar o modal pelo botao "Fechar"
closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none"
});

// Adicionar item no carrinho
menu.addEventListener("click", function(event){

    // Faz com que o "click" tenha uma ação ao clicar no ícone ou botão
    let parentButton = event.target.closest(".add-to-cart-btn")

    // Se for clicado, adiciona também os items: data-name e data-price
    if (parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))

        // Chamando função adicionar ao carrinho
        addToCart(name,price)
    }
});

// Função para adicionar no carrinho
function addToCart(name, price) {

    // Verificação contra itens duplicados 

    // Verifica se dentro da lista exite algum item com o nome igual
    const existingItem = cart.find(item => item.name === name)

    // Se exitir, soma +1 em quantity
    if(existingItem){

        existingItem.quantity += 1;
        
    // Se nao, continua com o próximo item e suas propriedades 
    }else{

        cart.push({
            name,
            price,
            quantity: 1,
        })
    }

    // Chamando a função update
    updateCartModal();

    // Usado para retirar os avisos de WARNING
    cartWarn.classList.add("hidden");
    addressWarn.classList.add("hidden")
    addressIput.classList.remove("border-red-500")

    
};

// Função para atualizar o carrinho
function updateCartModal(){

    // O HTML dentro de cartItemsContainer começa vazio 
    cartItemsContainer.innerHTML = "";
    let total = 0;

    // Looping que percorre a lista e monta os itens dentro do modal
    cart.forEach(item => {

        // Cria-se um novo HTML para cartItemsContainer
        const cartItemElement = document.createElement("div");

        // Estilização do novo HTML 
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        // Novo HTML para cartItemsContainer
        cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <p class="font-medium">${item.name}</p>
                <p>Qtd: ${item.quantity}</p>
                <p class="font-medium mt-2">R$ ${(item.price * item.quantity).toFixed(2)}</p>
            </div>

                <button class=" remove-from-cart-btn text-red-500 font-semibold px-4 py-1 rounded" data-name="${item.name}">
                    Remover
                </button>
            
        </div>
    `

    // Variável de soma para o preço total do carrinho
    total += item.price * item.quantity;

    // cartItemsContainer recebe o conteúdo de cartItemElement
    cartItemsContainer.appendChild(cartItemElement)

    })

    // Formatação do valor para moeda R$
    cartTotal.textContent = total.toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL"
    });

    // Contator de itens dentro do carrinho no footer "(0)"
    cartCounter.innerText = cart.length;

}

// Remover item do carrinho
cartItemsContainer.addEventListener("click", function(event){

    // Se o item clicado for da classe "remove-from-cart-btn", esse evento pega o item selecionado pelo nome "data-name"
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")

        // Chamando a função removeItemCart
        removeItemCart(name);
    }
})

// Função para remover item do carrinho
function removeItemCart(name){

    // Procura os items dentro do index pelo nome
    const index = cart.findIndex(item => item.name === name);

    // Verificação se o item foi encontado

    // Se o item for encontrado, ele entra na variável index
    if(index !== -1){
        const item = cart[index];

        // Se a quatidade de item for maior que 1, a quantidade e subtraída e o modal e atualizado com a funçâo update
        if(item.quantity > 1){
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        // Remove o item que está no index com o .splice e atualiza chamando o update 
        cart.splice(index, 1); 
        updateCartModal();
    }
}

// Endereço do cliente
addressIput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    // Verificação de input preenchido

    // Se o input for preenchido, a função que indica o input vazio e desativada. Assim a borda vermelha e removida e o hidden esconde o aviso novamente
    if(inputValue !== ""){
        addressIput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
})

// Finalizar pedido
checkoutBtn.addEventListener("click", function(){

    // Verificação de restaurante aberto
    const isOpen = checkRestaurantOpen();

    // Se a condição for diferente de aberto (isOpen), um alerta e emitido e a próxima parte do código não entra em acao
    if (!isOpen){
        
        // Utiliza o Toastify para o alert
        Toastify({
            text: "Ops, o restaurante esta fechado!",
            duration: 3000,
            destination: "https://github.com/apvarun/toastify-js",
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            }
            }).showToast();    

        return;
    }
    
    // Se o carrinho estiver vazio, a próxima parte do código não entra em ação
    if (cart.length === 0){
        cartWarn.classList. remove("hidden")
        return;
    }

    // Se não houver um valor no input, o hidden que esconde o addressWarn e removido e é adicionado uma borda vermelha ao input
    if (addressIput.value === ""){
        addressWarn.classList.remove("hidden")
        addressIput.classList.add("border-red-500")
        return;
    }

    // Envio do pedido pela API

    // Variável que guarda a soma o total geral começando com o valor 0
    let totalGeral = 0;

    // Mapeia os itens da lista
    const cartItems = cart.map((item) => {

        // Soma dos itens
        totalGeral += item.price * item.quantity;

        // Formatação de como vamos receber o item
        return(
        `
        ${item.name}
        Quantidade: (${item.quantity})
        Preço: R$ ${item.price.toFixed(2)}
        | `)

    // Join junta a foramtação do array e transforma em uma string    
    }).join("")

    // Gera a mensagem codificada pelo "encodeURIComponent"
    const message = encodeURIComponent(cartItems + `\nTotal: R$ ${totalGeral.toFixed(2)} |`) 

    // Define o caminho (telefone) para onde a mensagem sera enviada
    const phone = "3788448309"

    // Denomina o caminho da API, com os valores que serão enviados na mensagem
    window.open (`https://wa.me/${phone}?text=${message} Endereco: ${addressIput.value}`, "_blank")

    // Garante que ao finalizar o pedido a lista esvazie e atualize o modal
    cart = [];
    updateCartModal();
})

// Verificação de horario e manipulação 

// Função que verifica se o clinte está acessando após as 18:00 e antes das 22:00 horas
function checkRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 13 && hora < 22; // true 
}

// Verificação que muda a cor do span
const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

// Se estiver aberto, e removido a cor vermelha e adicionado a cor verde
if (isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");

// Se não, é removido a cor verde e adicionado a cor vermelha     
} else{
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500");
}