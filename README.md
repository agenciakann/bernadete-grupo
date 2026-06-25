# Bernadete Leite Costura — LP Molde Calça Jogger

Funil de captação de leads com 2 páginas estáticas:

- **`index.html`** — LP de cadastro (e-mail + WhatsApp).
- **`obrigado.html`** — página de obrigado (TYP) com botão para o grupo do WhatsApp.

Stack: **HTML + CSS + JavaScript vanilla** (sem framework, sem build) — leve,
responsivo e otimizado para mobile. Veja [`PROJETO.spec`](PROJETO.spec) e
[`PROJETO.prd`](PROJETO.prd) para detalhes.

---

## ▶️ Rodar localmente
```bash
python3 -m http.server 8000
# abra http://localhost:8000
```

## ⚙️ Configuração (tudo em `assets/js/config.js`)

### 1. Google Sheets (salvar os leads)
1. Crie uma planilha no Google Sheets.
2. **Extensões → Apps Script**, apague o conteúdo e cole
   [`google-apps-script/Code.gs`](google-apps-script/Code.gs).
3. **Implantar → Nova implantação → App da Web**
   - *Executar como:* **Eu**
   - *Quem pode acessar:* **Qualquer pessoa**
4. Copie a URL que termina em `/exec`.
5. Cole em `config.js`:
   ```js
   GOOGLE_SHEETS_ENDPOINT: "https://script.google.com/macros/s/SEU_ID/exec",
   ```
   > Enquanto estiver vazio, o formulário apenas redireciona (sem gravar).

### 2. Grupo do WhatsApp
Troque o placeholder em `config.js` pelo link real do grupo:
```js
WHATSAPP_GROUP_URL: "https://chat.whatsapp.com/SEU_CODIGO",
```

---

## 🚀 Deploy
É um site estático: suba a pasta inteira em qualquer host
(Netlify, Vercel, Cloudflare Pages, GitHub Pages). Não há etapa de build.

## ✅ Checklist pré-publicação
- [ ] `GOOGLE_SHEETS_ENDPOINT` preenchido e testado (lead caindo na planilha).
- [ ] `WHATSAPP_GROUP_URL` com o link real do grupo.
- [ ] (Opcional) Pixel/Tag de conversão nas duas páginas.

## 🗂️ Estrutura
```
index.html · obrigado.html
assets/css/styles.css
assets/js/config.js · assets/js/main.js
assets/img/logo-bernadete.webp · assets/img/calca-jogger.png
google-apps-script/Code.gs
```
