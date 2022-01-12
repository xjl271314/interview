---
title: OSI七层网络模型
nav:
  title: http
  path: /http
group:
  title: http相关
  path: /http/project/base
---

# OSI 七层网络模型

- 2022.01.11

## 模型总览

![OSI七层网络模型](https://img-blog.csdnimg.cn/49f0370775da4b10a96549b80d05c05b.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGpsMjcxMzE0,size_20,color_FFFFFF,t_70,g_se,x_16)

## 物理层

> 通过光缆、电缆、无线电波等方式将设备连接起来组网，以二进制的数据形式在物理媒体上传输比特流 0 和 1。

主要解决的问题:

1. 尽可能屏蔽物理设备、传输媒体和通讯手段的不同，使上面的数据链路层感觉不到这些差异的存在，而专注于完成本层的协议与服务。

2. 考虑的是怎么样才能在连接各种计算机的传输媒体上传输数据比特流。

| 数据形式   | 数据单位  | 典型代表                   |
| :--------- | :-------- | :------------------------- |
| 二进制数据 | 比特(bit) | V.35、RJ-45(8P8C 网线插头) |

## 数据链路层

> 根据以太网的协议将一组电信号组成一个数据包，称作`帧`，通过使用包含纠错和控制信息的方式实现在不可靠的物理线路上进行数据的可靠传递。

- 帧的组成:

  1. 标头 head： 标明数据发送者、接收者、数据类型等。
  2. 数据的 data

- 传播方式：

  广播，发送者将数据表，发送给局域网内的所有 PC，让每个 PC 根据 MAC 地址自动匹配。

- 常用协议解释：

  - SLIP(串行线路 IP)。
  - PPP(点到点协议)。

### MAC 地址

> MAC（Media Access Control，介质访问控制）地址专注于数据链路层，将一个数据帧从一个节点传送到相同链路的另一个节点，所以也叫物理地址、硬件地址或链路地址，由网络设备制造商生产时写在硬件内部。

MAC 地址与网络无关，也即无论将带有这个地址的硬件（如网卡、集线器、路由器等）接入到网络的何处，都有相同的 MAC 地址，它由厂商写在网卡的 BIOS 里。

MAC 地址长度为 6 字节（48 比特）长度，分为前 24 位和后 24 位：前 24 位是由生产网卡的厂商向 IEEE 申请的厂商地址，后 24 位由厂商自行分配，这样的分配使得世界上任意一个拥有 48 位 MAC 地址的网卡都有唯一的标识。

## 网络层

> 在数据链路层提供的两个相邻端点之间的数据帧的传送功能上，进一步管理网络中的数据通信，将网络地址翻译成对应的物理地址，将数据设法从源端经过若干个中间节点传送到目的端，从而向运输层提供最基本的端到端的数据传送服务。

- 常用协议解释:

  - IP(Internet Protocal)网络协议
  - ARP(Address Resolution Protocal)地址解析协议
  - ICMP(Internet Control Message Protocal)因特网控制消息协议
  - HDLC(High Data Link Control)高级数据链路控制。

## 传输层

> 通过流量控制及调整发送速率等方式为上层提供端到端的透明的、可靠的数据传输服务。

- 常用协议解释:

  - TCP(Transition Control Protocal)传输控制协议
  - UDP(User Data Protocal)用户数据协议

## 会话层

> 不参与具体的传输，提供了包括访问验证和会话管理在内的建立和维护应用之间通信的机制。

## 表示层

> 根据不同网络类型提供格式化的表示和转换数据服务。数据的压缩和解压缩， 加密和解密等工作都由表示层负责。

## 应用层

> 为操作系统或网络应用程序提供访问网络服务的接口。

- 常用协议解释:

  - HTTP(HyperText Transfer Protocal)超文本传输协议
  - FTP(File Transfer Protocal)文件传输协议
  - SMTP(Simple Mall Transfer Protocal)简单邮件传输协议
  - POP3(Post Office Protocal)邮局协议
  - DNS(Domain Name System)域名系统
