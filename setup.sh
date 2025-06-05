pwd=$(pwd)
rm -rf cd ${pwd}/OpenRouterAIExample
cd ${pwd} && git clone https://github.com/sfvishalgupta/OpenRouterAIExample.git ./OpenRouterAIExample 
cd ${pwd}/OpenRouterAIExample && npm install
cd ${pwd} && rm -rf node_modules package-lock.json && npm install
cd ${pwd} && npm i