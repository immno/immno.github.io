---
title: Java调用R（一） 编写程序
date: 2017/6/16 19:20:23
updated: 2019/4/24 18:40:28
comments: true
tags: 
    - Java调用R
categories: 
    - R
---

> 摘要：实现Java调用R语言的两种方式，以及在调用过程中应该注意的和优化的事项。

## 1.引用Maven包
### `maven`如下
```
<dependency>
  <groupId>org.rosuda.REngine</groupId>
  <artifactId>Rserve</artifactId>
  <version>1.8.1</version>
</dependency>
<dependency>
  <groupId>org.rosuda.REngine</groupId>
  <artifactId>REngine</artifactId>
  <version>2.1.0</version>
</dependency>
```
## 2.调用方式
### 1) R源码如下
```
sourceTest <- function(doubleA,doubleB){
  return (2*doubleA+doubleB)
}
```
### 2) Java调用方式一

通过装载源码的方式，对于函数比较大，有很多子函数时不太方便
```
public static void sourceTest2(double a, double b) {
        RConnection c = null;
        try {
            //获得 R链接
            c = new RConnection( "127.0.0.1");
            //加载 源代码
            c.voidEval("sourceTest <- function(doubleA,doubleB){return (2*doubleA+doubleB)}");
            //加载 参数
            c.assign("para", new double[]{a, b});
            //执行函数
            REXP data = c.eval("sourceTest(para[1],para[2])");
            //打印结果
            System.out.println( data.asDouble());
        } catch (REXPMismatchException | REngineException ignored) {
            // 做处理...
        } finally {
            if (c != null) {
                c.close();
            }
        }
    }
```
有子函数时,就应该先加载子函数再加载主函数：
```
//加载子函数 A
c.voidEval("sourceTestA <- function(doubleA,doubleB){return (doubleA+doubleB)}");
//加载子函数 B
c.voidEval("sourceTestB <- function(doubleA,doubleB){return (doubleA*doubleB)}");
//加载主函数，因为主函数中会用到子函数A和B
c.voidEval("sourceTest <- function(doubleA,doubleB){return (sourceTestA(doubleA,doubleB)+sourceTestB(doubleA,doubleB)}");
```
这种方式对子函数比较多，就很麻烦
### 3) Java调用方式二

通过`source`的方式，对于子函数很多也很方便
```
public static void sourceTest3(double a, double b) {
        RConnection c = null;
        try {
            c = new RConnection( "127.0.0.1");
            c.assign("para", new double[]{a, b});
            c.eval("source(\"E:/Data/bigdata-r/out/sourceTest.R\")");
            REXP data = c.eval("sourceTest(para[1],para[2])");
            System.out.println( data.asDouble());
        } catch (REXPMismatchException | REngineException ignored) {
            // 做处理...
        } finally {
            if (c != null) {
                c.close();
            }
        }
    }
```
### 4) 简单测试
```
public static void main(String[] args) {
    sourceTest2(2, 3);
    sourceTest3(2, 3);
}
```
结果：
```
E:\Soft\Java\jdk1.8.0_101\bin\java....
7.0
7.0
Process finished with exit code 0
```
## 3.优化
上面已经步骤完成了对`Java`对`R`的调用，但有时我们并不满足与此

捕获异常
```
REXP data = c.parseAndEval("data<-try( sourceTest(a[1],a[2]))");
if (data.inherits("try-error")) {
 System.out.println("Error: " + data.asString());
}
```
通过`parseAndEval`和`try()`定义：程序可能会有异常产生；将通过`data.inherits("try-error")`这种方式捕获异常，当然这种方式肯定对性能有所影响

## 4.注意
### 1) 加载boolean型参数
```
if( config.isUseNA()){
  c.voidEval("useNA <- T");
} else {
  c.voidEval("useNA <- F");
}
```
只能以这种方式加载，其中`useNA`为参数名，`T`和`F`分别表示`true`、`false`

### 2) 获取返回的数据

需要与编写R的同事沟通好返回什么类型，一般来说，有如下获取格式(可以相互独立)，`REXP data = c.parseAndEval("....");`：
```
data.asList();
RList result = ((REXP) data).asList();
((REXP) result.get("AAA")).asIntegers();
((REXP) result.get("BBB")).asDoubles();
((REXP) result.get("CCC")).asStrings()));
```
>谢谢