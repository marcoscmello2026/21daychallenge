/* ============================================================
   RELATIONSHIP RESET — página de vendas
   Interações: FAQ (acordeão), CTA fixo ao rolar, link de checkout.
   ============================================================ */

/* --------------------------------------------------------
   CONFIGURAÇÃO — troque pelo link real do seu checkout
   -------------------------------------------------------- */
const CHECKOUT_URL = "https://pay.hotmart.com/L107661291K"; // ex: "https://google.com.br"

document.addEventListener("DOMContentLoaded", () => {
  setupCheckoutLinks();
  setupFaqAccordion();
  setupStickyCta();
});

/* --------------------------------------------------------
   Botões de compra: apontam para CHECKOUT_URL
   -------------------------------------------------------- */
function setupCheckoutLinks() {
  const buyButtons = document.querySelectorAll("#cta-comprar, .sticky-cta");
  buyButtons.forEach(btn => {
    btn.setAttribute("href", CHECKOUT_URL);
  });
}

/* --------------------------------------------------------
   FAQ — acordeão simples, um item aberto por vez
   -------------------------------------------------------- */
function setupFaqAccordion() {
  const items = document.querySelectorAll(".faq-item");

  items.forEach(item => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      items.forEach(other => {
        other.classList.remove("open");
        other.querySelector(".faq-answer").style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add("open");
        answer.style.maxHeight = answer.scrollHeight + 24 + "px";
      }
    });
  });
}

/* --------------------------------------------------------
   CTA fixo no mobile: aparece depois que o usuário
   rola para além da seção hero.
   -------------------------------------------------------- */
function setupStickyCta() {
  const stickyCta = document.getElementById("sticky-cta");
  const offerSection = document.getElementById("oferta");
  if (!stickyCta) return;

  const showAfter = window.innerHeight * 0.9;

  const onScroll = () => {
    const scrollY = window.scrollY || window.pageYOffset;
    const offerTop = offerSection ? offerSection.offsetTop : Infinity;
    const offerBottom = offerSection ? offerTop + offerSection.offsetHeight : Infinity;
    const nearOffer = scrollY + window.innerHeight > offerTop && scrollY < offerBottom;

    if (scrollY > showAfter && !nearOffer) {
      stickyCta.classList.add("visible");
    } else {
      stickyCta.classList.remove("visible");
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}
