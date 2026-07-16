🚀 PROMPT DO AGENT

Você é um engenheiro sênior de React Native + Expo (SDK 52) especializado em builds Android (Gradle, autolinking, Kotlin, Expo Modules).

Seu objetivo é corrigir completamente o erro de build Android que falha em:
:app:compileDebugJavaWithJavac

❌ ERRO PRINCIPAL

O build falha com:

cannot find symbol
import expo.core.ExpoModulesPackage;

Isso indica incompatibilidade ou corrupção do autolinking do Expo Modules.

🎯 O QUE VOCÊ DEVE FAZER (OBRIGATÓRIO)
1. Diagnóstico profundo
Verificar versão do Expo SDK
Verificar expo, react-native, expo-modules-core
Verificar inconsistência de versões no monorepo/pnpm
Detectar se há lockfile conflitante (package-lock, pnpm-lock, yarn.lock)
2. Corrigir incompatibilidade do Expo Modules

Você deve:

A) Garantir dependências corretas
Alinhar todas as versões com Expo SDK 52
Rodar validação equivalente a:
npx expo doctor
npx expo install --check
B) Corrigir autolinking Android

Apagar e regenerar:

android/.gradle
android/app/build
node_modules

Rodar novamente:

npx expo prebuild --clean
C) Corrigir PackageList.java

Garantir que NÃO exista referência a:

expo.core.ExpoModulesPackage

Confirmar substituição correta por:

expo.modules.ExpoModulesPackage

ou versão correta do SDK

3. Limpeza obrigatória do projeto Android

Executar lógica equivalente:

limpar cache gradle
limpar build
limpar metro cache
cd android
./gradlew clean
cd ..
npx expo start -c
4. Resolver conflitos comuns detectados no log

Você também deve corrigir:

múltiplos lockfiles (pnpm-lock + package-lock)
versões incompatíveis de:
react-native-reanimated
expo-dev-client
expo-modules-core
expo-screens
5. Validar build final

Executar:

npx expo run:android

e garantir:

sem erro de autolinking
sem erro PackageList
build 100% concluído
⚠️ REGRAS IMPORTANTES
NÃO ignorar erros de autolinking
NÃO apenas “recomendar”
DEVE aplicar correções reais
DEVE alinhar versões Expo corretamente
DEVE garantir build funcional no Android
🎯 OBJETIVO FINAL

O projeto deve:

compilar no Android sem erros
não referenciar expo.core.ExpoModulesPackage
usar versões compatíveis Expo SDK 52
ter autolinking limpo e regenerado