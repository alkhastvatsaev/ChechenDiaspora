#!/bin/zsh
# Déplacer le terminal dans le dossier actuel
cd "$(dirname "$0")"

clear
echo "==========================================="
echo "   🌍 ЧЕЧЕНСКАЯ ДИАСПОРА (PWA) 🌍   "
echo "        Lancement en local...         "
echo "==========================================="
echo ""

# Vérification des dépendances si nécessaire
if [ ! -d "node_modules" ]; then
  echo "📦 Installation des dépendances (première fois)..."
  npm install
fi

# Lancer le serveur de développement
echo "🚀 Démarrage du serveur Vite..."
npm run dev
