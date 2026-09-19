/* ============================================================
   RELATIONSHIP RESET — landing page
   Interações: link de checkout, FAQ, CTA fixo (mobile),
   aviso visual para imagens ainda não adicionadas.
   ============================================================ */

/* --------------------------------------------------------
   CONFIGURAÇÃO — troque pelo link real do seu checkout
   -------------------------------------------------------- */
const CHECKOUT_URL = "https://pay.hotmart.com/L107661291K";

document.addEventListener("DOMContentLoaded", () => {
  setupCheckoutLinks();
  setupFaq();
  setupStickyCta();
  setupImageFallbacks();
});

/* --------------------------------------------------------
   Botões de compra: todo elemento com [data-checkout]
   aponta para CHECKOUT_URL e dispara o evento do Meta Pixel.
   -------------------------------------------------------- */
function setupCheckoutLinks() {
  document.querySelectorAll("[data-checkout]").forEach(btn => {
    btn.setAttribute("href", CHECKOUT_URL);
    btn.setAttribute("rel", "noopener");

    btn.addEventListener("click", () => {
      if (typeof window.fbq === "function") {
        window.fbq("track", "InitiateCheckout");
      }
    });
  });
}

/* --------------------------------------------------------
   FAQ — acordeão acessível, um item aberto por vez
   -------------------------------------------------------- */
function setupFaq() {
  const items = document.querySelectorAll(".faq-item");

  items.forEach(item => {
    const button = item.querySelector(".faq-q");
    if (!button) return;

    button.addEventListener("click", () => {
      const willOpen = !item.classList.contains("open");

      items.forEach(other => {
        other.classList.remove("open");
        const otherBtn = other.querySelector(".faq-q");
        if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
      });

      if (willOpen) {
        item.classList.add("open");
        button.setAttribute("aria-expanded", "true");
      }
    });
  });
}

/* --------------------------------------------------------
   CTA fixo no mobile: aparece depois que o botão do hero sai
   da tela e some quando a oferta ou o CTA final estão visíveis.
   -------------------------------------------------------- */
function setupStickyCta() {
  const sticky = document.getElementById("sticky-cta");
  const hero = document.querySelector(".hero-actions");
  if (!sticky || !hero || !("IntersectionObserver" in window)) return;

  const blockers = [
    hero,
    document.getElementById("oferta"),
    document.querySelector(".final-cta")
  ].filter(Boolean);

  const visibleBlockers = new Set(blockers.filter(el => el === hero));

  const update = () => {
    const show = visibleBlockers.size === 0;
    sticky.classList.toggle("visible", show);
    sticky.setAttribute("aria-hidden", show ? "false" : "true");
    sticky.tabIndex = show ? 0 : -1;
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) visibleBlockers.add(entry.target);
      else visibleBlockers.delete(entry.target);
    });
    update();
  });

  blockers.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------
   Imagens: se o arquivo ainda não existe, o container .media
   ganha a classe "is-empty" e mostra a caixa pontilhada com o
   nome do arquivo esperado (definido em data-hint).
   -------------------------------------------------------- */
function setupImageFallbacks() {
  document.querySelectorAll(".media img").forEach(img => {
    const markEmpty = () => img.closest(".media")?.classList.add("is-empty");
    const markOk = () => img.closest(".media")?.classList.remove("is-empty");

    img.addEventListener("error", markEmpty);
    img.addEventListener("load", markOk);

    // Caso o erro tenha acontecido antes do script rodar
    if (img.complete && img.naturalWidth === 0) markEmpty();
  });
}
