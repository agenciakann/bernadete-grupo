/* =====================================================================
   Bernadete Leite Costura — comportamento das LPs
   - LP cadastro: máscara de telefone, envio ao Google Sheets, redirect.
   - TYP: aplica o link do grupo do WhatsApp no botão.
   ===================================================================== */
(function () {
  "use strict";

  var cfg = window.APP_CONFIG || {};

  /* ---- TYP: aplica o link do grupo do WhatsApp ---- */
  var waLink = document.getElementById("wa-link");
  if (waLink && cfg.WHATSAPP_GROUP_URL) {
    waLink.setAttribute("href", cfg.WHATSAPP_GROUP_URL);
  }

  /* ---- Botão "QUERO ME CADASTRAR" rola até o formulário ---- */
  var scrollBtn = document.getElementById("scroll-to-form");
  if (scrollBtn) {
    scrollBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
      var email = document.getElementById("email");
      if (email) setTimeout(function () { email.focus(); }, 400);
    });
  }

  /* ---- Máscara de telefone BR: (00) 00000-0000 ---- */
  var tel = document.getElementById("tel");
  if (tel) {
    tel.addEventListener("input", function () {
      var v = tel.value.replace(/\D/g, "").slice(0, 11);
      if (v.length > 6) {
        v = (v.length > 10)
          ? v.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, "($1) $2-$3")
          : v.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
      } else if (v.length > 2) {
        v = v.replace(/^(\d{2})(\d{0,5}).*/, "($1) $2");
      } else if (v.length > 0) {
        v = v.replace(/^(\d{0,2}).*/, "($1");
      }
      tel.value = v;
    });
  }

  /* ---- Envio do formulário ---- */
  var form = document.getElementById("lead-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var btn = form.querySelector('button[type="submit"]');
    var payload = {
      email: ((form.email && form.email.value) || "").trim(),
      tel: ((form.tel && form.tel.value) || "").trim(),
      origem: "LP Cadastro Molde Jogger",
      data_hora: new Date().toISOString()
    };

    try { localStorage.setItem("bl_lead", JSON.stringify(payload)); } catch (err) { /* noop */ }

    if (btn) { btn.disabled = true; btn.textContent = "Enviando..."; }

    var typ = cfg.TYP_URL || "obrigado.html";
    var endpoint = cfg.GOOGLE_SHEETS_ENDPOINT;
    var done = false;
    function redirect() { if (!done) { done = true; window.location.href = typ; } }

    // Sem endpoint configurado ainda: só redireciona.
    if (!endpoint) { redirect(); return; }

    // Garante o redirect mesmo se a rede falhar/demorar.
    setTimeout(redirect, cfg.REDIRECT_FALLBACK_MS || 1500);

    try {
      fetch(endpoint, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload)
      }).then(redirect)["catch"](redirect);
    } catch (err) {
      redirect();
    }
  });
})();
