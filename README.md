# 💪 Cardio Tracker - App de Rastreamento de Cardio com Plano de Barriga

Um aplicativo mobile desenvolvido com **React Native (Expo)** para rastrear seus treinos de cardio diários e seguir um plano completo de definição abdominal.

## 🎯 Funcionalidades

✅ **Rastreamento Diário de Cardio**
- Registre seus treinos de cardio
- Visualize dias que treinou vs. dias que falhei
- Acompanhe sua sequência (streak) de dias consecutivos

✅ **Plano Completo de Barriga**
- Exercícios estruturados para cada dia da semana
- Rastreio de progresso semanal
- Dicas e orientações práticas

✅ **Histórico e Calendário**
- Visualize todos os seus treinos em um calendário interativo
- Estatísticas por mês
- Lista completa de treinos realizados

✅ **Estatísticas Avançadas**
- Sequência atual (streak)
- Treinos esta semana
- Treinos este mês
- Total geral de treinos
- Gráficos de progresso

✅ **Relógios Mundiais**
- Relógio digital em tempo real
- 12 fusos horários diferentes
- Adicione/remova fusos conforme necessário

✅ **Armazenamento Local**
- Todos os dados são salvos localmente no seu celular
- Funciona sem internet
- Dados persistem entre sessões

## 🚀 Como Instalar

### Pré-requisitos
- Node.js (v14 ou superior)
- npm ou yarn

### Passos de Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/Helberts0uza/cardio-tracker.git
cd cardio-tracker
```

2. **Instale as dependências**
```bash
npm install
# ou
yarn install
```

3. **Inicie o app**
```bash
npm start
# ou
yarn start
```

### Rodando no seu Celular

**Android:**
```bash
npm run android
```

**iOS:**
```bash
npm run ios
```

**Web:**
```bash
npm run web
```

### Escanear QR Code

Depois de `npm start`, uma QR code aparecerá no terminal. Use o app **Expo Go** (disponível na Play Store e App Store) para escanear e visualizar o app em tempo real.

## 📱 Telas do App

### 1. Hoje
- Registre seu treino de cardio do dia
- Veja sua sequência atual
- Total de treinos
- Dica motivacional

### 2. Plano de Barriga
- Exercícios para cada dia da semana
- Progresso semanal
- Marque dias como completos
- Dicas importantes

### 3. Relógio
- Relógio digital principal
- 12 fusos horários disponíveis
- Adicione/remova conforme necessário
- Atualização em tempo real

### 4. Histórico
- Calendário interativo com seus treinos
- Lista de treinos do mês
- Estatísticas mensais
- Total geral de treinos

### 5. Estatísticas
- Sequência atual (dias seguidos)
- Treinos esta semana
- Treinos este mês
- Gráficos de progresso
- Dicas para melhorar

## 💾 Dados Armazenados

Todos os dados são armazenados localmente usando **AsyncStorage**:

```json
{
  "workouts": [
    {
      "date": "2024-01-15",
      "duration": 30,
      "type": "cardio",
      "timestamp": "2024-01-15T10:30:00Z"
    }
  ],
  "plano": {
    "dias": {
      "seg": { "exercicios": [...], "feito": false },
      "ter": { "exercicios": [...], "feito": true },
      ...
    }
  }
}
```

## 🎨 Design & UX

- **Interface limpa e intuitiva**
- **Cores motivacionais** (vermelho para energia)
- **Ícones claros** e fáceis de entender
- **Navegação por abas** para fácil acesso
- **Feedback visual** (animações, cores, ícones)

## 🛠️ Tech Stack

- **React Native** - Framework mobile
- **Expo** - Plataforma de desenvolvimento
- **AsyncStorage** - Armazenamento local
- **React Navigation** - Navegação
- **React Native Calendars** - Calendário interativo
- **Material Community Icons** - Ícones

## 📅 Plano de Barriga Semanal

**Segunda:** Abdominais, Cardio, Prancha  
**Terça:** Corrida, Abdominais, Flexões  
**Quarta:** Ciclismo, Abdominais, Piscina  
**Quinta:** Cardio HIIT, Abdominais  
**Sexta:** Corrida, Abdominais, Agachamentos  
**Sábado:** Caminhada Rápida, Abdominais  
**Domingo:** Descanso Ativo, Alongamento, Yoga  

## 💡 Dicas para Melhores Resultados

1. **Consistência é tudo** - Não pule nenhum dia
2. **Hidrate-se bem** - 2-3 litros de água por dia
3. **Alimentação** - Dieta equilibrada com proteína
4. **Sono** - 7-8 horas por noite
5. **Paciência** - Resultados aparecem em 4-6 semanas

## 🐛 Reportar Bugs

Se encontrar algum problema, crie uma issue no repositório:
https://github.com/Helberts0uza/cardio-tracker/issues

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se livre para fazer fork, fazer alterações e submeter pull requests.

## 📄 Licença

MIT License - veja o arquivo LICENSE para detalhes.

## 🏋️ Objetivos Futuros

- [ ] Integração com Apple Health e Google Fit
- [ ] Notificações push diárias
- [ ] Backup na nuvem
- [ ] Compartilhamento de progresso
- [ ] Múltiplos planos de treino
- [ ] Integração com redes sociais

## 📞 Contato

- GitHub: [@Helberts0uza](https://github.com/Helberts0uza)

---

**Feito com ❤️ para sua saúde e bem-estar!**

Comece hoje e transforme seu corpo em 12 semanas! 💪🔥
