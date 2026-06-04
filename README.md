<h1 align="center"> 📊 NexusQA </h1>

<p align="center">
  <img src="https://img.shields.io/badge/status-em%20desenvolvimento-orange" alt="Status">
  <img src="https://img.shields.io/badge/versão-v0.1.0-blue" alt="Versão">
  <img src="https://img.shields.io/badge/licença-MIT-green" alt="Licença">
</p>

<p align="center">
  <strong>Automatização e padronização de relatórios de QA: do formulário técnico ao report visualmente perfeito em um clique.</strong>
</p>

---

## 💡 O Problema vs. A Solução

* **O Problema:** Profissionais de QA gastam tempo precioso formatando documentos, organizando prints e estruturando logs manualmente. Relatórios sem padrão geram ruído, atrasam o entendimento do time de desenvolvimento e dificultam a correção de falhas.
* **A Solução:** O **NexusQA** elimina o trabalho manual de layout. Através de um formulário inteligente e dinâmico, você apenas insere os dados técnicos essenciais. O sistema processa esses inputs e gera automaticamente um relatório padronizado, limpo, de altíssimo nível visual e pronto para o consumo dos desenvolvedores.

## 🔄 Funcionalidades
- Criação e edição de histórias de teste com campos estruturados
- Passos de execução numerados e editáveis
- Upload de evidências por imagem (PNG, JPG, GIF, WEBP)
- Status por história: Pending, Pass, Fail, Blocked
- Prioridade: Low, Medium, High
- Dashboard com contadores por status
- Exportação em PDF — história individual ou todas de uma vez
- Persistência local via `localStorage` (sem backend)

👾Dependências externas
| Biblioteca | Versão | Uso |
|---|---|---|
| [jsPDF](https://github.com/parallax/jsPDF) | 2.5.1 | Geração do arquivo PDF |
| [html2canvas](https://html2canvas.hertzen.com) | 1.4.1 | Renderização do HTML para canvas antes do PDF |
| [Inter](https://fonts.google.com/specimen/Inter) | — | Fonte principal da UI |
| [Roboto Mono](https://fonts.google.com/specimen/Roboto+Mono) | — | Fonte monoespaçada para IDs, índices e código |
