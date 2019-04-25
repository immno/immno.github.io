---
title: Java调用R（二） 环境搭建
date: 2017/6/17 16:22:45
updated: 2019/4/24 18:46:56
comments: true
tags: 
    - Java调用R
categories: 
    - R
---

> 摘要：描述分别在Ubuntu、Linux、Windows上搭建R的环境，以及一些配置项。

## 1.R环境搭建
> [R 官网（镜像等地址）](https://www.r-project.org/)

1) Windows：
[下载](https://mirrors.tuna.tsinghua.edu.cn/CRAN/),安装运行即可

2) Linux：
运行指令即可安装 `$ yum install R`
启动`$ R`即可

3) Ubuntu：
修改`sources.list`源文件
用文本编辑软件如 `vim` 或 `gedit` 或 `kate` 打开`/etc/apt/sources.list`文件，在文本末尾新增一行：

1. 如果是ubuntu是16.04 LTS（如图所示），新增
```plain
deb https://cloud.r-project.org//bin/linux/ubuntu xenial/
```

2. 如果是ubuntu是15.10，新增
```plain
deb https://cloud.r-project.org//bin/linux/ubuntu wily/
```

3. 如果ubuntu是14.04 LTS，新增
```plain
deb https://cloud.r-project.org//bin/linux/ubuntu trusty/
```

4. 如果ubuntu是12.04 LTS，新增
```plain
deb https://cloud.r-project.org//bin/linux/ubuntu precise/
```

接着运行指令:
```shell
$ sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys E084DAB9
$ sudo apt-get update
```

安装基本版，运行
```shell
$ sudo apt-get install r-base
```

也可以安装开发版（可以编译R包），运行
```shell
$ sudo apt-get install r-base-dev
```

可能需要XML依赖包：
```shell
$ sudo apt-get install libxml2-dev
```

启动`$ R`即可

## 2.包的导入
- 首先启动R（`$ R`）
- 安装R相关的包(注意引号)`install.packages("Rserve")`
- 导入包:`library(Rserve)`
- 查看包存储的目录`.libPaths()`
- 添加存储目录`.libPaths("/path/to/directory/with/libraries")`

### 3.其他配置
1）查看配置
```shell
$ R CMD Rserve --RS-settings
```
或者
```shell
$ vim /etc/Rserv.conf
```
详解：
```text
config file: 如果无此文件/etc/Rserv.conf, 系统会默认跳过这项
working root: R运行时工作目录 /tmp/Rserv
port: 通信端口默认6311
local socket: TCP/IP协议
authorization: 认证是否开启
plain text password: 是否允许明文密码
passwords file: 密码文件
allow I/O: 是否允许IO操作
allow remote access: 远程访问是否开启
control commands: 命令控制是否开启
interactive: 是否允许通信
max.input buffer size: 文件上传限制
```
创建配置文件
```shell
$ touch /etc/Rserv.conf
$ vim /etc/Rserv.conf
```
```text
workdir /tmp/Rserv
remote enable
fileio enable
auth required
plaintext enable
fileio enable
interactive yes
port 6311
maxinbuf 262144
encoding utf8
control enable
```

2）后台启动Rserve
```shell
$ R CMD Rserve
```

3）后台启动Rserve（可远程连接）
```shell
$ R CMD Rserve --RS-enable-remote
```

4）查看R进程
```shell
$ ps -aux|grep Rserve
```
## 4.Rserve远程连接
> 参考 [issues](https://github.com/virtualstaticvoid/heroku-buildpack-r/issues/28)

1）创建密码文件
创建`rserve.pwd`，完整路径为`/etc/rserve.pwd`
```shell
$ vim /etc/rserve.pwd
```
add
```text
test test
test1 test2
```

2）添加进配置文件
```shell
$ vim /etc/Rserv.conf
```
add
```text
pwdfile /etc/rserve.pwd
remote enable
auth required
plaintext disable
encoding utf8
```

3）登录Rserve
```java
RConnection c = new RConnection("xxx.xxx.xxx.xxx");
if( c.needLogin()) {
	c.login("test", "test");
}
//...
```

> 成功，谢谢！