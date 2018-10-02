cd dist

git init
git add -A
git commit -m "deploy"

git remote add origin https://github.com/avaver/avaver.github.io.git
git push -f -u origin master

cd ..