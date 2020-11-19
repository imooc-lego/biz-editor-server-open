#!/bin/bash

# 执行时需传入两个参数：参数1 - github 密码，参数2 - tag ，如 `sh bin/deploy.sh v1.0.1 xxx`
# shell 代码中使用 $1 $2 即可依次获取参数

teamPath="/home/work/lego-team" # team 目录
repoPath="/home/work/lego-team/biz-editor-server" # 项目目录，要和 repo 同名！！！
repoGitUrl="https://wangfupeng1988:$1@github.com/imooc-lego/biz-editor-server.git"

if [ ! -d "$teamPath" ]; then
    # 如果 team 目录不存在，则创建
    echo =================== mkdir "$teamPath" ===================
    mkdir "$teamPath"
fi
cd "$teamPath"

if [ ! -d "$repoPath" ]; then
    ## 如果 repo 目录不存在，则 git clone （私有项目，需要 github 用户名和密码）
    echo =================== git clone start ===================
    git clone "$repoGitUrl"
    git remote remove origin; # 删除 origin ，否则会暴露 github 密码
    echo =================== git clone end ===================
fi;
cd "$repoPath"

git checkout . # 撤销一切文件改动，否则可能导致 pull 失败

git remote add origin "$repoGitUrl"
git pull origin master # 下载最新 master 代码，tag 都是基于 master 分支提交的
git fetch --tags # 获取所有 tags 。否则，光执行 git pull origin master 获取不到新提交的 tag
git remote remove origin; # 删除 origin ，否则会暴露 github 密码

# 切换到 tag ，重要！！！
git checkout "$2"
echo =================== git checkout "$2" ===================

# 安装依赖
npm install

## 运行/重启 服务
npm run prd

## 心跳检测
npm run heart-beat-check

echo =================== deploy success ===================
