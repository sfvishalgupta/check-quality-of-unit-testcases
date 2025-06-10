pwd=$(pwd)
rm -rf cd ${pwd}/OpenRouterAICore
cd ${pwd} && git clone --depth=1 https://github.com/sfvishalgupta/OpenRouterAICore.git ./OpenRouterAICore 
cd ${pwd}/OpenRouterAICore && npm install
cd ${pwd} && rm -rf node_modules package-lock.json && npm install
cd ${pwd} && npm i