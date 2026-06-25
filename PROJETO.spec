# SPEC — Especificação Técnica
**Projeto:** LP Molde Calça Jogger — Bernadete Leite Costura
**Origem do design:** Claude Design (`1-Cadastro-Molde-Jogger.dc.html` + `2-Obrigada-Molde-Jogger.dc.html`)

## 1. Stack
- **HTML5 + CSS3 + JavaScript (ES5/ES6 vanilla)** — sem framework, sem
  bundler, sem etapa de build.
- **Justificativa:** o projeto são 2 LPs simples cujo objetivo é peso
  mínimo, carregamento instantâneo no mobile e hospedagem trivial. Qualquer
  framework (React/Vue/Astro) adicionaria runtime, build e complexidade sem
  benefício real aqui.
- **Hospedagem:** qualquer host estático — Netlify, Vercel, Cloudflare
  Pages, GitHub Pages, ou até um bucket/CDN. Basta subir a pasta.

## 2. Estrutura de arquivos
```
bernadete-grupo/
├── index.html              # LP de cadastro (formulário)
├── obrigado.html           # TYP (redireciona ao grupo do WhatsApp)
├── assets/
│   ├── css/styles.css      # estilos compartilhados (mobile-first)
│   ├── js/config.js        # CONFIG: endpoint Sheets, TYP, link WhatsApp
│   ├── js/main.js          # máscara, envio do form, redirect, link TYP
│   └── img/
│       ├── logo-bernadete.webp
│       └── calca-jogger.png
├── google-apps-script/Code.gs   # backend serverless (Google Sheets)
├── PROJETO.prd
├── PROJETO.spec
└── README.md
```

## 3. Design tokens (extraídos do Claude Design)
- Fundo: `#FBF1EA` · Card: `#FFFFFF` · Borda card: `#F4E2EC`
- Rosa (marca/CTA): `#DE1B7E` (hover `#C6156E`) · Rosa claro: `#FCE8F2`
- Teal (destaques): `#1F9FB0` · Verde WhatsApp: `#25A24A` (hover `#1E8C3E`)
- Texto: `#3B2A33` / corpo `#6B5560` / suave `#9A8791`
- Tipografia: **Baloo 2** (títulos/botões) + **Nunito** (corpo) via Google Fonts.

> A conversão do formato Claude Design (`x-dc` + `support.js`) para HTML
> estático eliminou o runtime proprietário: `style-hover`/`style-focus`
> viraram regras CSS `:hover`/`:focus`, e os bindings `{{ onSubmit }}` /
> `{{ scrollToForm }}` viraram listeners em `main.js`.

## 4. Integração com Google Sheets
- **Backend:** Google Apps Script Web App (`doPost`) em `Code.gs`.
- **Contrato:** o front envia `POST` com corpo JSON
  `{ email, tel, origem, data_hora }`.
- **CORS:** usa `fetch(..., { mode: "no-cors" })`. A resposta é opaca (não
  lida), por isso o redirect é disparado no `.then()`/`.catch()` e também
  por um timeout de segurança (`REDIRECT_FALLBACK_MS`). O Apps Script grava
  a linha independentemente.
- **Planilha:** aba `Leads` com colunas
  `Data/Hora | E-mail | WhatsApp | Origem` (cabeçalho criado on-demand).
- **Backup local:** o lead também é salvo em `localStorage` (`bl_lead`).

## 5. Pontos de configuração (`assets/js/config.js`)
| Chave | Descrição |
|-------|-----------|
| `GOOGLE_SHEETS_ENDPOINT` | URL `/exec` do Web App. Vazio = só redireciona. |
| `TYP_URL` | Destino do redirect pós-cadastro. |
| `WHATSAPP_GROUP_URL` | Link do grupo (placeholder até a configuração). |
| `REDIRECT_FALLBACK_MS` | Tempo-limite até forçar o redirect. |

## 6. Comportamento de runtime
- **index.html:** máscara de telefone em tempo real, validação nativa
  (`required`/`type`), submit → salva lead → redirect para a TYP.
- **obrigado.html:** `main.js` injeta `WHATSAPP_GROUP_URL` no botão verde
  (`#wa-link`); a página é `noindex`.

## 7. Como rodar localmente
```bash
# servidor estático simples (qualquer um serve)
python3 -m http.server 8000
# abrir http://localhost:8000
```

## 8. Acessibilidade & performance
- `<label>` associado a cada input; `inputmode`/`autocomplete` corretos.
- `prefers-reduced-motion` desliga as animações de pulso.
- Imagens com `width`/`height` para evitar layout shift; fontes com
  `display=swap` e `preconnect`.
