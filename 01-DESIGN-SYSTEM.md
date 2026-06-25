# Presentei — Design System (01)

> Fonte da verdade visual. Web (Tailwind) e Mobile (NativeWind) devem consumir os MESMOS tokens, definidos uma única vez em `packages/shared/src/constants/theme.ts`.

---

## 1. Paleta de Cores

| Nome do token | Hex | Uso |
|---|---|---|
| `brand.pink` | `#FF4D8D` | Início do gradiente principal, CTAs, destaques |
| `brand.orange` | `#FF8A00` | Fim do gradiente principal, alertas suaves, badges |
| `brand.purpleMid` | `#5A1E6C` | Acentos, hover states, fundo de cards secundários |
| `brand.purpleDark` | `#2D1140` | Fundo de seções escuras (ex: cards "Kits em promoção", header de "Próximos aniversários") |
| `brand.offWhite` | `#F9F7FB` | Fundo geral das telas |

### Gradiente principal
```css
background: linear-gradient(135deg, #FF4D8D 0%, #FF8A00 100%);
```
Usado em: logo, ícone do app, botões primários, ícone de notificação ativa.

### Texto
- Texto principal sobre fundo claro: `brand.purpleDark` (#2D1140)
- Texto sobre fundo escuro/gradiente: branco puro `#FFFFFF`
- Texto secundário/legendas: cinza neutro médio (`#6B7280` — Tailwind `gray-500`, não está no moodboard mas é necessário para hierarquia e não está nas cores de marca)

---

## 2. Tipografia

O moodboard mostra um sans-serif bold/geométrico para títulos ("Presentei" no logo, "Olá, João! 👋"). Recomendação:
- **Família:** Inter ou Poppins (gratuitas, boa cobertura de português, geométricas como no logo)
- Títulos de tela (`Olá, João!`): `font-bold`, ~24-28px
- Nome de seção (`Próximos aniversários`, `Categorias`): `font-semibold`, ~16-18px
- Corpo: `font-normal`, 14-15px
- Preços (`25.000 Kz`): `font-semibold`, cor `brand.purpleDark`

---

## 3. Logo & Ícone

- **Logo completo:** ícone de presente (caixa com laço, gradiente rosa→laranja, coração branco recortado na frente) + wordmark "Presentei" em roxo escuro (#2D1140) + acento de coraçãozinho rosa no "i" final + tagline em rosa abaixo.
- **Ícone do app:** versão quadrada do gift-box, disponível em 3 variantes mostradas no moodboard:
  1. Fundo gradiente cheio (rosa→laranja), ícone branco — uso principal (app icon)
  2. Fundo branco, ícone com gradiente — uso em superfícies claras
  3. Fundo roxo escuro, ícone com gradiente — uso em superfícies escuras / dark mode
- Manter sempre as proporções e o coração recortado vazado — é o elemento de reconhecimento da marca.

---

## 4. Componentes-chave (extraídos do mockup do app)

### 4.1 Header
- Ícone de menu (hambúrguer) à esquerda
- Logo "Presentei" centralizado, roxo escuro
- Ícone de notificação à direita, com badge vermelho quando há pendências

### 4.2 Saudação
- `Olá, {primeiroNome}! 👋` — bold, grande
- Subtexto motivacional abaixo, ex: "Nunca mais esqueça alguém especial." — tom afetivo, nunca genérico/corporativo

### 4.3 Card "Próximos aniversários"
- Fundo roxo escuro (`brand.purpleDark`), cantos arredondados, texto branco
- Header do card: título à esquerda, link "Ver todos" em rosa à direita
- Cada item: avatar circular (foto), nome em bold, idade + data abaixo em texto menor, à direita "Falta" + número de dias em destaque rosa/branco
- Lista com até 2-3 itens visíveis, scroll ou "ver todos" para o resto

### 4.4 Seção "Sugestões para {nome}"
- Título + "Ver mais" em rosa à direita (mesmo padrão do card de aniversários)
- Cards de produto em carrossel horizontal: imagem (proporção ~1:1), nome do produto, preço em Kz formatado (`25.000 Kz`)
- Cantos arredondados nas imagens, sombra suave

### 4.5 Banner "Kits em promoção"
- Fundo roxo escuro com leve textura/gradiente, full-width
- Título bold branco + subtítulo + botão CTA rosa sólido ("Ver kits")
- Imagem de produto (ex: caixa de presente com laço) ancorada à direita, sangrando levemente para fora do card

### 4.6 Categorias
- Grid horizontal de ícones circulares com fundo claro, ícone em roxo/rosa
- Categorias do moodboard: Kits, Experiências, Tecnologia, Beleza, "Ver todas" (com ícone de "...")
- Label abaixo de cada ícone, texto pequeno centralizado

### 4.7 Tab Bar (mobile) / Sidebar (web)
- 5 itens: Início, Calendário, Presentes, Pedidos, Perfil
- Item ativo: ícone + label em `brand.pink`, ícone preenchido
- Itens inativos: cinza neutro, ícone outline

---

## 5. Princípios de Identidade ("O que torna a Presentei única" — do moodboard)

Estes 5 pilares devem se refletir em features e copy, não só em ícones decorativos:
1. **Calendário Inteligente** — lembra datas automaticamente, com antecedência configurável
2. **Presentes e Kits Exclusivos** — curadoria, não apenas marketplace genérico
3. **Entrega Rápida e Programada** — agendamento é parte do valor central
4. **Cartões Digitais Personalizados** — toque pessoal mesmo em compra rápida
5. **Planos e Subscrições** — modelo de receita recorrente, não só transacional

---

## 6. Tom de Voz (copy)

- Sempre em português de Angola, caloroso e direto
- Frases curtas, pessoais ("Nunca mais esqueça alguém especial.")
- Evitar jargão corporativo/SaaS — este não é um app B2B
- CTAs no imperativo afetivo: "Surpreenda com amor", "Ver kits"
- Tagline da marca usada com moderação, não repetida em toda tela: **"Lembra, Escolhe e Surpreende."**

---

## 7. Tokens para implementação (`packages/shared/src/constants/theme.ts`)

```typescript
export const colors = {
  brand: {
    pink: '#FF4D8D',
    orange: '#FF8A00',
    purpleMid: '#5A1E6C',
    purpleDark: '#2D1140',
    offWhite: '#F9F7FB',
  },
  text: {
    primary: '#2D1140',
    onDark: '#FFFFFF',
    secondary: '#6B7280',
  },
} as const;

export const gradients = {
  primary: ['#FF4D8D', '#FF8A00'], // usar com expo-linear-gradient (mobile) ou CSS linear-gradient (web)
} as const;
```

Web (Tailwind config) e Mobile (NativeWind config) devem importar este arquivo e gerar suas respectivas configs a partir dele — **nunca redefinir cores soltas em cada app**.
