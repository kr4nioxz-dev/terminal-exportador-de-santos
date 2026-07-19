/* ==========================================================================
   IMPORTANTE
   NADA do que está aqui dentro funciona: nem o menu mobile, nem
   o efeito de rolagem no header, nem as animações de "aparecer" ao rolar,
   nem o formulário de contato.

   Tudo aqui dentro está dentro de uma IIFE: (() => { ... })();
   Isso é só uma forma de "empacotar" o código para que as variáveis
   declaradas aqui não vazem para o restante da página (boa prática,
   evita conflito de nomes caso adicione outros scripts no futuro).
   ========================================================================== */
(() => {
  /* ------------------------------------------------------------------------
     SELEÇÃO DOS ELEMENTOS QUE VAMOS CONTROLAR
     document.querySelector busca UM elemento que combine com o seletor CSS
     indicado. Os atributos "data-algo" no HTML (ex: data-header) servem
     exatamente para isso: são "ganchos" que o JS usa para achar o elemento
     certo, sem depender de classes que também controlam o visual.
     ------------------------------------------------------------------------ */
  const header = document.querySelector('[data-header]');          // o <header> lá no topo
  const menuToggle = document.querySelector('[data-menu-toggle]'); // o botão "hamburguer" do menu mobile
  const mobileMenu = document.querySelector('[data-mobile-menu]'); // o painel de menu que abre no mobile
  const backToTop = document.querySelector('[data-back-to-top]');  // o botão flutuante "voltar ao topo"
  // querySelectorAll busca TODOS os elementos que combinam, e devolve uma lista.
  const menuLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

  /* ------------------------------------------------------------------------
     MENU MOBILE (abrir/fechar)
     ------------------------------------------------------------------------ */
  const closeMenu = () => {
    if (!menuToggle || !mobileMenu) return; // segurança: se algum dos dois não existir no HTML, não faz nada
    menuToggle.setAttribute('aria-expanded', 'false'); // avisa leitores de tela que o menu fechou
    mobileMenu.hidden = true;                          // esconde o painel do menu
    document.body.classList.remove('menu-open');       // libera a rolagem do fundo da página
  };

  // Ao clicar no botão do menu, alterna entre aberto/fechado.
  menuToggle?.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    mobileMenu.hidden = isOpen;
    document.body.classList.toggle('menu-open', !isOpen); // trava o scroll do fundo enquanto o menu está aberto
  });

  // Clicar em qualquer link dentro do menu mobile fecha o menu automaticamente
  // (comportamento esperado: você clica em "Contato" e o menu some).
  menuLinks.forEach((link) => link.addEventListener('click', closeMenu));

  // Pressionar a tecla Esc também fecha o menu, em qualquer lugar da página.
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  // Clicar em qualquer lugar FORA do menu (e fora do botão que o abre) fecha o menu.
  document.addEventListener('click', (event) => {
    if (!mobileMenu || mobileMenu.hidden || mobileMenu.contains(event.target) || menuToggle?.contains(event.target)) return;
    closeMenu();
  });

  /* ------------------------------------------------------------------------
     COMPORTAMENTO AO ROLAR A PÁGINA (SCROLL)
     - O header ganha um fundo sólido depois que você rola um pouco (classe
     "is-scrolled", definida no styles.css).
     - O botão "voltar ao topo" só aparece depois de rolar bastante.
     ------------------------------------------------------------------------ */
  const onScroll = () => {
    header?.classList.toggle('is-scrolled', window.scrollY > 18);    // > 18px de rolagem já ativa o fundo do header
    backToTop?.classList.toggle('is-visible', window.scrollY > 700); // > 700px de rolagem mostra o botão flutuante
  };
  onScroll(); // roda uma vez assim que a página carrega, para já começar no estado correto
  // { passive: true } é uma otimização de performance: avisa o navegador que
  // esse listener não vai chamar preventDefault(), então ele pode rolar a
  // página sem esperar o JS terminar de processar.
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ------------------------------------------------------------------------
     ANIMAÇÃO "REVEAL" - elementos aparecem suavemente ao entrar na tela
     No CSS, todo elemento com [data-reveal] começa com opacity: 0.
     Aqui usamos um IntersectionObserver, que é uma API do navegador feita
     para "observar" elementos e avisar quando eles entram ou saem da área
     visível da tela — sem precisar calcular posição de scroll manualmente.
     ------------------------------------------------------------------------ */
  const revealElements = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) { // verifica se o navegador suporta essa API
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { // true quando o elemento ficou visível na tela
          entry.target.classList.add('is-revealed'); // dispara a animação (definida no CSS)
          currentObserver.unobserve(entry.target);   // para de observar esse elemento (já revelou, não precisa mais)
        }
      });
    }, { threshold: 0.12 }); // dispara quando 12% do elemento já estiver visível
    revealElements.forEach((element) => observer.observe(element));
  } else {
    // Fallback para navegadores muito antigos sem IntersectionObserver:
    // simplesmente mostra tudo de uma vez, sem animação.
    revealElements.forEach((element) => element.classList.add('is-revealed'));
  }

  /* ------------------------------------------------------------------------
     FORMULÁRIO DE CONTATO (demonstração local, sem backend)
     Este formulário NÃO envia e-mail de verdade — ele só simula o envio no
     navegador. Isso é intencional nesta versão: para receber mensagens de
     verdade, você precisaria de um serviço de backend/e-mail (ex: um
     endpoint próprio, Formspree, EmailJS etc.), o que é um passo futuro.
     ------------------------------------------------------------------------ */
  const form = document.querySelector('[data-contact-form]');
  const formStatus = document.querySelector('[data-form-status]');
  form?.addEventListener('submit', (event) => {
    event.preventDefault(); // impede o navegador de recarregar a página (comportamento padrão de todo <form>)
    const name = new FormData(form).get('nome'); // pega o valor digitado no campo "nome"
    if (formStatus) formStatus.textContent = `Obrigado${name ? `, ${name}` : ''}. Sua mensagem foi recebida nesta demonstração.`;
    form.reset(); // limpa todos os campos do formulário
  });

  /* ------------------------------------------------------------------------
     ANO ATUAL NO RODAPÉ
     Em vez de escrever "2026" fixo no HTML (que ficaria desatualizado ano
     que vem), o JS pega o ano atual do sistema e escreve automaticamente
     dentro do <span data-current-year></span> que está no rodapé.
     ------------------------------------------------------------------------ */
  const year = document.querySelector('[data-current-year]');
  if (year) year.textContent = String(new Date().getFullYear());
})();
