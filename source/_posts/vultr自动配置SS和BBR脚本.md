---
title: vultr自动配置SS和BBR脚本
date: 2018/11/23 19:21:45
updated: 2019/4/25 17:23:34
comments: true
tags: 
    - vultr
    - shadowsocks
    - bbr
categories: 
    - 工具
---
> Vultr使用很方便，使用时创建，不想用的时候随时`destroy`不会扣钱，频繁操作还是有点繁琐，因此附上自动安装`shadowsocks`和`bbr`的脚本。[Vultr地址](https://www.vultr.com/?ref=7283672)

## 说明
只需要修改
- `password`可以换成自己的密码
- `port`可以换成其他端口
- 加密方式默认为：aes-256-cfb  
![](/images/shadowsocks_config.png)

## 脚本
`Vultr`新建服务器`Startup Script ( Manage )`添加脚本：
![](/images/vultr_script.png)
```shell
#!/bin/sh
echo "-------------------------------------"
echo "-- Start Deployment environment(1) --"
echo "-------------------------------------"
#设置变量
password=taotao520
port=8989
#安装expect
yum -y install expect
#安装wget
yum -y install wget
#更换内核 并开启BBR
cd /
wget --no-check-certificate \
https://github.com/teddysun/across/raw/master/bbr.sh
chmod +x bbr.sh
#交互模式
/usr/bin/expect << EOF
spawn ./bbr.sh
set timeout 300
expect -re "Press any key to start" {send "\r"}
expect -re "restart system?" {send "n\r"; exp_continue}
interact
EOF
echo "----------------end(1)---------------"
########################################################
echo "-------------------------------------"
echo "-- Start Deployment environment(2) --"
echo "-------------------------------------"
#查看bbr状态
lsmod | grep bbr
#安装Shadowsocks
cd /
wget --no-check-certificate -O shadowsocks-go.sh \
https://raw.githubusercontent.com/teddysun/shadowsocks_install/\
master/shadowsocks-go.sh
chmod +x shadowsocks-go.sh
#交互模式
/usr/bin/expect << EOF
spawn ./shadowsocks-go.sh
set timeout 300
expect -re "Default password" {send "$password\r"}
expect -re "Default port:" {send "$port\r"}
expect -re "Which cipher" {send "\r"}
expect -re "Press any key" {send "\r"; exp_continue}
interact
EOF
#启动
echo "--------------- restart -------------"
echo "------------- show status -----------"
/etc/init.d/shadowsocks restart
/etc/init.d/shadowsocks status
echo "-------------- reboot bbr -----------"
reboot
```