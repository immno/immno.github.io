# 指定语言环境
# language: node_js
#
# # 指定需要sudo权限
# sudo: required
#
# # 指定node_js版本
# node_js: stable
#
# # 指定缓存模块，可选。缓存可加快编译速度。
# cache:
#   directories:
#       - node_modules
#
#       notifications:
#         # 钉钉机器人消息推送部署结果
#           webhooks:
#               urls:
#                     - https://oapi.dingtalk.com/robot/send?access_token=${DINGDING__TOKEN}
#                         on_success: change 
#                             on_failure: always 
#
#                             # 指定博客源码分支，因人而异。如果hexo博客源码托管在独立repo则不用设置此项
#                             branches:
#                               only:
#                                   - hexo 
#
#                                   # Start: Build Lifecycle
#                                   before_script:
#                                     - export TZ='Asia/Shanghai'
#                                       - npm install -g gulp
#
#                                       install:
#                                         - npm install
#                                           - npm install hexo-deployer-git --save
#
#                                           before_install:
#                                             - npm install -g hexo-cli
#
#                                             # 执行清缓存，生成网页操作
#                                             script:
#                                               - hexo clean && hexo generate
#
#                                               # 设置git提交名，邮箱；替换真实token到_config.yml文件，最后depoy部署
#                                               after_script:
#                                                 - git config user.name "mno"
#                                                   - git config user.email "574819887@qq.com"
#                                                     # 替换同目录下的_config.yml文件中gh_token字符串为travis后台刚才配置的变量，注意此处sed命令用了双引号。单引号无效！
#                                                       - sed -i "s/gh_token/${GH_TOKEN}/g" ./_config.yml
#                                                         - hexo deploy
#                                                         # End: Build LifeCycle
#                                                         :q
#
